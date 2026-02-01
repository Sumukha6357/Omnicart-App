package com.sumuka.ecommerce_backend.service.contract;

import com.sumuka.ecommerce_backend.dto.request.AddressRequest;
import com.sumuka.ecommerce_backend.dto.response.AddressResponse;

import java.util.List;
import java.util.UUID;

public interface AddressService {
    List<AddressResponse> getByUserId(UUID userId);
    AddressResponse create(UUID userId, AddressRequest request);
    AddressResponse update(UUID addressId, AddressRequest request);
    void delete(UUID addressId);
}
