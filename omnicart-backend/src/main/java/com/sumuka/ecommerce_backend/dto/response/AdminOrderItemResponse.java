package com.sumuka.ecommerce_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@AllArgsConstructor
public class AdminOrderItemResponse {
    private UUID productId;
    private String productName;
    private int quantity;
    private BigDecimal price;
}
