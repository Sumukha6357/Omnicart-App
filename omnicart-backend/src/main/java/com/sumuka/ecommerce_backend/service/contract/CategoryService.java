package com.sumuka.ecommerce_backend.service.contract;


import com.sumuka.ecommerce_backend.dto.request.CategoryRequest;
import com.sumuka.ecommerce_backend.dto.response.CategoryResponse;

import java.util.List;
import java.util.UUID;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest request);
    List<CategoryResponse> getAllCategories();
    CategoryResponse updateCategory(UUID categoryId, CategoryRequest request);
    void deleteCategory(UUID categoryId);
}
