package com.sumuka.ecommerce_backend.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatsDTO {
    private long totalUsers;
    private long totalSellers;
    private long totalBuyers;
    private long newUsersThisWeek;
}
