package com.ratnika.order.repository;

import com.ratnika.order.entity.Order;
import com.ratnika.order.entity.OrderStatus;
import com.ratnika.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    @EntityGraph(attributePaths = "items")
    List<Order> findByUserOrderByCreatedAtDesc(User user);

    // Fetch ONLY items eagerly. Fetching a second collection ("timeline") in the
    // same query produces a cartesian product that duplicates order items (an
    // order with 2 timeline events showed each line item twice, doubling the
    // quantity on order details & invoices). timeline loads lazily during mapping
    // (all callers are @Transactional).
    @EntityGraph(attributePaths = "items")
    Optional<Order> findWithDetailsById(UUID id);

    Optional<Order> findByOrderNumber(String orderNumber);

    @EntityGraph(attributePaths = "items")
    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @EntityGraph(attributePaths = "items")
    Page<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);

    long countByStatusIn(List<OrderStatus> statuses);

    /** Timeout sweeper: pending-payment orders created before the cutoff. */
    @EntityGraph(attributePaths = "items")
    List<Order> findByStatusAndCreatedAtBefore(OrderStatus status, java.time.Instant cutoff);

    long countByUser(User user);

    @org.springframework.data.jpa.repository.Query(
            "SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.user = :user AND o.status <> 'CANCELLED'")
    java.math.BigDecimal sumSpentByUser(@org.springframework.data.repository.query.Param("user") User user);
}
