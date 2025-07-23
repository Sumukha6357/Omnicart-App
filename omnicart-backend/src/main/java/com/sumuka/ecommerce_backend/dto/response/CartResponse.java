package com.sumuka.ecommerce_backend.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class CartResponse {
    private UUID userId;
    private List<CartItemResponse> items;
    private BigDecimal totalAmount;
}
