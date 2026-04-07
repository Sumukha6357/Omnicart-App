package com.sumuka.ecommerce_backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class EcommerceBackendApplicationTests {

	@LocalServerPort
	private int port;

	@Autowired
	private TestRestTemplate restTemplate;

	@Test
	void contextLoads() {
		// Basic context loading test
	}

	@Test
	void applicationStartsSuccessfully() {
		// Test that the application starts and responds to basic health check
		ResponseEntity<String> response = restTemplate.getForEntity(
			"http://localhost:" + port + "/actuator/health", 
			String.class
		);
		assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
	}

	@Test
	void securityEndpointsAreConfigured() {
		// Test that security is properly configured
		ResponseEntity<String> response = restTemplate.getForEntity(
			"http://localhost:" + port + "/api/users", 
			String.class
		);
		// Should be unauthorized without authentication
		assertThat(response.getStatusCode().value()).isIn(401, 403);
	}

	@Test
	void openApiDocsAreAvailable() {
		// Test that OpenAPI documentation is accessible
		ResponseEntity<String> response = restTemplate.getForEntity(
			"http://localhost:" + port + "/v3/api-docs", 
			String.class
		);
		assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
		assertThat(response.getBody()).contains("openapi");
	}
}
