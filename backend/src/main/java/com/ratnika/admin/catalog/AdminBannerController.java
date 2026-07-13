package com.ratnika.admin.catalog;

import com.ratnika.catalog.banner.dto.BannerDtos.BannerRequest;
import com.ratnika.catalog.banner.dto.BannerDtos.BannerResponse;
import com.ratnika.catalog.banner.service.BannerService;
import com.ratnika.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("${app.api-prefix}/admin/banners")
@RequiredArgsConstructor
@Tag(name = "Admin · Banners", description = "Banner management")
public class AdminBannerController {

    private final BannerService bannerService;

    @GetMapping
    @Operation(summary = "List all banners")
    public ApiResponse<List<BannerResponse>> list() {
        return ApiResponse.success(bannerService.listAll());
    }

    @PostMapping
    @Operation(summary = "Create a banner")
    public ApiResponse<BannerResponse> create(@Valid @RequestBody BannerRequest request) {
        return ApiResponse.success("Banner created", bannerService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a banner")
    public ApiResponse<BannerResponse> update(@PathVariable UUID id, @Valid @RequestBody BannerRequest request) {
        return ApiResponse.success("Banner updated", bannerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a banner")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        bannerService.delete(id);
        return ApiResponse.success("Banner deleted", null);
    }
}
