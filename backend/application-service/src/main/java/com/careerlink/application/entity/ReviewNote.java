package com.careerlink.application.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "review_notes")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long recruiterId;
    private String recruiterName;

    @Column(length = 2000)
    private String note;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRecruiterId() { return recruiterId; }
    public void setRecruiterId(Long recruiterId) { this.recruiterId = recruiterId; }

    public String getRecruiterName() { return recruiterName; }
    public void setRecruiterName(String recruiterName) { this.recruiterName = recruiterName; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static ReviewNoteBuilder builder() {
        return new ReviewNoteBuilder();
    }

    public static class ReviewNoteBuilder {
        private Long id;
        private Long recruiterId;
        private String recruiterName;
        private String note;
        private LocalDateTime createdAt;

        public ReviewNoteBuilder id(Long id) { this.id = id; return this; }
        public ReviewNoteBuilder recruiterId(Long recruiterId) { this.recruiterId = recruiterId; return this; }
        public ReviewNoteBuilder recruiterName(String recruiterName) { this.recruiterName = recruiterName; return this; }
        public ReviewNoteBuilder note(String note) { this.note = note; return this; }
        public ReviewNoteBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ReviewNote build() {
            ReviewNote rn = new ReviewNote();
            rn.id = this.id;
            rn.recruiterId = this.recruiterId;
            rn.recruiterName = this.recruiterName;
            rn.note = this.note;
            rn.createdAt = this.createdAt;
            return rn;
        }
    }
}
