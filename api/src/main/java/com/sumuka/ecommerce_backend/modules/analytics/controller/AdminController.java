package com.sumuka.ecommerce_backend.modules.analytics.controller;

import com.sumuka.ecommerce_backend.dto.response.AdminOrderResponse;
import com.sumuka.ecommerce_backend.dto.response.OrderResponse;
import com.sumuka.ecommerce_backend.dto.response.UserResponse;
import com.sumuka.ecommerce_backend.modules.user.entity.User;
import com.sumuka.ecommerce_backend.modules.common.enums.OrderStatus;
import com.sumuka.ecommerce_backend.modules.user.service.contract.CustomUserService;
import com.sumuka.ecommerce_backend.modules.invoice.service.contract.OrderService;
import com.sumuka.ecommerce_backend.modules.analytics.service.contract.AnalyticsService;
import com.sumuka.ecommerce_backend.modules.user.repository.UserRepository;
import com.sumuka.ecommerce_backend.modules.invoice.repository.OrderRepository;
import com.sumuka.ecommerce_backend.modules.procurement.repository.ProductRepository;
import com.sumuka.ecommerce_backend.modules.procurement.repository.CategoryRepository;
import com.sumuka.ecommerce_backend.modules.invoice.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final CustomUserService userService;

    private final OrderService orderService;
    private final AnalyticsService analyticsService;
    private final com.sumuka.ecommerce_backend.modules.user.mapper.UserMapper userMapper;

    @GetMapping("/orders")
    public ResponseEntity<List<AdminOrderResponse>> getAllOrdersForAdmin() {
        return ResponseEntity.ok(orderService.getAllOrdersForAdmin());
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable UUID orderId,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }

    @GetMapping("/users/seller/{sellerId}")
    public List<UserResponse> getUsersBySeller(@PathVariable UUID sellerId) {
        List<User> users = userService.getUsersBySellerId(sellerId);
        return users.stream()
                .map(userMapper::toDto)
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
                        user.getRole()))
                .collect(Collectors.toList());
    }

    @PostMapping("/analytics")
    public java.util.concurrent.CompletableFuture<com.sumuka.ecommerce_backend.dto.response.AdminAnalyticsResponseDTO> getAnalytics(
            @RequestBody com.sumuka.ecommerce_backend.dto.request.DateFilterRequestDTO filter) {
        return analyticsService.getDashboardAnalytics(filter);
    }
}
