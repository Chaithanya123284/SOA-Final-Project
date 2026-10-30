package com.careerlink.job.dto;

import com.careerlink.job.entity.EmploymentType;
import com.careerlink.job.entity.JobStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPostingRequest {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Company name is required")
    private String company;

    @NotBlank(message = "Job location is required")
    private String location;

    @NotNull(message = "Employment type is required")
    private EmploymentType employmentType;

    private String description;
    private String requirements;

    private Double minSalary;
    private Double maxSalary;
    @Builder.Default
    private String currency = "USD";

    private Integer experienceRequiredYears;
    private List<String> requiredSkills;

    @Builder.Default
    private JobStatus status = JobStatus.OPEN;

    @NotNull(message = "Recruiter ID is required")
    private Long recruiterId;

    private String recruiterEmail;

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

    public static JobPostingRequestBuilder builder() {
        return new JobPostingRequestBuilder();
    }

    public static class JobPostingRequestBuilder {
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
        private List<String> requiredSkills;
        private JobStatus status = JobStatus.OPEN;
        private Long recruiterId;
        private String recruiterEmail;

        public JobPostingRequestBuilder title(String title) { this.title = title; return this; }
        public JobPostingRequestBuilder company(String company) { this.company = company; return this; }
        public JobPostingRequestBuilder location(String location) { this.location = location; return this; }
        public JobPostingRequestBuilder employmentType(EmploymentType employmentType) { this.employmentType = employmentType; return this; }
        public JobPostingRequestBuilder description(String description) { this.description = description; return this; }
        public JobPostingRequestBuilder requirements(String requirements) { this.requirements = requirements; return this; }
        public JobPostingRequestBuilder minSalary(Double minSalary) { this.minSalary = minSalary; return this; }
        public JobPostingRequestBuilder maxSalary(Double maxSalary) { this.maxSalary = maxSalary; return this; }
        public JobPostingRequestBuilder currency(String currency) { this.currency = currency; return this; }
        public JobPostingRequestBuilder experienceRequiredYears(Integer experienceRequiredYears) { this.experienceRequiredYears = experienceRequiredYears; return this; }
        public JobPostingRequestBuilder requiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; return this; }
        public JobPostingRequestBuilder status(JobStatus status) { this.status = status; return this; }
        public JobPostingRequestBuilder recruiterId(Long recruiterId) { this.recruiterId = recruiterId; return this; }
        public JobPostingRequestBuilder recruiterEmail(String recruiterEmail) { this.recruiterEmail = recruiterEmail; return this; }

        public JobPostingRequest build() {
            JobPostingRequest req = new JobPostingRequest();
            req.title = this.title;
            req.company = this.company;
            req.location = this.location;
            req.employmentType = this.employmentType;
            req.description = this.description;
            req.requirements = this.requirements;
            req.minSalary = this.minSalary;
            req.maxSalary = this.maxSalary;
            req.currency = this.currency != null ? this.currency : "USD";
            req.experienceRequiredYears = this.experienceRequiredYears;
            req.requiredSkills = this.requiredSkills;
            req.status = this.status != null ? this.status : JobStatus.OPEN;
            req.recruiterId = this.recruiterId;
            req.recruiterEmail = this.recruiterEmail;
            return req;
        }
    }
}
