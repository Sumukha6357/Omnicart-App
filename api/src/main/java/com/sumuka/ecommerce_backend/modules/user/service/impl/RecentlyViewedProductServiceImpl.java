package com.sumuka.ecommerce_backend.modules.user.service.impl;

import com.sumuka.ecommerce_backend.dto.request.RecentlyViewedProductRequestDTO;
import com.sumuka.ecommerce_backend.dto.response.RecentlyViewedProductResponseDTO;
import com.sumuka.ecommerce_backend.modules.user.entity.RecentlyViewedProduct;
import com.sumuka.ecommerce_backend.modules.user.repository.RecentlyViewedProductRepository;
import com.sumuka.ecommerce_backend.modules.user.service.contract.RecentlyViewedProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecentlyViewedProductServiceImpl implements RecentlyViewedProductService {
    private final RecentlyViewedProductRepository repository;

    @Override
    public void addRecentlyViewedProduct(UUID userId, RecentlyViewedProductRequestDTO request) {
        RecentlyViewedProduct existing = repository.findByUserIdAndProductId(userId, request.getProductId());
        if (existing != null) {
            existing.setViewedAt(LocalDateTime.now());
            repository.save(existing);
        } else {
            RecentlyViewedProduct newView = RecentlyViewedProduct.builder()
                    .userId(userId)
                    .productId(request.getProductId())
                    .viewedAt(LocalDateTime.now())
                    .build();
            repository.save(newView);
        }
    }

    @Override
    public List<RecentlyViewedProductResponseDTO> getRecentlyViewedProducts(UUID userId, int limit) {
        return repository.findByUserIdOrderByViewedAtDesc(userId).stream()
                .limit(limit)
                .map(r -> RecentlyViewedProductResponseDTO.builder()
                        .productId(r.getProductId())
                        .viewedAt(r.getViewedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
