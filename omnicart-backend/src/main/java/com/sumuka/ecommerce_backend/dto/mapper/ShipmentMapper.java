package com.sumuka.ecommerce_backend.dto.mapper;


import com.sumuka.ecommerce_backend.dto.response.ShipmentResponseDTO;
import com.sumuka.ecommerce_backend.entity.Shipment;

public class ShipmentMapper {

    public static ShipmentResponseDTO toDTO(Shipment shipment) {
        if (shipment == null) {
            throw new IllegalArgumentException("Cannot convert null Shipment to DTO");
        }

        return ShipmentResponseDTO.builder()
                .shipmentId(shipment.getId())
                .orderId(shipment.getOrder().getId())
                .status(shipment.getStatus())
                .logisticsPartner(shipment.getLogisticsPartner())
                .shippedAt(shipment.getShippedAt())
                .estimatedDelivery(shipment.getEstimatedDelivery())
                .build();
    }

}
