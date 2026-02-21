package com.sumuka.ecommerce_backend.dto.request;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;        // Public image URL
    private UUID sellerId;          // Seller ID
    private UUID categoryId;        // Category ID
}
