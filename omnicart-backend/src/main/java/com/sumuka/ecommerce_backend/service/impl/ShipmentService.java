package com.sumuka.ecommerce_backend.service.impl;

import com.sumuka.ecommerce_backend.entity.Order;
import com.sumuka.ecommerce_backend.entity.Shipment;
import com.sumuka.ecommerce_backend.exception.ResourceNotFoundException;
import com.sumuka.ecommerce_backend.repository.OrderRepository;
import com.sumuka.ecommerce_backend.repository.ShipmentRepository;
import com.sumuka.ecommerce_backend.enums.OrderStatus;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public Shipment createShipment(UUID orderId, String logisticsPartner, String trackingNumber) {
        Order order = orderRepository.findById(orderId).orElseThrow();

        Shipment shipment = Shipment.builder()
                .order(order)
                .status("Pending")
                .logisticsPartner(logisticsPartner)
                .trackingNumber(trackingNumber)
                .shippedAt(LocalDateTime.now())
                .estimatedDelivery(LocalDateTime.now().plusDays(5))
                .build();

        order.setStatus(OrderStatus.SHIPPED);
        orderRepository.save(order);

        return shipmentRepository.save(shipment);
    }

    public Shipment updateShipmentStatus(UUID shipmentId, String newStatus) {
        Shipment shipment = shipmentRepository.findById(shipmentId).orElseThrow();
        shipment.setStatus(newStatus);
        Order order = shipment.getOrder();
        if (order != null) {
            OrderStatus mapped = mapShipmentStatusToOrderStatus(newStatus);
            if (mapped != null) {
                order.setStatus(mapped);
                orderRepository.save(order);
            }
        }
        return shipmentRepository.save(shipment);
    }

    public Shipment getShipmentByOrderId(UUID orderId) {
        return shipmentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found for orderId: " + orderId));
    }

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    @Transactional
    public List<Shipment> getShipmentsBySeller(UUID sellerId) {
        return shipmentRepository.findAll().stream()
                .filter(shipment -> shipment.getOrder() != null && shipment.getOrder().getItems() != null)
                .filter(shipment -> shipment.getOrder().getItems().stream().anyMatch(item ->
                        item.getProduct() != null
                                && item.getProduct().getSeller() != null
                                && sellerId.equals(item.getProduct().getSeller().getId())))
                .toList();
    }

    private OrderStatus mapShipmentStatusToOrderStatus(String status) {
        if (status == null) {
            return null;
        }
        String normalized = status.trim().toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case "PENDING", "CONFIRMED" -> OrderStatus.CONFIRMED;
            case "SHIPPED" -> OrderStatus.SHIPPED;
            case "DELIVERED" -> OrderStatus.DELIVERED;
            case "CANCELLED" -> OrderStatus.CANCELLED;
            default -> null;
        };
    }
}
