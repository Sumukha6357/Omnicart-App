package com.sumuka.ecommerce_backend.service.impl;

import com.sumuka.ecommerce_backend.dto.analytics.CategorySalesDTO;
import com.sumuka.ecommerce_backend.dto.analytics.TopProductDto;
import com.sumuka.ecommerce_backend.dto.request.*;
import com.sumuka.ecommerce_backend.dto.response.AdminAnalyticsResponseDTO;
import com.sumuka.ecommerce_backend.repository.*;
import com.sumuka.ecommerce_backend.service.contract.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public AdminAnalyticsResponseDTO getDashboardAnalytics(DateFilterRequestDTO filter) {
        LocalDate start = filter.getStartDate();
        LocalDate end = filter.getEndDate();

        // --- Sales Summary ---
        long totalOrders = orderRepository.countByOrderDateBetween(start.atStartOfDay(), end.plusDays(1).atStartOfDay());
        BigDecimal totalRevenue = orderRepository.calculateTotalRevenueBetween(start, end);
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

        List<TopProductDto> topProducts = orderItemRepository.findTopProductsByRevenue(start, end);
        List<CategorySalesDTO> categorySales = orderItemRepository.calculateSalesByCategory(start, end);


        return AdminAnalyticsResponseDTO.builder()
                .salesSummary(salesSummary)
                .userStats(userStats)
                .topProducts(topProducts)
                .categorySales(categorySales)
                .build();
    }
}
