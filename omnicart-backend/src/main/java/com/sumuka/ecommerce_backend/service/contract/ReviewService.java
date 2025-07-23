package com.sumuka.ecommerce_backend.service.contract;

import com.sumuka.ecommerce_backend.dto.request.ReviewRequestDTO;
import com.sumuka.ecommerce_backend.dto.response.ReviewResponseDTO;

import java.util.List;
import java.util.UUID;

public interface ReviewService {
    void addReview(UUID userId, ReviewRequestDTO request);

    List<ReviewResponseDTO> getReviewsForProduct(UUID productId);
}
