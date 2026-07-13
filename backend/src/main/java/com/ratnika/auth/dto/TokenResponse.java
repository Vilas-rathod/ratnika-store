package com.ratnika.auth.dto;

public record TokenResponse(
        String accessToken,
        String refreshToken
) {
}
