package com.sumuka.ecommerce_backend.dto.response;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class MailResponseDTO {
    private boolean success;
    private String info;
}
