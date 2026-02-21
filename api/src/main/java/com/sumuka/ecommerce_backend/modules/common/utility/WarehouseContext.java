package com.sumuka.ecommerce_backend.modules.common.utility;

import java.util.UUID;

/**
 * Context to hold the warehouse ID for the current thread.
 */
public class WarehouseContext {
    private static final ThreadLocal<UUID> warehouseIdThreadLocal = new ThreadLocal<>();

    public static void setWarehouseId(UUID warehouseId) {
        warehouseIdThreadLocal.set(warehouseId);
    }

    public static UUID getWarehouseId() {
        return warehouseIdThreadLocal.get();
    }

    public static void clear() {
        warehouseIdThreadLocal.remove();
    }
}
