package com.sumuka.ecommerce_backend.modules.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sumuka.ecommerce_backend.modules.user.service.contract.UserService;
import com.sumuka.ecommerce_backend.dto.request.UpdateUsernameRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@ActiveProfiles("test")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void updateUsername_ValidRequest_ReturnsSuccessMessage() throws Exception {
        // Given
        UUID userId = UUID.randomUUID();
        UpdateUsernameRequest request = new UpdateUsernameRequest();
        request.setName("newUsername");

        doNothing().when(userService).updateUsername(any(UUID.class), any(String.class));

        // When & Then
        mockMvc.perform(put("/api/users/{userId}/username", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Username updated successfully."));
    }

    @Test
    void updateUsername_UserNotFound_ReturnsBadRequest() throws Exception {
        // Given
        UUID userId = UUID.randomUUID();
        UpdateUsernameRequest request = new UpdateUsernameRequest();
        request.setName("newUsername");

        doThrow(new RuntimeException("User not found")).when(userService).updateUsername(any(UUID.class), any(String.class));

        // When & Then
        mockMvc.perform(put("/api/users/{userId}/username", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void initiatePasswordReset_ValidEmail_ReturnsSuccessMessage() throws Exception {
        // Given
        String email = "test@example.com";

        doNothing().when(userService).initiatePasswordReset(email);

        // When & Then
        mockMvc.perform(put("/api/users/{userId}/password", UUID.randomUUID())
                .param("email", email))
                .andExpect(status().isOk())
                .andExpect(content().string("Reset link sent if user exists."));
    }

    @Test
    void completeReset_ValidToken_ReturnsSuccessMessage() throws Exception {
        // Given
        String token = "validToken";
        String newPassword = "newPassword123";

        doNothing().when(userService).resetPassword(token, newPassword);

        // When & Then
        mockMvc.perform(post("/api/users/reset-password/complete")
                .param("token", token)
                .param("newPassword", newPassword))
                .andExpect(status().isOk())
                .andExpect(content().string("Password has been reset."));
    }

    @Test
    void completeReset_InvalidToken_ReturnsBadRequest() throws Exception {
        // Given
        String token = "invalidToken";
        String newPassword = "newPassword123";

        doThrow(new RuntimeException("Invalid token")).when(userService).resetPassword(token, newPassword);

        // When & Then
        mockMvc.perform(post("/api/users/reset-password/complete")
                .param("token", token)
                .param("newPassword", newPassword))
                .andExpect(status().isBadRequest());
    }
}
