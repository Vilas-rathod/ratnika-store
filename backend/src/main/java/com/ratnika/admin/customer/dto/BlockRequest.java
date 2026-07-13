package com.ratnika.admin.customer.dto;

import jakarta.validation.constraints.NotNull;

public record BlockRequest(
        @NotNull Boolean blocked
) {
}
