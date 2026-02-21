package com.sumuka.ecommerce_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NewsletterSubscriptionRequest {
    private String email;
    private String source;
}
