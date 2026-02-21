package com.sumuka.ecommerce_backend.modules.user.repository;

import com.sumuka.ecommerce_backend.modules.user.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CartItemRepository extends JpaRepository<CartItem, UUID> {
    void deleteAllByCart_UserId(UUID userId); // ✅ CORRECT
}
