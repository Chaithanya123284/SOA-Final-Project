package com.careerlink.gateway.filter;

import com.careerlink.gateway.util.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * CO-2 Microservices Security: Global API Gateway JWT Authentication Filter.
 * Intercepts requests, validates JWT tokens, extracts claims, and mutates
 * downstream request headers with user identity and roles.
 */
@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    @Autowired
    private JwtUtil jwtUtil;

    private static final List<String> OPEN_API_ENDPOINTS = List.of(
            "/",
            "/error",
            "/api/v1/auth/register",
            "/api/v1/auth/login",
            "/api/v1/auth/validate",
            "/actuator",
            "/v3/api-docs",
            "/swagger-ui",
            "/webjars"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        HttpMethod method = request.getMethod();

        // 1. Allow open endpoints
        if (isOpenEndpoint(path, method)) {
            return chain.filter(exchange);
        }

        // 2. Allow CORS pre-flight OPTIONS requests
        if (HttpMethod.OPTIONS.equals(method)) {
            return chain.filter(exchange);
        }

        // 3. Check for Authorization header
        if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
            return onError(exchange, "Missing Authorization Header", HttpStatus.UNAUTHORIZED);
        }

        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return onError(exchange, "Invalid Authorization Header Format", HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);

        try {
            if (!jwtUtil.validateToken(token)) {
                return onError(exchange, "JWT Token is invalid or expired", HttpStatus.UNAUTHORIZED);
            }

            Claims claims = jwtUtil.getAllClaimsFromToken(token);
            String username = claims.getSubject();
            String role = claims.get("role") != null ? claims.get("role").toString() : "";
            String userId = claims.get("userId") != null ? claims.get("userId").toString() : "";

            // Mutate request to pass authenticated user claims downstream
            ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                    .header("X-User-Email", username)
                    .header("X-User-Role", role)
                    .header("X-User-Id", userId)
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        } catch (Exception e) {
            return onError(exchange, "Authentication failed: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    private boolean isOpenEndpoint(String path, HttpMethod method) {
        // Public job browsing is allowed without login
        if (path.startsWith("/api/v1/jobs") && HttpMethod.GET.equals(method)) {
            return true;
        }

        return OPEN_API_ENDPOINTS.stream().anyMatch(path::startsWith);
    }

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        response.getHeaders().add("Content-Type", "application/json");
        String body = String.format("{\"timestamp\": %d, \"status\": %d, \"error\": \"%s\", \"message\": \"%s\"}",
                System.currentTimeMillis(), httpStatus.value(), httpStatus.getReasonPhrase(), message);
        return response.writeWith(Mono.just(response.bufferFactory().wrap(body.getBytes())));
    }

    @Override
    public int getOrder() {
        return -100; // High priority in filter chain
    }
}
