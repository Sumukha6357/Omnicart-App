package com.sumuka.ecommerce_backend.modules.invoice.mapper;

import com.sumuka.ecommerce_backend.dto.response.AdminOrderItemResponse;
import com.sumuka.ecommerce_backend.dto.response.AdminOrderResponse;
import com.sumuka.ecommerce_backend.dto.response.OrderItemResponse;
import com.sumuka.ecommerce_backend.dto.response.OrderResponse;
import com.sumuka.ecommerce_backend.modules.invoice.entity.Order;
import com.sumuka.ecommerce_backend.modules.invoice.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {

    @Mapping(source = "id", target = "orderId")
    @Mapping(source = "user.id", target = "userId")
    OrderResponse toDto(Order order);

    @Mapping(source = "product.id", target = "productId")
    OrderItemResponse toItemDto(OrderItem item);

    @Mapping(source = "id", target = "orderId")
    @Mapping(source = "user.name", target = "userName")
    @Mapping(source = "user.email", target = "userEmail")
    AdminOrderResponse toAdminDto(Order order);

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    AdminOrderItemResponse toAdminItemDto(OrderItem item);
}
