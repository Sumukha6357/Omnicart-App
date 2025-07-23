package com.sumuka.ecommerce_backend.controller;

import com.sumuka.ecommerce_backend.dto.request.OrderRequest;
import com.sumuka.ecommerce_backend.dto.response.OrderResponse;
import com.sumuka.ecommerce_backend.service.contract.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/{userId}")
    public ResponseEntity<OrderResponse> placeOrder(
            @PathVariable UUID userId,
            @RequestBody OrderRequest orderRequest) {
        return ResponseEntity.ok(orderService.placeOrder(userId, orderRequest));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getUserOrders(@PathVariable UUID userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable UUID orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }
}
