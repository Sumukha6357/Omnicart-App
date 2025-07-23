package com.sumuka.ecommerce_backend.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecentlyViewedProductResponseDTO {
    private UUID productId;
    private LocalDateTime viewedAt;
}
