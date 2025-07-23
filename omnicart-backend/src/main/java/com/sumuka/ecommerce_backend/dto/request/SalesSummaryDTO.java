package com.sumuka.ecommerce_backend.dto.request;


import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SalesSummaryDTO {
    private long totalOrders;
    private BigDecimal totalRevenue;
    private BigDecimal averageOrderValue;
}
