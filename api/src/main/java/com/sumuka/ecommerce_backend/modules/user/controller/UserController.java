package com.sumuka.ecommerce_backend.modules.user.controller;

import com.sumuka.ecommerce_backend.modules.user.service.contract.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/{userId}/username")
    public ResponseEntity<?> updateUsername(@PathVariable UUID userId,
            @RequestBody com.sumuka.ecommerce_backend.dto.request.UpdateUsernameRequest request) {
        userService.updateUsername(userId, request.getName());
        return ResponseEntity.ok("Username updated successfully.");
    }

    @PutMapping("/{userId}/password")
    public ResponseEntity<?> initiateReset(@RequestParam String email) {
        userService.initiatePasswordReset(email);
        return ResponseEntity.ok("Reset link sent if user exists.");
    }

    @PostMapping("/reset-password/complete")
    public ResponseEntity<?> completeReset(@RequestParam String token, @RequestParam String newPassword) {
        userService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Password has been reset.");
    }

}
