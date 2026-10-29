# Course Outcome 1 (CO-1): Service-Oriented Architecture (SOA) & Microservices Foundations

## 1. Overview of SOA Principles & Components

Service-Oriented Architecture (SOA) is an architectural style wherein software components are decoupled into distinct, reusable services communicating over network protocols.

### Core SOA Principles
1. **Standardized Service Contract**: Services agree upon explicit contracts specifying input parameters, output schemas, and error definitions (e.g., WSDL for SOAP, OpenAPI/Swagger for REST).
2. **Service Loose Coupling**: Services maintain minimal dependencies on other services' internal implementation details or persistence mechanisms.
3. **Service Abstraction**: Internal logic and database schemas are hidden behind clean abstraction interfaces.
4. **Service Autonomy**: Each service controls its execution environment and business logic boundary.
5. **Service Discoverability**: Services publish metadata to registries (UDDI in classic SOA, Netflix Eureka in modern microservices).
6. **Service Composability**: Fundamental services can be coordinated to construct composite business operations.

### Key SOA Components
* **Services**: Independent functional units performing business tasks (e.g., Job Catalog Service, Candidate Profile Service).
* **Contracts**: Machine-readable interface definitions specifying operations and wire formats.
* **Endpoints**: Network addresses (URIs) through which consumers invoke service operations.
* **Service Governance**: Policies and monitoring to enforce SLAs, versioning, security audits, and lifecycle management.

---

## 2. REST vs. SOAP: Practical Comparison

| Architectural Dimension | REST (Representational State Transfer) | SOAP (Simple Object Access Protocol) |
| :--- | :--- | :--- |
| **Protocol / Transport** | Application layer; primarily HTTP/HTTPS | Protocol agnostic (HTTP, SMTP, JMS, TCP) |
| **Data Format** | JSON (lightweight, human-readable), XML, YAML | XML only (verbose envelope, header, body) |
| **Interface Definition**| OpenAPI / Swagger 3.0 specification | WSDL (Web Services Description Language) |
| **Performance** | High throughput, low serialization overhead | Heavy XML parsing overhead and network payload |
| **State Handling** | Stateless requests; caching supported (ETag, Cache-Control) | Stateless by default; requires WS-* extensions for state |
| **Standard Security** | OAuth2, OpenID Connect, JWT over TLS | WS-Security (XML encryption and digital signatures) |

### Practical Code Comparison

#### SOAP Envelope Example (Classic SOA Job Application Request)
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:car="http://careerlink.com/services/jobapplication">
   <soapenv:Header>
      <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
         <wsse:UsernameToken>
            <wsse:Username>candidate@careerlink.com</wsse:Username>
         </wsse:UsernameToken>
      </wsse:Security>
   </soapenv:Header>
   <soapenv:Body>
      <car:ApplyJobRequest>
         <car:candidateId>1</car:candidateId>
         <car:jobId>101</car:jobId>
         <car:coverLetter>Experienced Spring Boot engineer applying.</car:coverLetter>
      </car:ApplyJobRequest>
   </soapenv:Body>
</soapenv:Envelope>
```

#### RESTful JSON Example (CareerLink PS015 Microservice)
```http
POST /api/v1/applications/apply HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Content-Type: application/json

{
  "candidateId": 1,
  "jobId": 101,
  "coverLetter": "Experienced Spring Boot engineer applying."
}
```

---

## 3. SOA vs. Microservices Architecture

While microservices evolved from SOA concepts, critical differences exist in their design and execution:

```
[ Traditional SOA ]                               [ Microservices Architecture ]
+----------------------------+                    +-----------+    +-----------+
|  Enterprise Service Bus    |                    | Gateway   |    | Discovery |
|  (ESB - Heavy Middleware)  |                    +-----+-----+    +-----+-----+
+-------------+--------------+                          |                |
              |                                   +-----+----------------+-----+
  +-----------+-----------+                       |                      |
  |                       |                       v                      v
