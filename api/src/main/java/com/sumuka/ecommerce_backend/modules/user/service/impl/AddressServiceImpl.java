package com.sumuka.ecommerce_backend.modules.user.service.impl;

import com.sumuka.ecommerce_backend.dto.request.AddressRequest;
import com.sumuka.ecommerce_backend.dto.response.AddressResponse;
import com.sumuka.ecommerce_backend.modules.user.entity.Address;
import com.sumuka.ecommerce_backend.modules.user.entity.User;
import com.sumuka.ecommerce_backend.modules.user.repository.AddressRepository;
import com.sumuka.ecommerce_backend.modules.user.repository.UserRepository;
import com.sumuka.ecommerce_backend.modules.user.service.contract.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @Override
    public List<AddressResponse> getByUserId(UUID userId) {
        return addressRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public AddressResponse create(UUID userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Address address = Address.builder()
                .label(normalizeLabel(request.getLabel()))
                .text(request.getText())
                .user(user)
                .build();
        return toResponse(addressRepository.save(address));
    }

    @Override
    public AddressResponse update(UUID addressId, AddressRequest request) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        address.setLabel(normalizeLabel(request.getLabel()));
        address.setText(request.getText());
        return toResponse(addressRepository.save(address));
    }

    @Override
    public void delete(UUID addressId) {
        addressRepository.deleteById(addressId);
    }

    private AddressResponse toResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .label(address.getLabel())
                .text(address.getText())
                .createdAt(address.getCreatedAt())
                .build();
    }

    private String normalizeLabel(String label) {
        if (label == null || label.isBlank()) {
            return "Saved Address";
        }
        return label.trim();
    }
}
