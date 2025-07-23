package com.sumuka.ecommerce_backend.service.impl;

import com.sumuka.ecommerce_backend.dto.request.ProductRequest;
import com.sumuka.ecommerce_backend.dto.response.ProductResponse;
import com.sumuka.ecommerce_backend.entity.Category;
import com.sumuka.ecommerce_backend.entity.Product;
import com.sumuka.ecommerce_backend.entity.User;
import com.sumuka.ecommerce_backend.repository.CategoryRepository;
import com.sumuka.ecommerce_backend.repository.ProductRepository;
import com.sumuka.ecommerce_backend.repository.UserRepository;
import com.sumuka.ecommerce_backend.service.contract.ProductService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final CategoryRepository categoryRepo;

    @Override
    @CacheEvict(value = "allProductsCache", allEntries = true)
    public ProductResponse createProduct(ProductRequest dto) {

        User seller = userRepo.findById(dto.getSellerId())
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Category category = categoryRepo.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .quantity(dto.getQuantity())
                .imageUrl(dto.getImageUrl())
                .seller(seller)
                .category(category)
                .build();

        Product saved = productRepo.save(product);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    @Cacheable(value = "allProductsCache", key = "'all'")
    public List<ProductResponse> getAllProducts() {
        return productRepo.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<ProductResponse> getProductsBySeller(UUID sellerId) {
        User seller = userRepo.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        return productRepo.findBySeller(seller)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @CacheEvict(value = "allProductsCache", allEntries = true)
    public ProductResponse updateProduct(UUID productId, ProductRequest request) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setImageUrl(request.getImageUrl());

        if (request.getCategoryId() != null) {
            Category category = categoryRepo.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        return mapToDto(productRepo.save(product));
    }

    @Override
    @CacheEvict(value = "allProductsCache", allEntries = true)
    public void deleteProduct(UUID productId) {
        productRepo.deleteById(productId);
    }

    private ProductResponse mapToDto(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .imageUrl(product.getImageUrl())
                .sellerName(product.getSeller().getName())
                .categoryName(product.getCategory().getName())
                .build();
    }

    private ProductResponse mapToResponse(Product product) {
        return mapToDto(product);
    }

    @Override
    @Transactional
    public ProductResponse getProductById(UUID productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToDto(product);
    }


}
