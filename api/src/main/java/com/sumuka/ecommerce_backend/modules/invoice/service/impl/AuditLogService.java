package com.sumuka.ecommerce_backend.modules.invoice.service.impl;

import com.sumuka.ecommerce_backend.modules.invoice.entity.AuditLog;
import com.sumuka.ecommerce_backend.modules.invoice.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(UUID userId, String action, String entityType, String entityId, String oldValue, String newValue) {
        AuditLog log = AuditLog.builder()
                .userId(userId)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .oldValue(oldValue)
                .newValue(newValue)
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(log);
    }
}
