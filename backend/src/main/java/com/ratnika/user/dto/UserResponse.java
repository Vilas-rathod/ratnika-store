package com.ratnika.user.dto;

import com.ratnika.user.entity.Role;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String phone,
        Role role,
        boolean emailVerified,
        boolean blocked,
        String avatarUrl,
        Instant createdAt
) {
}
