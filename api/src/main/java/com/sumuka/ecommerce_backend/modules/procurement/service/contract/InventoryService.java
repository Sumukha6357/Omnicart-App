package com.sumuka.ecommerce_backend.modules.procurement.service.contract;

import com.sumuka.ecommerce_backend.dto.request.InventoryAdjustRequest;
import com.sumuka.ecommerce_backend.dto.request.InventoryRequest;
import com.sumuka.ecommerce_backend.dto.response.InventoryResponse;
import com.sumuka.ecommerce_backend.dto.response.StockMovementResponse;
import com.sumuka.ecommerce_backend.dto.response.WarehouseInventoryResponse;

import java.util.UUID;
import java.util.List;

public interface InventoryService {
    void addOrUpdateInventory(UUID productId, InventoryRequest request);
    int getInventoryByProductId(UUID productId);
    List<InventoryResponse> getAllInventory();
    List<InventoryResponse> getInventoryBySeller(UUID sellerId);

    List<WarehouseInventoryResponse> getAllWarehouseInventory();
    List<WarehouseInventoryResponse> getWarehouseInventory(UUID warehouseId);
    List<WarehouseInventoryResponse> getWarehouseInventoryBySeller(UUID sellerId);
    List<WarehouseInventoryResponse> getWarehouseInventoryBySeller(UUID sellerId, UUID warehouseId);

    void adjustInventory(InventoryAdjustRequest request);
    void deleteWarehouseInventory(UUID warehouseId, UUID productId);
    List<StockMovementResponse> getStockMovements(UUID warehouseId, UUID productId);
}
