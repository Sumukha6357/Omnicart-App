package com.sumuka.ecommerce_backend.modules.analytics.service.contract;

import com.sumuka.ecommerce_backend.dto.request.DateFilterRequestDTO;
import com.sumuka.ecommerce_backend.dto.response.AdminAnalyticsResponseDTO;

import java.util.concurrent.CompletableFuture;

public interface AnalyticsService {
    CompletableFuture<com.sumuka.ecommerce_backend.dto.response.AdminAnalyticsResponseDTO> getDashboardAnalytics(
            DateFilterRequestDTO filter);
}
