package com.sumuka.ecommerce_backend.service.contract;

import com.sumuka.ecommerce_backend.entity.User;

import java.util.List;
import java.util.UUID;

public interface CustomUserService {
    public List<User> getUsersBySellerId(UUID sellerId);

    public List<User> getAllUsers();
}
