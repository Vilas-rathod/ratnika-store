package com.ratnika.admin.order.controller;

import com.ratnika.common.dto.ApiResponse;
import com.ratnika.common.dto.PageResponse;
import com.ratnika.order.dto.OrderDtos.OrderResponse;
import com.ratnika.order.entity.OrderStatus;
import com.ratnika.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("${app.api-prefix}/admin/orders")
@RequiredArgsConstructor
@Tag(name = "Admin · Orders", description = "Order fulfilment & status management")
public class AdminOrderController {

    private final OrderService orderService;

    public record UpdateStatusRequest(
            @NotNull OrderStatus status,
            String trackingNumber,
            String courierName,
            String note
    ) {
    }

    @GetMapping
    @Operation(summary = "List all orders (optionally filtered by status)")
    public ApiResponse<PageResponse<OrderResponse>> list(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(orderService.listAll(status, page, size));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update order status, tracking & courier")
    public ApiResponse<OrderResponse> updateStatus(@PathVariable UUID id,
                                                   @RequestBody UpdateStatusRequest request) {
        return ApiResponse.success("Order updated", orderService.updateStatus(
                id, request.status(), request.trackingNumber(), request.courierName(), request.note()));
    }
}
