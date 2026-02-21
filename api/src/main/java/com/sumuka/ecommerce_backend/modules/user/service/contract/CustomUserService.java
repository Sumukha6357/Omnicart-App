package com.sumuka.ecommerce_backend.modules.user.service.contract;

import com.sumuka.ecommerce_backend.modules.user.entity.User;

import java.util.List;
import java.util.UUID;

public interface CustomUserService {
    public List<User> getUsersBySellerId(UUID sellerId);

    public List<User> getAllUsers();
}
