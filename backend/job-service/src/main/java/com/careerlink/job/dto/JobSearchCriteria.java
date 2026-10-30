package com.careerlink.job.dto;

import com.careerlink.job.entity.EmploymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobSearchCriteria {
    private String query;
    private String location;
    private EmploymentType employmentType;
    private Double minSalary;
    private String skill;

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public EmploymentType getEmploymentType() { return employmentType; }
    public void setEmploymentType(EmploymentType employmentType) { this.employmentType = employmentType; }

    public Double getMinSalary() { return minSalary; }
    public void setMinSalary(Double minSalary) { this.minSalary = minSalary; }

    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }

    public static JobSearchCriteriaBuilder builder() {
        return new JobSearchCriteriaBuilder();
    }

    public static class JobSearchCriteriaBuilder {
        private String query;
        private String location;
        private EmploymentType employmentType;
        private Double minSalary;
        private String skill;

        public JobSearchCriteriaBuilder query(String query) { this.query = query; return this; }
        public JobSearchCriteriaBuilder location(String location) { this.location = location; return this; }
        public JobSearchCriteriaBuilder employmentType(EmploymentType employmentType) { this.employmentType = employmentType; return this; }
        public JobSearchCriteriaBuilder minSalary(Double minSalary) { this.minSalary = minSalary; return this; }
        public JobSearchCriteriaBuilder skill(String skill) { this.skill = skill; return this; }

        public JobSearchCriteria build() {
            JobSearchCriteria c = new JobSearchCriteria();
            c.query = this.query;
            c.location = this.location;
            c.employmentType = this.employmentType;
            c.minSalary = this.minSalary;
            c.skill = this.skill;
            return c;
        }
    }
}
