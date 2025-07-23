package com.sumuka.ecommerce_backend.repository;

import com.sumuka.ecommerce_backend.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CartRepository extends JpaRepository<Cart, UUID> {
    // No extra methods needed right now — findById(UUID) is inherited
}
