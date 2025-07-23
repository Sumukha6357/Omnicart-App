package com.sumuka.ecommerce_backend.repository;

import com.sumuka.ecommerce_backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
}
