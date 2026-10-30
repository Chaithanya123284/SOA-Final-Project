package com.careerlink.job.service;

import com.careerlink.job.dto.JobPostingRequest;
import com.careerlink.job.dto.JobPostingResponse;
import com.careerlink.job.dto.JobSearchCriteria;
import com.careerlink.job.entity.JobPosting;
import com.careerlink.job.entity.JobStatus;
import com.careerlink.job.repository.JobPostingRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobPostingRepository jobRepository;

    @Transactional
    public JobPostingResponse createJob(JobPostingRequest request) {
        JobPosting job = JobPosting.builder()
                .title(request.getTitle())
                .company(request.getCompany())
                .location(request.getLocation())
                .employmentType(request.getEmploymentType())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .minSalary(request.getMinSalary())
                .maxSalary(request.getMaxSalary())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .experienceRequiredYears(request.getExperienceRequiredYears())
                .requiredSkills(request.getRequiredSkills() != null ? request.getRequiredSkills() : new ArrayList<>())
                .status(request.getStatus() != null ? request.getStatus() : JobStatus.OPEN)
                .recruiterId(request.getRecruiterId())
                .recruiterEmail(request.getRecruiterEmail())
                .applicantsCount(0)
                .build();

        JobPosting saved = jobRepository.save(job);
        return mapToResponse(saved);
    }

    public List<JobPostingResponse> searchJobs(JobSearchCriteria criteria) {
        Specification<JobPosting> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // By default only return OPEN jobs
            predicates.add(cb.equal(root.get("status"), JobStatus.OPEN));

            if (criteria != null) {
                if (StringUtils.hasText(criteria.getQuery())) {
                    String pattern = "%" + criteria.getQuery().toLowerCase() + "%";
                    Predicate titlePred = cb.like(cb.lower(root.get("title")), pattern);
                    Predicate companyPred = cb.like(cb.lower(root.get("company")), pattern);
                    Predicate descPred = cb.like(cb.lower(root.get("description")), pattern);
                    predicates.add(cb.or(titlePred, companyPred, descPred));
                }

                if (StringUtils.hasText(criteria.getLocation())) {
                    predicates.add(cb.like(cb.lower(root.get("location")), "%" + criteria.getLocation().toLowerCase() + "%"));
                }

                if (criteria.getEmploymentType() != null) {
                    predicates.add(cb.equal(root.get("employmentType"), criteria.getEmploymentType()));
                }

                if (criteria.getMinSalary() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("minSalary"), criteria.getMinSalary()));
                }

                if (StringUtils.hasText(criteria.getSkill())) {
                    predicates.add(cb.isMember(criteria.getSkill(), root.get("requiredSkills")));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return jobRepository.findAll(spec).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public JobPostingResponse getJobById(Long id) {
        JobPosting job = jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found with ID: " + id));
        return mapToResponse(job);
    }

    @Transactional
    public JobPostingResponse updateJob(Long id, JobPostingRequest request) {
        JobPosting job = jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found with ID: " + id));

        job.setTitle(request.getTitle());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setEmploymentType(request.getEmploymentType());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setMinSalary(request.getMinSalary());
        job.setMaxSalary(request.getMaxSalary());
        if (request.getCurrency() != null) job.setCurrency(request.getCurrency());
        job.setExperienceRequiredYears(request.getExperienceRequiredYears());
        if (request.getRequiredSkills() != null) {
            job.getRequiredSkills().clear();
            job.getRequiredSkills().addAll(request.getRequiredSkills());
        }
        if (request.getStatus() != null) job.setStatus(request.getStatus());

        JobPosting saved = jobRepository.save(job);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteJob(Long id) {
        JobPosting job = jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job posting not found with ID: " + id));
        job.setStatus(JobStatus.CLOSED);
        jobRepository.save(job);
    }

    public List<JobPostingResponse> getJobsByRecruiter(Long recruiterId) {
        return jobRepository.findByRecruiterId(recruiterId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public boolean isJobOpen(Long id) {
        return jobRepository.findById(id)
                .map(job -> job.getStatus() == JobStatus.OPEN)
                .orElse(false);
    }

    @Transactional
    public void incrementApplicantCount(Long jobId) {
        jobRepository.incrementApplicantsCount(jobId);
    }

    private JobPostingResponse mapToResponse(JobPosting j) {
        return JobPostingResponse.builder()
                .id(j.getId())
                .title(j.getTitle())
                .company(j.getCompany())
                .location(j.getLocation())
                .employmentType(j.getEmploymentType())
                .description(j.getDescription())
                .requirements(j.getRequirements())
                .minSalary(j.getMinSalary())
                .maxSalary(j.getMaxSalary())
                .currency(j.getCurrency())
                .experienceRequiredYears(j.getExperienceRequiredYears())
                .requiredSkills(j.getRequiredSkills())
                .status(j.getStatus())
                .recruiterId(j.getRecruiterId())
                .recruiterEmail(j.getRecruiterEmail())
                .applicantsCount(j.getApplicantsCount())
                .createdAt(j.getCreatedAt())
                .updatedAt(j.getUpdatedAt())
                .build();
    }
}
