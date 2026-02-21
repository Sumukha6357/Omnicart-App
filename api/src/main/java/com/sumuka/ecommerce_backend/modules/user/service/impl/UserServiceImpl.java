package com.sumuka.ecommerce_backend.modules.user.service.impl;

import com.sumuka.ecommerce_backend.modules.user.entity.User;
import com.sumuka.ecommerce_backend.modules.user.repository.UserRepository;
import com.sumuka.ecommerce_backend.modules.auth.security.CustomUserDetails;
import com.sumuka.ecommerce_backend.modules.notification.service.contract.MailService;
import com.sumuka.ecommerce_backend.modules.user.service.contract.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // ✅ Injected
    private final MailService mailService;

    @Override
    public UserDetails loadUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return new CustomUserDetails(user);
    }

    @Override
    public void updateUsername(UUID userId, String newName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        user.setName(newName);
        userRepository.save(user);
    }

    public void initiatePasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15)); // Token valid for 15 mins
        userRepository.save(user);

        String resetLink = "http://yourfrontend.com/reset-password?token=" + token;
        String emailBody = "Click the link to reset your password: " + resetLink;

        mailService.sendSimpleEmail(user.getEmail(), "Password Reset", emailBody);
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword)); // hash this!
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }

}
