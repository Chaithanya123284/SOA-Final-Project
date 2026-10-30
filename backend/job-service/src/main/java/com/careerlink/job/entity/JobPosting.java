package com.careerlink.job.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "job_postings")
@Getter
@Setter
@Builder
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String company;

    @NotBlank
    private String location;

    @Enumerated(EnumType.STRING)
    @NotNull
    private EmploymentType employmentType;

    @Column(length = 4000)
    private String description;

    @Column(length = 2000)
    private String requirements;

    private Double minSalary;
    private Double maxSalary;
    private String currency;

    private Integer experienceRequiredYears;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_required_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill")
    @Builder.Default
    private List<String> requiredSkills = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private JobStatus status = JobStatus.OPEN;

    @NotNull
    private Long recruiterId;

    private String recruiterEmail;

    private Integer applicantsCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public JobPosting() {
    }

    public JobPosting(Long id, String title, String company, String location, EmploymentType employmentType,
                      String description, String requirements, Double minSalary, Double maxSalary, String currency,
                      Integer experienceRequiredYears, List<String> requiredSkills, JobStatus status,
                      Long recruiterId, String recruiterEmail, Integer applicantsCount,
                      LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.company = company;
        this.location = location;
        this.employmentType = employmentType;
        this.description = description;
        this.requirements = requirements;
        this.minSalary = minSalary;
        this.maxSalary = maxSalary;
        this.currency = currency;
        this.experienceRequiredYears = experienceRequiredYears;
        this.requiredSkills = requiredSkills != null ? requiredSkills : new ArrayList<>();
        this.status = status != null ? status : JobStatus.OPEN;
        this.recruiterId = recruiterId;
        this.recruiterEmail = recruiterEmail;
        this.applicantsCount = applicantsCount != null ? applicantsCount : 0;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (applicantsCount == null) {
            applicantsCount = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public EmploymentType getEmploymentType() { return employmentType; }
    public void setEmploymentType(EmploymentType employmentType) { this.employmentType = employmentType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRequirements() { return requirements; }
    public void setRequirements(String requirements) { this.requirements = requirements; }

    public Double getMinSalary() { return minSalary; }
    public void setMinSalary(Double minSalary) { this.minSalary = minSalary; }

    public Double getMaxSalary() { return maxSalary; }
    public void setMaxSalary(Double maxSalary) { this.maxSalary = maxSalary; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Integer getExperienceRequiredYears() { return experienceRequiredYears; }
    public void setExperienceRequiredYears(Integer experienceRequiredYears) { this.experienceRequiredYears = experienceRequiredYears; }

    public List<String> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; }

    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }

    public Long getRecruiterId() { return recruiterId; }
    public void setRecruiterId(Long recruiterId) { this.recruiterId = recruiterId; }

    public String getRecruiterEmail() { return recruiterEmail; }
    public void setRecruiterEmail(String recruiterEmail) { this.recruiterEmail = recruiterEmail; }

    public Integer getApplicantsCount() { return applicantsCount; }
    public void setApplicantsCount(Integer applicantsCount) { this.applicantsCount = applicantsCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static JobPostingBuilder builder() {
        return new JobPostingBuilder();
    }

    public static class JobPostingBuilder {
        private Long id;
        private String title;
        private String company;
        private String location;
        private EmploymentType employmentType;
        private String description;
        private String requirements;
        private Double minSalary;
        private Double maxSalary;
        private String currency = "USD";
        private Integer experienceRequiredYears;
        private List<String> requiredSkills = new ArrayList<>();
        private JobStatus status = JobStatus.OPEN;
        private Long recruiterId;
        private String recruiterEmail;
        private Integer applicantsCount = 0;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public JobPostingBuilder id(Long id) { this.id = id; return this; }
        public JobPostingBuilder title(String title) { this.title = title; return this; }
        public JobPostingBuilder company(String company) { this.company = company; return this; }
        public JobPostingBuilder location(String location) { this.location = location; return this; }
        public JobPostingBuilder employmentType(EmploymentType employmentType) { this.employmentType = employmentType; return this; }
        public JobPostingBuilder description(String description) { this.description = description; return this; }
        public JobPostingBuilder requirements(String requirements) { this.requirements = requirements; return this; }
        public JobPostingBuilder minSalary(Double minSalary) { this.minSalary = minSalary; return this; }
        public JobPostingBuilder maxSalary(Double maxSalary) { this.maxSalary = maxSalary; return this; }
        public JobPostingBuilder currency(String currency) { this.currency = currency; return this; }
        public JobPostingBuilder experienceRequiredYears(Integer experienceRequiredYears) { this.experienceRequiredYears = experienceRequiredYears; return this; }
        public JobPostingBuilder requiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; return this; }
        public JobPostingBuilder status(JobStatus status) { this.status = status; return this; }
        public JobPostingBuilder recruiterId(Long recruiterId) { this.recruiterId = recruiterId; return this; }
        public JobPostingBuilder recruiterEmail(String recruiterEmail) { this.recruiterEmail = recruiterEmail; return this; }
        public JobPostingBuilder applicantsCount(Integer applicantsCount) { this.applicantsCount = applicantsCount; return this; }
        public JobPostingBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public JobPostingBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public JobPosting build() {
            JobPosting jp = new JobPosting();
            jp.id = this.id;
            jp.title = this.title;
            jp.company = this.company;
            jp.location = this.location;
            jp.employmentType = this.employmentType;
            jp.description = this.description;
            jp.requirements = this.requirements;
            jp.minSalary = this.minSalary;
            jp.maxSalary = this.maxSalary;
            jp.currency = this.currency != null ? this.currency : "USD";
            jp.experienceRequiredYears = this.experienceRequiredYears;
            jp.requiredSkills = this.requiredSkills != null ? this.requiredSkills : new ArrayList<>();
            jp.status = this.status != null ? this.status : JobStatus.OPEN;
            jp.recruiterId = this.recruiterId;
            jp.recruiterEmail = this.recruiterEmail;
            jp.applicantsCount = this.applicantsCount != null ? this.applicantsCount : 0;
            jp.createdAt = this.createdAt;
            jp.updatedAt = this.updatedAt;
            return jp;
        }
    }
}
