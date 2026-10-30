package com.careerlink.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobSummaryDto {
    private Long id;
    private String title;
    private String company;
    private String location;
    private String status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public static JobSummaryDtoBuilder builder() {
        return new JobSummaryDtoBuilder();
    }

    public static class JobSummaryDtoBuilder {
        private Long id;
        private String title;
        private String company;
        private String location;
        private String status;

        public JobSummaryDtoBuilder id(Long id) { this.id = id; return this; }
        public JobSummaryDtoBuilder title(String title) { this.title = title; return this; }
        public JobSummaryDtoBuilder company(String company) { this.company = company; return this; }
        public JobSummaryDtoBuilder location(String location) { this.location = location; return this; }
        public JobSummaryDtoBuilder status(String status) { this.status = status; return this; }

        public JobSummaryDto build() {
            JobSummaryDto dto = new JobSummaryDto();
            dto.id = this.id;
            dto.title = this.title;
            dto.company = this.company;
            dto.location = this.location;
            dto.status = this.status;
            return dto;
        }
    }
}
