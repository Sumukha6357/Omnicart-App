package com.sumuka.ecommerce_backend.repository;

import com.sumuka.ecommerce_backend.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface WarehouseRepository extends JpaRepository<Warehouse, UUID> {
    List<Warehouse> findByActiveTrueOrderByCreatedAtAsc();
}
