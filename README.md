# CareerLink Networks - Enterprise Talent Acquisition & Job Application Portal
### Project Code: **PS015** | Academic Syllabus: **CO-1, CO-2, CO-3, CO-4**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2023.0.0-blue.svg)](https://spring.io/projects/spring-cloud)
[![Java](https://img.shields.io/badge/Java-17%2B-orange.svg)](https://www.oracle.com/java/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-13aa52.svg)](https://www.mongodb.com/)
[![Security](https://img.shields.io/badge/Security-Spring%20Security%206%20%2B%20JWT-red.svg)](https://jwt.io/)

---

## 1. About The Project

**CareerLink Networks** is a high-performance, enterprise-grade talent acquisition and job application tracking portal that connects job seekers with corporate recruiters across diverse industries. 

### Core Capabilities:
* **Job Seekers (Candidates)**: Create rich professional profiles with skills and resumes, explore and filter job openings, submit 1-click applications (with duplicate prevention), and track application review stages in real-time.
* **Corporate Recruiters**: Post job requisitions with salary bands and skill requirements, manage listings, inspect applicant resumes, transition candidate statuses (`SHORTLISTED`, `INTERVIEW_SCHEDULED`, `REJECTED`, `ACCEPTED`), and record interview review notes.
* **System Architecture**: Decoupled microservices architecture using **Spring Boot 3.2.x**, **Netflix Eureka** service discovery, **Spring Cloud Gateway** with load balancing (`lb://`), **Spring Security 6** with JWT token validation, **OpenFeign** inter-service calls, and **Polyglot Persistence** (PostgreSQL + MongoDB).

---

## 2. Microservices Architecture & Port Allocation

```
                                  +---------------------------------------+
                                  |     CareerLink Web UI Portal          |
                                  |      (frontend/index.html)            |
                                  |    & OpenAPI Swagger UI / Postman     |
                                  +-------------------+-------------------+
                                                      |
                                                      | (Port 8080)
                                                      v
                                  +---------------------------------------+
                                  |          API Gateway (8080)           |
                                  |       Spring Cloud Gateway + CORS     |
                                  |     Load Balancer (lb://) + Routing   |
                                  +-------------------+-------------------+
                                                      |
         +--------------------+-----------------------+-----------------------+--------------------+
         |                    |                       |                       |                    |
         v                    v                       v                       v                    v
  +--------------+     +--------------+        +--------------+        +--------------+     +--------------+
  | Auth Service |     |Profile Service|       | Job Service  |        | Application  |     | Eureka Server|
  |  (Port 8081) |     |  (Port 8082) |        |  (Port 8083) |        |   Service    |     |  (Port 8761) |
  +-------+------+     +-------+------+        +-------+------+        |  (Port 8084) |     +--------------+
          |                    |                       |               +-------+------+
     PostgreSQL             MongoDB                PostgreSQL                  |
      (authdb)            (profiledb)               (jobdb)                PostgreSQL
          |                    |                       |                    (appdb)
          v                    v                       v                       |
     +----------+        +----------+             +----------+                 |
     | pgAdmin4 |        | MongoDB  |             | pgAdmin4 |                 v
     | (Port    |        | Compass/ |             | (Port    |            +----------+
     |  Web)    |        |  Atlas   |             |  Web)    |            | pgAdmin4 |
     +----------+        +----------+             +----------+            +----------+
                                                       ^                       |
                                                       |                       |
                                                       +--- OpenFeign Client --+
                                                       | (Validate Job Status) |
                                                       +--- OpenFeign Client --+
                                                         (Verify Candidate)
```

### Port Allocation Reference Table

| Service / Tool | Port | Database / Persistence | Purpose |
| :--- | :---: | :--- | :--- |
| **`eureka-server`** | **`8761`** | In-Memory Registry | Netflix Eureka Service Discovery & Dashboard |
| **`api-gateway`** | **`8080`** | Reverse Proxy | Central Gateway, CORS, JWT verification, Load Balancing |
| **`auth-service`** | **`8081`** | **PostgreSQL** (`authdb`) | User Registration, JWT Token Issuance, Password Hashing |
| **`profile-service`**| **`8082`** | **MongoDB** (`profiledb`) | Candidate Profiles, Resumes, Skills, Experience Documents |
| **`job-service`** | **`8083`** | **PostgreSQL** (`jobdb`) | Job Catalog, Search & Filtering, Applicant Counts |
| **`application-service`**|**`8084`**| **PostgreSQL** (`appdb`) | Job Applications, Recruiter Status Reviews & Notes |
| **`pgAdmin 4`** | System App | PostgreSQL GUI | View tables and query rows for `authdb`, `jobdb`, `appdb` |

---

## 3. Why Polyglot Persistence? (PostgreSQL + MongoDB)

In enterprise microservices, **Polyglot Persistence** means choosing the best database engine for each specific business domain:

1. **Why PostgreSQL with pgAdmin for Auth, Job, and Application Services?**
   * **ACID Transactions**: Financial salaries, recruiter requisitions, and audit records require strict relational integrity.
   * **Relational Schema**: Tables with explicit column data types, foreign keys, and indexes.
   * **Inspection via pgAdmin 4**: Visual GUI to view tables (`users`, `roles`, `job_postings`, `job_applications`, `review_notes`).

2. **Why MongoDB for Profile Service?**
   * **Semi-Structured Resume Data**: Candidates have variable numbers of skills, multiple past companies, diverse college degrees, and unstructured resume text.
   * **No Complex Table Joins**: In MongoDB, the entire candidate profile is stored as a single, flexible BSON document in the `candidate_profiles` collection inside `profiledb`.

---

## 4. PIN-TO-PIN GUIDE: How to Set Up MongoDB

You can use **MongoDB Atlas (Free in the Cloud)** OR **Local MongoDB Community Server**. Both take under 3 minutes:

### OPTION 1: Free Cloud MongoDB Atlas (Recommended - No Installation Needed)

1. **Go to Google**:
   * Open your browser and search: `MongoDB Atlas sign up` or go directly to:
     👉 **[https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)**
2. **Sign Up**:
   * Click **Sign up with Google** (100% Free, NO credit card needed).
3. **Deploy Free Cluster**:
   * Choose the **M0 Free Shared** tier.
   * Select your preferred cloud provider (AWS/Google Cloud) and region (e.g., Mumbai, Singapore, US East).
   * Click **Create Deployment**.
4. **Security Quickstart (Crucial Step)**:
   * **Database User**: Enter a username (e.g. `careerlink`) and password (e.g. `Password123!`). Click **Create Database User**. *Remember this password!*
   * **Network Access (IP Whitelist)**:
     * In the IP Address field, enter `0.0.0.0/0` (or select "Allow Access from Anywhere").
     * Click **Add IP Address**.
5. **Get Your Connection URL**:
   * In the Atlas dashboard, click the green **Connect** button next to your cluster.
   * Under "Connect to your application", select **Drivers** (Language: **Java**).
   * Copy the connection string. It looks like this:
     ```
     mongodb+srv://careerlink:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
     ```
6. **Paste into `profile-service`**:
   * Open file: [`profile-service/src/main/resources/application.yml`](profile-service/src/main/resources/application.yml)
   * Replace `<password>` with your real password and append `/profiledb`:
     ```yaml
     spring:
       data:
         mongodb:
           uri: mongodb+srv://careerlink:Password123!@cluster0.abcde.mongodb.net/profiledb?retryWrites=true&w=majority
     ```
   * Done! Your profile service is now connected to Cloud MongoDB.

---

### OPTION 2: Local MongoDB Community Server

1. Download **MongoDB Community Server**:
   👉 [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run the installer (choose "Complete" and check "Install MongoDB as a Service" + "Install MongoDB Compass").
3. Your local MongoDB runs on port `27017`.
4. Open [`profile-service/src/main/resources/application.yml`](profile-service/src/main/resources/application.yml) and set:
   ```yaml
   spring:
     data:
       mongodb:
         uri: mongodb://localhost:27017/profiledb
   ```
5. You can view your data in **MongoDB Compass** by connecting to `mongodb://localhost:27017`.

---

## 5. PIN-TO-PIN GUIDE: How to Set Up PostgreSQL & pgAdmin 4

### Step 1: Install PostgreSQL & pgAdmin 4
1. Go to Google and search `Download PostgreSQL for Windows` or open:
   👉 **[https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)**
2. Download the installer for **PostgreSQL 16** (by EnterpriseDB).
3. Run the installer:
   * Keep components checked: PostgreSQL Server, pgAdmin 4, Command Line Tools.
   * Set a password for the `postgres` superuser (e.g. `postgres` or `admin123`). **Remember this password!**
   * Keep default port: `5432`.
   * Complete the installation.

---

### Step 2: Open pgAdmin 4 and Create the 3 Microservice Databases
1. Open **pgAdmin 4** from your Windows Start Menu.
2. Enter your master password when prompted.
3. In the left navigation tree:
   * Double-click **Servers** -> Click **PostgreSQL 16** (enter your `postgres` password).
4. **Create the 3 Databases**:
   * Right-click on **Databases** -> Select **Create** -> **Database...**
   * **Database 1**: In the "Database" box, type: `authdb` -> Click **Save**.
   * **Database 2**: Right-click Databases -> Create -> type: `jobdb` -> Click **Save**.
   * **Database 3**: Right-click Databases -> Create -> type: `appdb` -> Click **Save**.

```
pgAdmin 4 Tree:
Servers
└── PostgreSQL 16
    └── Databases
        ├── authdb   <-- for auth-service (Users, Roles)
        ├── jobdb    <-- for job-service (Job Postings)
        └── appdb    <-- for application-service (Job Applications)
```

---

### Step 3: Match the Password in `application.yml` Files
If your PostgreSQL password is `postgres`, everything works out of the box!
If your password is different (e.g. `mypassword123`), update the `password` field in:
1. [`auth-service/src/main/resources/application.yml`](auth-service/src/main/resources/application.yml):
   ```yaml
   password: ${SPRING_DATASOURCE_PASSWORD:mypassword123}
   ```
2. [`job-service/src/main/resources/application.yml`](job-service/src/main/resources/application.yml):
   ```yaml
   password: ${SPRING_DATASOURCE_PASSWORD:mypassword123}
   ```
3. [`application-service/src/main/resources/application.yml`](application-service/src/main/resources/application.yml):
   ```yaml
   password: ${SPRING_DATASOURCE_PASSWORD:mypassword123}
   ```

*(Note: If PostgreSQL is not installed or running, the services automatically fall back to their built-in in-memory H2 database, ensuring the app NEVER crashes during a demo!)*

---

### Step 4: How to View Live Tables & Data in pgAdmin
Once the microservices start:
1. In pgAdmin, expand **Databases** -> **`authdb`** -> **Schemas** -> **public** -> **Tables**.
   * You will see: `users`, `roles`, `user_roles`.
   * Right-click `users` -> **View/Edit Data** -> **All Rows** to see the registered users!
2. Expand **`jobdb`** -> **Schemas** -> **public** -> **Tables**.
   * You will see: `job_postings`, `job_required_skills`.
   * Right-click `job_postings` -> **View/Edit Data** -> **All Rows** to see live job postings!
3. Expand **`appdb`** -> **Schemas** -> **public** -> **Tables**.
   * You will see: `job_applications`, `review_notes`.
   * Right-click `job_applications` -> **View/Edit Data** -> **All Rows** to view applications!

---

## 6. How to Run Everything with 1-Click (`start.bat`)

We have created an automated launcher script [`start.bat`](start.bat).

### Step 1: Double Click `start.bat`
* Simply double-click [`start.bat`](start.bat) in the project root directory.
* The script automatically:
  1. Checks your Java and Maven installation.
  2. Launches **Eureka Server** in a dedicated window on Port `8761`.
  3. Waits 12 seconds for Eureka discovery registry to be ready.
  4. Launches **Auth Service** (Port `8081`).
  5. Launches **Profile Service** (Port `8082` with MongoDB).
  6. Launches **Job Service** (Port `8083` with PostgreSQL).
  7. Launches **Application Service** (Port `8084` with PostgreSQL).
  8. Waits 10 seconds for all services to register in Eureka.
  9. Launches **API Gateway** (Port `8080`).
  10. **Automatically opens the Web Portal ([`frontend/index.html`](frontend/index.html)) in your browser!**

### Step 2: How to Stop Everything (`stop.bat`)
* When you are done testing, simply double-click [`stop.bat`](stop.bat).
* It gracefully terminates all processes listening on ports `8761`, `8080`, `8081`, `8082`, `8083`, and `8084` to ensure zero port conflicts!

---

## 7. How to Use & Demonstrate the Web Portal

Open [`frontend/index.html`](frontend/index.html) in your browser:

### 1. 1-Click Demo Login:
In the top navbar, you will see two quick-login buttons:
* **Demo Candidate**: Logs in as `candidate@careerlink.com` with JWT.
* **Demo Recruiter**: Logs in as `recruiter@careerlink.com` with JWT.

### 2. Candidate Journey (Job Seeker):
1. Click **Demo Candidate** in the navbar.
2. In the **Explore Jobs** tab, browse pre-seeded jobs. Filter by search keyword (e.g. `Java`), location (`Remote`), or type (`FULL_TIME`).
3. Click **Apply Now** on any job -> Enter cover letter -> Click **Submit Application**.
4. Go to **My Applications** tab -> See your application live with status badge `SUBMITTED`.
5. Go to **My Profile** tab -> Edit skills, headline, experience -> Click **Save Profile** (persisted directly to MongoDB!).

### 3. Recruiter Journey (Hiring Manager):
1. Click **Demo Recruiter** in the navbar.
2. Go to **Manage Postings** tab -> Click **Post New Job** -> Fill in Title, Salary range, required skills -> Click **Publish Job Listing**.
3. Go to **Review Applicants** tab -> View candidates who applied -> Click **Review & Update Status**.
4. Change status from `SUBMITTED` to `SHORTLISTED` or `INTERVIEW_SCHEDULED`, add a review feedback note (e.g. *"Strong in Spring Cloud. Scheduled interview for Friday"*), and click **Save Review**.
5. Switch back to Candidate view -> Notice the live status update and recruiter notes in the Candidate Tracker!

---

## 8. Interactive Swagger / OpenAPI Documentation

Explore and execute REST endpoints directly via interactive Swagger UI:

* **Auth Service**: [http://localhost:8081/swagger-ui.html](http://localhost:8081/swagger-ui.html)
* **Profile Service (MongoDB)**: [http://localhost:8082/swagger-ui.html](http://localhost:8082/swagger-ui.html)
* **Job Service (PostgreSQL)**: [http://localhost:8083/swagger-ui.html](http://localhost:8083/swagger-ui.html)
* **Application Service (PostgreSQL)**: [http://localhost:8084/swagger-ui.html](http://localhost:8084/swagger-ui.html)
* **Eureka Service Registry**: [http://localhost:8761](http://localhost:8761)
* **API Gateway Route Actuator**: [http://localhost:8080/actuator/gateway/routes](http://localhost:8080/actuator/gateway/routes)

---

## 9. Postman Test Suite

A complete Postman test collection is located at:
[`postman/CareerLink_API_Collection.json`](postman/CareerLink_API_Collection.json)

### How to Use in Postman:
1. Open Postman -> Click **Import** -> Select `postman/CareerLink_API_Collection.json`.
2. Open folder `1. Authentication Service` -> Run request **Login as Candidate**.
   * The built-in test script automatically captures the JWT token and stores it in the `{{token}}` variable!
3. Now run any request in `Profile Service`, `Job Service`, or `Application Service` — the `Authorization: Bearer {{token}}` is added automatically!

---

## 10. Academic Syllabus Deliverables (CO-1 to CO-4)

Detailed theoretical and practical design documents matching your course outcomes are in [`docs/`](docs/):

* **[CO-1: SOA vs. Microservices Foundations](docs/CO1_SOA_vs_Microservices.md)**:
  * SOA principles, contracts, endpoints, governance.
  * REST vs. SOAP comparison with XML and JSON wire examples.
  * Orchestration vs. Choreography event-driven architecture with Apache Kafka.
  * Agile user stories and sprint planning in Jira.
* **[CO-2: Microservices Security Architecture](docs/CO2_Security_Architecture.md)**:
  * Threat modeling (MITM, Token Replay, IDOR, CORS).
  * JWT implementation with HMAC-SHA256, RFC 7519 claims, and Spring Security 6.
  * CORS `CorsWebFilter` configuration and preflight handling.
  * Security testing matrix.
* **[CO-3: Service Discovery, Gateway & Polyglot Persistence](docs/CO3_Service_Discovery_Gateway.md)**:
  * Eureka Server/Client registration lifecycle and heartbeat leases.
  * Spring Cloud Gateway dynamic load balancing with `lb://`.
  * Polyglot Persistence: PostgreSQL (with pgAdmin 4) & MongoDB (NoSQL).
  * Daily standup logs and sprint reviews.
* **[CO-4: Testing Strategies & CI/CD](docs/CO4_Testing_and_CICD.md)**:
  * Testing pyramid: Unit tests, slice tests (`@DataJpaTest`), and integration tests (`@SpringBootTest`).
  * Spring Boot testing toolkit: JUnit 5, AssertJ, Mockito.
  * GitHub Actions automated CI/CD pipeline ([`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml)).
  * Test case traceability matrix and sprint retrospectives.

---

## 11. Pre-Seeded Test Credentials

| Account Role | Email | Password | Access Details |
| :--- | :--- | :--- | :--- |
| **Candidate** | `candidate@careerlink.com` | `Password123!` | Explore jobs, 1-click apply, track applications, edit profile. |
| **Recruiter** | `recruiter@careerlink.com` | `Password123!` | Post new jobs, manage postings, review candidates, update statuses & notes. |
| **Admin** | `admin@careerlink.com` | `Password123!` | System administration & user management. |
| **pgAdmin 4** | `admin@careerlink.com` | `admin` *(or local)* | Connects to PostgreSQL `authdb`, `jobdb`, `appdb`. |

---

## 12. Troubleshooting & Viva Preparation

### Q: Why did you use both PostgreSQL and MongoDB?
**Answer**: *In enterprise microservices, Polyglot Persistence is the industry standard. Services that require ACID transactions, structured financial compensation bands, and relational integrity (Auth, Job catalog, Applications) use PostgreSQL. Meanwhile, the Profile Service manages candidate resumes, which contain variable skills, nested work histories, and arbitrary text that are naturally represented as polymorphic NoSQL documents in MongoDB.*

### Q: How do microservices communicate?
**Answer**: *Synchronous communication is handled via Spring Cloud OpenFeign (Application Service calls Job Service to verify job status and Profile Service to enrich candidate data). Asynchronous communication is handled via domain event publication (`ApplicationNotificationEvent`) ready for Apache Kafka message queues.*

### Q: How is security implemented?
**Answer**: *Spring Security 6 with stateless JWT tokens. The API Gateway validates tokens, handles CORS preflight requests, and injects authenticated identity headers (`X-User-Id`, `X-User-Role`) downstream so microservices never need session state.*

---

## 13. Clean Project Directory Structure

The project is cleanly structured into dedicated `frontend/` and `backend/` root folders:

```
c:/Job_Application/
│
├── frontend/                     # 🌐 ALL FRONTEND WEB ASSETS
│   ├── index.html                # Single Page Application Web Portal
│   ├── css/
│   │   └── style.css             # Glassmorphic Modern Styling
│   └── js/
│       └── app.js                # JWT Client, Job Browsing, Apply & Review Controller
│
├── backend/                      # ⚙️ ALL BACKEND MICROSERVICES & MAVEN SUITE
│   ├── pom.xml                   # Root Multi-Module Maven Parent POM
│   ├── eureka-server/            # Netflix Eureka Service Discovery (Port 8761)
│   ├── api-gateway/              # Spring Cloud Gateway & Load Balancer (Port 8080)
│   ├── auth-service/             # JWT Authentication & Roles (Port 8081 -> PostgreSQL)
│   ├── profile-service/          # Candidate Profiles & Resumes (Port 8082 -> MongoDB)
│   ├── job-service/              # Job Catalog & Search (Port 8083 -> PostgreSQL)
│   └── application-service/      # Applications Tracking & Feign (Port 8084 -> PostgreSQL)
│
├── docs/                         # 📚 ACADEMIC SYLLABUS DOCUMENTATION (CO-1 to CO-4)
│   ├── CO1_SOA_vs_Microservices.md
│   ├── CO2_Security_Architecture.md
│   ├── CO3_Service_Discovery_Gateway.md
│   └── CO4_Testing_and_CICD.md
│
├── postman/                      # 🚀 READY-TO-RUN API TEST SUITE
│   └── CareerLink_API_Collection.json
│
├── .github/                      # 🔄 CONTINUOUS INTEGRATION WORKFLOW
│   └── workflows/
│       └── ci-cd.yml             # Automated Maven Build, Test & Report CI Pipeline
│
├── start.bat                     # ⚡ 1-Click Windows Launcher Script
├── stop.bat                      # 🛑 1-Click Windows Graceful Shutdown Script
└── README.md                     # 📖 Complete Master Guide & Documentation
```
