package com.sumuka.ecommerce_backend.service.contract;

import com.sumuka.ecommerce_backend.dto.request.InventoryRequest;

import java.util.UUID;

public interface InventoryService {
    void addOrUpdateInventory(UUID productId, InventoryRequest request);
    int getInventoryByProductId(UUID productId);
}
