package com.sumuka.ecommerce_backend.repository;

import com.sumuka.ecommerce_backend.dto.analytics.CategorySalesDTO;
import com.sumuka.ecommerce_backend.dto.analytics.RevenueTrendDto;
import com.sumuka.ecommerce_backend.dto.analytics.TopProductDto;
import com.sumuka.ecommerce_backend.dto.analytics.UserSignupStatsDto;
import com.sumuka.ecommerce_backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AnalyticsRepository extends JpaRepository<Order, Long> {

    // ✅ Total Revenue
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o")
    BigDecimal getTotalRevenue();

    // ✅ Total Orders
    @Query("SELECT COUNT(o.id) FROM Order o")
    Long getTotalOrders();

    // ✅ Total Products
    @Query("SELECT COUNT(p.id) FROM Product p")
    Long getTotalProducts();

    // ✅ Total Users
    @Query("SELECT COUNT(u.id) FROM User u")
    Long getTotalUsers();

    // ✅ Revenue Trend (Daily)
    @Query("""
        SELECT new com.sumuka.ecommerce_backend.dto.analytics.RevenueTrendDto(
            o.orderDate,
            SUM(o.totalAmount)
        )
        FROM Order o
        GROUP BY o.orderDate
        ORDER BY o.orderDate
    """)
    List<RevenueTrendDto> getRevenueTrends();

    // ✅ Top Selling Products (All Time)
    @Query("""
        SELECT new com.sumuka.ecommerce_backend.dto.analytics.TopProductDto(
            p.name,
            SUM(oi.quantity),
            SUM(oi.price * oi.quantity)
        )
        FROM OrderItem oi
        JOIN oi.product p
        GROUP BY p.name
        ORDER BY SUM(oi.quantity) DESC
    """)
    List<TopProductDto> getTopProducts();

    // ✅ User Signup Stats (Daily)
    @Query("""
        SELECT new com.sumuka.ecommerce_backend.dto.analytics.UserSignupStatsDto(
            u.createdDate,
            COUNT(u)
        )
        FROM User u
        GROUP BY u.createdDate
        ORDER BY u.createdDate
    """)
    List<UserSignupStatsDto> getUserSignupStats();

    // ✅ Category Sales Report (Between Dates)
    @Query("""
        SELECT new com.sumuka.ecommerce_backend.dto.analytics.CategorySalesDTO(
            c.name,
            SUM(oi.price * oi.quantity)
        )
        FROM OrderItem oi
        JOIN oi.product p
        JOIN p.category c
        JOIN oi.order o
        WHERE o.orderDate BETWEEN :start AND :end
        GROUP BY c.name
    """)
    List<CategorySalesDTO> calculateSalesByCategory(LocalDate start, LocalDate end);

    // ✅ Top Products by Revenue (Between Dates)
    @Query("""
        SELECT new com.sumuka.ecommerce_backend.dto.analytics.TopProductDto(
            p.name,
            SUM(oi.quantity),
            SUM(oi.price * oi.quantity)
        )
        FROM OrderItem oi
        JOIN oi.product p
        JOIN oi.order o
        WHERE o.orderDate BETWEEN :start AND :end
        GROUP BY p.name
        ORDER BY SUM(oi.price * oi.quantity) DESC
    """)
    List<TopProductDto> findTopProductsByRevenue(LocalDate start, LocalDate end);
}
