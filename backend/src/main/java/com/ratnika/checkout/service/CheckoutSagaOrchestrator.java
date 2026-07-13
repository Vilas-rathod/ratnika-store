package com.ratnika.checkout.service;

import com.ratnika.catalog.product.entity.Product;
import com.ratnika.catalog.product.entity.ProductVariant;
import com.ratnika.catalog.product.repository.ProductRepository;
import com.ratnika.checkout.dto.CheckoutDtos.ConfirmPaymentRequest;
import com.ratnika.checkout.dto.CheckoutDtos.InitiateCheckoutRequest;
import com.ratnika.checkout.dto.CheckoutDtos.InitiateCheckoutResponse;
import com.ratnika.common.exception.BadRequestException;
import com.ratnika.common.exception.ResourceNotFoundException;
import com.ratnika.common.exception.UnauthorizedException;
import com.ratnika.config.props.AppProperties;
import com.ratnika.coupon.entity.Coupon;
import com.ratnika.coupon.repository.CouponRepository;
import com.ratnika.coupon.service.CouponService;
import com.ratnika.notification.NotificationService;
import com.ratnika.order.dto.OrderDtos.OrderItemRequest;
import com.ratnika.order.dto.OrderDtos.OrderResponse;
import com.ratnika.order.dto.OrderDtos.ShippingAddressDto;
import com.ratnika.order.entity.Order;
import com.ratnika.order.entity.OrderItem;
import com.ratnika.order.entity.OrderStatus;
import com.ratnika.order.entity.OrderTimelineEvent;
import com.ratnika.order.entity.PaymentMethod;
import com.ratnika.order.entity.PaymentStatus;
import com.ratnika.order.entity.ShippingAddress;
import com.ratnika.order.mapper.OrderMapper;
import com.ratnika.order.repository.OrderRepository;
import com.ratnika.payment.dto.PaymentDtos.RazorpayOrderResponse;
import com.ratnika.payment.entity.Payment;
import com.ratnika.payment.entity.ProcessedWebhookEvent;
import com.ratnika.payment.repository.PaymentRepository;
import com.ratnika.payment.repository.ProcessedWebhookEventRepository;
import com.ratnika.payment.service.RazorpayService;
import com.ratnika.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

