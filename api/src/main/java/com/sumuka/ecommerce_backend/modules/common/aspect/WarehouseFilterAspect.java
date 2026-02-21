package com.sumuka.ecommerce_backend.modules.common.aspect;

import com.sumuka.ecommerce_backend.modules.common.utility.WarehouseContext;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Session;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class WarehouseFilterAspect {

    private final EntityManager entityManager;

    @Before("execution(* com.sumuka.ecommerce_backend.modules.*.repository.*.*(..))")
    public void enableWarehouseFilter() {
        UUID warehouseId = WarehouseContext.getWarehouseId();
        if (warehouseId != null) {
            log.trace("Enabling warehouseFilter for warehouseId: {}", warehouseId);
            Session session = entityManager.unwrap(Session.class);
            session.enableFilter("warehouseFilter")
                    .setParameter("warehouseId", warehouseId);
        }
    }
}
