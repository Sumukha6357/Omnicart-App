package com.sumuka.ecommerce_backend.modules.invoice.service.impl;

import com.sumuka.ecommerce_backend.dto.request.MailRequestDTO;
import com.sumuka.ecommerce_backend.dto.request.PaymentRequest;
import com.sumuka.ecommerce_backend.dto.response.PaymentResponse;
import com.sumuka.ecommerce_backend.modules.invoice.entity.Order;
import com.sumuka.ecommerce_backend.modules.invoice.entity.Payment;
import com.sumuka.ecommerce_backend.modules.common.enums.OrderStatus;
import com.sumuka.ecommerce_backend.modules.common.enums.PaymentStatus;
import com.sumuka.ecommerce_backend.modules.invoice.repository.OrderRepository;
import com.sumuka.ecommerce_backend.modules.invoice.repository.PaymentRepository;
import com.sumuka.ecommerce_backend.modules.notification.service.contract.MailService;
import com.sumuka.ecommerce_backend.modules.invoice.service.contract.PaymentService;
import com.sumuka.ecommerce_backend.modules.common.utility.TemplateLoader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

        private final PaymentRepository paymentRepository;
        private final OrderRepository orderRepository;
        private final MailService mailService;
        private final TemplateLoader templateLoader;

        @Override
        public PaymentResponse processPayment(PaymentRequest request) {

                UUID orderId = request.getOrderId();

                // 🔥 Simulate payment
                Payment payment = Payment.builder()
                                .orderId(orderId)
                                .paymentMethod(request.getPaymentMethod())
                                .paymentTime(LocalDateTime.now())
                                .status(PaymentStatus.SUCCESS)
                                .build();

                payment = paymentRepository.save(payment);

                // ✅ Update order status
                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new RuntimeException("Order not found"));
                order.setStatus(OrderStatus.CONFIRMED);
                orderRepository.save(order);

                mailService.sendMail(MailRequestDTO.builder()
                                .to(order.getUser().getEmail())
                                .subject("✅ Payment Successful - Omnicart")
                                .message("Dear " + order.getUser().getName() + ",\n\nYour payment for Order ID "
                                                + orderId + " was successful.\nAmount: ₹" + order.getTotalAmount()
                                                + "\n\nThank you!")
                                .isHtml(false) // ⛔ Set to false
                                .build());

                return PaymentResponse.builder()
                                .paymentId(payment.getId())
                                .orderId(orderId)
                                .paymentMethod(payment.getPaymentMethod())
                                .paymentTime(payment.getPaymentTime())
                                .status(payment.getStatus())
                                .build();
        }
}
