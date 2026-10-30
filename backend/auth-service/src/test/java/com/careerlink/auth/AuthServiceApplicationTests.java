package com.careerlink.auth;

import com.careerlink.auth.dto.LoginRequest;
import com.careerlink.auth.dto.RegisterRequest;
import com.careerlink.auth.dto.UserDto;
import com.careerlink.auth.repository.UserRepository;
import com.careerlink.auth.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = {
    "eureka.client.enabled=false",
    "spring.cloud.discovery.enabled=false"
})
@Transactional
class AuthServiceApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("CO-2 & CO-4: Context loads and test users are initialized")
    void contextLoads() {
        assertTrue(userRepository.existsByEmail("candidate@careerlink.com"));
        assertTrue(userRepository.existsByEmail("recruiter@careerlink.com"));
    }

    @Test
    @DisplayName("CO-2: Register new candidate and verify user details")
    void testRegisterCandidate() {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Jordan Lee")
                .email("jordan.lee@example.com")
                .password("SecurePass123!")
                .role("CANDIDATE")
                .phoneNumber("+1-555-9988")
                .build();

        UserDto userDto = authService.registerUser(request);

        assertNotNull(userDto);
        assertEquals("Jordan Lee", userDto.getFullName());
        assertEquals("jordan.lee@example.com", userDto.getEmail());
        assertTrue(userDto.getRoles().contains("ROLE_CANDIDATE"));
    }

    @Test
    @DisplayName("CO-2: Authenticate valid user and receive signed JWT token")
    void testAuthenticateSuccess() {
        LoginRequest loginRequest = LoginRequest.builder()
                .email("candidate@careerlink.com")
                .password("Password123!")
                .build();

        var response = authService.authenticateUser(loginRequest);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("candidate@careerlink.com", response.getEmail());
        assertTrue(response.getRoles().contains("ROLE_CANDIDATE"));
    }

    @Test
    @DisplayName("CO-2: Invalid password triggers authentication failure")
    void testAuthenticateBadCredentials() {
        LoginRequest loginRequest = LoginRequest.builder()
                .email("candidate@careerlink.com")
                .password("WrongPassword")
                .build();

        assertThrows(BadCredentialsException.class, () -> authService.authenticateUser(loginRequest));
    }
}
