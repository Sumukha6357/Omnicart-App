package com.sumuka.ecommerce_backend.service.impl;


import com.sumuka.ecommerce_backend.dto.request.InventoryAdjustRequest;
import com.sumuka.ecommerce_backend.dto.request.InventoryRequest;
import com.sumuka.ecommerce_backend.dto.response.InventoryResponse;
import com.sumuka.ecommerce_backend.dto.response.StockMovementResponse;
import com.sumuka.ecommerce_backend.dto.response.WarehouseInventoryResponse;
import com.sumuka.ecommerce_backend.entity.Inventory;
import com.sumuka.ecommerce_backend.entity.Product;
import com.sumuka.ecommerce_backend.entity.StockMovement;
import com.sumuka.ecommerce_backend.entity.Warehouse;
import com.sumuka.ecommerce_backend.entity.WarehouseInventory;
import com.sumuka.ecommerce_backend.enums.StockMovementType;
import com.sumuka.ecommerce_backend.repository.InventoryRepository;
import com.sumuka.ecommerce_backend.repository.ProductRepository;
import com.sumuka.ecommerce_backend.repository.StockMovementRepository;
import com.sumuka.ecommerce_backend.repository.UserRepository;
import com.sumuka.ecommerce_backend.repository.WarehouseInventoryRepository;
import com.sumuka.ecommerce_backend.repository.WarehouseRepository;
import com.sumuka.ecommerce_backend.service.contract.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepo;
    private final ProductRepository productRepo;
    private final UserRepository userRepo;
    private final WarehouseRepository warehouseRepo;
    private final WarehouseInventoryRepository warehouseInventoryRepo;
    private final StockMovementRepository stockMovementRepo;

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

        Warehouse warehouse = getOrCreateDefaultWarehouse();
        adjustInventoryInternal(warehouse, product, request.getQuantity(), StockMovementType.ADJUSTMENT, "Legacy update", "LEGACY", null);
    }

    @Override
    public int getInventoryByProductId(UUID productId) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        int total = warehouseInventoryRepo.sumQuantityByProductId(productId);
        if (total == 0 && product.getQuantity() != null) {
            return product.getQuantity();
        }
        return total;
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponse> getAllInventory() {
        return productRepo.findAll().stream()
                .map(product -> {
                    int quantity = warehouseInventoryRepo.sumQuantityByProductId(product.getId());
                    if (quantity == 0 && product.getQuantity() != null) {
                        quantity = product.getQuantity();
                    }

                    return InventoryResponse.builder()
                            .productId(product.getId())
                            .productName(product.getName())
                            .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                            .quantity(quantity)
                            .lastUpdated(null)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryResponse> getInventoryBySeller(UUID sellerId) {
        return userRepo.findById(sellerId)
                .map(productRepo::findBySeller)
                .orElse(List.of())
                .stream()
                .map(product -> {
                    int quantity = warehouseInventoryRepo.sumQuantityByProductId(product.getId());
                    if (quantity == 0 && product.getQuantity() != null) {
                        quantity = product.getQuantity();
                    }

                    return InventoryResponse.builder()
                            .productId(product.getId())
                            .productName(product.getName())
                            .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                            .quantity(quantity)
                            .lastUpdated(null)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<WarehouseInventoryResponse> getAllWarehouseInventory() {
        Warehouse defaultWarehouse = getOrCreateDefaultWarehouse();
        List<WarehouseInventory> records = warehouseInventoryRepo.findAll();
        Map<UUID, WarehouseInventory> byProductId = new HashMap<>();
        for (WarehouseInventory inv : records) {
            if (defaultWarehouse.getId().equals(inv.getWarehouse().getId())) {
                byProductId.put(inv.getProduct().getId(), inv);
            }
        }

        return productRepo.findAll().stream()
                .map(product -> {
                    WarehouseInventory inv = byProductId.get(product.getId());
                    int qty = inv != null ? inv.getQuantity() : (product.getQuantity() != null ? product.getQuantity() : 0);
                    LocalDateTime lastUpdated = inv != null ? inv.getLastUpdated() : null;
                    return WarehouseInventoryResponse.builder()
                            .warehouseId(defaultWarehouse.getId())
                            .warehouseName(defaultWarehouse.getName())
                            .productId(product.getId())
                            .productName(product.getName())
                            .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                            .quantity(qty)
                            .lastUpdated(lastUpdated)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<WarehouseInventoryResponse> getWarehouseInventory(UUID warehouseId) {
        Warehouse warehouse = warehouseRepo.findById(warehouseId)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        Map<UUID, WarehouseInventory> inventoryMap = warehouseInventoryRepo.findByWarehouseId(warehouseId).stream()
                .collect(Collectors.toMap(inv -> inv.getProduct().getId(), inv -> inv));

        return productRepo.findAll().stream()
                .map(product -> {
                    WarehouseInventory inv = inventoryMap.get(product.getId());
                    int qty = inv != null ? inv.getQuantity() : 0;
                    LocalDateTime lastUpdated = inv != null ? inv.getLastUpdated() : null;
                    return WarehouseInventoryResponse.builder()
                            .warehouseId(warehouse.getId())
                            .warehouseName(warehouse.getName())
                            .productId(product.getId())
                            .productName(product.getName())
                            .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                            .quantity(qty)
                            .lastUpdated(lastUpdated)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<WarehouseInventoryResponse> getWarehouseInventoryBySeller(UUID sellerId) {
        Warehouse defaultWarehouse = getOrCreateDefaultWarehouse();
        Map<UUID, WarehouseInventory> inventoryMap = warehouseInventoryRepo.findByWarehouseId(defaultWarehouse.getId()).stream()
                .collect(Collectors.toMap(inv -> inv.getProduct().getId(), inv -> inv));

        return userRepo.findById(sellerId)
                .map(productRepo::findBySeller)
                .orElse(List.of())
                .stream()
                .map(product -> {
                    WarehouseInventory inv = inventoryMap.get(product.getId());
                    int qty = inv != null ? inv.getQuantity() : (product.getQuantity() != null ? product.getQuantity() : 0);
                    LocalDateTime lastUpdated = inv != null ? inv.getLastUpdated() : null;
                    return WarehouseInventoryResponse.builder()
                            .warehouseId(defaultWarehouse.getId())
                            .warehouseName(defaultWarehouse.getName())
                            .productId(product.getId())
                            .productName(product.getName())
                            .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                            .quantity(qty)
                            .lastUpdated(lastUpdated)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<WarehouseInventoryResponse> getWarehouseInventoryBySeller(UUID sellerId, UUID warehouseId) {
        Warehouse warehouse = warehouseRepo.findById(warehouseId)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        Map<UUID, WarehouseInventory> inventoryMap = warehouseInventoryRepo.findByWarehouseId(warehouseId).stream()
                .collect(Collectors.toMap(inv -> inv.getProduct().getId(), inv -> inv));

        return userRepo.findById(sellerId)
                .map(productRepo::findBySeller)
                .orElse(List.of())
                .stream()
                .map(product -> {
                    WarehouseInventory inv = inventoryMap.get(product.getId());
                    int qty = inv != null ? inv.getQuantity() : 0;
                    LocalDateTime lastUpdated = inv != null ? inv.getLastUpdated() : null;
                    return WarehouseInventoryResponse.builder()
                            .warehouseId(warehouse.getId())
                            .warehouseName(warehouse.getName())
                            .productId(product.getId())
                            .productName(product.getName())
                            .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                            .quantity(qty)
                            .lastUpdated(lastUpdated)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void adjustInventory(InventoryAdjustRequest request) {
        if (request.getProductId() == null) {
            throw new RuntimeException("productId is required");
        }
        if (request.getQuantityDelta() == null || request.getQuantityDelta() == 0) {
            throw new RuntimeException("quantityDelta must be non-zero");
        }

        Warehouse warehouse = request.getWarehouseId() != null
                ? warehouseRepo.findById(request.getWarehouseId())
                    .orElseThrow(() -> new RuntimeException("Warehouse not found"))
                : getOrCreateDefaultWarehouse();
        Product product = productRepo.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        StockMovementType type = request.getType() != null ? request.getType() : StockMovementType.ADJUSTMENT;
        adjustInventoryInternal(warehouse, product, request.getQuantityDelta(), type, request.getReason(), request.getReferenceType(), request.getReferenceId());
    }

    @Override
    @Transactional
    public void deleteWarehouseInventory(UUID warehouseId, UUID productId) {
        if (productId == null) {
            throw new RuntimeException("productId is required");
        }

        Warehouse warehouse = warehouseId != null
                ? warehouseRepo.findById(warehouseId)
                    .orElseThrow(() -> new RuntimeException("Warehouse not found"))
                : getOrCreateDefaultWarehouse();
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        WarehouseInventory existing = warehouseInventoryRepo.findByWarehouseAndProduct(warehouse, product)
                .orElse(null);
        if (existing == null) {
            return;
        }

        int currentQty = existing.getQuantity() != null ? existing.getQuantity() : 0;
        if (currentQty > 0) {
            adjustInventoryInternal(warehouse, product, -currentQty, StockMovementType.ADJUSTMENT,
                    "Delete inventory", "DELETE", null);
        }

        WarehouseInventory updated = warehouseInventoryRepo.findByWarehouseAndProduct(warehouse, product)
                .orElse(null);
        if (updated != null && (updated.getQuantity() == null || updated.getQuantity() == 0)) {
            warehouseInventoryRepo.delete(updated);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockMovementResponse> getStockMovements(UUID warehouseId, UUID productId) {
        List<StockMovement> movements;
        if (warehouseId != null && productId != null) {
            movements = stockMovementRepo.findByWarehouseIdAndProductIdOrderByCreatedAtDesc(warehouseId, productId);
        } else if (warehouseId != null) {
            movements = stockMovementRepo.findByWarehouseIdOrderByCreatedAtDesc(warehouseId);
        } else {
            movements = stockMovementRepo.findAll();
        }

        return movements.stream()
                .map(movement -> StockMovementResponse.builder()
                        .id(movement.getId())
                        .warehouseId(movement.getWarehouse().getId())
                        .warehouseName(movement.getWarehouse().getName())
                        .productId(movement.getProduct().getId())
                        .productName(movement.getProduct().getName())
                        .type(movement.getType())
                        .quantity(movement.getQuantity())
                        .reason(movement.getReason())
                        .referenceType(movement.getReferenceType())
                        .referenceId(movement.getReferenceId())
                        .createdAt(movement.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private Warehouse getOrCreateDefaultWarehouse() {
        List<Warehouse> active = warehouseRepo.findByActiveTrueOrderByCreatedAtAsc();
        if (!active.isEmpty()) {
            return active.get(0);
        }
        Warehouse warehouse = Warehouse.builder()
                .name("Main Warehouse")
                .location("Default")
                .capacity(null)
                .active(true)
                .build();
        return warehouseRepo.save(warehouse);
    }

    private void adjustInventoryInternal(Warehouse warehouse,
                                         Product product,
                                         Integer quantityDelta,
                                         StockMovementType type,
                                         String reason,
                                         String referenceType,
                                         UUID referenceId) {
        WarehouseInventory inv = warehouseInventoryRepo.findByWarehouseAndProduct(warehouse, product)
                .orElseGet(() -> {
                    int existingTotal = warehouseInventoryRepo.sumQuantityByProductId(product.getId());
                    int seedQty = (existingTotal == 0 && product.getQuantity() != null) ? product.getQuantity() : 0;
                    return WarehouseInventory.builder()
                            .warehouse(warehouse)
                            .product(product)
                            .quantity(seedQty)
                            .build();
                });

        int nextQty = inv.getQuantity() + quantityDelta;
        if (nextQty < 0) {
            throw new RuntimeException("Insufficient stock in warehouse");
        }
        inv.setQuantity(nextQty);
        inv.setLastUpdated(LocalDateTime.now());
        warehouseInventoryRepo.save(inv);

        int totalQty = warehouseInventoryRepo.sumQuantityByProductId(product.getId());
        product.setQuantity(totalQty);
        productRepo.save(product);

        StockMovement movement = StockMovement.builder()
                .warehouse(warehouse)
                .product(product)
                .type(type)
                .quantity(quantityDelta)
                .reason(reason)
                .referenceType(referenceType)
                .referenceId(referenceId)
                .build();
        stockMovementRepo.save(movement);
    }
}
