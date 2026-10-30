package com.careerlink.application.dto;

import com.careerlink.application.entity.ApplicationStatus;
import com.careerlink.application.entity.ReviewNote;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplicationResponse {
    private Long id;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private Long jobId;
    private String jobTitle;
    private String company;
    private String coverLetter;
    private String resumeUrl;
    private ApplicationStatus status;
    private String latestFeedback;
    private List<ReviewNote> reviewNotes;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCandidateId() { return candidateId; }
    public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }

    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

    public String getCandidateEmail() { return candidateEmail; }
    public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public String getLatestFeedback() { return latestFeedback; }
    public void setLatestFeedback(String latestFeedback) { this.latestFeedback = latestFeedback; }

    public List<ReviewNote> getReviewNotes() { return reviewNotes; }
    public void setReviewNotes(List<ReviewNote> reviewNotes) { this.reviewNotes = reviewNotes; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static JobApplicationResponseBuilder builder() {
        return new JobApplicationResponseBuilder();
    }

    public static class JobApplicationResponseBuilder {
        private Long id;
        private Long candidateId;
        private String candidateName;
        private String candidateEmail;
        private Long jobId;
        private String jobTitle;
        private String company;
        private String coverLetter;
        private String resumeUrl;
        private ApplicationStatus status;
        private String latestFeedback;
        private List<ReviewNote> reviewNotes;
        private LocalDateTime appliedAt;
        private LocalDateTime updatedAt;

        public JobApplicationResponseBuilder id(Long id) { this.id = id; return this; }
        public JobApplicationResponseBuilder candidateId(Long candidateId) { this.candidateId = candidateId; return this; }
        public JobApplicationResponseBuilder candidateName(String candidateName) { this.candidateName = candidateName; return this; }
        public JobApplicationResponseBuilder candidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; return this; }
        public JobApplicationResponseBuilder jobId(Long jobId) { this.jobId = jobId; return this; }
        public JobApplicationResponseBuilder jobTitle(String jobTitle) { this.jobTitle = jobTitle; return this; }
        public JobApplicationResponseBuilder company(String company) { this.company = company; return this; }
        public JobApplicationResponseBuilder coverLetter(String coverLetter) { this.coverLetter = coverLetter; return this; }
        public JobApplicationResponseBuilder resumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; return this; }
        public JobApplicationResponseBuilder status(ApplicationStatus status) { this.status = status; return this; }
        public JobApplicationResponseBuilder latestFeedback(String latestFeedback) { this.latestFeedback = latestFeedback; return this; }
        public JobApplicationResponseBuilder reviewNotes(List<ReviewNote> reviewNotes) { this.reviewNotes = reviewNotes; return this; }
        public JobApplicationResponseBuilder appliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; return this; }
        public JobApplicationResponseBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public JobApplicationResponse build() {
            JobApplicationResponse res = new JobApplicationResponse();
            res.id = this.id;
            res.candidateId = this.candidateId;
            res.candidateName = this.candidateName;
            res.candidateEmail = this.candidateEmail;
            res.jobId = this.jobId;
            res.jobTitle = this.jobTitle;
            res.company = this.company;
            res.coverLetter = this.coverLetter;
            res.resumeUrl = this.resumeUrl;
            res.status = this.status;
            res.latestFeedback = this.latestFeedback;
            res.reviewNotes = this.reviewNotes;
            res.appliedAt = this.appliedAt;
            res.updatedAt = this.updatedAt;
            return res;
        }
    }
}
