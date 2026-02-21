package com.sumuka.ecommerce_backend.modules.marketing.service.impl;

import com.sumuka.ecommerce_backend.dto.request.NewsletterSubscriptionRequest;
import com.sumuka.ecommerce_backend.modules.marketing.entity.NewsletterSubscription;
import com.sumuka.ecommerce_backend.modules.marketing.repository.NewsletterSubscriptionRepository;
import com.sumuka.ecommerce_backend.modules.marketing.service.contract.NewsletterSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Locale;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class NewsletterSubscriptionServiceImpl implements NewsletterSubscriptionService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    private final NewsletterSubscriptionRepository newsletterSubscriptionRepository;

    @Override
    public NewsletterSubscription subscribe(NewsletterSubscriptionRequest request) {
        if (request == null || !StringUtils.hasText(request.getEmail())) {
            throw new IllegalArgumentException("Email is required");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);
        if (!EMAIL_PATTERN.matcher(normalizedEmail).matches()) {
            throw new IllegalArgumentException("Please provide a valid email address");
        }

        NewsletterSubscription existing = newsletterSubscriptionRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElse(null);
        if (existing != null) {
            if (Boolean.FALSE.equals(existing.getActive())) {
                existing.setActive(true);
                return newsletterSubscriptionRepository.save(existing);
            }
            return existing;
        }

        String source = StringUtils.hasText(request.getSource()) ? request.getSource().trim().toLowerCase(Locale.ROOT)
                : "footer";

        NewsletterSubscription subscription = NewsletterSubscription.builder()
                .email(normalizedEmail)
                .source(source)
                .active(true)
                .build();

        return newsletterSubscriptionRepository.save(subscription);
    }
}
