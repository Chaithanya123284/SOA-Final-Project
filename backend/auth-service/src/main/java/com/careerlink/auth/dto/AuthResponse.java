package com.careerlink.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private Long id;
    private String fullName;
    private String email;
    private String companyName;
    private List<String> roles;
    private long expiresInMs;

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }

    public long getExpiresInMs() { return expiresInMs; }
    public void setExpiresInMs(long expiresInMs) { this.expiresInMs = expiresInMs; }

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String fullName;
        private String email;
        private String companyName;
        private List<String> roles;
        private long expiresInMs;

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder type(String type) { this.type = type; return this; }
        public AuthResponseBuilder id(Long id) { this.id = id; return this; }
        public AuthResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public AuthResponseBuilder email(String email) { this.email = email; return this; }
        public AuthResponseBuilder companyName(String companyName) { this.companyName = companyName; return this; }
        public AuthResponseBuilder roles(List<String> roles) { this.roles = roles; return this; }
        public AuthResponseBuilder expiresInMs(long expiresInMs) { this.expiresInMs = expiresInMs; return this; }

        public AuthResponse build() {
            AuthResponse res = new AuthResponse();
            res.token = this.token;
            res.type = this.type != null ? this.type : "Bearer";
            res.id = this.id;
            res.fullName = this.fullName;
            res.email = this.email;
            res.companyName = this.companyName;
            res.roles = this.roles;
            res.expiresInMs = this.expiresInMs;
            return res;
        }
    }
}
