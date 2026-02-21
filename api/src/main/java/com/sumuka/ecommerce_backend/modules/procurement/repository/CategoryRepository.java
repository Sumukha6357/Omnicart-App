package com.sumuka.ecommerce_backend.modules.procurement.repository;

import com.sumuka.ecommerce_backend.modules.procurement.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    Optional<Category> findByNameIgnoreCase(String name);
}
