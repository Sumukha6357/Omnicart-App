package com.sumuka.ecommerce_backend.dto.request;


import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequest {
    private UUID orderId;
    private String paymentMethod; // e.g., CARD, UPI, NETBANKING
}
