package com.sumuka.ecommerce_backend.dto.analytics;


import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserSignupStatsDto {
    private LocalDate date;
    private Long signups;
}
