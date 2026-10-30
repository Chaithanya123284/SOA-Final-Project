package com.careerlink.application.event;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationNotificationEvent {
    private String eventId;
    private String eventType;
    private Long applicationId;
    private Long candidateId;
    private String candidateEmail;
    private Long jobId;
    private String jobTitle;
    private String previousStatus;
    private String newStatus;
    private String feedback;
    private LocalDateTime timestamp;

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public Long getCandidateId() { return candidateId; }
    public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }

    public String getCandidateEmail() { return candidateEmail; }
    public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(String previousStatus) { this.previousStatus = previousStatus; }

    public String getNewStatus() { return newStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public static ApplicationNotificationEventBuilder builder() {
        return new ApplicationNotificationEventBuilder();
    }

    public static class ApplicationNotificationEventBuilder {
        private String eventId;
        private String eventType;
        private Long applicationId;
        private Long candidateId;
        private String candidateEmail;
        private Long jobId;
        private String jobTitle;
        private String previousStatus;
        private String newStatus;
        private String feedback;
        private LocalDateTime timestamp;

        public ApplicationNotificationEventBuilder eventId(String eventId) { this.eventId = eventId; return this; }
        public ApplicationNotificationEventBuilder eventType(String eventType) { this.eventType = eventType; return this; }
        public ApplicationNotificationEventBuilder applicationId(Long applicationId) { this.applicationId = applicationId; return this; }
        public ApplicationNotificationEventBuilder candidateId(Long candidateId) { this.candidateId = candidateId; return this; }
        public ApplicationNotificationEventBuilder candidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; return this; }
        public ApplicationNotificationEventBuilder jobId(Long jobId) { this.jobId = jobId; return this; }
        public ApplicationNotificationEventBuilder jobTitle(String jobTitle) { this.jobTitle = jobTitle; return this; }
        public ApplicationNotificationEventBuilder previousStatus(String previousStatus) { this.previousStatus = previousStatus; return this; }
        public ApplicationNotificationEventBuilder newStatus(String newStatus) { this.newStatus = newStatus; return this; }
        public ApplicationNotificationEventBuilder feedback(String feedback) { this.feedback = feedback; return this; }
        public ApplicationNotificationEventBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public ApplicationNotificationEvent build() {
            ApplicationNotificationEvent event = new ApplicationNotificationEvent();
            event.eventId = this.eventId;
            event.eventType = this.eventType;
            event.applicationId = this.applicationId;
            event.candidateId = this.candidateId;
            event.candidateEmail = this.candidateEmail;
            event.jobId = this.jobId;
            event.jobTitle = this.jobTitle;
            event.previousStatus = this.previousStatus;
            event.newStatus = this.newStatus;
            event.feedback = this.feedback;
            event.timestamp = this.timestamp;
            return event;
        }
    }
}
