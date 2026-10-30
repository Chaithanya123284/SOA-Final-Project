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
public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String companyName;
    private boolean active;
    private List<String> roles;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }

    public static UserDtoBuilder builder() {
        return new UserDtoBuilder();
    }

    public static class UserDtoBuilder {
        private Long id;
        private String fullName;
        private String email;
        private String phoneNumber;
        private String companyName;
        private boolean active;
        private List<String> roles;

        public UserDtoBuilder id(Long id) { this.id = id; return this; }
        public UserDtoBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public UserDtoBuilder email(String email) { this.email = email; return this; }
        public UserDtoBuilder phoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; return this; }
        public UserDtoBuilder companyName(String companyName) { this.companyName = companyName; return this; }
        public UserDtoBuilder active(boolean active) { this.active = active; return this; }
        public UserDtoBuilder roles(List<String> roles) { this.roles = roles; return this; }

        public UserDto build() {
            UserDto u = new UserDto();
            u.id = this.id;
            u.fullName = this.fullName;
            u.email = this.email;
            u.phoneNumber = this.phoneNumber;
            u.companyName = this.companyName;
            u.active = this.active;
            u.roles = this.roles;
            return u;
        }
    }
}
