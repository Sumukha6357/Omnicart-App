package com.sumuka.ecommerce_backend.controller;

import com.sumuka.ecommerce_backend.dto.request.PaymentRequest;
import com.sumuka.ecommerce_backend.dto.response.PaymentResponse;
import com.sumuka.ecommerce_backend.service.contract.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponse> pay(@RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.processPayment(request);
        return ResponseEntity.ok(response);
    }
}
