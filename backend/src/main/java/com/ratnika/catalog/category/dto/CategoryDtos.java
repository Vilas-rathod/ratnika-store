package com.ratnika.catalog.category.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public final class CategoryDtos {

    private CategoryDtos() {
    }

    public record CategoryResponse(
            UUID id,
            String name,
            String slug,
            String description,
            String imageUrl,
            boolean active,
            int sortOrder,
            long productCount
    ) {
    }

    public record CategoryRequest(
            @NotBlank String name,
            String description,
            String imageUrl,
            Boolean active
    ) {
    }
}
