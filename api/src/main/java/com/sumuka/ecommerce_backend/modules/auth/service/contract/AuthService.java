package com.sumuka.ecommerce_backend.modules.auth.service.contract;

import com.sumuka.ecommerce_backend.dto.request.LoginRequest;
import com.sumuka.ecommerce_backend.dto.request.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.UUID;

public interface AuthService {
    ResponseEntity<?> register(RegisterRequest request);

    ResponseEntity<?> login(LoginRequest request);

    UserDetails loadUserById(UUID userId);

}
