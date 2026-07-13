package com.ratnika.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ratnika.common.dto.ApiResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Lightweight in-memory sliding-window rate limiter for auth endpoints
 * (login / register / forgot-password) to blunt brute-force attempts.
 * For multi-instance deployments, back this with Redis.
 */
@Component
@Order(1)
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS = 20;      // per window
    private static final long WINDOW_SECONDS = 60;

    private final ObjectMapper objectMapper;
    private final Map<String, Window> buckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        if (path.contains("/auth/login") || path.contains("/auth/register")
                || path.contains("/auth/forgot-password") || path.contains("/auth/reset-password")) {
            String key = clientIp(request) + ":" + path;
            if (isLimited(key)) {
                response.setStatus(429);
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                objectMapper.writeValue(response.getWriter(),
                        ApiResponse.error("Too many requests. Please try again in a minute."));
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    private boolean isLimited(String key) {
        long now = Instant.now().getEpochSecond();
        Window window = buckets.compute(key, (k, existing) -> {
            if (existing == null || now - existing.start >= WINDOW_SECONDS) {
                return new Window(now);
            }
            return existing;
        });
        return window.count.incrementAndGet() > MAX_REQUESTS;
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwarded)) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private static final class Window {
        private final long start;
        private final AtomicInteger count = new AtomicInteger(0);

        private Window(long start) {
            this.start = start;
        }
    }
}
