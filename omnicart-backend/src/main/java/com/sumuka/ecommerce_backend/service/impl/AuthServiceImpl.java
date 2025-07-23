package com.sumuka.ecommerce_backend.service.impl;

import com.sumuka.ecommerce_backend.dto.request.LoginRequest;
import com.sumuka.ecommerce_backend.dto.request.RegisterRequest;
import com.sumuka.ecommerce_backend.entity.User;
import com.sumuka.ecommerce_backend.enums.UserRole;
import com.sumuka.ecommerce_backend.repository.UserRepository;
import com.sumuka.ecommerce_backend.security.CustomUserDetails;
import com.sumuka.ecommerce_backend.security.JwtTokenProvider;
import com.sumuka.ecommerce_backend.service.contract.AuthService;
import com.sumuka.ecommerce_backend.service.contract.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepo;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final MailService mailService;

    @Override
    public ResponseEntity<?> register(RegisterRequest req) {
        // ✅ Fallback to CUSTOMER if role not provided
        UserRole assignedRole = req.getRole() != null ? req.getRole() : UserRole.CUSTOMER;

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(assignedRole)
                .build();

        userRepo.save(user);

        // 💌 Send welcome email
        mailService.sendWelcomeMail(user.getEmail(), user.getName());

        return ResponseEntity.ok("User registered successfully.");
    }

    @Override
    public ResponseEntity<?> login(LoginRequest req) {
        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // ✅ Assign fallback role if missing (backend-safe patch)
        if (user.getRole() == null) {
            user.setRole(UserRole.CUSTOMER);
            userRepo.save(user);
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getRole().name());

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", Map.of(
                        "id", user.getId(),
                        "email", user.getEmail(),
                        "role", user.getRole().name(),
                        "name", user.getName()
                )
        ));
    }

    @Override
    public UserDetails loadUserById(UUID userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return new CustomUserDetails(user);
    }
}
