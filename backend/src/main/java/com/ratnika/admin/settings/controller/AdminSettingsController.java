package com.ratnika.admin.settings.controller;

import com.ratnika.admin.settings.dto.SettingsDtos.SettingsRequest;
import com.ratnika.admin.settings.dto.SettingsDtos.SettingsResponse;
import com.ratnika.admin.settings.service.AdminSettingsService;
import com.ratnika.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${app.api-prefix}/admin/settings")
@RequiredArgsConstructor
@Tag(name = "Admin · Settings", description = "Store configuration")
public class AdminSettingsController {

    private final AdminSettingsService adminSettingsService;

    @GetMapping
    @Operation(summary = "Get store settings")
    public ApiResponse<SettingsResponse> get() {
        return ApiResponse.success(adminSettingsService.get());
    }

    @PutMapping
    @Operation(summary = "Update store settings")
    public ApiResponse<SettingsResponse> update(@RequestBody SettingsRequest request) {
        return ApiResponse.success("Settings saved", adminSettingsService.update(request));
    }
}
