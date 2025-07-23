package com.sumuka.ecommerce_backend.service.contract;

import com.sumuka.ecommerce_backend.dto.request.DateFilterRequestDTO;
import com.sumuka.ecommerce_backend.dto.response.AdminAnalyticsResponseDTO;

public interface AnalyticsService {
    com.sumuka.ecommerce_backend.dto.response.AdminAnalyticsResponseDTO getDashboardAnalytics(DateFilterRequestDTO filter);
}
