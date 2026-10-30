package com.careerlink.gateway.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Replaces Spring Boot's Whitelabel Error Page with a JSON error response
 * for the API Gateway (Spring Cloud Gateway / WebFlux).
 */
@RestController
@RequestMapping("/error")
public class GlobalErrorController {

    @GetMapping
    public Mono<ResponseEntity<Map<String, Object>>> handleError(ServerWebExchange exchange) {
        return Mono.just(buildErrorResponse(exchange));
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(ServerWebExchange exchange) {
        int statusCode = exchange.getResponse().getStatusCode() != null
                ? exchange.getResponse().getStatusCode().value()
                : HttpStatus.INTERNAL_SERVER_ERROR.value();

        String path = exchange.getRequest().getURI().getPath();

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", System.currentTimeMillis());
        body.put("status", statusCode);
        body.put("error", HttpStatus.valueOf(statusCode).getReasonPhrase());
        body.put("message", "No handler found for path: " + path);
        body.put("path", path);

        return ResponseEntity.status(statusCode).body(body);
    }
}
