package com.careerlink.profile.dto;

import com.careerlink.profile.entity.Education;
import com.careerlink.profile.entity.Experience;
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
public class ProfileRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String headline;
    private String summary;
    private List<String> skills;
    private List<Experience> experiences;
    private List<Education> educations;
    private String resumeUrl;
    private String resumeText;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    private Integer yearsOfExperience;
    private String currentCompany;
    private String currentDesignation;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public List<Experience> getExperiences() { return experiences; }
    public void setExperiences(List<Experience> experiences) { this.experiences = experiences; }

    public List<Education> getEducations() { return educations; }
    public void setEducations(List<Education> educations) { this.educations = educations; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getResumeText() { return resumeText; }
    public void setResumeText(String resumeText) { this.resumeText = resumeText; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }

    public Integer getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }

    public String getCurrentCompany() { return currentCompany; }
    public void setCurrentCompany(String currentCompany) { this.currentCompany = currentCompany; }

    public String getCurrentDesignation() { return currentDesignation; }
    public void setCurrentDesignation(String currentDesignation) { this.currentDesignation = currentDesignation; }

    public static ProfileRequestBuilder builder() {
        return new ProfileRequestBuilder();
    }

    public static class ProfileRequestBuilder {
        private Long userId;
        private String fullName;
        private String email;
        private String phone;
        private String location;
        private String headline;
        private String summary;
        private List<String> skills;
        private List<Experience> experiences;
        private List<Education> educations;
        private String resumeUrl;
        private String resumeText;
        private String githubUrl;
        private String linkedinUrl;
        private String portfolioUrl;
        private Integer yearsOfExperience;
        private String currentCompany;
        private String currentDesignation;

        public ProfileRequestBuilder userId(Long userId) { this.userId = userId; return this; }
        public ProfileRequestBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public ProfileRequestBuilder email(String email) { this.email = email; return this; }
        public ProfileRequestBuilder phone(String phone) { this.phone = phone; return this; }
        public ProfileRequestBuilder location(String location) { this.location = location; return this; }
        public ProfileRequestBuilder headline(String headline) { this.headline = headline; return this; }
        public ProfileRequestBuilder summary(String summary) { this.summary = summary; return this; }
        public ProfileRequestBuilder skills(List<String> skills) { this.skills = skills; return this; }
        public ProfileRequestBuilder experiences(List<Experience> experiences) { this.experiences = experiences; return this; }
        public ProfileRequestBuilder educations(List<Education> educations) { this.educations = educations; return this; }
        public ProfileRequestBuilder resumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; return this; }
        public ProfileRequestBuilder resumeText(String resumeText) { this.resumeText = resumeText; return this; }
        public ProfileRequestBuilder githubUrl(String githubUrl) { this.githubUrl = githubUrl; return this; }
        public ProfileRequestBuilder linkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; return this; }
        public ProfileRequestBuilder portfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; return this; }
        public ProfileRequestBuilder yearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; return this; }
        public ProfileRequestBuilder currentCompany(String currentCompany) { this.currentCompany = currentCompany; return this; }
        public ProfileRequestBuilder currentDesignation(String currentDesignation) { this.currentDesignation = currentDesignation; return this; }

        public ProfileRequest build() {
            ProfileRequest req = new ProfileRequest();
            req.userId = this.userId;
            req.fullName = this.fullName;
            req.email = this.email;
            req.phone = this.phone;
            req.location = this.location;
            req.headline = this.headline;
            req.summary = this.summary;
            req.skills = this.skills;
            req.experiences = this.experiences;
            req.educations = this.educations;
            req.resumeUrl = this.resumeUrl;
            req.resumeText = this.resumeText;
            req.githubUrl = this.githubUrl;
            req.linkedinUrl = this.linkedinUrl;
            req.portfolioUrl = this.portfolioUrl;
            req.yearsOfExperience = this.yearsOfExperience;
            req.currentCompany = this.currentCompany;
            req.currentDesignation = this.currentDesignation;
            return req;
        }
    }
}
