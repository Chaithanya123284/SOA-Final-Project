# Course Outcome 3 (CO-3): Service Discovery, API Gateway & Database-per-Service

## 1. Service Discovery Concepts & Importance

In modern containerized and cloud environments (Docker, Kubernetes), microservice instances are dynamic:
* Pods and containers receive ephemeral IP addresses upon launch.
* Services autoscale up or down according to traffic demand.
* Unhealthy instances terminate and restart automatically.

Hardcoding network hostnames or IP addresses in application configurations leads to fragile deployments and frequent outages.

### Service Discovery Architecture (Netflix Eureka)
Netflix Eureka provides a client-side service registry and discovery mechanism consisting of:
1. **Eureka Server**: The central registry maintaining a live map of Service IDs to physical IP addresses, ports, and health statuses.
2. **Eureka Clients**: The microservices (`api-gateway`, `auth-service`, `profile-service`, `job-service`, `application-service`) that register themselves upon startup and periodically send heartbeats.

```
                  +--------------------------------+
                  |     Netflix Eureka Server      |
                  |          (Port 8761)           |
                  +---------------+----------------+
                                  ^
     Heartbeat & Registration     |      Heartbeat & Registration
          +-----------------------+-----------------------+
          |                       |                       |
          v                       v                       v
  +---------------+       +---------------+       +---------------+
  |  Job Service  |       |Profile Service|       |  Application  |
  |  (Port 8083)  |       |  (Port 8082)  |       |    Service    |
  +-------+-------+       +-------+-------+       +-------+-------+
          ^                                               |
          |-------- OpenFeign Client (lb://JOB-SERVICE) --|
```

### Heartbeat & Lease Renewal Lifecycle
* **Registration**: On startup, client sends HTTP `POST /eureka/apps/{appName}` with hostname and port.
* **Heartbeat (Lease Renewal)**: Every 30 seconds (configured via `lease-renewal-interval-in-seconds`), client sends HTTP `PUT /eureka/apps/{appName}/{instanceId}`.
* **Eviction**: If the server receives no heartbeat for 90 seconds (configured via `lease-expiration-duration-in-seconds`), the instance is evicted from the routing table.

---

## 2. Spring Cloud Gateway: Routing & Load Balancing

Spring Cloud Gateway acts as the single entry point (reverse proxy) for all incoming client traffic on **Port 8080**.

### Load Balancing with `lb://` URI Scheme
By prepending routes with `lb://` (e.g. `lb://JOB-SERVICE`), Spring Cloud Gateway integrates with Spring Cloud LoadBalancer:
1. The gateway intercepts the route predicate `/api/v1/jobs/**`.
2. It queries Eureka for all live instances registered under `JOB-SERVICE`.
3. It performs round-robin load balancing across all available healthy nodes, distributing incoming web requests evenly.

