package com.sumuka.ecommerce_backend.modules.user.repository;

import com.sumuka.ecommerce_backend.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    long countByRole(String role);

    long countByCreatedDateBetween(LocalDate start, LocalDate end);

    Optional<User> findByResetToken(String resetToken);

}
