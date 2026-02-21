package com.sumuka.ecommerce_backend.modules.invoice.repository;

import com.sumuka.ecommerce_backend.modules.invoice.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
}
