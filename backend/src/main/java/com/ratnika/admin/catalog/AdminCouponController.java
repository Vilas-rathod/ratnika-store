package com.ratnika.admin.catalog;

import com.ratnika.common.dto.ApiResponse;
import com.ratnika.coupon.dto.CouponDtos.CouponRequest;
import com.ratnika.coupon.dto.CouponDtos.CouponResponse;
import com.ratnika.coupon.service.CouponService;
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
@RequestMapping("${app.api-prefix}/admin/coupons")
@RequiredArgsConstructor
@Tag(name = "Admin · Coupons", description = "Coupon management")
public class AdminCouponController {

    private final CouponService couponService;

    @GetMapping
    @Operation(summary = "List all coupons")
    public ApiResponse<List<CouponResponse>> list() {
        return ApiResponse.success(couponService.listAll());
    }

    @PostMapping
    @Operation(summary = "Create a coupon")
    public ApiResponse<CouponResponse> create(@Valid @RequestBody CouponRequest request) {
        return ApiResponse.success("Coupon created", couponService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a coupon")
    public ApiResponse<CouponResponse> update(@PathVariable UUID id, @Valid @RequestBody CouponRequest request) {
        return ApiResponse.success("Coupon updated", couponService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a coupon")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        couponService.delete(id);
        return ApiResponse.success("Coupon deleted", null);
    }
}
