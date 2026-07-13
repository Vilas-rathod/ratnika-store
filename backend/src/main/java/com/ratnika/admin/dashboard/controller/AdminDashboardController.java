package com.ratnika.admin.dashboard.controller;

import com.ratnika.admin.dashboard.dto.DashboardStats;
import com.ratnika.admin.dashboard.service.DashboardService;
import com.ratnika.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${app.api-prefix}/admin/dashboard")
@RequiredArgsConstructor
@Tag(name = "Admin · Dashboard", description = "Store analytics")
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @Operation(summary = "Get dashboard analytics")
    public ApiResponse<DashboardStats> dashboard() {
        return ApiResponse.success(dashboardService.build());
    }
}
