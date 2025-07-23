package com.sumuka.ecommerce_backend.repository;

import com.sumuka.ecommerce_backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    void deleteAllByCart_UserId(UUID userId); // ✅ CORRECT
}
