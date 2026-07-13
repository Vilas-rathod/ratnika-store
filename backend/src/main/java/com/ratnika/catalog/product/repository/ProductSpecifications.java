package com.ratnika.catalog.product.repository;

import com.ratnika.catalog.product.dto.ProductFilter;
import com.ratnika.catalog.product.entity.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * Builds dynamic, type-safe query predicates for product filtering.
 */
public final class ProductSpecifications {

    private ProductSpecifications() {
    }

    public static Specification<Product> withFilter(ProductFilter f) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("active")));

            if (f.q() != null && !f.q().isBlank()) {
                String like = "%" + f.q().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("description")), like)));
            }
            if (f.category() != null && !f.category().isBlank()) {
                predicates.add(cb.equal(root.get("category").get("slug"), f.category()));
            }
            if (f.materials() != null && !f.materials().isEmpty()) {
                predicates.add(root.get("attributes").get("material").in(f.materials()));
            }
            if (f.occasions() != null && !f.occasions().isEmpty()) {
                predicates.add(root.get("attributes").get("occasion").in(f.occasions()));
            }
            if (f.minPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), f.minPrice()));
            }
            if (f.maxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), f.maxPrice()));
            }
            if (Boolean.TRUE.equals(f.featured())) predicates.add(cb.isTrue(root.get("featured")));
            if (Boolean.TRUE.equals(f.trending())) predicates.add(cb.isTrue(root.get("trending")));
            if (Boolean.TRUE.equals(f.bestSeller())) predicates.add(cb.isTrue(root.get("bestSeller")));
            if (Boolean.TRUE.equals(f.newArrival())) predicates.add(cb.isTrue(root.get("newArrival")));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
