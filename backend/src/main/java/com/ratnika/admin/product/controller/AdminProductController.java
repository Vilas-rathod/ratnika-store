package com.ratnika.admin.product.controller;

import com.ratnika.admin.product.dto.ProductInput.CreateOrUpdate;
import com.ratnika.admin.product.service.AdminProductService;
import com.ratnika.catalog.product.dto.ProductDtos.ProductResponse;
import com.ratnika.common.dto.ApiResponse;
import com.ratnika.common.dto.PageResponse;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("${app.api-prefix}/admin/products")
@RequiredArgsConstructor
@Tag(name = "Admin · Products", description = "Product management")
public class AdminProductController {

    private final AdminProductService adminProductService;

    @GetMapping
    @Operation(summary = "List products (admin view with supplier & cost)")
    public ApiResponse<PageResponse<ProductResponse>> list(
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(adminProductService.list(q, page, size));
    }

    @PostMapping
    @Operation(summary = "Create a product")
    public ApiResponse<ProductResponse> create(@Valid @RequestBody CreateOrUpdate input) {
        return ApiResponse.success("Product created", adminProductService.create(input));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a product")
    public ApiResponse<ProductResponse> update(@PathVariable UUID id,
                                               @Valid @RequestBody CreateOrUpdate input) {
        return ApiResponse.success("Product updated", adminProductService.update(id, input));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a product")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        adminProductService.delete(id);
        return ApiResponse.success("Product deleted", null);
    }
}
