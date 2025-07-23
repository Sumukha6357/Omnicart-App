package com.sumuka.ecommerce_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shipment {

    @Id
    @GeneratedValue
    private UUID id;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    private String status; // e.g., Pending, Shipped, Delivered

    private String logisticsPartner;

    private LocalDateTime shippedAt;

    private LocalDateTime estimatedDelivery;
}
