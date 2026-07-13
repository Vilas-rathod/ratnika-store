package com.ratnika.admin.settings.dto;

public final class SettingsDtos {

    private SettingsDtos() {
    }

    public record SettingsResponse(
            String storeName,
            String supportEmail,
            String supportPhone,
            String addressLine,
            long freeShippingThreshold,
            long shippingFee,
            boolean codEnabled
    ) {
    }

    public record SettingsRequest(
            String storeName,
            String supportEmail,
            String supportPhone,
            String addressLine,
            Long freeShippingThreshold,
            Long shippingFee,
            Boolean codEnabled
    ) {
    }
}
