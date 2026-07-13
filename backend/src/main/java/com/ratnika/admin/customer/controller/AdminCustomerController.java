package com.ratnika.admin.customer.controller;

import com.ratnika.admin.customer.dto.AdminCustomerResponse;
import com.ratnika.admin.customer.dto.BlockRequest;
import com.ratnika.admin.customer.service.AdminCustomerService;
import com.ratnika.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("${app.api-prefix}/admin/customers")
@RequiredArgsConstructor
@Tag(name = "Admin · Customers", description = "Customer management")
public class AdminCustomerController {

    private final AdminCustomerService adminCustomerService;

    @GetMapping
    @Operation(summary = "List customers with order stats")
    public ApiResponse<List<AdminCustomerResponse>> list() {
        return ApiResponse.success(adminCustomerService.list());
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Block or activate a customer")
    public ApiResponse<Void> setStatus(@PathVariable UUID id, @Valid @RequestBody BlockRequest request) {
        adminCustomerService.setBlocked(id, request.blocked());
        return ApiResponse.success(request.blocked() ? "Customer blocked" : "Customer activated", null);
    }
}
