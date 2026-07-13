package com.ratnika.admin.customer.dto;

import com.ratnika.user.entity.Role;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record AdminCustomerResponse(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String phone,
        Role role,
        boolean emailVerified,
        boolean blocked,
        Instant createdAt,
        long orderCount,
        BigDecimal totalSpent
) {
}
