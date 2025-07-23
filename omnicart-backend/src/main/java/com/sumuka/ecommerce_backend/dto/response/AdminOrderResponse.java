package com.sumuka.ecommerce_backend.dto.response;

import com.sumuka.ecommerce_backend.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
public class AdminOrderResponse {
    private UUID orderId;
    private String userName;
    private String userEmail;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private List<AdminOrderItemResponse> items;
}
