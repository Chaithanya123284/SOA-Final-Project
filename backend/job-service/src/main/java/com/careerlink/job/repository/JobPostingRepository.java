package com.careerlink.job.repository;

import com.careerlink.job.entity.JobPosting;
import com.careerlink.job.entity.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long>, JpaSpecificationExecutor<JobPosting> {

    List<JobPosting> findByStatus(JobStatus status);

    List<JobPosting> findByRecruiterId(Long recruiterId);

    @Modifying
    @Query("UPDATE JobPosting j SET j.applicantsCount = j.applicantsCount + 1 WHERE j.id = :jobId")
    void incrementApplicantsCount(@Param("jobId") Long jobId);
}
