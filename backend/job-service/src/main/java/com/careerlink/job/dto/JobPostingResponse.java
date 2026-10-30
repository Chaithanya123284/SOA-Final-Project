package com.careerlink.job.dto;

import com.careerlink.job.entity.EmploymentType;
import com.careerlink.job.entity.JobStatus;
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
public class JobPostingResponse {
    private Long id;
    private String title;
    private String company;
    private String location;
    private EmploymentType employmentType;
    private String description;
    private String requirements;
    private Double minSalary;
    private Double maxSalary;
    private String currency;
    private Integer experienceRequiredYears;
    private List<String> requiredSkills;
    private JobStatus status;
    private Long recruiterId;
    private String recruiterEmail;
    private Integer applicantsCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

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

    public static JobPostingResponseBuilder builder() {
        return new JobPostingResponseBuilder();
    }

    public static class JobPostingResponseBuilder {
        private Long id;
        private String title;
        private String company;
        private String location;
        private EmploymentType employmentType;
        private String description;
        private String requirements;
        private Double minSalary;
        private Double maxSalary;
        private String currency;
        private Integer experienceRequiredYears;
        private List<String> requiredSkills;
        private JobStatus status;
        private Long recruiterId;
        private String recruiterEmail;
        private Integer applicantsCount;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public JobPostingResponseBuilder id(Long id) { this.id = id; return this; }
        public JobPostingResponseBuilder title(String title) { this.title = title; return this; }
        public JobPostingResponseBuilder company(String company) { this.company = company; return this; }
        public JobPostingResponseBuilder location(String location) { this.location = location; return this; }
        public JobPostingResponseBuilder employmentType(EmploymentType employmentType) { this.employmentType = employmentType; return this; }
        public JobPostingResponseBuilder description(String description) { this.description = description; return this; }
        public JobPostingResponseBuilder requirements(String requirements) { this.requirements = requirements; return this; }
        public JobPostingResponseBuilder minSalary(Double minSalary) { this.minSalary = minSalary; return this; }
        public JobPostingResponseBuilder maxSalary(Double maxSalary) { this.maxSalary = maxSalary; return this; }
        public JobPostingResponseBuilder currency(String currency) { this.currency = currency; return this; }
        public JobPostingResponseBuilder experienceRequiredYears(Integer experienceRequiredYears) { this.experienceRequiredYears = experienceRequiredYears; return this; }
        public JobPostingResponseBuilder requiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; return this; }
        public JobPostingResponseBuilder status(JobStatus status) { this.status = status; return this; }
        public JobPostingResponseBuilder recruiterId(Long recruiterId) { this.recruiterId = recruiterId; return this; }
        public JobPostingResponseBuilder recruiterEmail(String recruiterEmail) { this.recruiterEmail = recruiterEmail; return this; }
        public JobPostingResponseBuilder applicantsCount(Integer applicantsCount) { this.applicantsCount = applicantsCount; return this; }
        public JobPostingResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public JobPostingResponseBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public JobPostingResponse build() {
            JobPostingResponse res = new JobPostingResponse();
            res.id = this.id;
            res.title = this.title;
            res.company = this.company;
            res.location = this.location;
            res.employmentType = this.employmentType;
            res.description = this.description;
            res.requirements = this.requirements;
            res.minSalary = this.minSalary;
            res.maxSalary = this.maxSalary;
            res.currency = this.currency;
            res.experienceRequiredYears = this.experienceRequiredYears;
            res.requiredSkills = this.requiredSkills;
            res.status = this.status;
            res.recruiterId = this.recruiterId;
            res.recruiterEmail = this.recruiterEmail;
            res.applicantsCount = this.applicantsCount;
            res.createdAt = this.createdAt;
            res.updatedAt = this.updatedAt;
            return res;
        }
    }
}
