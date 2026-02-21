package com.sumuka.ecommerce_backend.modules.notification.repository;

import com.sumuka.ecommerce_backend.modules.notification.entity.MailLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MailLogRepository extends JpaRepository<MailLog, Long> {
}
