package com.sumuka.ecommerce_backend.dto.response;

import lombok.*;

import java.io.Serializable; // ✅ Important
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse implements Serializable { // ✅ Implement Serializable

    private static final long serialVersionUID = 1L; // 🔒 Optional, but recommended

    private UUID id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
    private String sellerName;     // ✅ Useful for frontend
    private String categoryName;   // ✅ Useful for frontend
    private String brand;          // ✅ Added for frontend compatibility
    private Double rating;         // ✅ Added for frontend compatibility
    private Long popularity;       // ✅ Added for frontend compatibility
    private LocalDateTime createdAt; // ✅ Added for frontend compatibility
}
