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
    private String imageUrl;        // 🔗 S3 pre-signed URL
    private UUID sellerId;          // 👈 Just pass ID
    private UUID categoryId;        // 👈 Just pass ID
}
