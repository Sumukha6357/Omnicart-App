package com.sumuka.ecommerce_backend.modules.common.exception;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

/**
 * Standardized API error response body.
 *
 * <pre>
 * {
 *   "timestamp": "2026-02-20T10:00:00",
 *   "status": 400,
 *   "error": "Bad Request",
 *   "message": "Validation failed for field 'email'",
 *   "path": "/api/products"
 * }
 * </pre>
 */
public record ApiErrorResponse(

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime timestamp,

        int status,

        String error,

        String message,

        String path) {
    /** Convenience factory — sets timestamp to now. */
    public static ApiErrorResponse of(int status, String error, String message, String path) {
        return new ApiErrorResponse(LocalDateTime.now(), status, error, message, path);
    }
}
