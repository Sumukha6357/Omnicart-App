package com.sumuka.ecommerce_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MailLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recipient;
    private String subject;
    private boolean success;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    private LocalDateTime sentAt;
}
