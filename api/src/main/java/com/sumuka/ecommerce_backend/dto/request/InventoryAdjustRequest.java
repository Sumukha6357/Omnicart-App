package com.sumuka.ecommerce_backend.dto.request;

import com.sumuka.ecommerce_backend.modules.common.enums.StockMovementType;
import lombok.Data;

import java.util.UUID;

@Data
public class InventoryAdjustRequest {
    private UUID warehouseId;
    private UUID productId;
    private Integer quantityDelta;
    private StockMovementType type;
    private String reason;
    private String referenceType;
    private UUID referenceId;
}
