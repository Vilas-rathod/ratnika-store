package com.ratnika.catalog.banner.entity;

import com.ratnika.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "banners")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Banner extends BaseEntity {

    public enum Placement {
        HERO,
        PROMO
    }

    @Column(nullable = false, length = 160)
    private String title;

    @Column(length = 300)
    private String subtitle;

    @Column(nullable = false, columnDefinition = "text")
    private String imageUrl;

    @Column(length = 60)
    private String ctaLabel;

    @Column(length = 300)
    private String ctaLink;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default
    private Placement placement = Placement.HERO;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(nullable = false)
    @Builder.Default
    private int sortOrder = 0;
}
