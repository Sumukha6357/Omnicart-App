package com.sumuka.ecommerce_backend.dto.response;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishlistItemDTO {
    private UUID productId;
    private String name;
    private BigDecimal price;
    private String imageUrl;
}
