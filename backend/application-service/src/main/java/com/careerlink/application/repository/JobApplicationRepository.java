package com.careerlink.application.repository;

import com.careerlink.application.entity.ApplicationStatus;
import com.careerlink.application.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByCandidateId(Long candidateId);

    List<JobApplication> findByJobId(Long jobId);

    List<JobApplication> findByJobIdAndStatus(Long jobId, ApplicationStatus status);

    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);

    Optional<JobApplication> findByCandidateIdAndJobId(Long candidateId, Long jobId);
}
