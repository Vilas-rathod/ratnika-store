package com.ratnika.catalog.product.dto;

import com.ratnika.catalog.product.entity.Material;
import com.ratnika.catalog.product.entity.Occasion;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Product response DTOs. Supplier & cost fields are only populated by the
 * admin mapper — customer responses leave them null.
 */
public final class ProductDtos {

    private ProductDtos() {
    }

    public record ImageDto(
            UUID id,
            String url,
            String altText,
            int sortOrder
    ) {
    }

    public record VariantDto(
            UUID id,
            String name,
            String value,
            BigDecimal priceDelta,
            int stock,
            String sku
    ) {
    }

    public record AttributesDto(
            Material material,
            String stoneType,
            double weightGrams,
            String color,
            Occasion occasion
    ) {
    }

    public record ProductResponse(
            UUID id,
            String name,
            String slug,
            String description,
            UUID categoryId,
            String categoryName,
            BigDecimal price,
            BigDecimal mrp,
            String sku,
            int stock,
            List<ImageDto> images,
            List<VariantDto> variants,
            AttributesDto attributes,
            double rating,
            int reviewCount,
            boolean featured,
            boolean trending,
            boolean bestSeller,
            boolean newArrival,
            boolean active,
            String supplierName,
            String supplierUrl,
            BigDecimal costPrice,
            Instant createdAt
    ) {
    }
}
