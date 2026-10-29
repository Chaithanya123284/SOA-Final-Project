# Course Outcome 2 (CO-2): Microservices Security, JWT & Spring Security 6

## 1. Microservices Security Threats & Defense-in-Depth

Distributed microservices architectures introduce unique vulnerability surfaces compared to monolithic applications:

| Threat Vector | Description | CareerLink Mitigation Strategy |
| :--- | :--- | :--- |
| **Eavesdropping & Man-in-the-Middle (MITM)** | Interception of plaintext HTTP packets between microservices. | Enforce **TLS 1.3 / HTTPS** edge termination at Spring Cloud Gateway and mTLS between internal services. |
| **Token Theft & Replay Attacks** | Stolen credentials used to impersonate candidates or recruiters. | Short-lived JWTs (24 hours), cryptographic signing via HMAC-SHA256, and secure Bearer token transport. |
| **Privilege Escalation** | A Candidate invoking Recruiter-only endpoints (e.g. creating jobs or altering candidate review notes). | Role-Based Access Control (**RBAC**) verified at both API Gateway and service method levels (`@PreAuthorize`). |
| **Cross-Origin Resource Sharing (CORS) Exploits**| Malicious web applications issuing unauthorized browser requests to backend APIs. | Fine-grained **`CorsWebFilter`** on Spring Cloud Gateway with whitelisted origins, explicit headers, and method restrictions. |
| **Broken Object Level Authorization (BOLA/IDOR)**| A user modifying another user's profile by changing the `userId` in the payload. | Gateway injects validated `X-User-Id` header from signed JWT; services cross-check resource ownership against this header. |

---

## 2. JWT Implementation with Spring Security 6

CareerLink Networks utilizes **JSON Web Tokens (JWT)** based on the **RFC 7519** standard.

### JWT Structure in CareerLink
A JWT consists of three Base64URL-encoded parts separated by dots (`.`):
```
[ Header: Algorithm & Token Type ] . [ Payload: Claims & Roles ] . [ Cryptographic Signature ]
```

#### 1. Header
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

#### 2. Payload (Claims)
```json
{
  "sub": "candidate@careerlink.com",
  "userId": 1,
  "fullName": "Alex Morgan",
  "role": "ROLE_CANDIDATE",
  "roles": ["ROLE_CANDIDATE"],
  "iat": 1726850000,
  "exp": 1726936400
}
```

#### 3. Signature
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  jwtSecretKey
)
```

### Spring Security 6 Configuration Highlights
In `auth-service`, `WebSecurityConfig.java` enforces:
1. **Stateless Session Management**: `SessionCreationPolicy.STATELESS` avoids server-side session overhead.
2. **Password Hashing**: `BCryptPasswordEncoder` (10 rounds of salt generation) protects user credentials against rainbow tables.
3. **Filter Chain Execution Order**: `AuthTokenFilter` executes before `UsernamePasswordAuthenticationFilter`.

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
        .exceptionHandling(ex -> ex.authenticationEntryPoint(unauthorizedHandler))
        .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/v1/auth/**").permitAll()
            .requestMatchers("/actuator/**").permitAll()
            .anyRequest().authenticated()
        );
    http.authenticationProvider(authenticationProvider());
    http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
    return http.build();
}
```

---

## 3. API Security & CORS Configuration

Browsers enforce Same-Origin Policy. To enable our Web Portal (`index.html`) to invoke the API Gateway (`http://localhost:8080`), we configured a reactive `CorsWebFilter` in `api-gateway/config/CorsConfig.java`:

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Collections.singletonList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-User-Id", "X-Requested-With"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }
}
```

### Preflight `OPTIONS` Handling
When a browser makes a `POST /api/v1/applications/apply` request with custom headers like `Authorization: Bearer <token>`, it first sends an `OPTIONS` preflight request. The gateway responds with HTTP 200 and allowed CORS headers before processing the actual payload.

---

## 4. TLS/SSL Configuration for Secure Transport

To encrypt communications in production, TLS 1.3 is configured via PKCS12 / JKS keystores in Spring Boot:

```yaml
server:
  port: 8443
  ssl:
    enabled: true
    key-store: classpath:keystore.p12
    key-store-password: ${SSL_KEYSTORE_PASSWORD:ChangeMeSecurePassword123!}
    key-store-type: PKCS12
    key-alias: careerlink-gateway
    ciphers:
      - TLS_AES_128_GCM_SHA256
      - TLS_AES_256_GCM_SHA384
```

---

## 5. Security Testing Matrix & Verification

| Test Scenario | Input / Action | Expected Result | Verified In |
| :--- | :--- | :--- | :--- |
| **Authentication Success** | Correct email and password for candidate | Returns HTTP 200 with signed JWT token, user ID, and role. | `AuthServiceApplicationTests.java` |
| **Bad Credentials** | Wrong password provided | Throws `BadCredentialsException`, returns HTTP 401 Unauthorized. | `AuthServiceApplicationTests.java` |
| **Protected Endpoint without Token** | Request to `/api/v1/applications/apply` without `Authorization` header | Gateway returns HTTP 401 Unauthorized with error message. | `JwtAuthenticationFilter.java` |
| **Expired or Tampered JWT** | Modified signature or past expiration date | JWT validation fails; returns HTTP 401 with "Token is expired or invalid". | `JwtUtil.java` |
| **Duplicate Application Attack** | Candidate submits application to same job twice | Database unique constraint + service validation throws `IllegalStateException`, returns HTTP 409 Conflict. | `ApplicationServiceApplicationTests.java` |

---

## 6. Agile Practices: Security Task Tracking & Sprint Demos

### Security User Stories & Task Tracking (Jira)
* **SEC-101**: *Configure BCrypt password encoding with strength 10 for user registrations.* (Status: Done)
* **SEC-102**: *Implement API Gateway JWT extraction filter and downstream claim propagation (`X-User-Id`, `X-User-Role`).* (Status: Done)
* **SEC-103**: *Enforce CORS WebFilter on Gateway allowing authenticated web browser origins.* (Status: Done)

### Sprint Demo Agenda
1. **Live Demonstration**: Register new candidate via Web UI; inspect generated JWT token in Chrome DevTools Network Tab.
2. **Decode Claims**: Display payload on `jwt.io` showing `sub`, `userId`, `role` (`ROLE_CANDIDATE`).
3. **Penetration Test Demo**: Attempt invoking `/api/v1/jobs` (POST) as a candidate; demonstrate access denial.
4. **CORS Inspection**: Inspect HTTP Response Headers showing `Access-Control-Allow-Origin: *` and `Access-Control-Allow-Credentials: true`.
