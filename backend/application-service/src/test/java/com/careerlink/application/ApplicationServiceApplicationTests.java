package com.careerlink.application;

import com.careerlink.application.dto.ApplyRequest;
import com.careerlink.application.dto.JobApplicationResponse;
import com.careerlink.application.dto.StatusUpdateRequest;
import com.careerlink.application.entity.ApplicationStatus;
import com.careerlink.application.service.ApplicationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = {
    "eureka.client.enabled=false",
    "spring.cloud.discovery.enabled=false",
    "spring.cloud.openfeign.enabled=false"
})
@Transactional
class ApplicationServiceApplicationTests {

    @Autowired
    private ApplicationService applicationService;

    @Test
    @DisplayName("CO-4: Context loads and default seeded applications exist")
    void contextLoads() {
        List<JobApplicationResponse> apps = applicationService.getApplicationsByCandidate(1L);
        assertFalse(apps.isEmpty());
        assertTrue(apps.stream().anyMatch(a -> a.getJobTitle().contains("Senior Java Cloud Engineer")));
    }

    @Test
    @DisplayName("CO-4: Prevent duplicate applications from same candidate for same job")
    void testPreventDuplicateApplication() {
        // Candidate 1 has already applied for Job 1 in initializer
        ApplyRequest duplicateRequest = ApplyRequest.builder()
                .candidateId(1L)
                .jobId(1L)
                .coverLetter("Trying to apply again")
                .build();

        assertThrows(IllegalStateException.class, () -> applicationService.applyForJob(duplicateRequest));
    }

    @Test
    @DisplayName("CO-4: Update application status with recruiter feedback note")
    void testUpdateApplicationStatus() {
        List<JobApplicationResponse> apps = applicationService.getApplicationsByCandidate(1L);
        Long appId = apps.get(0).getId();

        StatusUpdateRequest update = StatusUpdateRequest.builder()
                .status(ApplicationStatus.INTERVIEW_SCHEDULED)
                .recruiterId(2L)
                .recruiterName("Sarah Jenkins")
                .feedbackNote("Interview scheduled for Tuesday at 2 PM PST.")
                .build();

        JobApplicationResponse updated = applicationService.updateApplicationStatus(appId, update);
        assertEquals(ApplicationStatus.INTERVIEW_SCHEDULED, updated.getStatus());
        assertEquals("Interview scheduled for Tuesday at 2 PM PST.", updated.getLatestFeedback());
        assertFalse(updated.getReviewNotes().isEmpty());
    }
}
