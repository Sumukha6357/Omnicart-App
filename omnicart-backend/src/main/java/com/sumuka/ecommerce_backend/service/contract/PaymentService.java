package com.sumuka.ecommerce_backend.service.contract;


import com.sumuka.ecommerce_backend.dto.request.PaymentRequest;
import com.sumuka.ecommerce_backend.dto.response.PaymentResponse;

public interface PaymentService {
    PaymentResponse processPayment(PaymentRequest request);
}
