package com.sumuka.ecommerce_backend.service.contract;

import com.sumuka.ecommerce_backend.dto.request.WarehouseRequest;
import com.sumuka.ecommerce_backend.dto.response.WarehouseResponse;

import java.util.List;
import java.util.UUID;

public interface WarehouseService {
    WarehouseResponse createWarehouse(WarehouseRequest request);
    WarehouseResponse updateWarehouse(UUID warehouseId, WarehouseRequest request);
    void deleteWarehouse(UUID warehouseId);
    List<WarehouseResponse> getAllWarehouses();
}
