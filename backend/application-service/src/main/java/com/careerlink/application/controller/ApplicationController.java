package com.careerlink.application.controller;

import com.careerlink.application.dto.ApplyRequest;
import com.careerlink.application.dto.JobApplicationResponse;
import com.careerlink.application.dto.StatusUpdateRequest;
import com.careerlink.application.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/applications")
@Tag(name = "Job Applications", description = "Endpoints for candidates to apply for jobs and recruiters to review applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/apply")
    @Operation(summary = "Apply for a job opening (Candidate)")
    public ResponseEntity<?> applyForJob(
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @Valid @RequestBody ApplyRequest request) {
        try {
            // If header user id is present, set it
            if (headerUserId != null && !headerUserId.isBlank()) {
            	request.setCandidateId(Long.parseLong(headerUserId));
            }
            JobApplicationResponse response = applicationService.applyForJob(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalStateException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/my-applications")
    @Operation(summary = "Get all applications submitted by candidate")
    public ResponseEntity<List<JobApplicationResponse>> getMyApplications(
            @RequestHeader(value = "X-User-Id", required = false) String headerUserId,
            @RequestParam(required = false) Long candidateId) {

        Long targetId = candidateId;
        if (targetId == null && headerUserId != null && !headerUserId.isBlank()) {
            targetId = Long.parseLong(headerUserId);
        }
        if (targetId == null) {
            targetId = 1L; // Fallback to demo candidate ID
        }

        List<JobApplicationResponse> apps = applicationService.getApplicationsByCandidate(targetId);
        return ResponseEntity.ok(apps);
    }

    @GetMapping("/job/{jobId}")
    @Operation(summary = "Get all candidate applications for a specific job (Recruiter)")
    public ResponseEntity<List<JobApplicationResponse>> getApplicationsByJob(@PathVariable Long jobId) {
        List<JobApplicationResponse> apps = applicationService.getApplicationsByJob(jobId);
        return ResponseEntity.ok(apps);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get application details by ID")
    public ResponseEntity<?> getApplicationById(@PathVariable Long id) {
        try {
            JobApplicationResponse app = applicationService.getApplicationById(id);
            return ResponseEntity.ok(app);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update application workflow status with review notes (Recruiter)")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) String headerRecruiterId,
            @Valid @RequestBody StatusUpdateRequest request) {
        try {
            if (request.getRecruiterId() == null && headerRecruiterId != null && !headerRecruiterId.isBlank()) {
                request.setRecruiterId(Long.parseLong(headerRecruiterId));
            }
            JobApplicationResponse updated = applicationService.updateApplicationStatus(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping("/candidate/{candidateId}/has-applied/{jobId}")
    @Operation(summary = "Check if candidate has already applied to a job")
    public ResponseEntity<Boolean> hasApplied(@PathVariable Long candidateId, @PathVariable Long jobId) {
        boolean hasApplied = applicationService.hasCandidateApplied(candidateId, jobId);
        return ResponseEntity.ok(hasApplied);
    }
}
