package com.sumuka.ecommerce_backend.dto.request;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardSummaryDto {
    private Long totalOrders;
    private BigDecimal totalRevenue;
    private Long totalUsers;
    private Long totalProducts;
}
