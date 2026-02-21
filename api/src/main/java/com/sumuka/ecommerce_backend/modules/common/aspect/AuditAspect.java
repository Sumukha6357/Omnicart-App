package com.sumuka.ecommerce_backend.modules.common.aspect;

import com.sumuka.ecommerce_backend.modules.auth.security.CustomUserDetails;
import com.sumuka.ecommerce_backend.modules.common.annotation.Auditable;
import com.sumuka.ecommerce_backend.modules.invoice.service.impl.AuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditLogService auditLogService;

    @AfterReturning(pointcut = "@annotation(auditable)", returning = "result")
    public void auditAfterReturning(JoinPoint joinPoint, Auditable auditable, Object result) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UUID userId = null;
            if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
                userId = userDetails.getId();
            }

            String entityId = extractEntityId(joinPoint, result);

            auditLogService.log(
                    userId,
                    auditable.action(),
                    auditable.entityType(),
                    entityId,
                    null, // Old value - would require more complex logic
                    "Operation Success");
        } catch (Exception e) {
            log.error("Failed to process audit log for method: {}", joinPoint.getSignature().getName(), e);
        }
    }

    private String extractEntityId(JoinPoint joinPoint, Object result) {
        // Simple extraction logic:
        // 1. If result is UUID, use it.
        // 2. If result has a getId() method, use it.
        // 3. Otherwise, check first argument if it's a UUID or has getId().

        if (result instanceof UUID) {
            return result.toString();
        }

        if (result != null) {
            try {
                return result.getClass().getMethod("getId").invoke(result).toString();
            } catch (Exception ignored) {
            }
        }

        Object[] args = joinPoint.getArgs();
        if (args.length > 0) {
            if (args[0] instanceof UUID) {
                return args[0].toString();
            }
            try {
                return args[0].getClass().getMethod("getId").invoke(args[0]).toString();
            } catch (Exception ignored) {
            }
        }

        return "UNKNOWN";
    }
}
