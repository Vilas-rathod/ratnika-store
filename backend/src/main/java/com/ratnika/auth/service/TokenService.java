package com.ratnika.auth.service;

import com.ratnika.auth.dto.TokenResponse;
import com.ratnika.auth.entity.RefreshToken;
import com.ratnika.auth.repository.RefreshTokenRepository;
import com.ratnika.common.exception.UnauthorizedException;
import com.ratnika.config.props.AppProperties;
import com.ratnika.security.JwtService;
import com.ratnika.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

/**
 * Issues JWT access tokens paired with opaque, rotating refresh tokens.
 */
@Service
@RequiredArgsConstructor
public class TokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final AppProperties props;
    private final SecureRandom random = new SecureRandom();

    /** Issue a brand-new access + refresh pair. */
    @Transactional
    public TokenResponse issue(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        RefreshToken refreshToken = RefreshToken.builder()
                .token(generateOpaqueToken())
                .user(user)
                .expiresAt(Instant.now().plusMillis(props.getJwt().getRefreshTokenExpiration()))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);
        return new TokenResponse(accessToken, refreshToken.getToken());
    }

    /**
     * Rotate a refresh token: validate the presented token, revoke it, and
     * issue a fresh pair. Reuse of a revoked/expired token is rejected.
     */
    @Transactional
    public TokenResponse rotate(String presentedToken) {
        RefreshToken existing = refreshTokenRepository.findByToken(presentedToken)
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));
        if (!existing.isActive()) {
            throw new UnauthorizedException("Refresh token expired or revoked");
        }
        existing.setRevoked(true);
        refreshTokenRepository.save(existing);
        return issue(existing.getUser());
    }

    @Transactional
    public void revokeAll(User user) {
        refreshTokenRepository.revokeAllForUser(user);
    }

    private String generateOpaqueToken() {
        byte[] bytes = new byte[48];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
