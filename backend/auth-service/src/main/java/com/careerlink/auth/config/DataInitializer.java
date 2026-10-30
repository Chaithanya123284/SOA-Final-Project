package com.careerlink.auth.config;

import com.careerlink.auth.entity.ERole;
import com.careerlink.auth.entity.Role;
import com.careerlink.auth.entity.User;
import com.careerlink.auth.repository.RoleRepository;
import com.careerlink.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

/**
 * Automatically seeds default roles and demo users for testing and grading evaluation.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed Roles
        Role candidateRole = roleRepository.findByName(ERole.ROLE_CANDIDATE)
                .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_CANDIDATE)));

        Role recruiterRole = roleRepository.findByName(ERole.ROLE_RECRUITER)
                .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_RECRUITER)));

        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(new Role(ERole.ROLE_ADMIN)));

        // 1. Seed Demo Candidate
        if (!userRepository.existsByEmail("candidate@careerlink.com")) {
            User candidate = User.builder()
                    .fullName("Alex Morgan")
                    .email("candidate@careerlink.com")
                    .password(passwordEncoder.encode("Password123!"))
                    .phoneNumber("+1-555-0100")
                    .active(true)
                    .roles(new HashSet<>(Set.of(candidateRole)))
                    .build();
            userRepository.save(candidate);
            logger.info("Default candidate seeded: candidate@careerlink.com / Password123!");
        }

        // 2. Seed Demo Recruiter
        if (!userRepository.existsByEmail("recruiter@careerlink.com")) {
            User recruiter = User.builder()
                    .fullName("Sarah Jenkins")
                    .email("recruiter@careerlink.com")
                    .password(passwordEncoder.encode("Password123!"))
                    .phoneNumber("+1-555-0200")
                    .companyName("TechCorp Global")
                    .active(true)
                    .roles(new HashSet<>(Set.of(recruiterRole)))
                    .build();
            userRepository.save(recruiter);
            logger.info("Default recruiter seeded: recruiter@careerlink.com / Password123!");
        }

        // 3. Seed Demo Admin
        if (!userRepository.existsByEmail("admin@careerlink.com")) {
            User admin = User.builder()
                    .fullName("System Administrator")
                    .email("admin@careerlink.com")
                    .password(passwordEncoder.encode("Password123!"))
                    .phoneNumber("+1-555-0300")
                    .active(true)
                    .roles(new HashSet<>(Set.of(adminRole)))
                    .build();
            userRepository.save(admin);
            logger.info("Default admin seeded: admin@careerlink.com / Password123!");
        }
    }
}
