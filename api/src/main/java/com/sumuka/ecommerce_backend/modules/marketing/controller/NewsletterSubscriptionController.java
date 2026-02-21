package com.sumuka.ecommerce_backend.modules.marketing.controller;

import com.sumuka.ecommerce_backend.dto.request.NewsletterSubscriptionRequest;
import com.sumuka.ecommerce_backend.modules.marketing.entity.NewsletterSubscription;
import com.sumuka.ecommerce_backend.modules.marketing.service.contract.NewsletterSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/public/subscriptions")
@RequiredArgsConstructor
public class NewsletterSubscriptionController {

    private final NewsletterSubscriptionService newsletterSubscriptionService;

    @PostMapping("/newsletter")
    public ResponseEntity<Map<String, Object>> subscribe(@RequestBody NewsletterSubscriptionRequest request) {
        NewsletterSubscription subscription = newsletterSubscriptionService.subscribe(request);
        return ResponseEntity.ok(Map.of(
                "message", "Subscription saved",
                "subscriptionId", subscription.getId(),
                "email", subscription.getEmail(),
                "source", subscription.getSource(),
                "active", subscription.getActive()));
    }
}
