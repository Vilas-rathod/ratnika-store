package com.ratnika.checkout.service;

import com.ratnika.catalog.product.repository.ProductRepository;
import com.ratnika.coupon.repository.CouponRepository;
import com.ratnika.order.entity.Order;
import com.ratnika.order.entity.OrderItem;
import com.ratnika.order.entity.OrderStatus;
import com.ratnika.order.entity.OrderTimelineEvent;
import com.ratnika.order.entity.PaymentStatus;
import com.ratnika.order.repository.OrderRepository;
import com.ratnika.payment.entity.Payment;
import com.ratnika.payment.repository.PaymentRepository;
import com.ratnika.payment.service.RazorpayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

/**
 * Compensating transactions for the checkout saga, run in a NEW transaction so
 * they COMMIT independently of the caller — even when the caller subsequently
 * throws (e.g. confirm() rejecting a bad signature) or rolls back. Idempotent:
 * a fail on an already-terminal order is a no-op.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CompensationService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final PaymentRepository paymentRepository;
    private final RazorpayService razorpayService;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void failOrder(UUID orderId, String reason) {
        Order order = orderRepository.findWithDetailsById(orderId).orElse(null);
        if (order == null) return;
        if (order.getStatus() == OrderStatus.PAYMENT_FAILED
                || order.getStatus() == OrderStatus.CANCELLED) {
            return; // idempotent — already compensated
        }

        releaseStock(order);
        revertCoupon(order);

        Payment payment = paymentRepository.findByOrderId(orderId).orElse(null);
        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            // Money was captured — refund it.
            String refundId = razorpayService.refund(
                    payment != null ? payment.getGatewayPaymentId() : null, order.getTotal());
            log.info("Refund issued for order {} → {}", order.getOrderNumber(), refundId);
            if (payment != null) payment.setStatus(PaymentStatus.REFUNDED);
            order.setPaymentStatus(PaymentStatus.REFUNDED);
        } else {
            if (payment != null) {
                payment.setStatus(PaymentStatus.FAILED);
                payment.setFailureReason(reason);
            }
            order.setPaymentStatus(PaymentStatus.FAILED);
        }

        order.setStatus(OrderStatus.PAYMENT_FAILED);
        order.addTimelineEvent(OrderTimelineEvent.builder()
                .status(OrderStatus.PAYMENT_FAILED).note(reason).at(Instant.now()).build());
    }

    private void releaseStock(Order order) {
        for (OrderItem item : order.getItems()) {
            productRepository.findWithDetailsById(item.getProductId()).ifPresent(product -> {
                product.setStock(product.getStock() + item.getQuantity());
                if (item.getVariantId() != null) {
                    product.getVariants().stream()
                            .filter(v -> v.getId().equals(item.getVariantId()))
                            .findFirst()
                            .ifPresent(v -> v.setStock(v.getStock() + item.getQuantity()));
                }
            });
        }
    }

    private void revertCoupon(Order order) {
        if (order.getCouponCode() != null) {
            couponRepository.findByCodeIgnoreCase(order.getCouponCode())
                    .ifPresent(c -> c.setUsedCount(Math.max(0, c.getUsedCount() - 1)));
        }
    }
}
