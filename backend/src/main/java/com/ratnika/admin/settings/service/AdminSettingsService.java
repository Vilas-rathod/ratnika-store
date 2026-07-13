package com.ratnika.admin.settings.service;

import com.ratnika.admin.settings.dto.SettingsDtos.SettingsRequest;
import com.ratnika.admin.settings.dto.SettingsDtos.SettingsResponse;
import com.ratnika.admin.settings.entity.StoreSettings;
import com.ratnika.admin.settings.repository.StoreSettingsRepository;
import com.ratnika.config.props.AppProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminSettingsService {

    private final StoreSettingsRepository repository;
    private final AppProperties props;

    @Transactional
    public SettingsResponse get() {
        return toResponse(getOrCreate());
    }

    @Transactional
    public SettingsResponse update(SettingsRequest request) {
        StoreSettings settings = getOrCreate();
        if (request.storeName() != null) settings.setStoreName(request.storeName());
        if (request.supportEmail() != null) settings.setSupportEmail(request.supportEmail());
        if (request.supportPhone() != null) settings.setSupportPhone(request.supportPhone());
        if (request.addressLine() != null) settings.setAddressLine(request.addressLine());
        if (request.freeShippingThreshold() != null) settings.setFreeShippingThreshold(request.freeShippingThreshold());
        if (request.shippingFee() != null) settings.setShippingFee(request.shippingFee());
        if (request.codEnabled() != null) settings.setCodEnabled(request.codEnabled());
        return toResponse(repository.save(settings));
    }

    private StoreSettings getOrCreate() {
        return repository.findFirstByOrderByCreatedAtAsc().orElseGet(() -> {
            AppProperties.Store s = props.getStore();
            return repository.save(StoreSettings.builder()
                    .storeName(s.getName())
                    .supportEmail(s.getSupportEmail())
                    .supportPhone(s.getSupportPhone())
                    .addressLine(s.getAddressLine())
                    .freeShippingThreshold(s.getFreeShippingThreshold())
                    .shippingFee(s.getShippingFee())
                    .codEnabled(s.isCodEnabled())
                    .build());
        });
    }

    private SettingsResponse toResponse(StoreSettings s) {
        return new SettingsResponse(s.getStoreName(), s.getSupportEmail(), s.getSupportPhone(),
                s.getAddressLine(), s.getFreeShippingThreshold(), s.getShippingFee(), s.isCodEnabled());
    }
}
