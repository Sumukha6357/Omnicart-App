package com.sumuka.ecommerce_backend.modules.auth.security;

import com.sumuka.ecommerce_backend.modules.common.utility.WarehouseContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Filter to extract warehouse_id from request headers and set it in
 * WarehouseContext.
 */
@Component
@Slf4j
public class WarehouseFilter extends OncePerRequestFilter {

    private static final String WAREHOUSE_HEADER = "X-Warehouse-Id";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String warehouseIdHeader = request.getHeader(WAREHOUSE_HEADER);

        if (warehouseIdHeader != null && !warehouseIdHeader.isBlank()) {
            try {
                UUID warehouseId = UUID.fromString(warehouseIdHeader);
                WarehouseContext.setWarehouseId(warehouseId);
                log.debug("Warehouse context set to: {}", warehouseId);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid Warehouse ID header received: {}", warehouseIdHeader);
            }
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            // Always clear context at the end of the request
            WarehouseContext.clear();
        }
    }
}
