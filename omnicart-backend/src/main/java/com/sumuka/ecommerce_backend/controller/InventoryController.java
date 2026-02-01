package com.sumuka.ecommerce_backend.controller;


import com.sumuka.ecommerce_backend.dto.request.InventoryAdjustRequest;
import com.sumuka.ecommerce_backend.dto.request.InventoryRequest;
import com.sumuka.ecommerce_backend.dto.response.InventoryResponse;
import com.sumuka.ecommerce_backend.dto.response.StockMovementResponse;
import com.sumuka.ecommerce_backend.dto.response.WarehouseInventoryResponse;
import com.sumuka.ecommerce_backend.service.contract.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping("/update/{productId}")
    public ResponseEntity<?> updateInventory(@PathVariable UUID productId,
                                             @RequestBody InventoryRequest request) {
        inventoryService.addOrUpdateInventory(productId, request);
        return ResponseEntity.ok("Inventory updated.");
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Integer> getInventory(@PathVariable UUID productId) {
        int quantity = inventoryService.getInventoryByProductId(productId);
        return ResponseEntity.ok(quantity);
    }

    @GetMapping("/all")
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<InventoryResponse>> getInventoryBySeller(@PathVariable UUID sellerId) {
        return ResponseEntity.ok(inventoryService.getInventoryBySeller(sellerId));
    }

    @GetMapping("/warehouses")
    public ResponseEntity<List<WarehouseInventoryResponse>> getAllWarehouseInventory() {
        return ResponseEntity.ok(inventoryService.getAllWarehouseInventory());
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<WarehouseInventoryResponse>> getWarehouseInventory(@PathVariable UUID warehouseId) {
        return ResponseEntity.ok(inventoryService.getWarehouseInventory(warehouseId));
    }

    @GetMapping("/warehouse/seller/{sellerId}")
    public ResponseEntity<List<WarehouseInventoryResponse>> getWarehouseInventoryBySeller(@PathVariable UUID sellerId) {
        return ResponseEntity.ok(inventoryService.getWarehouseInventoryBySeller(sellerId));
    }

    @GetMapping("/warehouse/{warehouseId}/seller/{sellerId}")
    public ResponseEntity<List<WarehouseInventoryResponse>> getWarehouseInventoryBySeller(@PathVariable UUID warehouseId,
                                                                                          @PathVariable UUID sellerId) {
        return ResponseEntity.ok(inventoryService.getWarehouseInventoryBySeller(sellerId, warehouseId));
    }

    @PostMapping("/adjust")
    public ResponseEntity<?> adjustInventory(@RequestBody InventoryAdjustRequest request) {
        inventoryService.adjustInventory(request);
        return ResponseEntity.ok("Inventory adjusted.");
    }

    @DeleteMapping("/warehouse/{warehouseId}/product/{productId}")
    public ResponseEntity<?> deleteWarehouseInventory(@PathVariable UUID warehouseId,
                                                      @PathVariable UUID productId) {
        inventoryService.deleteWarehouseInventory(warehouseId, productId);
        return ResponseEntity.ok("Inventory deleted.");
    }

    @GetMapping("/movements")
    public ResponseEntity<List<StockMovementResponse>> getStockMovements(@RequestParam(required = false) UUID warehouseId,
                                                                         @RequestParam(required = false) UUID productId) {
        return ResponseEntity.ok(inventoryService.getStockMovements(warehouseId, productId));
    }
}
