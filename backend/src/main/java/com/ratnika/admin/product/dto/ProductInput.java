package com.ratnika.admin.product.dto;

import com.ratnika.catalog.product.entity.Material;
import com.ratnika.catalog.product.entity.Occasion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public final class ProductInput {

    private ProductInput() {
    }

    public record AttributesInput(
            @NotNull Material material,
            String stoneType,
            double weightGrams,
            @NotBlank String color,
            @NotNull Occasion occasion
    ) {
    }

    public record VariantInput(
            String name,
            String value,
            BigDecimal priceDelta,
            int stock,
            String sku
    ) {
    }

    public record CreateOrUpdate(
            @NotBlank String name,
            @NotBlank String description,
            @NotNull UUID categoryId,
            @NotNull BigDecimal price,
            @NotNull BigDecimal mrp,
            String sku,
            @PositiveOrZero int stock,
            List<String> images,
            List<VariantInput> variants,
            @NotNull AttributesInput attributes,
            boolean featured,
            boolean trending,
            boolean bestSeller,
            boolean newArrival,
            boolean active,
            String supplierName,
            String supplierUrl,
            BigDecimal costPrice
    ) {
    }
}
