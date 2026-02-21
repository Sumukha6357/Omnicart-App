package com.sumuka.ecommerce_backend.modules.invoice.event.listener;

import com.sumuka.ecommerce_backend.dto.request.MailRequestDTO;
import com.sumuka.ecommerce_backend.modules.invoice.entity.Order;
import com.sumuka.ecommerce_backend.modules.invoice.event.InvoiceCreatedEvent;
import com.sumuka.ecommerce_backend.modules.invoice.service.impl.AuditLogService;
import com.sumuka.ecommerce_backend.modules.notification.service.contract.MailService;
import com.sumuka.ecommerce_backend.modules.common.utility.TemplateLoader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class InvoiceEventListener {

    private final MailService mailService;
    private final AuditLogService auditLogService;
    private final TemplateLoader templateLoader;

    @Async
    @EventListener
    public void handleInvoiceCreatedEvent(InvoiceCreatedEvent event) {
        Order order = event.getOrder();
        log.info("Processing InvoiceCreatedEvent for order: {}", order.getId());

        // 1. Send Order Confirmation Email
        try {
            String html = templateLoader.loadTemplate("order_placed.html")
                    .replace("${userName}", order.getUser().getName())
                    .replace("${orderId}", order.getId().toString())
                    .replace("${totalAmount}", order.getTotalAmount().toString())
                    .replace("${orderDate}", order.getOrderDate().toString());

            mailService.sendMail(MailRequestDTO.builder()
                    .to(order.getUser().getEmail())
                    .subject("🛒 Order Confirmation - Omnicart")
                    .message(html)
                    // Fallback message was in OrderServiceImpl, using HTML template here as per
                    // method sendOrderPlacedMail structure
                    // Actually OrderServiceImpl had simpler inline message in one place and
                    // template usage in another.
                    // I will use the template logic which looks better.
                    // Wait, the OrderServiceImpl.placeOrder method was using a simpler inline
                    // string builder in the viewed code.
                    // I'll stick to what was in placeOrder or improve it.
                    // `placeOrder` used simpler inline HTML. `sendOrderPlacedMail` was unused?
                    // Let's use the simpler inline HTML for now to match `placeOrder` exactly, or
                    // use the nicer `order_placed.html` if available.
                    // The viewed `OrderServiceImpl` had `sendOrderPlacedMail` method (lines 62-77)
                    // using `order_placed.html`.
                    // But `placeOrder` (lines 178-187) called `sendMail` with a hardcoded string.
                    // I will prefer the template approach if possible, but to be safe and avoid
                    // "template not found" errors if setup isn't complete, I'll use the hardcoded
                    // one from `placeOrder` but cleaner.
                    // Actually, let's just use the hardcoded one from `placeOrder` to minimize risk
                    // of regressions.
                    .message("Hi " + order.getUser().getName() + ",<br><br>" +
                            "Your order #" + order.getId() + " has been successfully placed!<br>" +
                            "We’ll notify you once it’s shipped.<br><br>" +
                            "Thank you for shopping with us!<br><br>" +
                            "- Team Omnicart")
                    .isHtml(true)
                    .build());
        } catch (Exception e) {
            log.error("Failed to send order confirmation email for order {}", order.getId(), e);
        }

        // 2. Audit Logging
        try {
            auditLogService.log(order.getUser().getId(), "ORDER_CREATE", "ORDER", order.getId().toString(), null,
                    order.getTotalAmount().toString());
        } catch (Exception e) {
            log.error("Failed to log audit for order {}", order.getId(), e);
        }
    }
}
