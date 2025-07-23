package com.sumuka.ecommerce_backend.service.contract;

import com.sumuka.ecommerce_backend.dto.request.OrderRequest;
import com.sumuka.ecommerce_backend.dto.response.AdminOrderResponse;
import com.sumuka.ecommerce_backend.dto.response.OrderResponse;

import java.util.List;
import java.util.UUID;

public interface OrderService {

    OrderResponse placeOrder(UUID userId, OrderRequest request);

    List<OrderResponse> getOrdersByUser(UUID userId);

    OrderResponse getOrderById(UUID orderId);

    List<AdminOrderResponse> getAllOrdersForAdmin();

}
