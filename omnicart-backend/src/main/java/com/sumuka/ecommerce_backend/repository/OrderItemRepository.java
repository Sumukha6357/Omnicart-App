package com.sumuka.ecommerce_backend.repository;

import com.sumuka.ecommerce_backend.dto.analytics.CategorySalesDTO;
import com.sumuka.ecommerce_backend.dto.analytics.TopProductDto;
import com.sumuka.ecommerce_backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface OrderItemRepository extends JpaRepository<OrderItem, UUID> {

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

}
