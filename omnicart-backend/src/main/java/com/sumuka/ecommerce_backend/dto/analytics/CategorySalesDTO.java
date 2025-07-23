package com.sumuka.ecommerce_backend.dto.analytics;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategorySalesDTO {
    private String categoryName;
    private BigDecimal totalSales;
}
