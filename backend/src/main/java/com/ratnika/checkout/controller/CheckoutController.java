package com.ratnika.checkout.controller;

import com.ratnika.checkout.dto.CheckoutDtos.ConfirmPaymentRequest;
import com.ratnika.checkout.dto.CheckoutDtos.InitiateCheckoutRequest;
import com.ratnika.checkout.dto.CheckoutDtos.InitiateCheckoutResponse;
import com.ratnika.checkout.service.CheckoutSagaOrchestrator;
import com.ratnika.common.dto.ApiResponse;
import com.ratnika.order.dto.OrderDtos.OrderResponse;
import com.ratnika.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("${app.api-prefix}/checkout")
@RequiredArgsConstructor
@Tag(name = "Checkout", description = "Order + payment saga (initiate → pay → confirm)")
public class CheckoutController {

    private final CheckoutSagaOrchestrator saga;

    @PostMapping("/initiate")
    @Operation(summary = "Start checkout: reserve stock, create order, create gateway order")
    public ApiResponse<InitiateCheckoutResponse> initiate(@AuthenticationPrincipal UserPrincipal principal,
                                                          @Valid @RequestBody InitiateCheckoutRequest request) {
        return ApiResponse.success(saga.initiate(principal.getUser(), request));
    }

    @PostMapping("/confirm")
    @Operation(summary = "Confirm payment after the Razorpay callback (verifies signature)")
    public ApiResponse<OrderResponse> confirm(@AuthenticationPrincipal UserPrincipal principal,
                                              @Valid @RequestBody ConfirmPaymentRequest request) {
        return ApiResponse.success("Payment confirmed", saga.confirm(principal.getUser(), request));
    }

    @PostMapping("/{orderId}/cancel")
    @Operation(summary = "Cancel a pending-payment order (releases reserved stock)")
    public ApiResponse<Void> cancel(@AuthenticationPrincipal UserPrincipal principal,
                                    @PathVariable UUID orderId) {
        saga.cancel(principal.getUser(), orderId);
        return ApiResponse.success("Checkout cancelled", null);
    }
}
