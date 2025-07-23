package com.sumuka.ecommerce_backend.repository;

import com.sumuka.ecommerce_backend.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface WishlistRepository extends JpaRepository<WishlistItem, UUID> {

    List<WishlistItem> findByUserId(UUID userId);

    boolean existsByUserIdAndProductId(UUID userId, UUID productId);

    void deleteByUserIdAndProductId(UUID userId, UUID productId);
}
