package com.sumuka.ecommerce_backend.dto.request;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DateFilterRequestDTO {
    private LocalDate startDate;
    private LocalDate endDate;
}
