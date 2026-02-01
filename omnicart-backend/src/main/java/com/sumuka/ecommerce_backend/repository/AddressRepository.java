package com.sumuka.ecommerce_backend.repository;

import com.sumuka.ecommerce_backend.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AddressRepository extends JpaRepository<Address, UUID> {
    List<Address> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
