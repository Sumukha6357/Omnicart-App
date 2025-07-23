package com.sumuka.ecommerce_backend.controller;


import com.sumuka.ecommerce_backend.dto.request.MailRequestDTO;
import com.sumuka.ecommerce_backend.dto.response.MailResponseDTO;
import com.sumuka.ecommerce_backend.service.contract.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mail")
@RequiredArgsConstructor
public class MailController {

    private final MailService mailService;

    @PostMapping("/send")
    public MailResponseDTO sendMail(@RequestBody MailRequestDTO request) {
        return mailService.sendMail(request);
    }
}
