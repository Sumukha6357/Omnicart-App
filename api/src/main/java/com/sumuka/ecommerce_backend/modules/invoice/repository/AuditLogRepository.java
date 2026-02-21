package com.sumuka.ecommerce_backend.modules.invoice.repository;

import com.sumuka.ecommerce_backend.modules.invoice.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
}
