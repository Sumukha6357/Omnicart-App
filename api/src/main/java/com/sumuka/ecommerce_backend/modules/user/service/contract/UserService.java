package com.sumuka.ecommerce_backend.modules.user.service.contract;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.UUID;

public interface UserService {
    UserDetails loadUserById(UUID userId);
    void updateUsername(UUID userId, String newUsername);
    void initiatePasswordReset(String email);

    void resetPassword(String token, String newPassword);
}
