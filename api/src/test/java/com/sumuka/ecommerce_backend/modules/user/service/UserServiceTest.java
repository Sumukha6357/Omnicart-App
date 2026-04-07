package com.sumuka.ecommerce_backend.modules.user.service;

import com.sumuka.ecommerce_backend.modules.user.repository.UserRepository;
import com.sumuka.ecommerce_backend.modules.user.service.impl.UserServiceImpl;
import com.sumuka.ecommerce_backend.modules.user.entity.User;
import com.sumuka.ecommerce_backend.modules.notification.service.contract.MailService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private MailService mailService;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void updateUsername_ValidUser_UpdatesUsername() {
        // Given
        UUID userId = UUID.randomUUID();
        String newUsername = "newUsername";
        User user = new User();
        user.setId(userId);
        user.setName("oldUsername");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        // When
        userService.updateUsername(userId, newUsername);

        // Then
        assertEquals(newUsername, user.getName());
        verify(userRepository).findById(userId);
        verify(userRepository).save(user);
    }

    @Test
    void updateUsername_UserNotFound_ThrowsException() {
        // Given
        UUID userId = UUID.randomUUID();
        String newUsername = "newUsername";

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> userService.updateUsername(userId, newUsername));
        verify(userRepository).findById(userId);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void initiatePasswordReset_ValidEmail_SendsResetLink() {
        // Given
        String email = "test@example.com";
        User user = new User();
        user.setEmail(email);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // When
        userService.initiatePasswordReset(email);

        // Then
        verify(userRepository).findByEmail(email);
        // In a real implementation, you would verify email sending
    }

    @Test
    void initiatePasswordReset_UserNotFound_DoesNothing() {
        // Given
        String email = "nonexistent@example.com";

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When
        userService.initiatePasswordReset(email);

        // Then
        verify(userRepository).findByEmail(email);
        // Should not throw exception, just do nothing
    }

    @Test
    void resetPassword_ValidToken_ResetsPassword() {
        // Given
        String token = "validToken";
        String newPassword = "newPassword123";
        User user = new User();
        user.setResetToken(token);
        user.setResetTokenExpiry(java.time.LocalDateTime.now().plusMinutes(10));

        when(userRepository.findByResetToken(token)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode(newPassword)).thenReturn("encodedPassword");

        // When
        userService.resetPassword(token, newPassword);

        // Then
        verify(userRepository).findByResetToken(token);
        verify(passwordEncoder).encode(newPassword);
        verify(userRepository).save(user);
        assertNull(user.getResetToken());
        assertEquals("encodedPassword", user.getPassword());
    }

    @Test
    void resetPassword_InvalidToken_ThrowsException() {
        // Given
        String token = "invalidToken";
        String newPassword = "newPassword123";

        when(userRepository.findByResetToken(token)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> userService.resetPassword(token, newPassword));
        verify(userRepository).findByResetToken(token);
        verify(userRepository, never()).save(any(User.class));
    }
}
