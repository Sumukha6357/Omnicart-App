package com.sumuka.ecommerce_backend.modules.user.service.impl;

import com.sumuka.ecommerce_backend.dto.request.CartItemRequest;
import com.sumuka.ecommerce_backend.dto.response.CartItemResponse;
import com.sumuka.ecommerce_backend.dto.response.CartResponse;
import com.sumuka.ecommerce_backend.modules.user.entity.Cart;
import com.sumuka.ecommerce_backend.modules.user.entity.CartItem;
import com.sumuka.ecommerce_backend.modules.user.repository.CartItemRepository;
import com.sumuka.ecommerce_backend.modules.user.repository.CartRepository;
import com.sumuka.ecommerce_backend.modules.user.service.contract.CartService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

        private final CartRepository cartRepository;
        private final CartItemRepository cartItemRepository;

        @Override
        public CartResponse addItemToCart(UUID userId, CartItemRequest request) {
                Cart cart = cartRepository.findById(userId).orElseGet(() -> cartRepository
                                .save(Cart.builder().userId(userId).items(new ArrayList<>()).build()));

                CartItem item = cart.getItems().stream()
                                .filter(i -> i.getProductId().equals(request.getProductId()))
                                .findFirst()
                                .orElse(null);

                if (item == null) {
                        item = CartItem.builder()
                                        .cart(cart)
                                        .productId(request.getProductId())
                                        .quantity(request.getQuantity())
                                        .price(BigDecimal.valueOf(100)) // Replace with actual product price
                                        .build();
                        cart.getItems().add(item);
                } else {
                        item.setQuantity(item.getQuantity() + request.getQuantity());
                }

                cartRepository.save(cart);
                return buildCartResponse(cart);
        }

        @Override
        public CartResponse getCartByUserId(UUID userId) {
                Cart cart = cartRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("Cart not found"));
                return buildCartResponse(cart);
        }

        @Override
        public void removeItemFromCart(UUID userId, UUID productId) {
                Cart cart = cartRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("Cart not found"));

                cart.getItems().removeIf(item -> item.getProductId().equals(productId));
                cartRepository.save(cart);
        }

        private CartResponse buildCartResponse(Cart cart) {
                List<CartItemResponse> itemResponses = cart.getItems().stream().map(item -> CartItemResponse.builder()
                                .productId(item.getProductId())
                                .quantity(item.getQuantity())
                                .price(item.getPrice())
                                .build()).toList();

                BigDecimal total = itemResponses.stream()
                                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                return CartResponse.builder()
                                .userId(cart.getUserId())
                                .items(itemResponses)
                                .totalAmount(total)
                                .build();
        }
}
