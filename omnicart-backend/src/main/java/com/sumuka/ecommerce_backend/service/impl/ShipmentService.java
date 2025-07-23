package com.sumuka.ecommerce_backend.service.impl;

import com.sumuka.ecommerce_backend.entity.Order;
import com.sumuka.ecommerce_backend.entity.Shipment;
import com.sumuka.ecommerce_backend.exception.ResourceNotFoundException;
import com.sumuka.ecommerce_backend.repository.OrderRepository;
import com.sumuka.ecommerce_backend.repository.ShipmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public Shipment createShipment(UUID orderId, String logisticsPartner) {
        Order order = orderRepository.findById(orderId).orElseThrow();

        Shipment shipment = Shipment.builder()
                .order(order)
                .status("Pending")
                .logisticsPartner(logisticsPartner)
                .shippedAt(LocalDateTime.now())
                .estimatedDelivery(LocalDateTime.now().plusDays(5))
                .build();

        return shipmentRepository.save(shipment);
    }

    public Shipment updateShipmentStatus(UUID shipmentId, String newStatus) {
        Shipment shipment = shipmentRepository.findById(shipmentId).orElseThrow();
        shipment.setStatus(newStatus);
        return shipmentRepository.save(shipment);
    }

    public Shipment getShipmentByOrderId(UUID orderId) {
        return shipmentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found for orderId: " + orderId));
    }
}
