package com.careerlink.gateway.config;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Root endpoint for the API Gateway. Returns service information
 * instead of a 404 when users access the gateway base URL.
 */
@RestController
@RequestMapping("/")
public class HomeController {

    @GetMapping
    public Mono<ResponseEntity<Map<String, Object>>> home(ServerWebExchange exchange) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("service", "CareerLink Networks - API Gateway");
        body.put("version", "1.0.0");
        body.put("description", "Enterprise Talent Acquisition & Job Application Portal - Microservices Suite");
        body.put("gatewayUrl", exchange.getRequest().getURI().toString());

        Map<String, String> routes = new LinkedHashMap<>();
        routes.put("Auth Service", "/api/v1/auth/**");
        routes.put("Profile Service", "/api/v1/profiles/**");
        routes.put("Job Service", "/api/v1/jobs/**");
        routes.put("Application Service", "/api/v1/applications/**");
        body.put("routes", routes);

        Map<String, String> swagger = new LinkedHashMap<>();
        swagger.put("Auth Service", "http://localhost:8081/swagger-ui.html");
        swagger.put("Profile Service", "http://localhost:8082/swagger-ui.html");
        swagger.put("Job Service", "http://localhost:8083/swagger-ui.html");
        swagger.put("Application Service", "http://localhost:8084/swagger-ui.html");
        body.put("swaggerUi", swagger);

        body.put("eurekaDashboard", "http://localhost:8761");

        return Mono.just(ResponseEntity.ok(body));
    }
}
