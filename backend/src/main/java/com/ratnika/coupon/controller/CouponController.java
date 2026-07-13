package com.ratnika.coupon.controller;

import com.ratnika.common.dto.ApiResponse;
import com.ratnika.coupon.dto.CouponDtos.CouponValidationResponse;
import com.ratnika.coupon.dto.CouponDtos.ValidateCouponRequest;
import com.ratnika.coupon.service.CouponService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${app.api-prefix}/coupons")
@RequiredArgsConstructor
@Tag(name = "Coupons", description = "Coupon validation")
public class CouponController {

    private final CouponService couponService;

    @PostMapping("/validate")
    @Operation(summary = "Validate a coupon against a cart subtotal")
    public ApiResponse<CouponValidationResponse> validate(@Valid @RequestBody ValidateCouponRequest request) {
        return ApiResponse.success(couponService.validate(request.code(), request.subtotal()));
    }
}
