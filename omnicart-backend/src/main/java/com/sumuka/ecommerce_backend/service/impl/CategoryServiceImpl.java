package com.sumuka.ecommerce_backend.service.impl;


import com.sumuka.ecommerce_backend.dto.request.CategoryRequest;
import com.sumuka.ecommerce_backend.dto.response.CategoryResponse;
import com.sumuka.ecommerce_backend.entity.Category;
import com.sumuka.ecommerce_backend.repository.CategoryRepository;
import com.sumuka.ecommerce_backend.service.contract.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepo;

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepo.findByNameIgnoreCase(request.getName()).isPresent()) {
            throw new RuntimeException("Category already exists");
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        return mapToDto(categoryRepo.save(category));
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepo.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse updateCategory(UUID categoryId, CategoryRequest request) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        return mapToDto(categoryRepo.save(category));
    }

    @Override
    public void deleteCategory(UUID categoryId) {
        categoryRepo.deleteById(categoryId);
    }

    private CategoryResponse mapToDto(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }
}
