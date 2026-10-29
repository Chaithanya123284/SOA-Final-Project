# Course Outcome 4 (CO-4): Microservices Testing, CI/CD & Agile Quality Assurance

## 1. Microservices Testing Strategy & The Testing Pyramid

Testing distributed microservices requires a layered testing pyramid to balance execution speed, test isolation, and real-world system fidelity:

```
                  / \
                 / E2E \              End-to-End System Tests
                /-------\             (Postman Collection, Web UI)
               / Component\           Integration / Slice Tests
              /  Service   \          (@SpringBootTest, @DataJpaTest)
             /--------------\
            /      Unit      \        Fast Unit Tests
           /     (JUnit 5)    \       (Mockito, AssertJ, Business Logic)
          /--------------------\
```

1. **Unit Tests (Base)**: Test isolated classes and methods using JUnit 5 and Mockito. Fast execution, zero network I/O.
2. **Component / Integration Slice Tests**: Test JPA repositories with in-memory H2 via `@DataJpaTest`, or controllers via `MockMvc`.
3. **Service Integration Tests**: Boot full Spring context via `@SpringBootTest` with isolated properties to verify beans, security filters, and data persistence.
4. **End-to-End (E2E) Acceptance Tests**: Execute user journeys across the API Gateway using Postman test scripts and browser automation.

---

## 2. Spring Boot Testing Toolset

CareerLink Networks leverages the standard `spring-boot-starter-test` dependency suite:
* **JUnit 5 (Jupiter)**: Modern test engine supporting `@DisplayName`, `@Nested`, `@ParameterizedTest`, and lifecycle hooks.
* **Mockito**: Generates test doubles (`@Mock`, `@InjectMocks`, `when().thenReturn()`) to mock external dependencies like Feign clients or repositories.
* **AssertJ**: Fluent assertions (`assertThat(response.getStatus()).isEqualTo(ApplicationStatus.SHORTLISTED)`).
* **Spring Test**: Integration support with `@SpringBootTest`, `@MockBean`, and transactional test rollback.

### Code Sample: Testing Business Logic & Duplicate Prevention
From `ApplicationServiceApplicationTests.java`:
```java
@SpringBootTest(properties = {
    "eureka.client.enabled=false",
    "spring.cloud.discovery.enabled=false",
    "spring.cloud.openfeign.enabled=false"
})
@Transactional
class ApplicationServiceApplicationTests {

    @Autowired
    private ApplicationService applicationService;

    @Test
    @DisplayName("CO-4: Prevent duplicate applications from same candidate for same job")
    void testPreventDuplicateApplication() {
        ApplyRequest duplicateRequest = ApplyRequest.builder()
                .candidateId(1L)
                .jobId(1L)
                .coverLetter("Duplicate submission attempt")
                .build();

        // Verify exception is thrown to enforce business rule
        assertThrows(IllegalStateException.class, 
            () -> applicationService.applyForJob(duplicateRequest));
    }
}
```

---

## 3. Comprehensive Test Traceability Matrix

| Test ID | Microservice | Test Name | Method / Annotation | Test Objective | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-AUTH-01** | `auth-service` | `testRegisterCandidate` | `@Test`, `@Transactional` | Verify user persistence, role assignment, and BCrypt password encryption. | Passed |
| **TC-AUTH-02** | `auth-service` | `testAuthenticateSuccess` | `@Test` | Verify valid credentials return signed JWT with correct role claims. | Passed |
| **TC-AUTH-03** | `auth-service` | `testAuthenticateBadCredentials` | `@Test` | Verify wrong password throws `BadCredentialsException` (HTTP 401). | Passed |
| **TC-PROF-01** | `profile-service`| `testCreateProfile` | `@Test`, `@Transactional` | Verify candidate profile persistence with skills and education items. | Passed |
| **TC-JOB-01** | `job-service` | `testCreateAndSearchJob` | `@Test`, `JobSpecification` | Verify recruiter job creation and dynamic keyword query filter. | Passed |
| **TC-APP-01** | `application-service` | `testPreventDuplicateApplication` | `@Test` | Verify candidate cannot apply twice to the same job opening. | Passed |
| **TC-APP-02** | `application-service` | `testUpdateApplicationStatus` | `@Test`, `@Transactional` | Verify recruiter can update status and attach review notes. | Passed |

---

## 4. Continuous Integration & Continuous Deployment (CI/CD) with GitHub Actions

The automated pipeline is defined in `.github/workflows/ci-cd.yml` and triggers on every git push or pull request.

### Pipeline Stages
```
[ Push / Pull Request ]
          |
          v
+-----------------------------+
| Stage 1: Checkout Code      |
+-----------------------------+
          |
          v
+-----------------------------+
| Stage 2: JDK 17 Setup       | (Eclipse Temurin + Maven Cache)
+-----------------------------+
          |
          v
+-----------------------------+
| Stage 3: Test Execution     | (mvn clean test)
+-----------------------------+
          |
          v
+-----------------------------+
| Stage 4: Package JARs       | (mvn package -DskipTests)
+-----------------------------+
          |
          v
+-----------------------------+
| Stage 5: Archive Reports    | (Upload Surefire XML/HTML test reports)
+-----------------------------+
          |
          v
+-----------------------------+
| Stage 6: Docker Compose     | (docker compose build --parallel)
+-----------------------------+
```

### Benefits of the CI/CD Pipeline
1. **Automated Regression Prevention**: Faulty commits that break business logic or cause test failures cannot be merged.
2. **Reproducible Builds**: Guarantees identical dependencies across developer workstations and production clusters.
3. **Artifact Integrity**: Packages self-contained Spring Boot executable JARs ready for container deployment.

---

## 5. Agile Practices: Test Case Reviews & Sprint Retrospectives

### Test Case Review Checklist (Peer QA Review)
* [x] **Positive Path**: Does the test verify expected behavior under valid inputs?
* [x] **Boundary & Edge Cases**: Are invalid inputs (null IDs, negative salaries, blank names) tested?
* [x] **State Isolation**: Does the test use `@Transactional` or clear the H2 test schema to prevent cross-test pollution?
* [x] **Execution Speed**: Do unit and slice tests execute in under 5 seconds without waiting on external networks?

### Sprint Retrospective Summary (Sprint 2)
* **What Went Well**:
  * Decoupling services with OpenFeign allowed parallel development of `job-service` and `application-service`.
  * H2 embedded in-memory databases allowed automated tests to run instantly without external database setup.
  * Postman automated test scripts streamlined verifying JWT expiration and role protection.
* **What Could Be Improved**:
  * Mocking Eureka service discovery in tests required setting explicit fallback properties (`eureka.client.enabled=false`).
  * Add contract testing with Spring Cloud Contract or Pact in future sprints to validate API schemas across teams.
* **Action Items**:
  * Integrate SonarQube quality gate in GitHub Actions for static code analysis.
  * Implement automated load tests with JMeter or k6 against API Gateway endpoints.
