package com.sumuka.ecommerce_backend.modules.user.controller;

import com.sumuka.ecommerce_backend.dto.request.AddressRequest;
import com.sumuka.ecommerce_backend.dto.response.AddressResponse;
import com.sumuka.ecommerce_backend.modules.user.service.contract.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddressResponse>> getAddresses(@PathVariable UUID userId) {
        return ResponseEntity.ok(addressService.getByUserId(userId));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<AddressResponse> addAddress(
            @PathVariable UUID userId,
            @RequestBody AddressRequest request) {
        return ResponseEntity.ok(addressService.create(userId, request));
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable UUID addressId,
            @RequestBody AddressRequest request) {
        return ResponseEntity.ok(addressService.update(addressId, request));
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(@PathVariable UUID addressId) {
        addressService.delete(addressId);
        return ResponseEntity.noContent().build();
    }
}
