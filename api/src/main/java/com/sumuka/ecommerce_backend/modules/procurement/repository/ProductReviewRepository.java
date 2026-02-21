package com.sumuka.ecommerce_backend.modules.procurement.repository;

import com.sumuka.ecommerce_backend.modules.procurement.entity.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ProductReviewRepository extends JpaRepository<ProductReview, UUID> {
    List<ProductReview> findByProductId(UUID productId);

    @Query("""
        SELECT pr.product.id, AVG(pr.rating)
        FROM ProductReview pr
        WHERE pr.product.id IN :productIds
        GROUP BY pr.product.id
    """)
    List<Object[]> findAverageRatingsByProductIds(List<UUID> productIds);
}
