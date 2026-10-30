package com.careerlink.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileSummaryDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String headline;
    private String resumeUrl;
    private List<String> skills;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public static ProfileSummaryDtoBuilder builder() {
        return new ProfileSummaryDtoBuilder();
    }

    public static class ProfileSummaryDtoBuilder {
        private Long id;
        private Long userId;
        private String fullName;
        private String email;
        private String headline;
        private String resumeUrl;
        private List<String> skills;

        public ProfileSummaryDtoBuilder id(Long id) { this.id = id; return this; }
        public ProfileSummaryDtoBuilder userId(Long userId) { this.userId = userId; return this; }
        public ProfileSummaryDtoBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public ProfileSummaryDtoBuilder email(String email) { this.email = email; return this; }
        public ProfileSummaryDtoBuilder headline(String headline) { this.headline = headline; return this; }
        public ProfileSummaryDtoBuilder resumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; return this; }
        public ProfileSummaryDtoBuilder skills(List<String> skills) { this.skills = skills; return this; }

        public ProfileSummaryDto build() {
            ProfileSummaryDto dto = new ProfileSummaryDto();
            dto.id = this.id;
            dto.userId = this.userId;
            dto.fullName = this.fullName;
            dto.email = this.email;
            dto.headline = this.headline;
            dto.resumeUrl = this.resumeUrl;
            dto.skills = this.skills;
            return dto;
        }
    }
}
