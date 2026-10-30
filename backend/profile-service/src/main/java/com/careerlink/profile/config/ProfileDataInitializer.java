package com.careerlink.profile.config;

import com.careerlink.profile.entity.CandidateProfile;
import com.careerlink.profile.entity.Education;
import com.careerlink.profile.entity.Experience;
import com.careerlink.profile.repository.CandidateProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ProfileDataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(ProfileDataInitializer.class);

    @Autowired
    private CandidateProfileRepository profileRepository;

    @Override
    public void run(String... args) {
        try {
            if (profileRepository.count() == 0) {
                // Seed Profile for Demo Candidate (userId: 1)
                List<Experience> experiences = new ArrayList<>();
                experiences.add(Experience.builder()
                        .company("Acme Cloud Solutions")
                        .role("Full Stack Software Engineer")
                        .startDate("2021-06")
                        .endDate("Present")
                        .currentlyWorking(true)
                        .description("Designed microservices using Spring Boot, Docker, and AWS. Improved API latency by 35%.")
                        .build());

                List<Education> educations = new ArrayList<>();
                educations.add(Education.builder()
                        .institution("University of Technology")
                        .degree("Bachelor of Science")
                        .fieldOfStudy("Computer Science")
                        .startYear("2017")
                        .endYear("2021")
                        .grade("3.85 GPA")
                        .build());

                CandidateProfile profile1 = CandidateProfile.builder()
                        .userId(1L)
                        .fullName("Alex Morgan")
                        .email("candidate@careerlink.com")
                        .phone("+1-555-0100")
                        .location("San Francisco, CA")
                        .headline("Senior Java & Spring Cloud Microservices Engineer")
                        .summary("Passionate software engineer with 4+ years of hands-on experience building distributed systems, RESTful APIs, Spring Cloud architectures, and containerized deployments.")
                        .skills(new ArrayList<>(List.of("Java", "Spring Boot", "Spring Cloud", "Microservices", "Docker", "Kubernetes", "PostgreSQL", "Kafka", "REST API", "Git")))
                        .experiences(experiences)
                        .educations(educations)
                        .resumeUrl("https://careerlink.s3.amazonaws.com/resumes/alex_morgan_cv.pdf")
                        .resumeText("ALEX MORGAN - Senior Software Engineer | Java, Spring Boot, Microservices, Eureka, Kafka, Docker, Kubernetes, CI/CD, SQL.")
                        .githubUrl("https://github.com/alexmorgan-dev")
                        .linkedinUrl("https://linkedin.com/in/alexmorgan-dev")
                        .yearsOfExperience(4)
                        .currentCompany("Acme Cloud Solutions")
                        .currentDesignation("Senior Software Engineer")
                        .build();

                profileRepository.save(profile1);

                // Seed Profile 2
                CandidateProfile profile2 = CandidateProfile.builder()
                        .userId(4L)
                        .fullName("Priya Sharma")
                        .email("priya.sharma@example.com")
                        .phone("+1-555-0199")
                        .location("Austin, TX")
                        .headline("Backend Developer & Distributed Systems Enthusiast")
                        .summary("Backend engineer specialized in high-throughput data pipelines, event-driven microservices using Kafka, and database query optimization.")
                        .skills(new ArrayList<>(List.of("Java", "Spring Boot", "Apache Kafka", "Redis", "MySQL", "AWS", "Elasticsearch")))
                        .yearsOfExperience(3)
                        .currentCompany("DataPulse Inc")
                        .currentDesignation("Backend Developer")
                        .build();

                profileRepository.save(profile2);

                logger.info("Default candidate profiles initialized successfully.");
            }
        } catch (Exception e) {
            logger.warn("MongoDB is not connected. Skipping profile seeding (service remains active): {}", e.getMessage());
        }
    }
}
