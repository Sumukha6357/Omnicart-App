package com.sumuka.ecommerce_backend.modules.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sumuka.ecommerce_backend.modules.common.enums.UserRole;
import com.sumuka.ecommerce_backend.modules.user.entity.User;
import com.sumuka.ecommerce_backend.modules.user.repository.UserRepository;
import com.sumuka.ecommerce_backend.modules.procurement.entity.Category;
import com.sumuka.ecommerce_backend.modules.procurement.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
class UserControllerIntegrationTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();
    }

    @Test
    void updateUsername_ValidRequest_UpdatesUsername() throws Exception {
        // Given
        User user = createTestUser();
        userRepository.save(user);

        String newName = "Updated Username";
        String requestBody = "{\"name\":\"" + newName + "\"}";

        // When & Then
        mockMvc.perform(put("/api/users/{userId}/username", user.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(content().string("Username updated successfully."));

        // Verify the update
        User updatedUser = userRepository.findById(user.getId()).orElseThrow();
        assertEquals(newName, updatedUser.getName());
    }

    @Test
    void updateUsername_InvalidUser_ReturnsNotFound() throws Exception {
        // Given
        UUID nonExistentUserId = UUID.randomUUID();
        String requestBody = "{\"name\":\"Updated Username\"}";

        // When & Then
        mockMvc.perform(put("/api/users/{userId}/username", nonExistentUserId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isNotFound());
    }

    @Test
    void initiatePasswordReset_ValidEmail_SendsResetLink() throws Exception {
        // Given
        User user = createTestUser();
        userRepository.save(user);

        // When & Then
        mockMvc.perform(put("/api/users/{userId}/password", UUID.randomUUID())
                .param("email", user.getEmail()))
                .andExpect(status().isOk())
                .andExpect(content().string("Reset link sent if user exists."));
    }

    @Test
    void initiatePasswordReset_InvalidEmail_ReturnsSuccessMessage() throws Exception {
        // Given
        String nonExistentEmail = "nonexistent@example.com";

        // When & Then
        mockMvc.perform(put("/api/users/{userId}/password", UUID.randomUUID())
                .param("email", nonExistentEmail))
                .andExpect(status().isOk())
                .andExpect(content().string("Reset link sent if user exists."));
    }

    @Test
    void completeResetPassword_ValidToken_ResetsPassword() throws Exception {
        // Given
        User user = createTestUser();
        user.setResetToken("valid-reset-token");
        user.setResetTokenExpiry(java.time.LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        String newPassword = "NewPassword123!";
        String requestBody = "{\"token\":\"valid-reset-token\",\"newPassword\":\"" + newPassword + "\"}";

        // When & Then
        mockMvc.perform(post("/api/users/reset-password/complete")
                .param("token", "valid-reset-token")
                .param("newPassword", newPassword))
                .andExpect(status().isOk())
                .andExpect(content().string("Password has been reset."));

        // Verify password was reset
        User updatedUser = userRepository.findById(user.getId()).orElseThrow();
        assertTrue(passwordEncoder.matches(newPassword, updatedUser.getPassword()));
        assertNull(updatedUser.getResetToken());
    }

    @Test
    void completeResetPassword_InvalidToken_ReturnsBadRequest() throws Exception {
        // Given
        String invalidToken = "invalid-token";
        String newPassword = "NewPassword123!";

        // When & Then
        mockMvc.perform(post("/api/users/reset-password/complete")
                .param("token", invalidToken)
                .param("newPassword", newPassword))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateUsername_EmptyName_ReturnsBadRequest() throws Exception {
        // Given
        User user = createTestUser();
        userRepository.save(user);

        String requestBody = "{\"name\":\"\"}";

        // When & Then
        mockMvc.perform(put("/api/users/{userId}/username", user.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    private User createTestUser() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setRole(UserRole.CUSTOMER);
        return user;
    }
}
