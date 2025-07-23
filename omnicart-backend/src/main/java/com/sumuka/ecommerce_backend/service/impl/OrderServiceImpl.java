package com.sumuka.ecommerce_backend.service.impl;

import com.sumuka.ecommerce_backend.dto.request.MailRequestDTO;
import com.sumuka.ecommerce_backend.dto.response.AdminOrderItemResponse;
import com.sumuka.ecommerce_backend.dto.response.AdminOrderResponse;
import com.sumuka.ecommerce_backend.dto.response.OrderItemResponse;
import com.sumuka.ecommerce_backend.dto.request.OrderRequest;
import com.sumuka.ecommerce_backend.dto.response.OrderResponse;
import com.sumuka.ecommerce_backend.entity.*;
import com.sumuka.ecommerce_backend.enums.OrderStatus;
import com.sumuka.ecommerce_backend.repository.*;
import com.sumuka.ecommerce_backend.service.contract.MailService;
import com.sumuka.ecommerce_backend.service.contract.OrderService;
import com.sumuka.ecommerce_backend.utility.TemplateLoader;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ShipmentRepository shipmentRepository;

    private final MailService mailService;

    private final UserRepository userRepository;

    private final TemplateLoader templateLoader;

    public void sendOrderPlacedMail(Order order, User user) {
        String html = templateLoader.loadTemplate("order_placed.html")
                .replace("${userName}", user.getName())
                .replace("${orderId}", order.getId().toString())
                .replace("${totalAmount}", order.getTotalAmount().toString())
                .replace("${orderDate}", order.getOrderDate().toString());

        MailRequestDTO mailRequest = MailRequestDTO.builder()
                .to(user.getEmail())
                .subject("Order Confirmation - OmniCart")
                .message(html)
                .isHtml(true)
                .build();

        mailService.sendMail(mailRequest);
    }

    @Override
    @Transactional
    public OrderResponse placeOrder(UUID userId, OrderRequest request) {

        Cart cart = cartRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty. Cannot place order.");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }

            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice())
                    .build();

            orderItems.add(orderItem);
            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.CONFIRMED)
                .orderDate(LocalDateTime.now())
                .totalAmount(totalAmount)
                .build();

        order = orderRepository.save(order);

        for (OrderItem item : orderItems) {
            item.setOrder(order);
        }
        orderItemRepository.saveAll(orderItems);

        // 🔥 Shipment creation logic
        Shipment shipment = Shipment.builder()
                .order(order)
                .status("PLACED")
                .logisticsPartner(getRandomPartner())
                .estimatedDelivery(LocalDateTime.now().plusDays(4))
                .shippedAt(null)
                .build();

        shipmentRepository.save(shipment);

        cartItemRepository.deleteAll(cart.getItems());

        mailService.sendMail(MailRequestDTO.builder()
                .to(order.getUser().getEmail())
                .subject("🛒 Order Confirmation - Omnicart")
                .message("Hi " + order.getUser() + ",<br><br>" +
                        "Your order #" + order.getId() + " has been successfully placed!<br>" +
                        "We’ll notify you once it’s shipped.<br><br>" +
                        "Thank you for shopping with us!<br><br>" +
                        "- Team Omnicart")
                .isHtml(true)
                .build());


        return OrderResponse.builder()
                .orderId(order.getId())
                .userId(userId)
                .orderDate(order.getOrderDate())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .items(orderItems.stream()
                        .map(oi -> OrderItemResponse.builder()
                                .productId(oi.getProduct().getId())
                                .price(oi.getPrice())
                                .quantity(oi.getQuantity())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    @Override
    @Transactional
    public List<OrderResponse> getOrdersByUser(UUID userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream()
                .map(order -> OrderResponse.builder()
                        .orderId(order.getId())
                        .userId(userId)
                        .orderDate(order.getOrderDate())
                        .status(order.getStatus())
                        .totalAmount(order.getTotalAmount())
                        .items(order.getItems().stream()
                                .map(item -> OrderItemResponse.builder()
                                        .productId(item.getProduct().getId())
                                        .quantity(item.getQuantity())
                                        .price(item.getPrice())
                                        .build())
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponse getOrderById(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        return OrderResponse.builder()
                .orderId(order.getId())
                .userId(order.getUser().getId())
                .orderDate(order.getOrderDate())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .items(order.getItems().stream()
                        .map(item -> OrderItemResponse.builder()
                                .productId(item.getProduct().getId())
                                .quantity(item.getQuantity())
                                .price(item.getPrice())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    @Override
    @Transactional
    public List<AdminOrderResponse> getAllOrdersForAdmin() {
        List<Order> orders = orderRepository.findAllWithDetails(); // ensure you join fetch if lazy loading causes issues

        return orders.stream().map(order -> {
            List<AdminOrderItemResponse> itemResponses = order.getItems().stream().map(item ->
                    new AdminOrderItemResponse(
                            item.getProduct().getId(),
                            item.getProduct().getName(),
                            item.getQuantity(),
                            item.getPrice()
                    )
            ).toList();

            return new AdminOrderResponse(
                    order.getId(),
                    order.getUser().getName(),
                    order.getUser().getEmail(),
                    order.getOrderDate(),
                    order.getTotalAmount(),
                    order.getStatus(),
                    itemResponses
            );
        }).toList();
    }


    // 🚚 Helper method to get a random logistics partner
    private String getRandomPartner() {
        List<String> partners = Arrays.asList("Ekart", "Delhivery", "BlueDart", "Shadowfax");
        return partners.get(new Random().nextInt(partners.size()));
    }
}
