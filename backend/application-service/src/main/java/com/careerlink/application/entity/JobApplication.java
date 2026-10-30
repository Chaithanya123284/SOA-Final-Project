package com.careerlink.application.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "job_applications", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"candidateId", "jobId"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private Long candidateId;

    private String candidateName;
    private String candidateEmail;

    @NotNull
    private Long jobId;

    private String jobTitle;
    private String company;

    @Column(length = 3000)
    private String coverLetter;

    private String resumeUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.SUBMITTED;

    private String latestFeedback;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id")
    @Builder.Default
    private List<ReviewNote> reviewNotes = new ArrayList<>();

    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

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

    public static JobApplicationBuilder builder() {
        return new JobApplicationBuilder();
    }

    public static class JobApplicationBuilder {
        private Long id;
        private Long candidateId;
        private String candidateName;
        private String candidateEmail;
        private Long jobId;
        private String jobTitle;
        private String company;
        private String coverLetter;
        private String resumeUrl;
        private ApplicationStatus status = ApplicationStatus.SUBMITTED;
        private String latestFeedback;
        private List<ReviewNote> reviewNotes = new ArrayList<>();
        private LocalDateTime appliedAt;
        private LocalDateTime updatedAt;

        public JobApplicationBuilder id(Long id) { this.id = id; return this; }
        public JobApplicationBuilder candidateId(Long candidateId) { this.candidateId = candidateId; return this; }
        public JobApplicationBuilder candidateName(String candidateName) { this.candidateName = candidateName; return this; }
        public JobApplicationBuilder candidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; return this; }
        public JobApplicationBuilder jobId(Long jobId) { this.jobId = jobId; return this; }
        public JobApplicationBuilder jobTitle(String jobTitle) { this.jobTitle = jobTitle; return this; }
        public JobApplicationBuilder company(String company) { this.company = company; return this; }
        public JobApplicationBuilder coverLetter(String coverLetter) { this.coverLetter = coverLetter; return this; }
        public JobApplicationBuilder resumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; return this; }
        public JobApplicationBuilder status(ApplicationStatus status) { this.status = status; return this; }
        public JobApplicationBuilder latestFeedback(String latestFeedback) { this.latestFeedback = latestFeedback; return this; }
        public JobApplicationBuilder reviewNotes(List<ReviewNote> reviewNotes) { this.reviewNotes = reviewNotes; return this; }
        public JobApplicationBuilder appliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; return this; }
        public JobApplicationBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public JobApplication build() {
            JobApplication app = new JobApplication();
            app.id = this.id;
            app.candidateId = this.candidateId;
            app.candidateName = this.candidateName;
            app.candidateEmail = this.candidateEmail;
            app.jobId = this.jobId;
            app.jobTitle = this.jobTitle;
            app.company = this.company;
            app.coverLetter = this.coverLetter;
            app.resumeUrl = this.resumeUrl;
            app.status = this.status != null ? this.status : ApplicationStatus.SUBMITTED;
            app.latestFeedback = this.latestFeedback;
            app.reviewNotes = this.reviewNotes != null ? this.reviewNotes : new ArrayList<>();
            app.appliedAt = this.appliedAt;
            app.updatedAt = this.updatedAt;
            return app;
        }
    }
}
