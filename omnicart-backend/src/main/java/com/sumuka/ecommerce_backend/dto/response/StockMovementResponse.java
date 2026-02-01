package com.sumuka.ecommerce_backend.dto.response;

import com.sumuka.ecommerce_backend.enums.StockMovementType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class StockMovementResponse {
    private UUID id;
    private UUID warehouseId;
    private String warehouseName;
    private UUID productId;
    private String productName;
    private StockMovementType type;
    private Integer quantity;
    private String reason;
    private String referenceType;
    private UUID referenceId;
    private LocalDateTime createdAt;
}
