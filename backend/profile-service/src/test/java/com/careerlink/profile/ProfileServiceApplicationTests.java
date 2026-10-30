package com.careerlink.profile;

import com.careerlink.profile.dto.ProfileRequest;
import com.careerlink.profile.dto.ProfileResponse;
import com.careerlink.profile.entity.CandidateProfile;
import com.careerlink.profile.repository.CandidateProfileRepository;
import com.careerlink.profile.service.ProfileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest(properties = {
    "eureka.client.enabled=false",
    "spring.cloud.discovery.enabled=false",
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration,org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration"
})
class ProfileServiceApplicationTests {

    @Autowired
    private ProfileService profileService;

    @MockBean
    private CandidateProfileRepository profileRepository;

    @BeforeEach
    void setupMocks() {
        CandidateProfile mockProfile = CandidateProfile.builder()
                .id("65f9b12a8f1b2c3d4e5f6a7b")
                .userId(1L)
                .fullName("Alex Morgan")
                .email("candidate@careerlink.com")
                .headline("Senior Java & Spring Cloud Microservices Engineer")
                .skills(new ArrayList<>(List.of("Java", "Spring Boot", "Spring Cloud", "MongoDB")))
                .build();

        when(profileRepository.findByUserId(1L)).thenReturn(Optional.of(mockProfile));
        when(profileRepository.existsByUserId(1L)).thenReturn(true);
        when(profileRepository.save(any(CandidateProfile.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    @DisplayName("CO-4: Context loads and verifies MongoDB-backed Candidate Profile retrieval")
    void testGetProfile() {
        assertTrue(profileService.profileExists(1L));
        ProfileResponse profile = profileService.getProfileByUserId(1L);
        assertNotNull(profile);
        assertEquals("Alex Morgan", profile.getFullName());
        assertTrue(profile.getSkills().contains("MongoDB"));
    }

    @Test
    @DisplayName("CO-4: Save candidate profile into MongoDB document collection")
    void testSaveProfile() {
        ProfileRequest request = ProfileRequest.builder()
                .userId(1L)
                .fullName("Alex Morgan")
                .email("candidate@careerlink.com")
                .headline("Principal Architect")
                .skills(List.of("Java", "Spring Boot", "MongoDB", "Kafka"))
                .build();

        ProfileResponse saved = profileService.createOrUpdateProfile(request);
        assertNotNull(saved);
        assertEquals("Alex Morgan", saved.getFullName());
    }
}
