package com.careerlink.auth.service;

import com.careerlink.auth.dto.*;
import com.careerlink.auth.entity.ERole;
import com.careerlink.auth.entity.Role;
import com.careerlink.auth.entity.User;
import com.careerlink.auth.repository.RoleRepository;
import com.careerlink.auth.repository.UserRepository;
import com.careerlink.auth.security.JwtUtils;
import com.careerlink.auth.security.UserDetailsImpl;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(userDetails.getId())
                .fullName(userDetails.getFullName())
                .email(userDetails.getEmail())
                .companyName(userDetails.getCompanyName())
                .roles(roles)
                .expiresInMs(jwtUtils.getExpirationMs())
                .build();
    }

    @Transactional
    public UserDto registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Error: Email " + registerRequest.getEmail() + " is already in use!");
        }

        // Create new user account
        User user = User.builder()
                .fullName(registerRequest.getFullName())
                .email(registerRequest.getEmail())
                .password(encoder.encode(registerRequest.getPassword()))
                .phoneNumber(registerRequest.getPhoneNumber())
                .companyName(registerRequest.getCompanyName())
                .active(true)
                .roles(new HashSet<>())
                .build();

        String strRole = registerRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRole == null || strRole.equalsIgnoreCase("CANDIDATE")) {
            Role candidateRole = roleRepository.findByName(ERole.ROLE_CANDIDATE)
                    .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_CANDIDATE)));
            roles.add(candidateRole);
        } else if (strRole.equalsIgnoreCase("RECRUITER")) {
            Role recruiterRole = roleRepository.findByName(ERole.ROLE_RECRUITER)
                    .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_RECRUITER)));
            roles.add(recruiterRole);
        } else if (strRole.equalsIgnoreCase("ADMIN")) {
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_ADMIN)));
            roles.add(adminRole);
        } else {
            Role defaultRole = roleRepository.findByName(ERole.ROLE_CANDIDATE)
                    .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_CANDIDATE)));
            roles.add(defaultRole);
        }

        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        return mapToDto(savedUser);
    }

    public TokenValidationResponse validateToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (token == null || !jwtUtils.validateJwtToken(token)) {
            return TokenValidationResponse.builder()
                    .valid(false)
                    .message("Token is expired or invalid")
                    .build();
        }

        Claims claims = jwtUtils.getAllClaimsFromToken(token);
        String email = claims.getSubject();
        Long userId = claims.get("userId", Long.class);
        @SuppressWarnings("unchecked")
        List<String> roles = claims.get("roles", List.class);

        return TokenValidationResponse.builder()
                .valid(true)
                .email(email)
                .userId(userId)
                .roles(roles)
                .message("Token is valid")
                .build();
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
        return mapToDto(user);
    }

    private UserDto mapToDto(User user) {
        List<String> roles = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());

        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .companyName(user.getCompanyName())
                .active(user.isActive())
                .roles(roles)
                .build();
    }
}
