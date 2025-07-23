package com.sumuka.ecommerce_backend.dto.request;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderProductRequest {
    private UUID productId;
    private int quantity;
}
