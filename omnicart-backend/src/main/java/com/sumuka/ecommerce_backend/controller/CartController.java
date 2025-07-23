package com.sumuka.ecommerce_backend.controller;

import com.sumuka.ecommerce_backend.dto.request.CartItemRequest;
import com.sumuka.ecommerce_backend.dto.response.CartResponse;
import com.sumuka.ecommerce_backend.service.contract.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/{userId}")
    public ResponseEntity<CartResponse> addToCart(
            @PathVariable UUID userId,
            @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addItemToCart(userId, request));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable UUID userId) {
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    @DeleteMapping("/{userId}/item/{productId}")
    public ResponseEntity<Void> removeItem(
            @PathVariable UUID userId,
            @PathVariable UUID productId) {
        cartService.removeItemFromCart(userId, productId);
        return ResponseEntity.noContent().build();
    }
}
