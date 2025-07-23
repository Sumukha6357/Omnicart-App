package com.sumuka.ecommerce_backend.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentResponseDTO {

    private UUID shipmentId;
    private UUID orderId;
    private String status;
    private String logisticsPartner;
    private LocalDateTime shippedAt;
    private LocalDateTime estimatedDelivery;
}