+---+                   +---+               +-----------+          +-----------+
|Service A|             |Service B|         |Job Service|          |App Service|
+---+                   +---+               +-----+-----+          +-----+-----+
    \                   /                         |                      |
     v                 v                          v                      v
    +-------------------+                   +-----------+          +-----------+
    |   Shared Mono DB  |                   |  job_db   |          |  app_db   |
    +-------------------+                   +-----------+          +-----------+
```

| Criterion | Traditional SOA | Microservices (CareerLink) |
| :--- | :--- | :--- |
| **Communication Backbone** | Smart pipes (Enterprise Service Bus - ESB) | Dumb pipes, smart endpoints (API Gateway, HTTP/REST, Kafka) |
| **Data Storage** | Frequently shares a centralized enterprise database | Strict **Database-per-Service** (each service owns its DB) |
| **Service Granularity** | Coarse-grained, enterprise-wide scope | Fine-grained, single responsibility per business capability |
| **Deployment Model** | Monolithic application servers (WebLogic, WebSphere) | Independent containerized runtimes (Docker, Kubernetes) |
| **Scalability** | Scale the entire cluster/ESB stack | Independent horizontal scaling of hot services (e.g. Job Search) |

---

## 4. Advanced Patterns: Orchestration vs. Choreography & Event-Driven Kafka

When a candidate applies for a job in CareerLink, multiple downstream tasks occur (notify recruiter, update applicant counter, audit log). Two coordination patterns exist:

### Orchestration (Saga Coordinator)
A central coordinator service directs participants step-by-step:
1. Orchestrator calls `JobService.validateJob()`.
2. Orchestrator calls `ApplicationService.saveApplication()`.
3. Orchestrator calls `NotificationService.sendEmail()`.
* **Advantage**: Centralized visibility of the workflow.
* **Disadvantage**: High coupling to the coordinator; single point of failure.

### Choreography (Event-Driven Architecture with Kafka)
Services publish domain events without knowing who consumes them.
1. `ApplicationService` saves the application and publishes `ApplicationNotificationEvent` to the Kafka topic `application-notifications`.
2. `JobService` subscribes to the topic and increments its `applicantsCount`.
3. Notification and Audit services asynchronously consume the event and send alerts.
* **Advantage**: Fully decoupled, resilient, asynchronous.

In CareerLink, we implement the **Event-Driven Choreography** pattern via `ApplicationEventPublisherService` broadcasting `ApplicationNotificationEvent`.

---

## 5. Agile Practices: User Stories & Sprint Planning (Jira)

### Epic: PS015 Talent Acquisition & Job Application Portal

#### User Stories Breakdown
1. **US-01 (Candidate)**: *As a job seeker, I want to create and edit my professional profile with resume and skills so recruiters can evaluate my qualifications.*
   * **Acceptance Criteria**: Profile can be created; skills list saved; resume URL persisted.
   * **Story Points**: 5 | **Priority**: High | **Sprint**: 1
2. **US-02 (Recruiter)**: *As a corporate recruiter, I want to post job requisitions with compensation ranges and required skills so candidates can find matching openings.*
   * **Acceptance Criteria**: Recruiter can specify title, salary, skills; job is saved in `OPEN` status.
   * **Story Points**: 5 | **Priority**: High | **Sprint**: 1
3. **US-03 (Candidate)**: *As a job seeker, I want to apply for an open job and prevent duplicate applications so my application is accurately recorded once.*
   * **Acceptance Criteria**: 1-click apply; returns HTTP 409 Conflict if candidate already applied.
   * **Story Points**: 8 | **Priority**: Critical | **Sprint**: 2
4. **US-04 (Recruiter)**: *As a recruiter, I want to review applicants for my postings and transition their status (Shortlist, Interview, Reject, Hire) with notes.*
   * **Acceptance Criteria**: Recruiter updates status; review note is recorded; event notification emitted.
   * **Story Points**: 8 | **Priority**: High | **Sprint**: 2
5. **US-05 (Architect)**: *As a DevOps engineer, I want services registered in Eureka and routed through Spring Cloud Gateway with JWT authentication to ensure secure multi-tenant access.*
   * **Acceptance Criteria**: All services discovered; Gateway validates JWT; CORS enabled.
   * **Story Points**: 13 | **Priority**: Critical | **Sprint**: 1
