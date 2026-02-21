package com.sumuka.ecommerce_backend.modules.user.controller;

import com.sumuka.ecommerce_backend.dto.request.WishlistRequestDTO;
import com.sumuka.ecommerce_backend.dto.response.WishlistItemDTO;
import com.sumuka.ecommerce_backend.modules.user.service.contract.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/{userId}")
    public ResponseEntity<String> addToWishlist(@PathVariable UUID userId,
            @RequestBody WishlistRequestDTO request) {
        wishlistService.addToWishlist(userId, request);
        return ResponseEntity.ok("Product added to wishlist");
    }

    @DeleteMapping("/{userId}/{productId}")
    public ResponseEntity<String> removeFromWishlist(@PathVariable UUID userId,
            @PathVariable UUID productId) {
        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.ok("Product removed from wishlist");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<WishlistItemDTO>> getWishlist(@PathVariable UUID userId) {
        return ResponseEntity.ok(wishlistService.getUserWishlist(userId));
    }
}
