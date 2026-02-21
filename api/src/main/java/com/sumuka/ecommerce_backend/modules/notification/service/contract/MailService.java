package com.sumuka.ecommerce_backend.modules.notification.service.contract;

import com.sumuka.ecommerce_backend.dto.request.MailRequestDTO;
import com.sumuka.ecommerce_backend.dto.response.MailResponseDTO;

import java.util.concurrent.CompletableFuture;

public interface MailService {
    CompletableFuture<MailResponseDTO> sendMail(MailRequestDTO request);

    void sendWelcomeMail(String to, String name);

    void sendSimpleEmail(String to, String subject, String body);
}
