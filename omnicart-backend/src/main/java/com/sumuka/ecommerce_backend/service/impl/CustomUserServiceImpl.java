package com.sumuka.ecommerce_backend.service.impl;

import com.sumuka.ecommerce_backend.entity.User;
import com.sumuka.ecommerce_backend.repository.CustomUserRepository;
import com.sumuka.ecommerce_backend.service.contract.CustomUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomUserServiceImpl implements CustomUserService {

    private final CustomUserRepository userRepository;

    @Override
    public List<User> getUsersBySellerId(UUID sellerId) {
        return userRepository.findUsersBySellerId(sellerId);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


}
