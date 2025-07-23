package com.sumuka.ecommerce_backend.dto.response;


import com.sumuka.ecommerce_backend.dto.analytics.CategorySalesDTO;
import com.sumuka.ecommerce_backend.dto.request.SalesSummaryDTO;
import com.sumuka.ecommerce_backend.dto.analytics.TopProductDto;
import com.sumuka.ecommerce_backend.dto.request.UserStatsDTO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAnalyticsResponseDTO {
    private SalesSummaryDTO salesSummary;
    private UserStatsDTO userStats;
    private List<TopProductDto> topProducts;
    private List<CategorySalesDTO> categorySales;
}
