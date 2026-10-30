package com.careerlink.auth.config;

import io.swagger.v3.oas.annotations.Hidden;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Replaces Spring Boot's Whitelabel Error Page with a JSON error response
 * for the Auth Service.
 */
@Hidden
@RestController
@RequestMapping("/error")
public class GlobalErrorController {

    @org.springframework.web.bind.annotation.GetMapping
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        return buildErrorResponse(request);
    }

    @org.springframework.web.bind.annotation.PostMapping
    public ResponseEntity<Map<String, Object>> handleErrorPost(HttpServletRequest request) {
        return buildErrorResponse(request);
    }

    @org.springframework.web.bind.annotation.PutMapping
    public ResponseEntity<Map<String, Object>> handleErrorPut(HttpServletRequest request) {
        return buildErrorResponse(request);
    }

    @org.springframework.web.bind.annotation.DeleteMapping
    public ResponseEntity<Map<String, Object>> handleErrorDelete(HttpServletRequest request) {
        return buildErrorResponse(request);
    }

    @org.springframework.web.bind.annotation.PatchMapping
    public ResponseEntity<Map<String, Object>> handleErrorPatch(HttpServletRequest request) {
        return buildErrorResponse(request);
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(HttpServletRequest request) {
        Integer statusCode = (Integer) request.getAttribute(jakarta.servlet.RequestDispatcher.ERROR_STATUS_CODE);
        String errorMessage = (String) request.getAttribute(jakarta.servlet.RequestDispatcher.ERROR_MESSAGE);
        String requestUri = (String) request.getAttribute(jakarta.servlet.RequestDispatcher.ERROR_REQUEST_URI);

        int status = statusCode != null ? statusCode : 500;
        String path = requestUri != null ? requestUri : request.getRequestURI();

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", System.currentTimeMillis());
        body.put("status", status);
        body.put("error", errorMessage != null ? errorMessage : "Error");
        body.put("message", "No handler found for path: " + path);
        body.put("path", path);

        return ResponseEntity.status(status).body(body);
    }
}

