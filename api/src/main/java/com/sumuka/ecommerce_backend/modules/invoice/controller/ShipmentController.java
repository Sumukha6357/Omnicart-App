package com.sumuka.ecommerce_backend.modules.invoice.controller;

import com.sumuka.ecommerce_backend.dto.mapper.ShipmentMapper;
import com.sumuka.ecommerce_backend.dto.response.ShipmentResponseDTO;
import com.sumuka.ecommerce_backend.modules.invoice.entity.Shipment;
import com.sumuka.ecommerce_backend.modules.invoice.service.impl.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PostMapping("/{orderId}")
    public Shipment createShipment(@PathVariable UUID orderId,
            @RequestParam String logisticsPartner,
            @RequestParam(required = false) String trackingNumber) {
        return shipmentService.createShipment(orderId, logisticsPartner, trackingNumber);
    }

    @PutMapping("/{shipmentId}")
    public Shipment updateShipmentStatus(@PathVariable UUID shipmentId, @RequestParam String status) {
        return shipmentService.updateShipmentStatus(shipmentId, status);
    }

    @GetMapping("/order/{orderId}")
    public ShipmentResponseDTO getShipmentByOrderId(@PathVariable UUID orderId) {
        Shipment shipment = shipmentService.getShipmentByOrderId(orderId);
        return ShipmentMapper.toDTO(shipment);
    }

    @GetMapping
    public ResponseEntity<List<ShipmentResponseDTO>> getAllShipments() {
        List<ShipmentResponseDTO> shipments = shipmentService.getAllShipments()
                .stream()
                .map(ShipmentMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(shipments);
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<ShipmentResponseDTO>> getShipmentsBySeller(@PathVariable UUID sellerId) {
        List<ShipmentResponseDTO> shipments = shipmentService.getShipmentsBySeller(sellerId)
                .stream()
                .map(ShipmentMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(shipments);
    }

}
