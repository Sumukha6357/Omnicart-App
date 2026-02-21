package com.sumuka.ecommerce_backend.modules.marketing.service.contract;

import com.sumuka.ecommerce_backend.dto.request.NewsletterSubscriptionRequest;
import com.sumuka.ecommerce_backend.modules.marketing.entity.NewsletterSubscription;

public interface NewsletterSubscriptionService {
    NewsletterSubscription subscribe(NewsletterSubscriptionRequest request);
}
