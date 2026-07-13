package com.ratnika.coupon.dto;

import com.ratnika.coupon.entity.Coupon.Type;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public final class CouponDtos {

    private CouponDtos() {
    }

    public record CouponResponse(
            UUID id,
            String code,
            String description,
            Type type,
            BigDecimal value,
            BigDecimal minOrderAmount,
            BigDecimal maxDiscount,
            Instant expiresAt,
            int usageLimit,
            int usedCount,
            boolean active
    ) {
    }

    public record CouponRequest(
            @NotBlank String code,
            @NotBlank String description,
            @NotNull Type type,
            @Positive BigDecimal value,
            @PositiveOrZero BigDecimal minOrderAmount,
            BigDecimal maxDiscount,
            @NotNull Instant expiresAt,
            @Positive int usageLimit,
            Boolean active
    ) {
    }

    public record ValidateCouponRequest(
            @NotBlank String code,
            @NotNull BigDecimal subtotal
    ) {
    }

    public record CouponValidationResponse(
            CouponResponse coupon,
            BigDecimal discount
    ) {
    }
}
