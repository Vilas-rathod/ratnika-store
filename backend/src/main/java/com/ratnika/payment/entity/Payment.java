package com.ratnika.payment.entity;

import com.ratnika.common.entity.BaseEntity;
import com.ratnika.order.entity.PaymentMethod;
import com.ratnika.order.entity.PaymentStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Audit record of a payment transaction (gateway order + payment ids).
 */
@Entity
@Table(name = "payments", indexes = {
        @Index(name = "idx_payment_order", columnList = "orderId"),
        @Index(name = "idx_payment_gateway_order", columnList = "gatewayOrderId")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment extends BaseEntity {

    private UUID orderId;

    @Column(length = 80)
    private String gatewayOrderId;    // razorpay order id

    @Column(length = 80)
    private String gatewayPaymentId;  // razorpay payment id

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status;

    @Column(length = 512)
    private String gatewaySignature;

    @Column(length = 300)
    private String failureReason;

    @Column(nullable = false)
    @Builder.Default
    private int attemptCount = 0;
}
