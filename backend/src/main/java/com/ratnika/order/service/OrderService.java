package com.ratnika.order.service;

import com.ratnika.catalog.product.entity.Product;
import com.ratnika.catalog.product.entity.ProductVariant;
import com.ratnika.catalog.product.repository.ProductRepository;
import com.ratnika.common.dto.PageResponse;
import com.ratnika.common.exception.BadRequestException;
import com.ratnika.common.exception.ResourceNotFoundException;
import com.ratnika.common.exception.UnauthorizedException;
import com.ratnika.config.props.AppProperties;
import com.ratnika.coupon.entity.Coupon;
import com.ratnika.coupon.repository.CouponRepository;
import com.ratnika.coupon.service.CouponService;
import com.ratnika.notification.NotificationService;
import com.ratnika.order.dto.OrderDtos.OrderResponse;
import com.ratnika.order.dto.OrderDtos.PlaceOrderRequest;
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
import com.ratnika.user.entity.Role;
import com.ratnika.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final CouponService couponService;
    private final OrderMapper orderMapper;
    private final NotificationService notificationService;
    private final AppProperties props;

    @Transactional(readOnly = true)
    public List<OrderResponse> myOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(orderMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(String idOrNumber, User user) {
        Order order = resolveOrder(idOrNumber);
        if (!order.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Not allowed to view this order");
        }
        return orderMapper.toResponse(order);
    }

    @Transactional
    public OrderResponse cancel(User user, UUID orderId, String reason) {
        Order order = orderRepository.findWithDetailsById(orderId)
                .orElseThrow(() -> ResourceNotFoundException.of("Order", orderId));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Not allowed to cancel this order");
        }
        if (List.of(OrderStatus.SHIPPED, OrderStatus.OUT_FOR_DELIVERY,
                OrderStatus.DELIVERED, OrderStatus.CANCELLED).contains(order.getStatus())) {
            throw new BadRequestException("Cannot cancel an order that is " + order.getStatus());
        }
        order.setStatus(OrderStatus.CANCELLED);
        order.addTimelineEvent(OrderTimelineEvent.builder()
                .status(OrderStatus.CANCELLED)
                .note(reason != null ? reason : "Cancelled by customer")
                .at(Instant.now()).build());
        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            order.setPaymentStatus(PaymentStatus.REFUNDED);
        }
        // Restock
        order.getItems().forEach(item -> productRepository.findById(item.getProductId())
                .ifPresent(p -> p.setStock(p.getStock() + item.getQuantity())));
        return orderMapper.toResponse(order);
    }

    // ── Admin ─────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public PageResponse<OrderResponse> listAll(OrderStatus status, int page, int size) {
        var pageable = PageRequest.of(page, size);
        Page<Order> result = status == null
                ? orderRepository.findAllByOrderByCreatedAtDesc(pageable)
                : orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        return PageResponse.from(result, orderMapper::toResponse);
    }

    @Transactional
    public OrderResponse updateStatus(UUID orderId, OrderStatus status,
                                      String trackingNumber, String courierName, String note) {
        Order order = orderRepository.findWithDetailsById(orderId)
                .orElseThrow(() -> ResourceNotFoundException.of("Order", orderId));
        order.setStatus(status);
        if (trackingNumber != null) order.setTrackingNumber(trackingNumber);
        if (courierName != null) order.setCourierName(courierName);
        order.addTimelineEvent(OrderTimelineEvent.builder()
                .status(status).note(note).at(Instant.now()).build());
        if (status == OrderStatus.DELIVERED && order.getPaymentMethod() == PaymentMethod.COD) {
            order.setPaymentStatus(PaymentStatus.PAID);
        }
        notificationService.sendOrderStatusUpdate(order.getCustomerEmail(), order.getOrderNumber(), status.name());
        return orderMapper.toResponse(order);
    }

    // ── Helpers ───────────────────────────────────────────────────
    private Order resolveOrder(String idOrNumber) {
        try {
            UUID id = UUID.fromString(idOrNumber);
            return orderRepository.findWithDetailsById(id)
                    .orElseThrow(() -> ResourceNotFoundException.of("Order", idOrNumber));
        } catch (IllegalArgumentException notUuid) {
            return orderRepository.findByOrderNumber(idOrNumber)
                    .orElseThrow(() -> ResourceNotFoundException.of("Order", idOrNumber));
        }
    }

}
