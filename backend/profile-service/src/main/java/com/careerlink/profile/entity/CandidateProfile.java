package com.careerlink.profile.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "candidate_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {

    @Id
    private String id;

    @Indexed(unique = true)
    private Long userId;

    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String headline;
    private String summary;

    @Builder.Default
    private List<String> skills = new ArrayList<>();

    @Builder.Default
    private List<Experience> experiences = new ArrayList<>();

    @Builder.Default
    private List<Education> educations = new ArrayList<>();

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

    public static CandidateProfileBuilder builder() {
        return new CandidateProfileBuilder();
    }

    public static class CandidateProfileBuilder {
        private String id;
        private Long userId;
        private String fullName;
        private String email;
        private String phone;
        private String location;
        private String headline;
        private String summary;
        private List<String> skills = new ArrayList<>();
        private List<Experience> experiences = new ArrayList<>();
        private List<Education> educations = new ArrayList<>();
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

        public CandidateProfileBuilder id(String id) { this.id = id; return this; }
        public CandidateProfileBuilder userId(Long userId) { this.userId = userId; return this; }
        public CandidateProfileBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public CandidateProfileBuilder email(String email) { this.email = email; return this; }
        public CandidateProfileBuilder phone(String phone) { this.phone = phone; return this; }
        public CandidateProfileBuilder location(String location) { this.location = location; return this; }
        public CandidateProfileBuilder headline(String headline) { this.headline = headline; return this; }
        public CandidateProfileBuilder summary(String summary) { this.summary = summary; return this; }
        public CandidateProfileBuilder skills(List<String> skills) { this.skills = skills; return this; }
        public CandidateProfileBuilder experiences(List<Experience> experiences) { this.experiences = experiences; return this; }
        public CandidateProfileBuilder educations(List<Education> educations) { this.educations = educations; return this; }
        public CandidateProfileBuilder resumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; return this; }
        public CandidateProfileBuilder resumeText(String resumeText) { this.resumeText = resumeText; return this; }
        public CandidateProfileBuilder githubUrl(String githubUrl) { this.githubUrl = githubUrl; return this; }
        public CandidateProfileBuilder linkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; return this; }
        public CandidateProfileBuilder portfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; return this; }
        public CandidateProfileBuilder yearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; return this; }
        public CandidateProfileBuilder currentCompany(String currentCompany) { this.currentCompany = currentCompany; return this; }
        public CandidateProfileBuilder currentDesignation(String currentDesignation) { this.currentDesignation = currentDesignation; return this; }
        public CandidateProfileBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public CandidateProfileBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public CandidateProfile build() {
            CandidateProfile cp = new CandidateProfile();
            cp.id = this.id;
            cp.userId = this.userId;
            cp.fullName = this.fullName;
            cp.email = this.email;
            cp.phone = this.phone;
            cp.location = this.location;
            cp.headline = this.headline;
            cp.summary = this.summary;
            cp.skills = this.skills != null ? this.skills : new ArrayList<>();
            cp.experiences = this.experiences != null ? this.experiences : new ArrayList<>();
            cp.educations = this.educations != null ? this.educations : new ArrayList<>();
            cp.resumeUrl = this.resumeUrl;
            cp.resumeText = this.resumeText;
            cp.githubUrl = this.githubUrl;
            cp.linkedinUrl = this.linkedinUrl;
            cp.portfolioUrl = this.portfolioUrl;
            cp.yearsOfExperience = this.yearsOfExperience;
            cp.currentCompany = this.currentCompany;
            cp.currentDesignation = this.currentDesignation;
            cp.createdAt = this.createdAt;
            cp.updatedAt = this.updatedAt;
            return cp;
        }
    }
}
