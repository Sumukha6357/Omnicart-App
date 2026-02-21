package com.sumuka.ecommerce_backend.modules.procurement.repository;

import com.sumuka.ecommerce_backend.modules.procurement.entity.Product;
import com.sumuka.ecommerce_backend.modules.procurement.entity.Warehouse;
import com.sumuka.ecommerce_backend.modules.procurement.entity.WarehouseInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WarehouseInventoryRepository extends JpaRepository<WarehouseInventory, UUID> {
    Optional<WarehouseInventory> findByWarehouseAndProduct(Warehouse warehouse, Product product);

    List<WarehouseInventory> findByWarehouseId(UUID warehouseId);

    List<WarehouseInventory> findByProductId(UUID productId);

    @Query("select coalesce(sum(wi.quantity), 0) from WarehouseInventory wi where wi.product.id = :productId")
    int sumQuantityByProductId(UUID productId);
}
