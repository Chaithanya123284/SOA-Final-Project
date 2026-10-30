package com.careerlink.application.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Builder
@AllArgsConstructor
public class ApplyRequest {

    @NotNull(message = "Candidate ID is required")
    private Long candidateId;

    private String candidateName;
    private String candidateEmail;

    @NotNull(message = "Job ID is required")
    private Long jobId;

    private String coverLetter;
    private String resumeUrl;

    public ApplyRequest() {
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public static ApplyRequestBuilder builder() {
        return new ApplyRequestBuilder();
    }

    public static class ApplyRequestBuilder {
        private Long candidateId;
        private String candidateName;
        private String candidateEmail;
        private Long jobId;
        private String coverLetter;
        private String resumeUrl;

        public ApplyRequestBuilder candidateId(Long candidateId) { this.candidateId = candidateId; return this; }
        public ApplyRequestBuilder candidateName(String candidateName) { this.candidateName = candidateName; return this; }
        public ApplyRequestBuilder candidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; return this; }
        public ApplyRequestBuilder jobId(Long jobId) { this.jobId = jobId; return this; }
        public ApplyRequestBuilder coverLetter(String coverLetter) { this.coverLetter = coverLetter; return this; }
        public ApplyRequestBuilder resumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; return this; }

        public ApplyRequest build() {
            ApplyRequest req = new ApplyRequest();
            req.candidateId = this.candidateId;
            req.candidateName = this.candidateName;
            req.candidateEmail = this.candidateEmail;
            req.jobId = this.jobId;
            req.coverLetter = this.coverLetter;
            req.resumeUrl = this.resumeUrl;
            return req;
        }
    }
}