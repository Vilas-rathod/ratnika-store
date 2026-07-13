package com.ratnika.catalog.product.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductAttributes {

    @Enumerated(EnumType.STRING)
    @Column(name = "attr_material", length = 20)
    private Material material;

    @Column(name = "attr_stone_type", length = 60)
    private String stoneType;

    @Column(name = "attr_weight_grams")
    private double weightGrams;

    @Column(name = "attr_color", length = 40)
    private String color;

    @Enumerated(EnumType.STRING)
    @Column(name = "attr_occasion", length = 20)
    private Occasion occasion;
}
