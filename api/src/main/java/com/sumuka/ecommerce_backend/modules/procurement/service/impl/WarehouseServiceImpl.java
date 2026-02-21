package com.sumuka.ecommerce_backend.modules.procurement.service.impl;

import com.sumuka.ecommerce_backend.dto.request.WarehouseRequest;
import com.sumuka.ecommerce_backend.dto.response.WarehouseResponse;
import com.sumuka.ecommerce_backend.modules.procurement.entity.Warehouse;
import com.sumuka.ecommerce_backend.modules.procurement.repository.WarehouseRepository;
import com.sumuka.ecommerce_backend.modules.procurement.service.contract.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;

    @Override
    public WarehouseResponse createWarehouse(WarehouseRequest request) {
        Warehouse warehouse = Warehouse.builder()
                .name(request.getName())
                .location(request.getLocation())
                .capacity(request.getCapacity())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();
        return toResponse(warehouseRepository.save(warehouse));
    }

    @Override
    public WarehouseResponse updateWarehouse(UUID warehouseId, WarehouseRequest request) {
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));
        if (request.getName() != null) {
            warehouse.setName(request.getName());
        }
        if (request.getLocation() != null) {
            warehouse.setLocation(request.getLocation());
        }
        if (request.getCapacity() != null) {
            warehouse.setCapacity(request.getCapacity());
        }
        if (request.getActive() != null) {
            warehouse.setActive(request.getActive());
        }
        return toResponse(warehouseRepository.save(warehouse));
    }

    @Override
    public void deleteWarehouse(UUID warehouseId) {
        warehouseRepository.deleteById(warehouseId);
    }

    @Override
    public List<WarehouseResponse> getAllWarehouses() {
        return warehouseRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private WarehouseResponse toResponse(Warehouse warehouse) {
        return WarehouseResponse.builder()
                .id(warehouse.getId())
                .name(warehouse.getName())
                .location(warehouse.getLocation())
                .capacity(warehouse.getCapacity())
                .active(warehouse.getActive())
                .createdAt(warehouse.getCreatedAt())
                .updatedAt(warehouse.getUpdatedAt())
                .build();
    }
}
