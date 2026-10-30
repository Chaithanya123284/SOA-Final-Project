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
public class TokenValidationResponse {
    private boolean valid;
    private String email;
    private Long userId;
    private List<String> roles;
    private String message;

    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public static TokenValidationResponseBuilder builder() {
        return new TokenValidationResponseBuilder();
    }

    public static class TokenValidationResponseBuilder {
        private boolean valid;
        private String email;
        private Long userId;
        private List<String> roles;
        private String message;

        public TokenValidationResponseBuilder valid(boolean valid) { this.valid = valid; return this; }
        public TokenValidationResponseBuilder email(String email) { this.email = email; return this; }
        public TokenValidationResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public TokenValidationResponseBuilder roles(List<String> roles) { this.roles = roles; return this; }
        public TokenValidationResponseBuilder message(String message) { this.message = message; return this; }

        public TokenValidationResponse build() {
            TokenValidationResponse res = new TokenValidationResponse();
            res.valid = this.valid;
            res.email = this.email;
            res.userId = this.userId;
            res.roles = this.roles;
            res.message = this.message;
            return res;
        }
    }
}
