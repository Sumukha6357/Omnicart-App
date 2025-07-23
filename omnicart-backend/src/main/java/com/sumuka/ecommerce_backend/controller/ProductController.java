package com.sumuka.ecommerce_backend.controller;

import com.sumuka.ecommerce_backend.dto.request.ProductRequest;
import com.sumuka.ecommerce_backend.dto.response.ProductResponse;
import com.sumuka.ecommerce_backend.service.contract.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductRequest request) {
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<ProductResponse>> getProductsBySeller(@PathVariable UUID sellerId) {
        List<ProductResponse> products = productService.getProductsBySeller(sellerId);
        return ResponseEntity.ok(products);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable UUID productId,
            @RequestBody ProductRequest request) {
        ProductResponse updated = productService.updateProduct(productId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable UUID productId) {
        ProductResponse product = productService.getProductById(productId);
        return ResponseEntity.ok(product);
    }

}