/**
 * Orchestration saga for checkout & payment.
 *
 * Steps (RAZORPAY):  reserve stock → create PENDING_PAYMENT order → create
 * gateway order  ── customer pays ──  verify signature → CONFIRMED / PAID.
 * Every step has a compensating action (release stock, revert coupon, fail
 * order, refund) invoked on failure, on customer cancel, on a `payment.failed`
 * webhook, or by the expiry sweeper. The webhook is the authoritative,
 * idempotent source of truth. COD skips the gateway and confirms immediately.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CheckoutSagaOrchestrator {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final CouponService couponService;
    private final PaymentRepository paymentRepository;
    private final ProcessedWebhookEventRepository webhookEventRepository;
    private final OrderMapper orderMapper;
    private final NotificationService notificationService;
    private final RazorpayService razorpayService;
    private final CompensationService compensationService;
    private final AppProperties props;

    // ── Step 1: initiate ──────────────────────────────────────────
    @Transactional
    public InitiateCheckoutResponse initiate(User user, InitiateCheckoutRequest request) {
        if (request.items().isEmpty()) {
            throw new BadRequestException("Your cart is empty");
        }
        Instant now = Instant.now();
        Order order = Order.builder()
                .orderNumber(generateOrderNumber())
                .user(user)
                .customerName(user.fullName())
                .customerEmail(user.getEmail())
                .shippingAddress(toShippingAddress(request.shippingAddress()))
                .paymentMethod(request.paymentMethod())
                .status(OrderStatus.PENDING)
                .build();

        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItemRequest itemReq : request.items()) {
            Product product = productRepository.findWithDetailsById(itemReq.productId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product " + itemReq.productId() + " no longer available"));
            ProductVariant variant = resolveVariant(product, itemReq.variantId());
            int available = variant != null ? variant.getStock() : product.getStock();
            if (available < itemReq.quantity()) {
                throw new BadRequestException("Only " + available + " left of " + product.getName());
            }
            BigDecimal unitPrice = product.getPrice()
                    .add(variant != null ? variant.getPriceDelta() : BigDecimal.ZERO);

            order.addItem(OrderItem.builder()
                    .productId(product.getId())
                    .name(product.getName())
                    .imageUrl(product.getImages().isEmpty() ? null : product.getImages().get(0).getUrl())
                    .price(unitPrice)
                    .quantity(itemReq.quantity())
                    .variantId(variant != null ? variant.getId() : null)
                    .variantLabel(itemReq.variantLabel() != null ? itemReq.variantLabel()
                            : variant != null ? variant.getName() + ": " + variant.getValue() : null)
                    .build());

            subtotal = subtotal.add(unitPrice.multiply(BigDecimal.valueOf(itemReq.quantity())));

            // RESERVE stock (optimistic-locked via Product.version → prevents oversell)
            product.setStock(product.getStock() - itemReq.quantity());
            if (variant != null) variant.setStock(variant.getStock() - itemReq.quantity());
        }

        // Coupon (server-side; reverted on compensation)
        BigDecimal discount = BigDecimal.ZERO;
        if (request.couponCode() != null && !request.couponCode().isBlank()) {
            Coupon coupon = couponRepository.findByCodeIgnoreCase(request.couponCode())
                    .filter(Coupon::isActive).orElse(null);
            if (coupon != null && subtotal.compareTo(coupon.getMinOrderAmount()) >= 0) {
                discount = couponService.computeDiscount(coupon, subtotal);
                coupon.setUsedCount(coupon.getUsedCount() + 1);
                order.setCouponCode(coupon.getCode());
            }
        }

        BigDecimal afterDiscount = subtotal.subtract(discount);
        BigDecimal shippingFee = afterDiscount.compareTo(
                BigDecimal.valueOf(props.getStore().getFreeShippingThreshold())) >= 0
                ? BigDecimal.ZERO : BigDecimal.valueOf(props.getStore().getShippingFee());
        BigDecimal total = afterDiscount.add(shippingFee);

        order.setSubtotal(subtotal);
        order.setDiscount(discount);
        order.setShippingFee(shippingFee);
        order.setTotal(total);
        order.addTimelineEvent(event(OrderStatus.PENDING, "Order placed", now));

        // ── COD: confirm immediately, no gateway ──────────────────
        if (request.paymentMethod() == PaymentMethod.COD) {
            order.setStatus(OrderStatus.CONFIRMED);
            order.setPaymentStatus(PaymentStatus.COD_PENDING);
            order.addTimelineEvent(event(OrderStatus.CONFIRMED, "COD order confirmed", now));
            order = orderRepository.save(order);
            paymentRepository.save(Payment.builder()
                    .orderId(order.getId()).amount(total).currency("INR")
                    .method(PaymentMethod.COD).status(PaymentStatus.COD_PENDING).build());
            notificationService.sendOrderConfirmation(user.getEmail(), user.fullName(),
                    order.getOrderNumber(), "₹" + total);
            return new InitiateCheckoutResponse(order.getId(), order.getOrderNumber(),
                    PaymentMethod.COD, false, null, null, null, null);
        }

        // ── RAZORPAY: create gateway order (rolls back on failure) ──
        order.setStatus(OrderStatus.PENDING_PAYMENT);
        order.setPaymentStatus(PaymentStatus.PENDING);
        order = orderRepository.save(order);

        RazorpayOrderResponse gateway = razorpayService.createOrder(total); // throws → tx rollback (compensates all)
        paymentRepository.save(Payment.builder()
                .orderId(order.getId())
                .gatewayOrderId(gateway.razorpayOrderId())
                .amount(total).currency("INR")
                .method(PaymentMethod.RAZORPAY).status(PaymentStatus.PENDING).build());

        return new InitiateCheckoutResponse(order.getId(), order.getOrderNumber(),
                PaymentMethod.RAZORPAY, true, gateway.razorpayOrderId(),
                gateway.amount(), gateway.currency(), gateway.keyId());
    }

    // ── Step 3: confirm (client callback) ─────────────────────────
    @Transactional
    public OrderResponse confirm(User user, ConfirmPaymentRequest request) {
        Order order = orderRepository.findWithDetailsById(request.orderId())
                .orElseThrow(() -> ResourceNotFoundException.of("Order", request.orderId()));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Not allowed to confirm this order");
        }
        if (order.getStatus() == OrderStatus.CONFIRMED) {
            return orderMapper.toResponse(order); // idempotent — already paid
        }
        if (order.getStatus() != OrderStatus.PENDING_PAYMENT) {
            throw new BadRequestException("This order is not awaiting payment");
        }
        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElseThrow(() -> ResourceNotFoundException.of("Payment for order", order.getId()));
        payment.setAttemptCount(payment.getAttemptCount() + 1);

        boolean verified = razorpayService.verifySignature(
                request.razorpayOrderId(), request.razorpayPaymentId(), request.razorpaySignature());
        if (!verified) {
            // Compensate in a NEW transaction so it commits even though we throw.
            compensationService.failOrder(order.getId(), "Payment verification failed");
            throw new BadRequestException("Payment verification failed");
        }
        applyPaymentSuccess(order, payment, request.razorpayPaymentId(), request.razorpaySignature());
        return orderMapper.toResponse(order);
    }

    // ── Compensation: customer abandons the payment ───────────────
    @Transactional
    public void cancel(User user, UUID orderId) {
        Order order = orderRepository.findWithDetailsById(orderId)
                .orElseThrow(() -> ResourceNotFoundException.of("Order", orderId));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Not allowed to cancel this order");
        }
        if (order.getStatus() == OrderStatus.PENDING_PAYMENT) {
            compensationService.failOrder(order.getId(), "Payment cancelled by customer");
        }
    }

    // ── Authoritative reconciliation: Razorpay webhook ────────────
    @Transactional
    public void handleWebhook(String rawBody, String signature, String eventId) {
        if (!razorpayService.verifyWebhookSignature(rawBody, signature)) {
            throw new BadRequestException("Invalid webhook signature");
        }
        if (eventId != null && webhookEventRepository.existsByEventId(eventId)) {
            return; // idempotent — already handled
        }
        JSONObject payload = new JSONObject(rawBody);
        String event = payload.optString("event", "");
        JSONObject entity = payload.optJSONObject("payload") != null
                && payload.getJSONObject("payload").optJSONObject("payment") != null
                ? payload.getJSONObject("payload").getJSONObject("payment").optJSONObject("entity")
                : null;

        if (entity != null) {
            String gatewayOrderId = entity.optString("order_id", null);
            String gatewayPaymentId = entity.optString("id", null);
            paymentRepository.findByGatewayOrderId(gatewayOrderId).ifPresent(payment -> {
                Order order = orderRepository.findWithDetailsById(payment.getOrderId()).orElse(null);
                if (order == null) return;
                switch (event) {
                    case "payment.captured", "order.paid" -> {
                        if (order.getStatus() == OrderStatus.PENDING_PAYMENT) {
                            applyPaymentSuccess(order, payment, gatewayPaymentId, "webhook");
                        }
                    }
                    case "payment.failed" -> {
                        if (order.getStatus() == OrderStatus.PENDING_PAYMENT) {
                            compensationService.failOrder(order.getId(), "Payment failed at gateway");
                        }
                    }
                    case "refund.processed", "refund.created" -> {
                        order.setPaymentStatus(PaymentStatus.REFUNDED);
                        payment.setStatus(PaymentStatus.REFUNDED);
                    }
                    default -> log.info("Unhandled Razorpay webhook event: {}", event);
                }
            });
        }
        if (eventId != null) {
            webhookEventRepository.save(ProcessedWebhookEvent.builder()
                    .eventId(eventId).eventType(event).build());
        }
    }

    // ── Expiry sweeper: release stock for abandoned payment orders ─
    @org.springframework.scheduling.annotation.Scheduled(fixedDelayString = "PT5M")
    @Transactional
    public void sweepExpiredPayments() {
        Instant cutoff = Instant.now().minus(
                props.getCheckout().getPaymentTimeoutMinutes(), ChronoUnit.MINUTES);
        var expired = orderRepository.findByStatusAndCreatedAtBefore(OrderStatus.PENDING_PAYMENT, cutoff);
        for (Order order : expired) {
            log.info("Auto-cancelling expired payment order {}", order.getOrderNumber());
            // Each in its own transaction — one failure never rolls back the others.
            compensationService.failOrder(order.getId(), "Payment window expired");
        }
    }

    // ── Internal helpers ──────────────────────────────────────────
    private void applyPaymentSuccess(Order order, Payment payment, String gatewayPaymentId, String signature) {
        payment.setStatus(PaymentStatus.PAID);
        payment.setGatewayPaymentId(gatewayPaymentId);
        payment.setGatewaySignature(signature);
        order.setStatus(OrderStatus.CONFIRMED);
        order.setPaymentStatus(PaymentStatus.PAID);
        order.setPaymentId(gatewayPaymentId);
        order.addTimelineEvent(event(OrderStatus.CONFIRMED, "Payment received", Instant.now()));
        notificationService.sendOrderConfirmation(order.getCustomerEmail(), order.getCustomerName(),
                order.getOrderNumber(), "₹" + order.getTotal());
    }

    private OrderTimelineEvent event(OrderStatus status, String note, Instant at) {
        return OrderTimelineEvent.builder().status(status).note(note).at(at).build();
    }

    private ProductVariant resolveVariant(Product product, UUID variantId) {
        if (variantId == null) return null;
        return product.getVariants().stream()
                .filter(v -> v.getId().equals(variantId)).findFirst().orElse(null);
    }

    private ShippingAddress toShippingAddress(ShippingAddressDto dto) {
        return ShippingAddress.builder()
                .fullName(dto.fullName()).phone(dto.phone())
                .line1(dto.line1()).line2(dto.line2())
                .city(dto.city()).state(dto.state()).pincode(dto.pincode())
                .country(dto.country() == null ? "India" : dto.country())
                .type(dto.type())
                .build();
    }

    private String generateOrderNumber() {
        String suffix = String.valueOf(System.currentTimeMillis());
        return "RTN" + suffix.substring(suffix.length() - 8);
    }
}
