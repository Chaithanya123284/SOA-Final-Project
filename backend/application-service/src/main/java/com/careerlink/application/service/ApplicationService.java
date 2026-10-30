package com.careerlink.application.service;

import com.careerlink.application.client.JobServiceClient;
import com.careerlink.application.client.ProfileServiceClient;
import com.careerlink.application.dto.*;
import com.careerlink.application.entity.ApplicationStatus;
import com.careerlink.application.entity.JobApplication;
import com.careerlink.application.entity.ReviewNote;
import com.careerlink.application.event.ApplicationEventPublisherService;
import com.careerlink.application.repository.JobApplicationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private static final Logger logger = LoggerFactory.getLogger(ApplicationService.class);

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Autowired(required = false)
    private JobServiceClient jobServiceClient;

    @Autowired(required = false)
    private ProfileServiceClient profileServiceClient;

    @Autowired
    private ApplicationEventPublisherService eventPublisher;

    @Transactional
    public JobApplicationResponse applyForJob(ApplyRequest request) {
        // 1. Prevent duplicate applications
        if (applicationRepository.existsByCandidateIdAndJobId(request.getCandidateId(), request.getJobId())) {
            throw new IllegalStateException("Candidate has already applied for this job!");
        }

        String jobTitle = "Software Engineering Role";
        String company = "CareerLink Partner";

        // 2. Inter-service validation with Job Service via OpenFeign
        if (jobServiceClient != null) {
            try {
                Boolean isOpen = jobServiceClient.isJobOpen(request.getJobId());
                if (isOpen != null && !isOpen) {
                    throw new IllegalStateException("This job posting is closed or no longer accepting applications.");
                }
                JobSummaryDto job = jobServiceClient.getJobById(request.getJobId());
                if (job != null) {
                    jobTitle = job.getTitle();
                    company = job.getCompany();
                }
                // Increment applicant count asynchronously/remotely
                jobServiceClient.incrementApplicant(request.getJobId());
            } catch (IllegalStateException e) {
                throw e;
            } catch (Exception e) {
                logger.warn("Unable to contact Job Service via OpenFeign: {}. Proceeding with request info.", e.getMessage());
            }
        }

        // 3. Inter-service candidate validation with Profile Service via OpenFeign
        String candidateName = request.getCandidateName();
        String candidateEmail = request.getCandidateEmail();
        String resumeUrl = request.getResumeUrl();

        if (profileServiceClient != null) {
            try {
                ProfileSummaryDto profile = profileServiceClient.getProfileByUserId(request.getCandidateId());
                if (profile != null) {
                    if (candidateName == null || candidateName.isBlank()) candidateName = profile.getFullName();
                    if (candidateEmail == null || candidateEmail.isBlank()) candidateEmail = profile.getEmail();
                    if (resumeUrl == null || resumeUrl.isBlank()) resumeUrl = profile.getResumeUrl();
                }
            } catch (Exception e) {
                logger.warn("Unable to contact Profile Service via OpenFeign: {}. Proceeding with request info.", e.getMessage());
            }
        }

        // 4. Create and persist application
        JobApplication application = JobApplication.builder()
                .candidateId(request.getCandidateId())
                .candidateName(candidateName != null ? candidateName : "Applicant #" + request.getCandidateId())
                .candidateEmail(candidateEmail != null ? candidateEmail : "candidate" + request.getCandidateId() + "@careerlink.com")
                .jobId(request.getJobId())
                .jobTitle(jobTitle)
                .company(company)
                .coverLetter(request.getCoverLetter())
                .resumeUrl(resumeUrl)
                .status(ApplicationStatus.SUBMITTED)
                .build();
        JobApplication saved = applicationRepository.save(application);

        // 5. Emit asynchronous domain event
        eventPublisher.publishEvent(
                "APPLICATION_SUBMITTED",
                saved.getId(),
                saved.getCandidateId(),
                saved.getCandidateEmail(),
                saved.getJobId(),
                saved.getJobTitle(),
                null,
                ApplicationStatus.SUBMITTED.name(),
                "Application submitted successfully"
        );

        return mapToResponse(saved);
    }

    public List<JobApplicationResponse> getApplicationsByCandidate(Long candidateId) {
        return applicationRepository.findByCandidateId(candidateId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<JobApplicationResponse> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public JobApplicationResponse getApplicationById(Long id) {
        JobApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job application not found with ID: " + id));
        return mapToResponse(app);
    }

    @Transactional
    public JobApplicationResponse updateApplicationStatus(Long id, StatusUpdateRequest request) {
        JobApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job application not found with ID: " + id));

        ApplicationStatus previousStatus = app.getStatus();
        app.setStatus(request.getStatus());

        if (request.getFeedbackNote() != null && !request.getFeedbackNote().isBlank()) {
            app.setLatestFeedback(request.getFeedbackNote());
            ReviewNote note = ReviewNote.builder()
                    .recruiterId(request.getRecruiterId())
                    .recruiterName(request.getRecruiterName())
                    .note(request.getFeedbackNote())
                    .build();
            app.getReviewNotes().add(note);
        }

        JobApplication saved = applicationRepository.save(app);

        // Emit asynchronous domain event for recruiter review
        eventPublisher.publishEvent(
                "STATUS_CHANGED",
                saved.getId(),
                saved.getCandidateId(),
                saved.getCandidateEmail(),
                saved.getJobId(),
                saved.getJobTitle(),
                previousStatus.name(),
                request.getStatus().name(),
                request.getFeedbackNote()
        );

        return mapToResponse(saved);
    }

    public boolean hasCandidateApplied(Long candidateId, Long jobId) {
        return applicationRepository.existsByCandidateIdAndJobId(candidateId, jobId);
    }

    private JobApplicationResponse mapToResponse(JobApplication a) {
        return JobApplicationResponse.builder()
                .id(a.getId())
                .candidateId(a.getCandidateId())
                .candidateName(a.getCandidateName())
                .candidateEmail(a.getCandidateEmail())
                .jobId(a.getJobId())
                .jobTitle(a.getJobTitle())
                .company(a.getCompany())
                .coverLetter(a.getCoverLetter())
                .resumeUrl(a.getResumeUrl())
                .status(a.getStatus())
                .latestFeedback(a.getLatestFeedback())
                .reviewNotes(a.getReviewNotes())
                .appliedAt(a.getAppliedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }
}
