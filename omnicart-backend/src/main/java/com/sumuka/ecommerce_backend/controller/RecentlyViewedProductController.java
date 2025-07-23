package com.sumuka.ecommerce_backend.controller;

import com.sumuka.ecommerce_backend.dto.request.RecentlyViewedProductRequestDTO;
import com.sumuka.ecommerce_backend.dto.response.RecentlyViewedProductResponseDTO;
import com.sumuka.ecommerce_backend.service.contract.RecentlyViewedProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recently-viewed")
@RequiredArgsConstructor
public class RecentlyViewedProductController {
    private final RecentlyViewedProductService service;

    @PostMapping("/{userId}")
    public ResponseEntity<Void> addRecentlyViewedProduct(
            @PathVariable UUID userId,
            @RequestBody RecentlyViewedProductRequestDTO request
    ) {
        service.addRecentlyViewedProduct(userId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<RecentlyViewedProductResponseDTO>> getRecentlyViewedProducts(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return ResponseEntity.ok(service.getRecentlyViewedProducts(userId, limit));
    }
}
