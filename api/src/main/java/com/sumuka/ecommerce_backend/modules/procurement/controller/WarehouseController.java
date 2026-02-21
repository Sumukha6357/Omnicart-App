package com.sumuka.ecommerce_backend.modules.procurement.controller;

import com.sumuka.ecommerce_backend.dto.request.WarehouseRequest;
import com.sumuka.ecommerce_backend.dto.response.WarehouseResponse;
import com.sumuka.ecommerce_backend.modules.procurement.service.contract.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/warehouses")
@RequiredArgsConstructor
public class WarehouseController {

    private final WarehouseService warehouseService;

    @PostMapping
    public ResponseEntity<WarehouseResponse> createWarehouse(@RequestBody WarehouseRequest request) {
        return ResponseEntity.ok(warehouseService.createWarehouse(request));
    }

    @PutMapping("/{warehouseId}")
    public ResponseEntity<WarehouseResponse> updateWarehouse(@PathVariable UUID warehouseId,
            @RequestBody WarehouseRequest request) {
        return ResponseEntity.ok(warehouseService.updateWarehouse(warehouseId, request));
    }

    @DeleteMapping("/{warehouseId}")
    public ResponseEntity<?> deleteWarehouse(@PathVariable UUID warehouseId) {
        warehouseService.deleteWarehouse(warehouseId);
        return ResponseEntity.ok("Warehouse deleted.");
    }

    @GetMapping
    public ResponseEntity<List<WarehouseResponse>> getAllWarehouses() {
        return ResponseEntity.ok(warehouseService.getAllWarehouses());
    }
}
