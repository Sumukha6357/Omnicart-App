package com.sumuka.ecommerce_backend.service.impl;

import com.sumuka.ecommerce_backend.dto.request.MailRequestDTO;
import com.sumuka.ecommerce_backend.dto.response.MailResponseDTO;
import com.sumuka.ecommerce_backend.entity.MailLog;
import com.sumuka.ecommerce_backend.repository.MailLogRepository;
import com.sumuka.ecommerce_backend.service.contract.MailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.*;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;
    private final MailLogRepository mailLogRepo;
    private final TemplateEngine templateEngine;
    private final JavaMailSender javaMailSender;

    @Override
    public void sendSimpleEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("kysumukha@gmail.com"); // match with spring.mail.username

        javaMailSender.send(message);
    }
    @Override
    public MailResponseDTO sendMail(MailRequestDTO req) {
        MailLog log = MailLog.builder()
                .recipient(req.getTo())
                .subject(req.getSubject())
                .sentAt(LocalDateTime.now())
                .build();

        try {
            if (req.isHtml()) {
                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
                helper.setTo(req.getTo());
                helper.setSubject(req.getSubject());
                helper.setText(req.getMessage(), true);
                helper.setFrom("kysumukha@gmail.com"); // ✅ Verified sender
                mailSender.send(mimeMessage);
            } else {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(req.getTo());
                message.setSubject(req.getSubject());
                message.setText(req.getMessage());
                message.setFrom("kysumukha@gmail.com"); // ✅ Verified sender
                mailSender.send(message);
            }

            log.setSuccess(true);
            log.setErrorMessage(null);
            mailLogRepo.save(log);
            return new MailResponseDTO(true, "📩 Email sent successfully.");

        } catch (MessagingException | RuntimeException e) {
            log.setSuccess(false);
            log.setErrorMessage(e.getMessage());
            mailLogRepo.save(log);
            return new MailResponseDTO(false, "❌ Failed: " + e.getMessage());
        }
    }

    @Override
    public void sendWelcomeMail(String to, String name) {
        Context context = new Context();
        context.setVariable("name", name); // dynamic variable

        String body = templateEngine.process("welcome-email", context); // resolves HTML

        MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(
                    mimeMessage,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    "UTF-8"
            );
            helper.setTo(to);
            helper.setSubject("🎉 Welcome to OmniCart!");
            helper.setFrom("kysumukha@gmail.com"); // ✅ Use the correct from address
            helper.setText(body, true);

            mailSender.send(mimeMessage);
            log.info("📩 Sent welcome mail to {}", to);

            MailLog logEntry = MailLog.builder()
                    .recipient(to)
                    .subject("🎉 Welcome to OmniCart!")
                    .sentAt(LocalDateTime.now())
                    .success(true)
                    .build();
            mailLogRepo.save(logEntry);

        } catch (Exception e) {
            log.error("🔥 Failed to send welcome email", e);

            MailLog failedLog = MailLog.builder()
                    .recipient(to)
                    .subject("🎉 Welcome to OmniCart!")
                    .sentAt(LocalDateTime.now())
                    .success(false)
                    .errorMessage(e.getMessage())
                    .build();
            mailLogRepo.save(failedLog);
        }
    }
}
