package com.ratnika.checkout.dto;

import com.ratnika.order.dto.OrderDtos.OrderItemRequest;
import com.ratnika.order.dto.OrderDtos.ShippingAddressDto;
import com.ratnika.order.entity.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public final class CheckoutDtos {

    private CheckoutDtos() {
    }

    /** Step 1 — start the checkout saga (order created, stock reserved). */
    public record InitiateCheckoutRequest(
            @NotEmpty @Valid List<OrderItemRequest> items,
            @NotNull @Valid ShippingAddressDto shippingAddress,
            @NotNull PaymentMethod paymentMethod,
            String couponCode
    ) {
    }

    /**
     * Response from initiate. For COD the order is already CONFIRMED and the
     * razorpay* fields are null. For RAZORPAY the client opens checkout with them.
     */
    public record InitiateCheckoutResponse(
            UUID orderId,
            String orderNumber,
            PaymentMethod paymentMethod,
            boolean requiresPayment,
            String razorpayOrderId,
            Long amount,          // paise
            String currency,
            String keyId
    ) {
    }

    /** Step 3 — confirm payment after the Razorpay checkout callback. */
    public record ConfirmPaymentRequest(
            @NotNull UUID orderId,
            @NotNull String razorpayOrderId,
            @NotNull String razorpayPaymentId,
            @NotNull String razorpaySignature
    ) {
    }
}
