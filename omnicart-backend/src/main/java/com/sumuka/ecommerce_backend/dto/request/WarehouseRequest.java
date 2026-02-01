package com.sumuka.ecommerce_backend.dto.request;

import lombok.Data;

@Data
public class WarehouseRequest {
    private String name;
    private String location;
    private Integer capacity;
    private Boolean active;
}
