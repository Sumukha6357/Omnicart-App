package com.sumuka.ecommerce_backend.modules.common.utility;

import org.springframework.stereotype.Component;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Component
public class TemplateLoader {

    public String loadTemplate(String fileName) {
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("templates/" + fileName)) {
            if (inputStream == null) throw new FileNotFoundException("Template not found");
            return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Template loading failed", e);
        }
    }
}
