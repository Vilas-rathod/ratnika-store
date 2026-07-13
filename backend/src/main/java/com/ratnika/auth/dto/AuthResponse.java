package com.ratnika.auth.dto;

import com.ratnika.user.dto.UserResponse;

/**
 * Matches the frontend AuthResponse: {@code { user, tokens: { accessToken, refreshToken } }}.
 */
public record AuthResponse(
        UserResponse user,
        TokenResponse tokens
) {
}
