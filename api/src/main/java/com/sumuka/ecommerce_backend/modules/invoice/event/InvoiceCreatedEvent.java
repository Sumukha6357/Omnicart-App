package com.sumuka.ecommerce_backend.modules.invoice.event;

import com.sumuka.ecommerce_backend.modules.invoice.entity.Order;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class InvoiceCreatedEvent extends ApplicationEvent {
    private final Order order;

    public InvoiceCreatedEvent(Object source, Order order) {
        super(source);
        this.order = order;
    }
}
