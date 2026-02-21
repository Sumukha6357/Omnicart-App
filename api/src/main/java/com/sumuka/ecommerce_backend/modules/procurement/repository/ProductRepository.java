package com.sumuka.ecommerce_backend.modules.procurement.repository;

import com.sumuka.ecommerce_backend.modules.procurement.entity.Product;
import com.sumuka.ecommerce_backend.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {
    List<Product> findBySeller(User seller);
}
