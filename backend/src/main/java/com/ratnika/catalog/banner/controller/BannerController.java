package com.ratnika.catalog.banner.controller;

import com.ratnika.catalog.banner.dto.BannerDtos.BannerResponse;
import com.ratnika.catalog.banner.service.BannerService;
import com.ratnika.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${app.api-prefix}/banners")
@RequiredArgsConstructor
@Tag(name = "Banners", description = "Public homepage & promotional banners")
public class BannerController {

    private final BannerService bannerService;

    @GetMapping
    @Operation(summary = "List active banners")
    public ApiResponse<List<BannerResponse>> list() {
        return ApiResponse.success(bannerService.listActive());
    }
}
