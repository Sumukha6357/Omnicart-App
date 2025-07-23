package com.sumuka.ecommerce_backend.dto.request;

import com.sumuka.ecommerce_backend.enums.UserRole;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private UserRole role;
}
