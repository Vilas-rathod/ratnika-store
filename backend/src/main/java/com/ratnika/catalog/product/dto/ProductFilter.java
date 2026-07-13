package com.ratnika.catalog.product.dto;

import com.ratnika.catalog.product.entity.Material;
import com.ratnika.catalog.product.entity.Occasion;

import java.math.BigDecimal;
import java.util.List;

/**
 * Query parameters for the public product listing.
 */
public record ProductFilter(
        String q,
        String category,             // slug
        List<Material> materials,
        List<Occasion> occasions,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        String sort,                 // newest | price_asc | price_desc | rating | popularity
        Boolean featured,
        Boolean trending,
        Boolean bestSeller,
        Boolean newArrival
) {
}
