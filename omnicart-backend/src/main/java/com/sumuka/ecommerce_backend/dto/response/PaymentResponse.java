package com.sumuka.ecommerce_backend.dto.response;

import com.sumuka.ecommerce_backend.enums.PaymentStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private UUID paymentId;
    private UUID orderId;
    private String paymentMethod;
    private LocalDateTime paymentTime;
    private PaymentStatus status;
}
