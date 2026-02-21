package com.sumuka.ecommerce_backend.modules.user.service.contract;

import com.sumuka.ecommerce_backend.dto.request.RecentlyViewedProductRequestDTO;
import com.sumuka.ecommerce_backend.dto.response.RecentlyViewedProductResponseDTO;

import java.util.List;
import java.util.UUID;

public interface RecentlyViewedProductService {
    void addRecentlyViewedProduct(UUID userId, RecentlyViewedProductRequestDTO request);
    List<RecentlyViewedProductResponseDTO> getRecentlyViewedProducts(UUID userId, int limit);
}
