package com.sumuka.ecommerce_backend.service.contract;

import com.sumuka.ecommerce_backend.dto.request.CartItemRequest;
import com.sumuka.ecommerce_backend.dto.response.CartResponse;

import java.util.UUID;

public interface CartService {
    CartResponse addItemToCart(UUID userId, CartItemRequest request);
    CartResponse getCartByUserId(UUID userId);
    void removeItemFromCart(UUID userId, UUID productId);
}
