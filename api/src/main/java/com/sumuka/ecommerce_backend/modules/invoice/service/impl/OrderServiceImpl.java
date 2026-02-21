package com.sumuka.ecommerce_backend.modules.invoice.service.impl;

import com.sumuka.ecommerce_backend.dto.request.MailRequestDTO;
import com.sumuka.ecommerce_backend.dto.response.AdminOrderItemResponse;
import com.sumuka.ecommerce_backend.dto.response.AdminOrderResponse;
import com.sumuka.ecommerce_backend.dto.response.OrderItemResponse;
import com.sumuka.ecommerce_backend.dto.request.InventoryAdjustRequest;
import com.sumuka.ecommerce_backend.dto.request.OrderProductRequest;
import com.sumuka.ecommerce_backend.dto.request.OrderRequest;
import com.sumuka.ecommerce_backend.dto.response.OrderResponse;
import com.sumuka.ecommerce_backend.modules.user.entity.User;
import com.sumuka.ecommerce_backend.modules.user.entity.Cart;
import com.sumuka.ecommerce_backend.modules.user.entity.CartItem;
import com.sumuka.ecommerce_backend.modules.invoice.entity.Order;
import com.sumuka.ecommerce_backend.modules.invoice.entity.OrderItem;
import com.sumuka.ecommerce_backend.modules.invoice.entity.Shipment;
import com.sumuka.ecommerce_backend.modules.procurement.entity.Product;
import com.sumuka.ecommerce_backend.modules.common.enums.OrderStatus;
import com.sumuka.ecommerce_backend.modules.common.enums.StockMovementType;
import com.sumuka.ecommerce_backend.modules.user.repository.UserRepository;
import com.sumuka.ecommerce_backend.modules.user.repository.CartRepository;
import com.sumuka.ecommerce_backend.modules.user.repository.CartItemRepository;
import com.sumuka.ecommerce_backend.modules.invoice.repository.OrderRepository;
import com.sumuka.ecommerce_backend.modules.invoice.repository.OrderItemRepository;
import com.sumuka.ecommerce_backend.modules.invoice.repository.ShipmentRepository;
import com.sumuka.ecommerce_backend.modules.procurement.repository.ProductRepository;
import com.sumuka.ecommerce_backend.modules.procurement.service.contract.InventoryService;
import com.sumuka.ecommerce_backend.modules.notification.service.contract.MailService;
import com.sumuka.ecommerce_backend.modules.invoice.service.contract.OrderService;
import com.sumuka.ecommerce_backend.modules.common.utility.TemplateLoader;
import com.sumuka.ecommerce_backend.modules.invoice.service.impl.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import com.sumuka.ecommerce_backend.modules.invoice.event.InvoiceCreatedEvent;
import org.springframework.context.ApplicationEventPublisher;
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

        private final InventoryService inventoryService;
        private final AuditLogService auditLogService;
        private final ApplicationEventPublisher eventPublisher;
        private final com.sumuka.ecommerce_backend.modules.invoice.mapper.InvoiceMapper invoiceMapper;

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
        @com.sumuka.ecommerce_backend.modules.common.annotation.Auditable(action = "ORDER_PLACEMENT", entityType = "ORDER")
        @org.springframework.cache.annotation.CacheEvict(value = { "adminOrders", "userOrders",
                        "dashboardAnalytics" }, allEntries = true)
        public OrderResponse placeOrder(UUID userId, OrderRequest request) {

                Optional<Cart> cartOpt = cartRepository.findById(userId);
                List<OrderProductRequest> requestedProducts = request != null ? request.getProducts() : null;
                boolean useCartItems = cartOpt.isPresent() && !cartOpt.get().getItems().isEmpty();

                if (!useCartItems && (requestedProducts == null || requestedProducts.isEmpty())) {
                        throw new RuntimeException("Cart is empty. Cannot place order.");
                }

                List<OrderItem> orderItems = new ArrayList<>();
                BigDecimal totalAmount = BigDecimal.ZERO;

                if (useCartItems) {
                        Cart cart = cartOpt.get();
                        for (CartItem cartItem : cart.getItems()) {
                                Product product = productRepository.findById(cartItem.getProductId())
                                                .orElseThrow(() -> new RuntimeException("Product not found"));

                                if (product.getQuantity() < cartItem.getQuantity()) {
                                        throw new RuntimeException(
                                                        "Insufficient stock for product: " + product.getName());
                                }

                                adjustWarehouseStock(product.getId(), -cartItem.getQuantity(), "Order placed");

                                OrderItem orderItem = OrderItem.builder()
                                                .product(product)
                                                .quantity(cartItem.getQuantity())
                                                .price(product.getPrice())
                                                .build();

                                orderItems.add(orderItem);
                                totalAmount = totalAmount.add(product.getPrice()
                                                .multiply(BigDecimal.valueOf(cartItem.getQuantity())));
                        }
                } else {
                        for (OrderProductRequest reqItem : requestedProducts) {
                                Product product = productRepository.findById(reqItem.getProductId())
                                                .orElseThrow(() -> new RuntimeException("Product not found"));

                                if (product.getQuantity() < reqItem.getQuantity()) {
                                        throw new RuntimeException(
                                                        "Insufficient stock for product: " + product.getName());
                                }

                                adjustWarehouseStock(product.getId(), -reqItem.getQuantity(), "Order placed");

                                OrderItem orderItem = OrderItem.builder()
                                                .product(product)
                                                .quantity(reqItem.getQuantity())
                                                .price(product.getPrice())
                                                .build();

                                orderItems.add(orderItem);
                                totalAmount = totalAmount.add(
                                                product.getPrice().multiply(BigDecimal.valueOf(reqItem.getQuantity())));
                        }
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

                if (useCartItems) {
                        cartItemRepository.deleteAll(cartOpt.get().getItems());
                }

                // Publish Invoice Created Event
                eventPublisher.publishEvent(new InvoiceCreatedEvent(this, order));

                return invoiceMapper.toDto(order);
        }

        private void adjustWarehouseStock(UUID productId, int delta, String reason) {
                InventoryAdjustRequest adjustRequest = new InventoryAdjustRequest();
                adjustRequest.setProductId(productId);
                adjustRequest.setQuantityDelta(delta);
                adjustRequest.setReason(reason);
                adjustRequest.setReferenceType("ORDER_LINE");
                adjustRequest.setType(StockMovementType.OUTBOUND);
                adjustRequest.setReferenceId(null);

                try {
                        inventoryService.adjustInventory(adjustRequest);
                } catch (Exception ignored) {
                        // Avoid blocking order placement if warehouse not configured yet
                }
        }

        @Override
        @Transactional
        @org.springframework.cache.annotation.Cacheable(value = "userOrders", key = "#userId")
        public List<OrderResponse> getOrdersByUser(UUID userId) {
                List<Order> orders = orderRepository.findByUserId(userId);
                return orders.stream()
                                .map(invoiceMapper::toDto)
                                .collect(Collectors.toList());
        }

        @Override
        @Transactional
        public OrderResponse getOrderById(UUID orderId) {
                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                return invoiceMapper.toDto(order);
        }

        @Override
        @Transactional
        @com.sumuka.ecommerce_backend.modules.common.annotation.Auditable(action = "ORDER_STATUS_UPDATE", entityType = "ORDER")
        @org.springframework.cache.annotation.CacheEvict(value = { "adminOrders", "userOrders",
                        "dashboardAnalytics" }, allEntries = true)
        public OrderResponse updateOrderStatus(UUID orderId,
                        OrderStatus status) {
                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));

                String oldStatus = order.getStatus().toString();
                order.setStatus(status);
                order = orderRepository.save(order);

                // Audit logging
                String action = (status == OrderStatus.CANCELLED)
                                ? "ORDER_CANCEL"
                                : (status == OrderStatus.CONFIRMED)
                                                ? "PO_AMENDMENT"
                                                : "INVOICE_UPDATE";

                UUID currentUserId = null;
                try {
                        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext()
                                        .getAuthentication();
                        if (auth != null && auth
                                        .getPrincipal() instanceof com.sumuka.ecommerce_backend.modules.auth.security.CustomUserDetails userDetails) {
                                currentUserId = userDetails.getId();
                        }
                } catch (Exception ignored) {
                }

                auditLogService.log(currentUserId, action, "ORDER", orderId.toString(), oldStatus, status.toString());

                return invoiceMapper.toDto(order);
        }

        @Override
        @Transactional
        public List<AdminOrderResponse> getAllOrdersForAdmin() {
                List<Order> orders = orderRepository.findAllWithDetails(); // ensure you join fetch if lazy loading
                                                                           // causes issues

                return orders.stream().map(invoiceMapper::toAdminDto).toList();
        }

        // 🚚 Helper method to get a random logistics partner
        private String getRandomPartner() {
                List<String> partners = Arrays.asList("Ekart", "Delhivery", "BlueDart", "Shadowfax");
                return partners.get(new Random().nextInt(partners.size()));
        }
}
