package com.sumuka.ecommerce_backend.modules.procurement.controller;

import com.sumuka.ecommerce_backend.dto.request.ReviewRequestDTO;
import com.sumuka.ecommerce_backend.dto.response.ReviewResponseDTO;
import com.sumuka.ecommerce_backend.modules.procurement.service.contract.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    // Add a review for a product
    @PostMapping("/product/{productId}")
    public ResponseEntity<Void> addReview(
            @PathVariable UUID productId,
            @RequestParam UUID userId,
            @RequestBody ReviewRequestDTO request) {
        reviewService.addReview(userId, request);
        return ResponseEntity.ok().build();
    }

    // Get all reviews for a product
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsForProduct(@PathVariable UUID productId) {
        List<ReviewResponseDTO> reviews = reviewService.getReviewsForProduct(productId);
        return ResponseEntity.ok(reviews);
    }
}
