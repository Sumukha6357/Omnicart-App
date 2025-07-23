package com.sumuka.ecommerce_backend.dto.request;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentStatusUpdateDTO {
    private UUID shipmentId;
    private String newStatus;
}
