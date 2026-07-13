package com.ratnika.catalog.banner.dto;

import com.ratnika.catalog.banner.entity.Banner.Placement;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public final class BannerDtos {

    private BannerDtos() {
    }

    public record BannerResponse(
            UUID id,
            String title,
            String subtitle,
            String imageUrl,
            String ctaLabel,
            String ctaLink,
            Placement placement,
            boolean active,
            int sortOrder
    ) {
    }

    public record BannerRequest(
            @NotBlank String title,
            String subtitle,
            @NotBlank String imageUrl,
            String ctaLabel,
            String ctaLink,
            @NotNull Placement placement,
            Boolean active
    ) {
    }
}
