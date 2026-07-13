package com.ratnika.security;

import com.ratnika.common.exception.UnauthorizedException;
import com.ratnika.user.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Convenience access to the currently authenticated user.
 */
public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserPrincipal principal) {
            return principal.getUser();
        }
        throw new UnauthorizedException("Authentication required");
    }
}
