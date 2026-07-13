package com.ratnika.order.controller;

import com.ratnika.common.dto.ApiResponse;
import com.ratnika.order.dto.OrderDtos.CancelOrderRequest;
import com.ratnika.order.dto.OrderDtos.OrderResponse;
import com.ratnika.order.service.OrderService;
import com.ratnika.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("${app.api-prefix}/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Customer order placement & tracking")
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @Operation(summary = "List my orders")
    public ApiResponse<List<OrderResponse>> myOrders(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(orderService.myOrders(principal.getUser()));
    }

    @GetMapping("/{idOrNumber}")
    @Operation(summary = "Get an order by id or order number")
    public ApiResponse<OrderResponse> getOrder(@AuthenticationPrincipal UserPrincipal principal,
                                               @PathVariable String idOrNumber) {
        return ApiResponse.success(orderService.getOrder(idOrNumber, principal.getUser()));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel an order")
    public ApiResponse<OrderResponse> cancel(@AuthenticationPrincipal UserPrincipal principal,
                                             @PathVariable UUID id,
                                             @RequestBody(required = false) CancelOrderRequest request) {
        String reason = request != null ? request.reason() : null;
        return ApiResponse.success("Order cancelled", orderService.cancel(principal.getUser(), id, reason));
    }
}
