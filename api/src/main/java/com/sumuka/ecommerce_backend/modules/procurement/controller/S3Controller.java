package com.sumuka.ecommerce_backend.modules.procurement.controller;

import com.sumuka.ecommerce_backend.modules.procurement.service.impl.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URL;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/s3")
@RequiredArgsConstructor
public class S3Controller {

    private final S3Service s3Service;

    @GetMapping("/upload-url")
    public ResponseEntity<Map<String, String>> getUploadUrl(
            @RequestParam String fileName,
            @RequestParam String contentType) {
        URL url = s3Service.generatePreSignedUrl(fileName, contentType);
        Map<String, String> response = new HashMap<>();
        response.put("url", url.toString());
        return ResponseEntity.ok(response);
    }
}
