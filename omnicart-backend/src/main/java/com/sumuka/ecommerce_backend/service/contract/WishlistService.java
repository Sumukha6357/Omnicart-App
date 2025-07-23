package com.sumuka.ecommerce_backend.service.contract;

import com.sumuka.ecommerce_backend.dto.request.WishlistRequestDTO;
import com.sumuka.ecommerce_backend.dto.response.WishlistItemDTO;

import java.util.List;
import java.util.UUID;

public interface WishlistService {

    void addToWishlist(UUID userId, WishlistRequestDTO request);

    void removeFromWishlist(UUID userId, UUID productId);

    List<WishlistItemDTO> getUserWishlist(UUID userId);
}
