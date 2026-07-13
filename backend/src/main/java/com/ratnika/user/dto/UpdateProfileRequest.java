package com.ratnika.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank @Size(min = 2, max = 60) String firstName,
        @NotBlank @Size(max = 60) String lastName,
        @Pattern(regexp = "^[+]?[0-9\\s-]{10,15}$", message = "Enter a valid phone number") String phone
) {
}
