package com.sumuka.ecommerce_backend.modules.user.repository;

import com.sumuka.ecommerce_backend.modules.user.entity.RecentlyViewedProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface RecentlyViewedProductRepository extends JpaRepository<RecentlyViewedProduct, UUID> {
    List<RecentlyViewedProduct> findByUserIdOrderByViewedAtDesc(UUID userId);

    @Query("SELECT r FROM RecentlyViewedProduct r WHERE r.userId = :userId AND r.productId = :productId")
    RecentlyViewedProduct findByUserIdAndProductId(UUID userId, UUID productId);
}
