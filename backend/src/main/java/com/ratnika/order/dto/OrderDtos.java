package com.ratnika.order.dto;

import com.ratnika.address.entity.AddressType;
import com.ratnika.order.entity.OrderStatus;
import com.ratnika.order.entity.PaymentMethod;
import com.ratnika.order.entity.PaymentStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public final class OrderDtos {

    private OrderDtos() {
    }

    // ── Responses ─────────────────────────────────────────────────
    public record OrderItemResponse(
            UUID productId,
            String name,
            String imageUrl,
            BigDecimal price,
            int quantity,
            String variantLabel
    ) {
    }

    public record ShippingAddressDto(
            String fullName,
            String phone,
            String line1,
            String line2,
            String city,
            String state,
            String pincode,
            String country,
            AddressType type
    ) {
    }

    public record TimelineEventDto(
            OrderStatus status,
            String note,
            Instant at
    ) {
    }

    public record OrderResponse(
            UUID id,
            String orderNumber,
            UUID userId,
            String customerName,
            String customerEmail,
            List<OrderItemResponse> items,
            BigDecimal subtotal,
            BigDecimal discount,
            BigDecimal shippingFee,
            BigDecimal total,
            String couponCode,
            PaymentMethod paymentMethod,
            PaymentStatus paymentStatus,
            String paymentId,
            OrderStatus status,
            ShippingAddressDto shippingAddress,
            String trackingNumber,
            String courierName,
            List<TimelineEventDto> timeline,
            Instant createdAt
    ) {
    }

    // ── Requests ──────────────────────────────────────────────────
    public record OrderItemRequest(
            @NotNull UUID productId,
            @Positive int quantity,
            UUID variantId,
            String variantLabel
    ) {
    }

    public record PlaceOrderRequest(
            @NotEmpty @Valid List<OrderItemRequest> items,
            @NotNull @Valid ShippingAddressDto shippingAddress,
            @NotNull PaymentMethod paymentMethod,
            String couponCode,
            String paymentId
    ) {
    }

    public record CancelOrderRequest(
            String reason
    ) {
    }
}
