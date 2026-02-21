package com.sumuka.ecommerce_backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class WarehouseInventoryResponse {
    private UUID warehouseId;
    private String warehouseName;
    private UUID productId;
    private String productName;
    private String categoryName;
    private Integer quantity;
    private LocalDateTime lastUpdated;
}
