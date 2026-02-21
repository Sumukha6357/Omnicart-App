package com.sumuka.ecommerce_backend.dto.request;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShipmentRequestDTO {
    private UUID orderId;
    private String logisticsPartner;
}
