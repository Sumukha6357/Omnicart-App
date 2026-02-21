package com.sumuka.ecommerce_backend.dto.request;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewRequestDTO {
    private UUID productId;
    private Integer rating;       // 1 to 5
    private String reviewContent; // Optional user comment
}
