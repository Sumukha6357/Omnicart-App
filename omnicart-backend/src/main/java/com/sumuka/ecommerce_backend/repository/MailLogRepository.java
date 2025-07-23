package com.sumuka.ecommerce_backend.repository;

import com.sumuka.ecommerce_backend.entity.MailLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MailLogRepository extends JpaRepository<MailLog, Long> {
}
