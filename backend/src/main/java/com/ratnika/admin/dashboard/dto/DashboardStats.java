package com.ratnika.admin.dashboard.dto;

import com.ratnika.order.dto.OrderDtos.OrderResponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record DashboardStats(
        BigDecimal totalRevenue,
        BigDecimal revenueThisMonth,
        long totalOrders,
        long pendingOrders,
        long totalCustomers,
        long totalProducts,
        long lowStockCount,
        BigDecimal averageOrderValue,
        List<DailyPoint> revenueByDay,
        List<CategorySales> salesByCategory,
        List<TopProduct> topProducts,
        List<OrderResponse> recentOrders
) {

    public record DailyPoint(String date, BigDecimal revenue, long orders) {
    }

    public record CategorySales(String category, BigDecimal revenue) {
    }

    public record TopProduct(UUID productId, String name, long unitsSold, BigDecimal revenue) {
    }
}
