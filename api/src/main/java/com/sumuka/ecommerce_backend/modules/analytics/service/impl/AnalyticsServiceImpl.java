package com.sumuka.ecommerce_backend.modules.analytics.service.impl;

import com.sumuka.ecommerce_backend.dto.analytics.*;
import com.sumuka.ecommerce_backend.dto.request.*;
import com.sumuka.ecommerce_backend.dto.response.AdminAnalyticsResponseDTO;
import com.sumuka.ecommerce_backend.modules.invoice.repository.OrderRepository;
import com.sumuka.ecommerce_backend.modules.invoice.repository.OrderItemRepository;
import com.sumuka.ecommerce_backend.modules.user.repository.UserRepository;
import com.sumuka.ecommerce_backend.modules.procurement.repository.ProductRepository;
import com.sumuka.ecommerce_backend.modules.procurement.repository.CategoryRepository;
import com.sumuka.ecommerce_backend.dto.request.UserStatsDTO;
import com.sumuka.ecommerce_backend.modules.analytics.service.contract.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import org.springframework.scheduling.annotation.Async;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

        private final OrderRepository orderRepository;
        private final OrderItemRepository orderItemRepository;
        private final UserRepository userRepository;
        private final ProductRepository productRepository;
        private final CategoryRepository categoryRepository;

        @Override
        @Async("taskExecutor")
        @org.springframework.cache.annotation.Cacheable(value = "dashboardAnalytics")
        public CompletableFuture<AdminAnalyticsResponseDTO> getDashboardAnalytics(DateFilterRequestDTO filter) {
                LocalDate start = filter.getStartDate();
                LocalDate end = filter.getEndDate();
                LocalDateTime startDateTime = start.atStartOfDay();
                LocalDateTime endDateTime = end.plusDays(1).atStartOfDay();

                // --- Sales Summary ---
                long totalOrders = orderRepository.countByOrderDateBetween(startDateTime, endDateTime);
                BigDecimal totalRevenue = orderRepository.calculateTotalRevenueBetween(startDateTime, endDateTime);
                BigDecimal avgOrderValue = totalOrders > 0
                                ? totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, BigDecimal.ROUND_HALF_UP)
                                : BigDecimal.ZERO;

                SalesSummaryDTO salesSummary = SalesSummaryDTO.builder()
                                .totalOrders(totalOrders)
                                .totalRevenue(totalRevenue)
                                .averageOrderValue(avgOrderValue)
                                .build();

                // --- User Stats ---
                long totalUsers = userRepository.count();
                long totalSellers = userRepository.countByRole("SELLER");
                long totalBuyers = userRepository.countByRole("CUSTOMER");
                long newUsersThisWeek = userRepository.countByCreatedDateBetween(start, end);

                UserStatsDTO userStats = UserStatsDTO.builder()
                                .totalUsers(totalUsers)
                                .totalSellers(totalSellers)
                                .totalBuyers(totalBuyers)
                                .newUsersThisWeek(newUsersThisWeek)
                                .build();

                List<TopProductDto> topProducts = orderItemRepository.findTopProductsByRevenue(startDateTime,
                                endDateTime);
                List<CategorySalesDTO> categorySales = orderItemRepository.calculateSalesByCategory(startDateTime,
                                endDateTime);

                return CompletableFuture.completedFuture(AdminAnalyticsResponseDTO.builder()
                                .salesSummary(salesSummary)
                                .userStats(userStats)
                                .topProducts(topProducts)
                                .categorySales(categorySales)
                                .build());
        }
}
