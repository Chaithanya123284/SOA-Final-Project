package com.careerlink.profile.entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
// @AllArgsConstructor -- removed: conflicts with explicit all-args constructor below
@Builder
public class Experience {
    private String company;
    private String role;
    private String startDate;
    private String endDate;
    private boolean currentlyWorking;
    private String description;

    // ── Explicit getters (STS/ECJ compatibility — Lombok not processed without plugin) ──
    public String getCompany() { return company; }
    public String getRole() { return role; }
    public String getStartDate() { return startDate; }
    public String getEndDate() { return endDate; }
    public boolean isCurrentlyWorking() { return currentlyWorking; }
    public String getDescription() { return description; }

    // ── Explicit setters ──
    public void setCompany(String company) { this.company = company; }
    public void setRole(String role) { this.role = role; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    public void setCurrentlyWorking(boolean currentlyWorking) { this.currentlyWorking = currentlyWorking; }
    public void setDescription(String description) { this.description = description; }

    // ── Explicit all-args constructor ──
    public Experience(String company, String role, String startDate, String endDate,
                      boolean currentlyWorking, String description) {
        this.company = company;
        this.role = role;
        this.startDate = startDate;
        this.endDate = endDate;
        this.currentlyWorking = currentlyWorking;
        this.description = description;
    }

    // ── Explicit builder ──
    public static ExperienceBuilder builder() { return new ExperienceBuilder(); }

    public static class ExperienceBuilder {
        private String company;
        private String role;
        private String startDate;
        private String endDate;
        private boolean currentlyWorking;
        private String description;

        ExperienceBuilder() {}

        public ExperienceBuilder company(String company) { this.company = company; return this; }
        public ExperienceBuilder role(String role) { this.role = role; return this; }
        public ExperienceBuilder startDate(String startDate) { this.startDate = startDate; return this; }
        public ExperienceBuilder endDate(String endDate) { this.endDate = endDate; return this; }
        public ExperienceBuilder currentlyWorking(boolean currentlyWorking) { this.currentlyWorking = currentlyWorking; return this; }
        public ExperienceBuilder description(String description) { this.description = description; return this; }

        public Experience build() {
            return new Experience(company, role, startDate, endDate, currentlyWorking, description);
        }
    }
}
