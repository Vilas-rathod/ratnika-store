package com.ratnika.address.dto;

import com.ratnika.address.entity.AddressType;

import java.util.UUID;

public record AddressResponse(
        UUID id,
        UUID userId,
        String fullName,
        String phone,
        String line1,
        String line2,
        String city,
        String state,
        String pincode,
        String country,
        AddressType type,
        boolean isDefault
) {
}
