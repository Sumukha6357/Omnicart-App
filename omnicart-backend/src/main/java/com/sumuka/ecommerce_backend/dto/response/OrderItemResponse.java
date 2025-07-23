package com.sumuka.ecommerce_backend.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {
    private UUID productId;
    private int quantity;
    private BigDecimal price;
}
