package com.ratnika.catalog.product.entity;

import com.ratnika.catalog.category.entity.Category;
import com.ratnika.common.entity.BaseEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_product_slug", columnList = "slug", unique = true),
        @Index(name = "idx_product_category", columnList = "category_id"),
        @Index(name = "idx_product_active", columnList = "active")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product extends BaseEntity {

    /** Optimistic-lock guard so concurrent stock reservations can't oversell. */
    @Version
    private Long version;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, unique = true, length = 240)
    private String slug;

    @Column(nullable = false, columnDefinition = "text")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal mrp;

    @Column(nullable = false, length = 60)
    private String sku;

    @Column(nullable = false)
    @Builder.Default
    private int stock = 0;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<ProductVariant> variants = new ArrayList<>();

    @Embedded
    private ProductAttributes attributes;

    @Column(nullable = false)
    @Builder.Default
    private double rating = 0;

    @Column(nullable = false)
    @Builder.Default
    private int reviewCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private boolean featured = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean trending = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean bestSeller = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean newArrival = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    // ── Dropshipping (admin-only; never exposed to customers) ──────
    @Column(length = 160)
    private String supplierName;

    @Column(length = 512)
    private String supplierUrl;

    @Column(precision = 12, scale = 2)
    private BigDecimal costPrice;

    // ── Helpers to keep both sides of the relationship in sync ─────
    public void addImage(ProductImage image) {
        image.setProduct(this);
        this.images.add(image);
    }

    public void addVariant(ProductVariant variant) {
        variant.setProduct(this);
        this.variants.add(variant);
    }
}