### Route Configurations in `application.yml`
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: auth-service-route
          uri: lb://AUTH-SERVICE
          predicates:
            - Path=/api/v1/auth/**

        - id: profile-service-route
          uri: lb://PROFILE-SERVICE
          predicates:
            - Path=/api/v1/profiles/**

        - id: job-service-route
          uri: lb://JOB-SERVICE
          predicates:
            - Path=/api/v1/jobs/**

        - id: application-service-route
          uri: lb://APPLICATION-SERVICE
          predicates:
            - Path=/api/v1/applications/**
```

---

## 3. Database-per-Service & Polyglot Persistence (PostgreSQL + pgAdmin & MongoDB + Mongo Express)

A foundational tenet of modern microservices is **Polyglot Persistence**: choosing the optimal storage technology for each service's specific data characteristics rather than forcing all data into one generic database:

| Microservice | Persistence Engine | Database Name | Primary Entities / Collections | Architectural Rationale | Visual GUI Tool |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Auth Service** | **PostgreSQL (RDBMS)** | `authdb` | `users`, `roles`, `user_roles` | Relational integrity, ACID compliance, and secure BCrypt hash storage. | **pgAdmin 4** (Port 5050) |
| **Job Service** | **PostgreSQL (RDBMS)** | `jobdb` | `job_postings`, `job_required_skills` | Strict typing for compensation ranges, dates, and indexed tabular filtering. | **pgAdmin 4** (Port 5050) |
| **Application Service** | **PostgreSQL (RDBMS)** | `appdb`| `job_applications`, `review_notes` | Transactional audit records, strict state transitions, and relational candidate-job IDs. | **pgAdmin 4** (Port 5050) |
| **Profile Service** | **MongoDB (NoSQL)** | `profiledb` | `candidate_profiles` (Document Collection) | Dynamic resume schemas, polymorphic skill lists, arbitrarily nested experience/education documents without complex joins. | **Mongo Express** (Port 8085) |

### Elimination of Distributed Foreign Keys
Instead of database-level `FOREIGN KEY (candidate_id) REFERENCES users(id)` (which creates tight physical coupling across schemas), the Application Service stores `candidateId: Long` and `jobId: Long`. Inter-service consistency is verified via **Spring Cloud OpenFeign**:

```java
@FeignClient(name = "job-service")
public interface JobServiceClient {
    @GetMapping("/api/v1/jobs/{id}/is-open")
    Boolean isJobOpen(@PathVariable("id") Long id);
}
```

---

## 4. Local Testing & Verification of Service Discovery

### Verification Steps
1. **Launch Eureka Server**:
   ```bash
   cd eureka-server
   mvn spring-boot:run
   ```
   Open browser at `http://localhost:8761`. Verify Eureka dashboard displays *"Instances currently registered with Eureka"*.

2. **Launch Services**:
   Launch `api-gateway`, `auth-service`, `profile-service`, `job-service`, and `application-service`.
   Refresh `http://localhost:8761` and verify the table:
   * `API-GATEWAY` (UP (1) - 192.168.x.x:8080)
   * `AUTH-SERVICE` (UP (1) - 192.168.x.x:8081)
   * `PROFILE-SERVICE` (UP (1) - 192.168.x.x:8082)
   * `JOB-SERVICE` (UP (1) - 192.168.x.x:8083)
   * `APPLICATION-SERVICE` (UP (1) - 192.168.x.x:8084)

3. **Gateway Actuator Inspection**:
   Run `curl http://localhost:8080/actuator/gateway/routes` to verify all dynamic `lb://` routes are mapped.

---

## 5. Agile Practices: Daily Stand-ups & Sprint Reviews

### Daily Stand-up Log (Scrum Ceremonies)

#### Day 3 Standup:
* **Developer 1 (Auth & Gateway)**:
  * *Yesterday*: Finished Spring Cloud Gateway routing rules and JWT extraction filter.
  * *Today*: Configure CORS WebFilter to resolve preflight errors from the browser frontend.
  * *Blockers*: None.
* **Developer 2 (Job & Profile)**:
  * *Yesterday*: Created JobPosting JPA repository and custom search specification.
  * *Today*: Implement CandidateProfile repository with skills collections and seed demo profiles.
  * *Blockers*: Waiting on final OpenAPI DTO schemas.
* **Developer 3 (Application & Feign)**:
  * *Yesterday*: Added OpenFeign client dependencies and Eureka discovery hooks.
  * *Today*: Implement duplicate application prevention logic and status transition endpoints.
  * *Blockers*: Eureka instance discovery latency during test runs (resolved by disabling self-preservation in test profile).

### Sprint Review Agenda
1. **Demonstration of Sprint Goal**: Successfully registered services in Eureka, routed calls through Gateway, and applied for a job through the responsive Web UI.
2. **Stakeholder Feedback**: Recruiter requested filtering applicants by status chip (Shortlisted vs Submitted); accepted into next sprint backlog.
