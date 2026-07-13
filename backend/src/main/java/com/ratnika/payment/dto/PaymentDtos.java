package com.ratnika.payment.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public final class PaymentDtos {

    private PaymentDtos() {
    }

    public record CreateOrderRequest(
            @NotNull @Positive BigDecimal amount
    ) {
    }

    public record RazorpayOrderResponse(
            String razorpayOrderId,
            long amount,       // in paise
            String currency,
            String keyId
    ) {
    }

    public record VerifyPaymentRequest(
            @NotNull String razorpayOrderId,
            @NotNull String razorpayPaymentId,
            @NotNull String razorpaySignature
    ) {
    }

    public record VerifyPaymentResponse(
            boolean verified,
            String paymentId
    ) {
    }
}
