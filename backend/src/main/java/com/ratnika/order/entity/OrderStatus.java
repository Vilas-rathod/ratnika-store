package com.ratnika.order.entity;

public enum OrderStatus {
    PENDING,
    PENDING_PAYMENT,   // saga: order created, awaiting online payment (stock reserved)
    PAYMENT_FAILED,    // saga: payment failed/abandoned/expired (stock released)
    CONFIRMED,
    PROCESSING,
    PLACED_WITH_SUPPLIER,
    SHIPPED,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED
}
