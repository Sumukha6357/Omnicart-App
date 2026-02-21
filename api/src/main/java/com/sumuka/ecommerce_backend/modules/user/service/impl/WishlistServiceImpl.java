package com.sumuka.ecommerce_backend.modules.user.service.impl;

import com.sumuka.ecommerce_backend.dto.request.WishlistRequestDTO;
import com.sumuka.ecommerce_backend.dto.response.WishlistItemDTO;
import com.sumuka.ecommerce_backend.modules.procurement.entity.Product;
import com.sumuka.ecommerce_backend.modules.user.entity.User;
import com.sumuka.ecommerce_backend.modules.user.entity.WishlistItem;
import com.sumuka.ecommerce_backend.modules.user.repository.WishlistRepository;
import com.sumuka.ecommerce_backend.modules.procurement.repository.ProductRepository;
import com.sumuka.ecommerce_backend.modules.user.repository.UserRepository;
import com.sumuka.ecommerce_backend.modules.user.service.contract.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public void addToWishlist(UUID userId, WishlistRequestDTO request) {
        if (wishlistRepository.existsByUserIdAndProductId(userId, request.getProductId()))
            return;

        User user = userRepository.findById(userId).orElseThrow();
        Product product = productRepository.findById(request.getProductId()).orElseThrow();

        WishlistItem item = WishlistItem.builder()
                .user(user)
                .product(product)
                .build();

        wishlistRepository.save(item);
    }

    @Override
    @Transactional
    public void removeFromWishlist(UUID userId, UUID productId) {
        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Override
    @Transactional
    public List<WishlistItemDTO> getUserWishlist(UUID userId) {
        return wishlistRepository.findByUserId(userId).stream()
                .map(item -> WishlistItemDTO.builder()
                        .productId(item.getProduct().getId())
                        .name(item.getProduct().getName())
                        .price(item.getProduct().getPrice())
                        .imageUrl(item.getProduct().getImageUrl())
                        .build())
                .collect(Collectors.toList());
    }
}
