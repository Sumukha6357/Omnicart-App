package com.sumuka.ecommerce_backend.controller;


import com.sumuka.ecommerce_backend.dto.request.LoginRequest;
import com.sumuka.ecommerce_backend.dto.request.RegisterRequest;
import com.sumuka.ecommerce_backend.service.contract.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        return authService.register(req);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        return authService.login(req);
    }
}
