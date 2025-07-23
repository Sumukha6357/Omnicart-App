package com.sumuka.ecommerce_backend.service.impl;


import com.sumuka.ecommerce_backend.dto.request.InventoryRequest;
import com.sumuka.ecommerce_backend.entity.Inventory;
import com.sumuka.ecommerce_backend.entity.Product;
import com.sumuka.ecommerce_backend.repository.InventoryRepository;
import com.sumuka.ecommerce_backend.repository.ProductRepository;
import com.sumuka.ecommerce_backend.service.contract.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepo;
    private final ProductRepository productRepo;

    @Override
    public void addOrUpdateInventory(UUID productId, InventoryRequest request) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Inventory inventory = inventoryRepo.findByProduct(product)
                .orElse(Inventory.builder()
                        .product(product)
                        .build());

        inventory.setQuantity(request.getQuantity());
        inventory.setLastUpdated(LocalDateTime.now());

        inventoryRepo.save(inventory);
    }

    @Override
    public int getInventoryByProductId(UUID productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return inventoryRepo.findByProduct(product)
                .map(Inventory::getQuantity)
                .orElse(0);
    }
}
