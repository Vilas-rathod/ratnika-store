package com.ratnika.order.mapper;

import com.ratnika.order.dto.OrderDtos.OrderItemResponse;
import com.ratnika.order.dto.OrderDtos.OrderResponse;
import com.ratnika.order.dto.OrderDtos.ShippingAddressDto;
import com.ratnika.order.dto.OrderDtos.TimelineEventDto;
import com.ratnika.order.entity.Order;
import com.ratnika.order.entity.OrderItem;
import com.ratnika.order.entity.OrderTimelineEvent;
import com.ratnika.order.entity.ShippingAddress;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface OrderMapper {

    @Mapping(target = "userId", source = "user.id")
    OrderResponse toResponse(Order order);

    OrderItemResponse toItemResponse(OrderItem item);

    ShippingAddressDto toAddressDto(ShippingAddress address);

    TimelineEventDto toTimelineDto(OrderTimelineEvent event);
}
