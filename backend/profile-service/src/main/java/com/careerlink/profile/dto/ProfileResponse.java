package com.careerlink.profile.dto;

import com.careerlink.profile.entity.Education;
import com.careerlink.profile.entity.Experience;
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
public class ProfileResponse {
    private String id;
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
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static ProfileResponseBuilder builder() {
        return new ProfileResponseBuilder();
    }

    public static class ProfileResponseBuilder {
        private String id;
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
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ProfileResponseBuilder id(String id) { this.id = id; return this; }
        public ProfileResponseBuilder userId(Long userId) { this.userId = userId; return this; }
        public ProfileResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public ProfileResponseBuilder email(String email) { this.email = email; return this; }
        public ProfileResponseBuilder phone(String phone) { this.phone = phone; return this; }
        public ProfileResponseBuilder location(String location) { this.location = location; return this; }
        public ProfileResponseBuilder headline(String headline) { this.headline = headline; return this; }
        public ProfileResponseBuilder summary(String summary) { this.summary = summary; return this; }
        public ProfileResponseBuilder skills(List<String> skills) { this.skills = skills; return this; }
        public ProfileResponseBuilder experiences(List<Experience> experiences) { this.experiences = experiences; return this; }
        public ProfileResponseBuilder educations(List<Education> educations) { this.educations = educations; return this; }
        public ProfileResponseBuilder resumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; return this; }
        public ProfileResponseBuilder resumeText(String resumeText) { this.resumeText = resumeText; return this; }
        public ProfileResponseBuilder githubUrl(String githubUrl) { this.githubUrl = githubUrl; return this; }
        public ProfileResponseBuilder linkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; return this; }
        public ProfileResponseBuilder portfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; return this; }
        public ProfileResponseBuilder yearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; return this; }
        public ProfileResponseBuilder currentCompany(String currentCompany) { this.currentCompany = currentCompany; return this; }
        public ProfileResponseBuilder currentDesignation(String currentDesignation) { this.currentDesignation = currentDesignation; return this; }
        public ProfileResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ProfileResponseBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public ProfileResponse build() {
            ProfileResponse res = new ProfileResponse();
            res.id = this.id;
            res.userId = this.userId;
            res.fullName = this.fullName;
            res.email = this.email;
            res.phone = this.phone;
            res.location = this.location;
            res.headline = this.headline;
            res.summary = this.summary;
            res.skills = this.skills;
            res.experiences = this.experiences;
            res.educations = this.educations;
            res.resumeUrl = this.resumeUrl;
            res.resumeText = this.resumeText;
            res.githubUrl = this.githubUrl;
            res.linkedinUrl = this.linkedinUrl;
            res.portfolioUrl = this.portfolioUrl;
            res.yearsOfExperience = this.yearsOfExperience;
            res.currentCompany = this.currentCompany;
            res.currentDesignation = this.currentDesignation;
            res.createdAt = this.createdAt;
            res.updatedAt = this.updatedAt;
            return res;
        }
    }
}
