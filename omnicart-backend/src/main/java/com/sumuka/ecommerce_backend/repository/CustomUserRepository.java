package com.sumuka.ecommerce_backend.repository;

import com.sumuka.ecommerce_backend.entity.User;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CustomUserRepository extends JpaRepository<User, UUID> {

    @Query("SELECT DISTINCT o.user FROM Order o " +
            "JOIN o.items i " +
            "JOIN i.product p " +
            "WHERE p.seller.id = :sellerId")
    List<User> findUsersBySellerId(@Param("sellerId") UUID sellerId);



}
