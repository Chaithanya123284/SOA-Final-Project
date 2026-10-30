package com.careerlink.application.client;

import com.careerlink.application.dto.JobSummaryDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "job-service")
public interface JobServiceClient {

    @GetMapping("/api/v1/jobs/{id}")
    JobSummaryDto getJobById(@PathVariable("id") Long id);

    @GetMapping("/api/v1/jobs/{id}/is-open")
    Boolean isJobOpen(@PathVariable("id") Long id);

    @PostMapping("/api/v1/jobs/{id}/increment-applicant")
    void incrementApplicant(@PathVariable("id") Long id);
}
