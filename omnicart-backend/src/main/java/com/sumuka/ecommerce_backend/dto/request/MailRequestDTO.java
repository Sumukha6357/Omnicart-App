package com.sumuka.ecommerce_backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MailRequestDTO {
    private String to;
    private String subject;
    private String message;
    private boolean isHtml;
}
