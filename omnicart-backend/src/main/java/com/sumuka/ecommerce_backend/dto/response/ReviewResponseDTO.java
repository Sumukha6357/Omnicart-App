package com.sumuka.ecommerce_backend.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponseDTO {
    private UUID reviewId;
    private String reviewerName;
    private Integer rating;
    private String reviewContent;
    private LocalDateTime createdAt;
}
