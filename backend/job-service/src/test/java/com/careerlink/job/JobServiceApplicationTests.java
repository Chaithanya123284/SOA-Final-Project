package com.careerlink.job;

import com.careerlink.job.dto.JobPostingRequest;
import com.careerlink.job.dto.JobPostingResponse;
import com.careerlink.job.dto.JobSearchCriteria;
import com.careerlink.job.entity.EmploymentType;
import com.careerlink.job.service.JobService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties = {
    "eureka.client.enabled=false",
    "spring.cloud.discovery.enabled=false"
})
@Transactional
class JobServiceApplicationTests {

    @Autowired
    private JobService jobService;

    @Test
    @DisplayName("CO-4: Context loads and default jobs are seeded")
    void contextLoads() {
        List<JobPostingResponse> jobs = jobService.searchJobs(null);
        assertFalse(jobs.isEmpty());
        assertTrue(jobs.stream().anyMatch(j -> j.getTitle().contains("Java Cloud Engineer")));
    }

    @Test
    @DisplayName("CO-4: Create new job posting and search by keyword")
    void testCreateAndSearchJob() {
        JobPostingRequest request = JobPostingRequest.builder()
                .title("Staff AI Engineer")
                .company("DeepLink AI")
                .location("New York, NY")
                .employmentType(EmploymentType.FULL_TIME)
                .description("Build agentic workflows and LLM infrastructure.")
                .minSalary(180000.0)
                .maxSalary(220000.0)
                .recruiterId(2L)
                .requiredSkills(List.of("Python", "PyTorch", "LangChain"))
                .build();

        JobPostingResponse created = jobService.createJob(request);
        assertNotNull(created.getId());
        assertEquals("Staff AI Engineer", created.getTitle());

        JobSearchCriteria criteria = JobSearchCriteria.builder()
                .query("DeepLink")
                .build();
        List<JobPostingResponse> results = jobService.searchJobs(criteria);
        assertEquals(1, results.size());
        assertEquals("DeepLink AI", results.get(0).getCompany());
    }
}
