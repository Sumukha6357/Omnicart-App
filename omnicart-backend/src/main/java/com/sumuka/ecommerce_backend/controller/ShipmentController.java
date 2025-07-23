package com.sumuka.ecommerce_backend.controller;


import com.sumuka.ecommerce_backend.dto.mapper.ShipmentMapper;
import com.sumuka.ecommerce_backend.dto.response.ShipmentResponseDTO;
import com.sumuka.ecommerce_backend.entity.Shipment;
import com.sumuka.ecommerce_backend.service.impl.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @PostMapping("/{orderId}")
    public Shipment createShipment(@PathVariable UUID orderId, @RequestParam String logisticsPartner) {
        return shipmentService.createShipment(orderId, logisticsPartner);
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


}
