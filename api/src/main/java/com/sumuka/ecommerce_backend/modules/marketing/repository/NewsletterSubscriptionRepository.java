package com.sumuka.ecommerce_backend.modules.marketing.repository;

import com.sumuka.ecommerce_backend.modules.marketing.entity.NewsletterSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface NewsletterSubscriptionRepository extends JpaRepository<NewsletterSubscription, UUID> {
    Optional<NewsletterSubscription> findByEmailIgnoreCase(String email);
}
