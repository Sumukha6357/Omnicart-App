package com.sumuka.ecommerce_backend.modules.invoice.repository;

import com.sumuka.ecommerce_backend.modules.invoice.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ShipmentRepository extends JpaRepository<Shipment, UUID> {
    Optional<Shipment> findByOrderId(UUID orderId);
}
