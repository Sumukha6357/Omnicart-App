package com.sumuka.ecommerce_backend.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CartItemResponse {
    private UUID productId;
    private Integer quantity;
    private BigDecimal price;
}
