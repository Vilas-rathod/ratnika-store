package com.ratnika.address.dto;

import com.ratnika.address.entity.AddressType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record AddressRequest(
        @NotBlank String fullName,
        @NotBlank @Pattern(regexp = "^[+]?[0-9\\s-]{10,15}$", message = "Enter a valid phone number") String phone,
        @NotBlank String line1,
        String line2,
        @NotBlank String city,
        @NotBlank String state,
        @NotBlank @Pattern(regexp = "^[1-9][0-9]{5}$", message = "Enter a valid 6-digit pincode") String pincode,
        String country,
        @NotNull AddressType type,
        Boolean isDefault
) {
}
