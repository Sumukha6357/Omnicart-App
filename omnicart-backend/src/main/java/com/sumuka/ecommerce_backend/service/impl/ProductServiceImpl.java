package com.sumuka.ecommerce_backend.service.impl;

import com.sumuka.ecommerce_backend.dto.request.ProductRequest;
import com.sumuka.ecommerce_backend.dto.response.ProductResponse;
import com.sumuka.ecommerce_backend.entity.Category;
import com.sumuka.ecommerce_backend.entity.Product;
import com.sumuka.ecommerce_backend.entity.User;
import com.sumuka.ecommerce_backend.repository.CategoryRepository;
import com.sumuka.ecommerce_backend.repository.OrderItemRepository;
import com.sumuka.ecommerce_backend.repository.ProductRepository;
import com.sumuka.ecommerce_backend.repository.ProductReviewRepository;
import com.sumuka.ecommerce_backend.repository.UserRepository;
import com.sumuka.ecommerce_backend.service.contract.InventoryService;
import com.sumuka.ecommerce_backend.service.contract.ProductService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final CategoryRepository categoryRepo;
    private final ProductReviewRepository reviewRepo;
    private final OrderItemRepository orderItemRepo;
    private final InventoryService inventoryService;

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
    public List<ProductResponse> getAllProductsFiltered(String search,
                                                        String category,
                                                        BigDecimal minPrice,
                                                        BigDecimal maxPrice,
                                                        Double minRating,
                                                        String sort) {
        Specification<Product> spec = buildSpec(search, category, minPrice, maxPrice, null);
        List<Product> products = productRepo.findAll(spec);
        return applyRatingAndSort(products, minRating, sort);
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
    @Transactional
    public List<ProductResponse> getProductsBySellerFiltered(UUID sellerId,
                                                             String search,
                                                             String category,
                                                             BigDecimal minPrice,
                                                             BigDecimal maxPrice,
                                                             Double minRating,
                                                             String sort) {
        userRepo.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        Specification<Product> spec = buildSpec(search, category, minPrice, maxPrice, sellerId);
        List<Product> products = productRepo.findAll(spec);
        return applyRatingAndSort(products, minRating, sort);
    }

    @Override
    @CacheEvict(value = "allProductsCache", allEntries = true)
    public ProductResponse updateProduct(UUID productId, ProductRequest request) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Integer previousQty = product.getQuantity();
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

        Product saved = productRepo.save(product);
        if (previousQty != null && request.getQuantity() != null) {
            int delta = request.getQuantity() - previousQty;
            if (delta != 0) {
                try {
                    var adjust = new com.sumuka.ecommerce_backend.dto.request.InventoryAdjustRequest();
                    adjust.setProductId(saved.getId());
                    adjust.setQuantityDelta(delta);
                    adjust.setReason("Product stock update");
                    inventoryService.adjustInventory(adjust);
                } catch (Exception ignored) {
                }
            }
        }
        return mapToDto(saved);
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

    private Specification<Product> buildSpec(String search,
                                             String category,
                                             BigDecimal minPrice,
                                             BigDecimal maxPrice,
                                             UUID sellerId) {
        return (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String like = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), like),
                        cb.like(cb.lower(root.get("description")), like)
                ));
            }

            if (category != null && !category.isBlank()) {
                var categoryJoin = root.join("category");
                predicates.add(cb.like(cb.lower(categoryJoin.get("name")), "%" + category.toLowerCase() + "%"));
            }

            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            if (sellerId != null) {
                predicates.add(cb.equal(root.get("seller").get("id"), sellerId));
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }

    private List<ProductResponse> applyRatingAndSort(List<Product> products,
                                                     Double minRating,
                                                     String sort) {
        if (products.isEmpty()) {
            return List.of();
        }

        List<UUID> productIds = products.stream().map(Product::getId).collect(Collectors.toList());

        Map<UUID, Double> avgRatingMap = new HashMap<>();
        for (Object[] row : reviewRepo.findAverageRatingsByProductIds(productIds)) {
            avgRatingMap.put((UUID) row[0], row[1] != null ? ((Number) row[1]).doubleValue() : 0.0);
        }

        Map<UUID, Long> popularityMap = new HashMap<>();
        for (Object[] row : orderItemRepo.findPopularityByProductIds(productIds)) {
            popularityMap.put((UUID) row[0], row[1] != null ? ((Number) row[1]).longValue() : 0L);
        }

        List<Product> filtered = products;
        if (minRating != null) {
            filtered = products.stream()
                    .filter(p -> avgRatingMap.getOrDefault(p.getId(), 0.0) >= minRating)
                    .collect(Collectors.toList());
        }

        String sortKey = sort == null ? "" : sort.trim().toLowerCase();
        Comparator<Product> comparator = null;

        switch (sortKey) {
            case "price_asc":
                comparator = Comparator.comparing(Product::getPrice, Comparator.nullsLast(BigDecimal::compareTo));
                break;
            case "price_desc":
                comparator = Comparator.comparing(Product::getPrice, Comparator.nullsLast(BigDecimal::compareTo)).reversed();
                break;
            case "newest":
                comparator = Comparator.comparing(
                        (Product p) -> p.getCreatedAt() != null ? p.getCreatedAt() : LocalDateTime.MIN
                ).reversed();
                break;
            case "popular":
                comparator = Comparator.comparingLong((Product p) -> popularityMap.getOrDefault(p.getId(), 0L)).reversed();
                break;
            case "rating":
                comparator = Comparator.comparingDouble((Product p) -> avgRatingMap.getOrDefault(p.getId(), 0.0)).reversed();
                break;
            default:
                break;
        }

        if (comparator != null) {
            filtered = filtered.stream().sorted(comparator).collect(Collectors.toList());
        }

        return filtered.stream().map(this::mapToDto).collect(Collectors.toList());
    }

}
