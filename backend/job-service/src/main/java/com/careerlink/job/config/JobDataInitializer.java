package com.careerlink.job.config;

import com.careerlink.job.entity.EmploymentType;
import com.careerlink.job.entity.JobPosting;
import com.careerlink.job.entity.JobStatus;
import com.careerlink.job.repository.JobPostingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class JobDataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(JobDataInitializer.class);

    @Autowired
    private JobPostingRepository jobRepository;

    @Override
    public void run(String... args) {
        if (jobRepository.count() == 0) {
            // Job 1: Senior Java Cloud Engineer
            JobPosting job1 = JobPosting.builder()
                    .title("Senior Java Cloud Engineer")
                    .company("TechCorp Global")
                    .location("San Francisco, CA (Hybrid)")
                    .employmentType(EmploymentType.FULL_TIME)
                    .description("Join TechCorp's core infrastructure team to build high-throughput microservices using Spring Boot, Spring Cloud, Kafka, and Kubernetes.")
                    .requirements("4+ years experience with Java, Spring Boot microservices, distributed caching, and container orchestration.")
                    .minSalary(140000.0)
                    .maxSalary(175000.0)
                    .currency("USD")
                    .experienceRequiredYears(4)
                    .requiredSkills(new ArrayList<>(List.of("Java", "Spring Boot", "Spring Cloud", "Docker", "Kubernetes", "Kafka")))
                    .status(JobStatus.OPEN)
                    .recruiterId(2L)
                    .recruiterEmail("recruiter@careerlink.com")
                    .applicantsCount(0)
                    .build();
            jobRepository.save(job1);

            // Job 2: Full Stack Developer (React & Java)
            JobPosting job2 = JobPosting.builder()
                    .title("Full Stack Developer (React & Java)")
                    .company("TechCorp Global")
                    .location("Remote")
                    .employmentType(EmploymentType.REMOTE)
                    .description("Develop intuitive user interfaces in React while designing RESTful microservice backends with Spring Boot and PostgreSQL.")
                    .requirements("Strong proficiency in modern JavaScript/React and Java Spring Boot. Familiarity with CI/CD pipelines.")
                    .minSalary(120000.0)
                    .maxSalary(150000.0)
                    .currency("USD")
                    .experienceRequiredYears(3)
                    .requiredSkills(new ArrayList<>(List.of("React", "JavaScript", "Java", "Spring Boot", "PostgreSQL", "REST API")))
                    .status(JobStatus.OPEN)
                    .recruiterId(2L)
                    .recruiterEmail("recruiter@careerlink.com")
                    .applicantsCount(0)
                    .build();
            jobRepository.save(job2);

            // Job 3: DevOps & Site Reliability Engineer
            JobPosting job3 = JobPosting.builder()
                    .title("DevOps & SRE Engineer")
                    .company("CloudScale Networks")
                    .location("Austin, TX")
                    .employmentType(EmploymentType.FULL_TIME)
                    .description("Manage multi-region Kubernetes clusters, monitor system reliability, and maintain automated GitHub Actions CI/CD workflows.")
                    .requirements("Hands-on experience with Terraform, Kubernetes, Prometheus, Grafana, and cloud platforms (AWS/GCP).")
                    .minSalary(130000.0)
                    .maxSalary(160000.0)
                    .currency("USD")
                    .experienceRequiredYears(3)
                    .requiredSkills(new ArrayList<>(List.of("Kubernetes", "Terraform", "Docker", "AWS", "CI/CD", "Linux")))
                    .status(JobStatus.OPEN)
                    .recruiterId(2L)
                    .recruiterEmail("recruiter@careerlink.com")
                    .applicantsCount(0)
                    .build();
            jobRepository.save(job3);

            logger.info("Demo job listings seeded successfully.");
        }
    }
}
