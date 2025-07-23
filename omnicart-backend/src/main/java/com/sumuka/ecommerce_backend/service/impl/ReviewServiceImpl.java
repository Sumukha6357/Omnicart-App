package com.sumuka.ecommerce_backend.service.impl;

import com.sumuka.ecommerce_backend.dto.request.ReviewRequestDTO;
import com.sumuka.ecommerce_backend.dto.response.ReviewResponseDTO;
import com.sumuka.ecommerce_backend.entity.Product;
import com.sumuka.ecommerce_backend.entity.ProductReview;
import com.sumuka.ecommerce_backend.entity.User;
import com.sumuka.ecommerce_backend.repository.*;
import com.sumuka.ecommerce_backend.service.contract.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductReviewRepository reviewRepository;

    @Override
    public void addReview(UUID userId, ReviewRequestDTO request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProductReview review = ProductReview.builder()
                .product(product)
                .reviewer(user)
                .rating(request.getRating())
                .reviewContent(request.getReviewContent())
                .createdAt(LocalDateTime.now())
                .build();

        reviewRepository.save(review);
    }

    @Override
    public List<ReviewResponseDTO> getReviewsForProduct(UUID productId) {
        return reviewRepository.findByProductId(productId).stream()
                .map(r -> ReviewResponseDTO.builder()
                        .reviewId(r.getId())
                        .reviewerName(r.getReviewer().getName())
                        .rating(r.getRating())
                        .reviewContent(r.getReviewContent())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
