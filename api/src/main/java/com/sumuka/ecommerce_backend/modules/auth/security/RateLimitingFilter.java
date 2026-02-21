package com.sumuka.ecommerce_backend.modules.auth.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RedisTemplate<String, Object> redisTemplate;

    // In-memory cache of buckets for performance, but we can back it by Redis
    // For a strict Redis-backed implementation, we'd use ProxyManager from Bucket4j
    // For this demo, we'll use a hybrid approach or just stick to the logical
    // requirements.
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String key;
        Bucket bucket;

        if (request.getRequestURI().startsWith("/auth/login")) {
            // Login endpoint: 5 requests per minute per IP
            key = "rate:login:" + getClientIp(request);
            bucket = buckets.computeIfAbsent(key, k -> createBucket(5, 1));
        } else {
            // General API: 100 requests per minute per user (or IP if unauthenticated)
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String identity = (auth != null && auth.isAuthenticated()) ? auth.getName() : getClientIp(request);
            key = "rate:api:" + identity;
            bucket = buckets.computeIfAbsent(key, k -> createBucket(100, 1));
        }

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
        } else {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write(
                    "{\"status\": 429, \"error\": \"Too Many Requests\", \"message\": \"Too many requests. Please try again later.\"}");
        }
    }

    private Bucket createBucket(int limit, int minutes) {
        Bandwidth limitBandwidth = Bandwidth.classic(limit, Refill.greedy(limit, Duration.ofMinutes(minutes)));
        return Bucket.builder().addLimit(limitBandwidth).build();
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
