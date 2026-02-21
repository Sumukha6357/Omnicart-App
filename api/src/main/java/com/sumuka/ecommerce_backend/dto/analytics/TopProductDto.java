package com.sumuka.ecommerce_backend.dto.analytics;

import java.math.BigDecimal;

public class TopProductDto {

    private String productName;
    private Long unitsSold;
    private BigDecimal totalRevenue;

    public TopProductDto(String productName, Long unitsSold, BigDecimal totalRevenue) {
        this.productName = productName;
        this.unitsSold = unitsSold;
        this.totalRevenue = totalRevenue;
    }

    public String getProductName() {
        return productName;
    }

    public Long getUnitsSold() {
        return unitsSold;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }
}
