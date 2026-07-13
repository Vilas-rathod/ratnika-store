package com.ratnika.admin.dashboard.service;

import com.ratnika.admin.dashboard.dto.DashboardStats;
import com.ratnika.admin.dashboard.dto.DashboardStats.CategorySales;
import com.ratnika.admin.dashboard.dto.DashboardStats.DailyPoint;
import com.ratnika.admin.dashboard.dto.DashboardStats.TopProduct;
import com.ratnika.catalog.product.repository.ProductRepository;
import com.ratnika.order.entity.Order;
import com.ratnika.order.entity.OrderItem;
import com.ratnika.order.entity.OrderStatus;
import com.ratnika.order.mapper.OrderMapper;
import com.ratnika.order.repository.OrderRepository;
import com.ratnika.user.entity.Role;
import com.ratnika.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Aggregates store analytics for the admin dashboard. Reads all orders once
 * and aggregates in memory — fine for admin-scale reporting; swap for
 * projection queries if the order table grows very large.
 */
@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final int TREND_DAYS = 14;
    private static final int LOW_STOCK_THRESHOLD = 5;
    private static final ZoneId IST = ZoneId.of("Asia/Kolkata");

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderMapper orderMapper;

    @Transactional(readOnly = true)
    public DashboardStats build() {
        List<Order> allOrders = orderRepository.findAll();
        List<Order> paid = allOrders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .toList();

        BigDecimal totalRevenue = paid.stream()
                .map(Order::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);

        LocalDate monthStart = LocalDate.now(IST).withDayOfMonth(1);
        BigDecimal revenueThisMonth = paid.stream()
                .filter(o -> !toDate(o).isBefore(monthStart))
                .map(Order::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);

        long pending = orderRepository.countByStatusIn(List.of(
                OrderStatus.PENDING, OrderStatus.CONFIRMED,
                OrderStatus.PROCESSING, OrderStatus.PLACED_WITH_SUPPLIER));

        BigDecimal aov = paid.isEmpty() ? BigDecimal.ZERO
                : totalRevenue.divide(BigDecimal.valueOf(paid.size()), 0, RoundingMode.HALF_UP);

        return new DashboardStats(
                totalRevenue,
                revenueThisMonth,
                allOrders.size(),
                pending,
                userRepository.countByRole(Role.CUSTOMER),
                productRepository.countByActiveTrue(),
                productRepository.countByActiveTrueAndStockLessThan(LOW_STOCK_THRESHOLD),
                aov,
                revenueByDay(paid),
                salesByCategory(paid),
                topProducts(paid),
                allOrders.stream()
                        .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                        .limit(5).map(orderMapper::toResponse).toList());
    }

    private List<DailyPoint> revenueByDay(List<Order> paid) {
        Map<LocalDate, BigDecimal> revenue = new LinkedHashMap<>();
        Map<LocalDate, Long> counts = new LinkedHashMap<>();
        LocalDate today = LocalDate.now(IST);
        for (int i = TREND_DAYS - 1; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            revenue.put(d, BigDecimal.ZERO);
            counts.put(d, 0L);
        }
        for (Order o : paid) {
            LocalDate d = toDate(o);
            if (revenue.containsKey(d)) {
                revenue.merge(d, o.getTotal(), BigDecimal::add);
                counts.merge(d, 1L, Long::sum);
            }
        }
        return revenue.entrySet().stream()
                .map(e -> new DailyPoint(e.getKey().toString(), e.getValue(), counts.get(e.getKey())))
                .toList();
    }

    private List<CategorySales> salesByCategory(List<Order> paid) {
        Map<String, BigDecimal> byCategory = new LinkedHashMap<>();
        for (Order o : paid) {
            for (OrderItem item : o.getItems()) {
                String category = productRepository.findById(item.getProductId())
                        .map(p -> p.getCategory().getName()).orElse("Other");
                byCategory.merge(category,
                        item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())), BigDecimal::add);
            }
        }
        return byCategory.entrySet().stream()
                .map(e -> new CategorySales(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(CategorySales::revenue).reversed())
                .limit(6).toList();
    }

    private List<TopProduct> topProducts(List<Order> paid) {
        Map<UUID, long[]> units = new LinkedHashMap<>();
        Map<UUID, BigDecimal> revenue = new LinkedHashMap<>();
        Map<UUID, String> names = new LinkedHashMap<>();
        for (Order o : paid) {
            for (OrderItem item : o.getItems()) {
                units.computeIfAbsent(item.getProductId(), k -> new long[1])[0] += item.getQuantity();
                revenue.merge(item.getProductId(),
                        item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())), BigDecimal::add);
                names.putIfAbsent(item.getProductId(), item.getName());
            }
        }
        return revenue.entrySet().stream()
                .map(e -> new TopProduct(e.getKey(), names.get(e.getKey()),
                        units.get(e.getKey())[0], e.getValue()))
                .sorted(Comparator.comparing(TopProduct::revenue).reversed())
                .limit(5).toList();
    }

    private LocalDate toDate(Order order) {
        return order.getCreatedAt().atZone(IST).toLocalDate();
    }
}
