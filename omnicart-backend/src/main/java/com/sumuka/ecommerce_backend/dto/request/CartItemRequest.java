package com.sumuka.ecommerce_backend.dto.request;

import lombok.*;
import java.util.UUID;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CartItemRequest {
    private UUID productId;
    private int quantity;
}
