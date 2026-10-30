package com.careerlink.profile.entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
// @AllArgsConstructor -- removed: conflicts with explicit all-args constructor below
@Builder
public class Education {
    private String institution;
    private String degree;
    private String fieldOfStudy;
    private String startYear;
    private String endYear;
    private String grade;

    // ── Explicit getters (STS/ECJ compatibility — Lombok not processed without plugin) ──
    public String getInstitution() { return institution; }
    public String getDegree() { return degree; }
    public String getFieldOfStudy() { return fieldOfStudy; }
    public String getStartYear() { return startYear; }
    public String getEndYear() { return endYear; }
    public String getGrade() { return grade; }

    // ── Explicit setters ──
    public void setInstitution(String institution) { this.institution = institution; }
    public void setDegree(String degree) { this.degree = degree; }
    public void setFieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; }
    public void setStartYear(String startYear) { this.startYear = startYear; }
    public void setEndYear(String endYear) { this.endYear = endYear; }
    public void setGrade(String grade) { this.grade = grade; }

    // ── Explicit all-args constructor ──
    public Education(String institution, String degree, String fieldOfStudy,
                     String startYear, String endYear, String grade) {
        this.institution = institution;
        this.degree = degree;
        this.fieldOfStudy = fieldOfStudy;
        this.startYear = startYear;
        this.endYear = endYear;
        this.grade = grade;
    }

    // ── Explicit builder ──
    public static EducationBuilder builder() { return new EducationBuilder(); }

    public static class EducationBuilder {
        private String institution;
        private String degree;
        private String fieldOfStudy;
        private String startYear;
        private String endYear;
        private String grade;

        EducationBuilder() {}

        public EducationBuilder institution(String institution) { this.institution = institution; return this; }
        public EducationBuilder degree(String degree) { this.degree = degree; return this; }
        public EducationBuilder fieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; return this; }
        public EducationBuilder startYear(String startYear) { this.startYear = startYear; return this; }
        public EducationBuilder endYear(String endYear) { this.endYear = endYear; return this; }
        public EducationBuilder grade(String grade) { this.grade = grade; return this; }

        public Education build() {
            return new Education(institution, degree, fieldOfStudy, startYear, endYear, grade);
        }
    }
}
