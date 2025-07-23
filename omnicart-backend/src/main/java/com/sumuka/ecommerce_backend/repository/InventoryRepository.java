package com.sumuka.ecommerce_backend.repository;

import com.sumuka.ecommerce_backend.entity.Inventory;
import com.sumuka.ecommerce_backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface InventoryRepository extends JpaRepository<Inventory, UUID> {
    Optional<Inventory> findByProduct(Product product);
}
