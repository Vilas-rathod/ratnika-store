package com.ratnika.order.entity;

import com.ratnika.address.entity.AddressType;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A snapshot of the delivery address captured at order time (immutable copy,
 * so later edits to the customer's saved address never alter past orders).
 */
@Embeddable
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShippingAddress {

    @Column(name = "ship_full_name", length = 120)
    private String fullName;

    @Column(name = "ship_phone", length = 20)
    private String phone;

    @Column(name = "ship_line1", length = 200)
    private String line1;

    @Column(name = "ship_line2", length = 200)
    private String line2;

    @Column(name = "ship_city", length = 80)
    private String city;

    @Column(name = "ship_state", length = 80)
    private String state;

    @Column(name = "ship_pincode", length = 10)
    private String pincode;

    @Column(name = "ship_country", length = 60)
    private String country;

    @Enumerated(EnumType.STRING)
    @Column(name = "ship_type", length = 10)
    private AddressType type;
}
