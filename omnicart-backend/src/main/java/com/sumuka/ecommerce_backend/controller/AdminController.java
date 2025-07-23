package com.sumuka.ecommerce_backend.controller;

import com.sumuka.ecommerce_backend.dto.response.AdminOrderResponse;
import com.sumuka.ecommerce_backend.dto.response.UserResponse;
import com.sumuka.ecommerce_backend.entity.User;
import com.sumuka.ecommerce_backend.service.contract.CustomUserService;
import com.sumuka.ecommerce_backend.service.contract.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final CustomUserService userService;

    private final OrderService orderService;

    @GetMapping("/orders")
    public ResponseEntity<List<AdminOrderResponse>> getAllOrdersForAdmin() {
        return ResponseEntity.ok(orderService.getAllOrdersForAdmin());
    }

    @GetMapping("/users/seller/{sellerId}")
    public List<UserResponse> getUsersBySeller(@PathVariable UUID sellerId) {
        List<User> users = userService.getUsersBySellerId(sellerId);
        return users.stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole() // ✅ Include role
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return users.stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole() // ✅ Include role
                ))
                .collect(Collectors.toList());
    }

}
