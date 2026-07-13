package com.ratnika.catalog.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.time.Instant;
import java.util.UUID;

public final class ReviewDtos {

    private ReviewDtos() {
    }

    public record ReviewResponse(
            UUID id,
            UUID productId,
            String productName,
            UUID userId,
            String userName,
            int rating,
            String title,
            String comment,
            boolean approved,
            Instant createdAt
    ) {
    }

    public record ReviewRequest(
            @Min(1) @Max(5) int rating,
            @NotBlank String title,
            @NotBlank String comment
    ) {
    }
}
