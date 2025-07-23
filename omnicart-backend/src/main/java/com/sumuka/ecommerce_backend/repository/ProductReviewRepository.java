package com.sumuka.ecommerce_backend.repository;

import com.sumuka.ecommerce_backend.entity.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProductReviewRepository extends JpaRepository<ProductReview, UUID> {
    List<ProductReview> findByProductId(UUID productId);
}
