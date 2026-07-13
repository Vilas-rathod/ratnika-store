package com.ratnika.admin.settings.entity;

import com.ratnika.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Single-row store configuration editable from the admin panel.
 */
@Entity
@Table(name = "store_settings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StoreSettings extends BaseEntity {

    @Column(nullable = false, length = 120)
    private String storeName;

    @Column(nullable = false, length = 160)
    private String supportEmail;

    @Column(length = 30)
    private String supportPhone;

    @Column(length = 300)
    private String addressLine;

    @Column(nullable = false)
    private long freeShippingThreshold;

    @Column(nullable = false)
    private long shippingFee;

    @Column(nullable = false)
    private boolean codEnabled;
}
