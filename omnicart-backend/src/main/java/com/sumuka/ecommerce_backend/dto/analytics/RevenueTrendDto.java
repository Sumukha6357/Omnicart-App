package com.sumuka.ecommerce_backend.dto.analytics;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RevenueTrendDto {
    private LocalDateTime orderDate;
    private BigDecimal totalRevenue;
}
