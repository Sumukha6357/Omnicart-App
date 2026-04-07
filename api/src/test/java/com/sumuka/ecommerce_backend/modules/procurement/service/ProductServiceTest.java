package com.sumuka.ecommerce_backend.modules.procurement.service;

import com.sumuka.ecommerce_backend.modules.procurement.repository.ProductRepository;
import com.sumuka.ecommerce_backend.modules.procurement.service.impl.ProductServiceImpl;
import com.sumuka.ecommerce_backend.modules.procurement.entity.Product;
import com.sumuka.ecommerce_backend.modules.procurement.entity.Category;
import com.sumuka.ecommerce_backend.dto.response.ProductResponse;
import com.sumuka.ecommerce_backend.modules.invoice.repository.OrderItemRepository;
import com.sumuka.ecommerce_backend.modules.procurement.mapper.ProductMapper;
import com.sumuka.ecommerce_backend.modules.procurement.repository.CategoryRepository;
import com.sumuka.ecommerce_backend.modules.procurement.repository.ProductReviewRepository;
import com.sumuka.ecommerce_backend.modules.procurement.service.contract.InventoryService;
import com.sumuka.ecommerce_backend.modules.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductReviewRepository productReviewRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private InventoryService inventoryService;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    void getAllProducts_ReturnsProducts() {
        // Given
        Product p1 = createTestProduct();
        Product p2 = createTestProduct();
        List<Product> products = List.of(p1, p2);

        when(productRepository.findAll()).thenReturn(products);
        when(productReviewRepository.findAverageRatingsByProductIds(any())).thenReturn(List.of());
        when(orderItemRepository.findPopularityByProductIds(any())).thenReturn(List.of());
        when(productMapper.toDto(any(Product.class))).thenAnswer(inv -> {
            Product p = inv.getArgument(0);
            ProductResponse response = new ProductResponse();
            response.setId(p.getId());
            response.setName(p.getName());
            return response;
        });

        // When
        List<ProductResponse> result = productService.getAllProducts();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(productRepository).findAll();
    }

    @Test
    void getProductById_ValidId_ReturnsProduct() {
        // Given
        UUID productId = UUID.randomUUID();
        Product expectedProduct = createTestProduct();
        expectedProduct.setId(productId);
        ProductResponse mapped = new ProductResponse();
        mapped.setId(productId);

        when(productRepository.findById(productId)).thenReturn(Optional.of(expectedProduct));
        when(productMapper.toDto(expectedProduct)).thenReturn(mapped);
        when(productReviewRepository.findAverageRatingsByProductIds(any())).thenReturn(List.of());
        when(orderItemRepository.findPopularityByProductIds(any())).thenReturn(List.of());

        // When
        ProductResponse result = productService.getProductById(productId);

        // Then
        assertNotNull(result);
        assertEquals(productId, result.getId());
        verify(productRepository).findById(productId);
    }

    @Test
    void deleteProduct_ValidId_DeletesProduct() {
        // Given
        UUID productId = UUID.randomUUID();

        // When
        productService.deleteProduct(productId);

        // Then
        verify(productRepository).deleteById(productId);
    }

    private Product createTestProduct() {
        Product product = new Product();
        product.setId(UUID.randomUUID());
        product.setName("Test Product");
        product.setDescription("Test Description");
        product.setPrice(new BigDecimal("99.99"));
        product.setQuantity(100);
        product.setCategory(new Category());
        return product;
    }

}
