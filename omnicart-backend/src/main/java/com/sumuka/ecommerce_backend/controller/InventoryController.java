package com.sumuka.ecommerce_backend.controller;


import com.sumuka.ecommerce_backend.dto.request.InventoryRequest;
import com.sumuka.ecommerce_backend.service.contract.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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
}
