package com.sumuka.ecommerce_backend.service.contract;

import com.sumuka.ecommerce_backend.dto.request.ProductRequest;
import com.sumuka.ecommerce_backend.dto.response.ProductResponse;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface ProductService {
    ProductResponse createProduct(ProductRequest request);
    List<ProductResponse> getAllProducts();
    List<ProductResponse> getAllProductsFiltered(String search,
                                                 String category,
                                                 BigDecimal minPrice,
                                                 BigDecimal maxPrice,
                                                 Double minRating,
                                                 String sort);
    List<ProductResponse> getProductsBySeller(UUID sellerId);
    List<ProductResponse> getProductsBySellerFiltered(UUID sellerId,
                                                      String search,
                                                      String category,
                                                      BigDecimal minPrice,
                                                      BigDecimal maxPrice,
                                                      Double minRating,
                                                      String sort);
    ProductResponse updateProduct(UUID productId, ProductRequest request);
    void deleteProduct(UUID productId);
    ProductResponse getProductById(UUID productId);

}
