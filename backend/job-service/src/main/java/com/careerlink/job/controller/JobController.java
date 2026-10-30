package com.careerlink.job.controller;

import com.careerlink.job.dto.JobPostingRequest;
import com.careerlink.job.dto.JobPostingResponse;
import com.careerlink.job.dto.JobSearchCriteria;
import com.careerlink.job.entity.EmploymentType;
import com.careerlink.job.service.JobService;
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
@RequestMapping("/api/v1/jobs")
@Tag(name = "Job Postings", description = "Endpoints for job seekers to search jobs and recruiters to manage postings")
public class JobController {

    @Autowired
    private JobService jobService;

    @PostMapping
    @Operation(summary = "Post a new job opening (Recruiter)")
    public ResponseEntity<JobPostingResponse> createJob(@Valid @RequestBody JobPostingRequest request) {
        JobPostingResponse response = jobService.createJob(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Search and filter active job postings")
    public ResponseEntity<List<JobPostingResponse>> searchJobs(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) EmploymentType employmentType,
            @RequestParam(required = false) Double minSalary,
            @RequestParam(required = false) String skill) {

        JobSearchCriteria criteria = JobSearchCriteria.builder()
                .query(query)
                .location(location)
                .employmentType(employmentType)
                .minSalary(minSalary)
                .skill(skill)
                .build();

        List<JobPostingResponse> jobs = jobService.searchJobs(criteria);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed information for a specific job posting")
    public ResponseEntity<?> getJobById(@PathVariable Long id) {
        try {
            JobPostingResponse job = jobService.getJobById(id);
            return ResponseEntity.ok(job);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing job posting")
    public ResponseEntity<?> updateJob(@PathVariable Long id, @Valid @RequestBody JobPostingRequest request) {
        try {
            JobPostingResponse updated = jobService.updateJob(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Close a job posting")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        try {
            jobService.deleteJob(id);
            Map<String, String> res = new HashMap<>();
            res.put("message", "Job listing successfully closed.");
            return ResponseEntity.ok(res);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping("/recruiter/{recruiterId}")
    @Operation(summary = "Get all jobs posted by a specific recruiter")
    public ResponseEntity<List<JobPostingResponse>> getJobsByRecruiter(@PathVariable Long recruiterId) {
        List<JobPostingResponse> jobs = jobService.getJobsByRecruiter(recruiterId);
        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}/is-open")
    @Operation(summary = "Inter-service verification: Check if a job is open for applications")
    public ResponseEntity<Boolean> isJobOpen(@PathVariable Long id) {
        boolean open = jobService.isJobOpen(id);
        return ResponseEntity.ok(open);
    }

    @PostMapping("/{id}/increment-applicant")
    @Operation(summary = "Inter-service call: Increment applicant counter")
    public ResponseEntity<Void> incrementApplicant(@PathVariable Long id) {
        jobService.incrementApplicantCount(id);
        return ResponseEntity.ok().build();
    }
}
