package com.sumuka.ecommerce_backend.service.contract;

import com.sumuka.ecommerce_backend.dto.request.MailRequestDTO;
import com.sumuka.ecommerce_backend.dto.response.MailResponseDTO;

public interface MailService {
    MailResponseDTO sendMail(MailRequestDTO request);
    void sendWelcomeMail(String to, String name);

    void sendSimpleEmail(String to, String subject, String body);
}
