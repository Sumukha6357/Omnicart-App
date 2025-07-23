package com.sumuka.ecommerce_backend.dto.projection;


import java.math.BigDecimal;

public interface TopProductProjection {
    String getProductName();
    BigDecimal getTotalRevenue();
    Long getUnitsSold();
}
