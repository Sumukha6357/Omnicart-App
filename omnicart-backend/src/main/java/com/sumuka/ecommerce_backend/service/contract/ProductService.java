package com.sumuka.ecommerce_backend.service.contract;

import com.sumuka.ecommerce_backend.dto.request.ProductRequest;
import com.sumuka.ecommerce_backend.dto.response.ProductResponse;

import java.util.List;
import java.util.UUID;

public interface ProductService {
    ProductResponse createProduct(ProductRequest request);
    List<ProductResponse> getAllProducts();
    List<ProductResponse> getProductsBySeller(UUID sellerId);
    ProductResponse updateProduct(UUID productId, ProductRequest request);
    void deleteProduct(UUID productId);
    ProductResponse getProductById(UUID productId);

}
