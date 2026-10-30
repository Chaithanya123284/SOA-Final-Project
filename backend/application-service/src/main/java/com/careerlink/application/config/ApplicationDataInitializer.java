package com.careerlink.application.config;

import com.careerlink.application.entity.ApplicationStatus;
import com.careerlink.application.entity.JobApplication;
import com.careerlink.application.entity.ReviewNote;
import com.careerlink.application.repository.JobApplicationRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ApplicationDataInitializer implements CommandLineRunner {

    private static final Logger logger =
            LoggerFactory.getLogger(ApplicationDataInitializer.class);

    @Autowired
    private JobApplicationRepository applicationRepository;

    @Override
    public void run(String... args) {

        if (applicationRepository.count() == 0) {

            // =====================================================
            // Seed Application 1: Shortlisted
            // =====================================================

            List<ReviewNote> notes1 = new ArrayList<>();

            ReviewNote note1 = new ReviewNote();

            note1.setRecruiterId(2L);
            note1.setRecruiterName("Sarah Jenkins");
            note1.setNote(
                    "Strong background in Spring Boot microservices and Kafka. "
                    + "Moved to interview round."
            );

            notes1.add(note1);

            JobApplication app1 = new JobApplication();

            app1.setCandidateId(1L);
            app1.setCandidateName("Alex Morgan");
            app1.setCandidateEmail("candidate@careerlink.com");

            app1.setJobId(1L);
            app1.setJobTitle("Senior Java Cloud Engineer");
            app1.setCompany("TechCorp Global");

            app1.setCoverLetter(
                    "I have over 4 years of experience architecting distributed "
                    + "systems with Spring Cloud, Eureka, and Docker. "
                    + "I would love to contribute to TechCorp's core backend platform."
            );

            app1.setResumeUrl(
                    "https://careerlink.s3.amazonaws.com/resumes/alex_morgan_cv.pdf"
            );

            app1.setStatus(ApplicationStatus.SHORTLISTED);

            app1.setLatestFeedback(
                    "Profile shortlisted for technical screening."
            );

            app1.setReviewNotes(notes1);

            applicationRepository.save(app1);


            // =====================================================
            // Seed Application 2: Submitted
            // =====================================================

            JobApplication app2 = new JobApplication();

            app2.setCandidateId(1L);
            app2.setCandidateName("Alex Morgan");
            app2.setCandidateEmail("candidate@careerlink.com");

            app2.setJobId(2L);
            app2.setJobTitle("Full Stack Developer (React & Java)");
            app2.setCompany("TechCorp Global");

            app2.setCoverLetter(
                    "Excited about the full stack role connecting React "
                    + "frontends with reactive Spring Boot APIs."
            );

            app2.setResumeUrl(
                    "https://careerlink.s3.amazonaws.com/resumes/alex_morgan_cv.pdf"
            );

            app2.setStatus(ApplicationStatus.SUBMITTED);

            applicationRepository.save(app2);


            // =====================================================
            // Success message
            // =====================================================

            logger.info("Demo job applications seeded successfully.");
        }
    }
}