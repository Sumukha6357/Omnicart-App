package com.sumuka.ecommerce_backend.repository;

import com.sumuka.ecommerce_backend.entity.Product;
import com.sumuka.ecommerce_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findBySeller(User seller);
}
