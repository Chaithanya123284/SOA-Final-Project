package com.careerlink.application.dto;

import com.careerlink.application.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Builder
@AllArgsConstructor
public class StatusUpdateRequest {

    @NotNull(message = "New application status is required")
    private ApplicationStatus status;

    private Long recruiterId;
    private String recruiterName;
    private String feedbackNote;

    public StatusUpdateRequest() {
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public Long getRecruiterId() {
        return recruiterId;
    }

    public void setRecruiterId(Long recruiterId) {
        this.recruiterId = recruiterId;
    }

    public String getRecruiterName() {
        return recruiterName;
    }

    public void setRecruiterName(String recruiterName) {
        this.recruiterName = recruiterName;
    }

    public String getFeedbackNote() {
        return feedbackNote;
    }

    public void setFeedbackNote(String feedbackNote) {
        this.feedbackNote = feedbackNote;
    }

    public static StatusUpdateRequestBuilder builder() {
        return new StatusUpdateRequestBuilder();
    }

    public static class StatusUpdateRequestBuilder {
        private ApplicationStatus status;
        private Long recruiterId;
        private String recruiterName;
        private String feedbackNote;

        public StatusUpdateRequestBuilder status(ApplicationStatus status) { this.status = status; return this; }
        public StatusUpdateRequestBuilder recruiterId(Long recruiterId) { this.recruiterId = recruiterId; return this; }
        public StatusUpdateRequestBuilder recruiterName(String recruiterName) { this.recruiterName = recruiterName; return this; }
        public StatusUpdateRequestBuilder feedbackNote(String feedbackNote) { this.feedbackNote = feedbackNote; return this; }

        public StatusUpdateRequest build() {
            StatusUpdateRequest req = new StatusUpdateRequest();
            req.status = this.status;
            req.recruiterId = this.recruiterId;
            req.recruiterName = this.recruiterName;
            req.feedbackNote = this.feedbackNote;
            return req;
        }
    }
}