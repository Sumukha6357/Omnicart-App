package com.sumuka.ecommerce_backend.repository;

import com.sumuka.ecommerce_backend.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface StockMovementRepository extends JpaRepository<StockMovement, UUID> {
    List<StockMovement> findByWarehouseIdOrderByCreatedAtDesc(UUID warehouseId);

    List<StockMovement> findByWarehouseIdAndProductIdOrderByCreatedAtDesc(UUID warehouseId, UUID productId);
}
