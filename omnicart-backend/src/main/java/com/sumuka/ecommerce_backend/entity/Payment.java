package com.sumuka.ecommerce_backend.entity;


import com.sumuka.ecommerce_backend.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue
    private UUID id;

    private UUID orderId;

    private String paymentMethod;

    private LocalDateTime paymentTime;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
}
