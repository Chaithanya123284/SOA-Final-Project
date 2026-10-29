# CareerLink Networks — Frontend

Enterprise Talent Acquisition & Job Application Tracking Portal (React + Vite).

This frontend connects to the CareerLink microservices backend through the Spring Cloud API Gateway at `http://localhost:8080`.

## Tech Stack

- React 18 + Vite
- JavaScript / JSX
- React Router DOM v6
- Axios (with JWT interceptor)
- Bootstrap 5 + Bootstrap Icons + Lucide React
- Context API (authentication & user state)
- React Toastify (notifications)

## Getting Started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

## Environment

Create a `.env` file (already provided) with:

```text
VITE_API_BASE_URL=http://localhost:8080
```

## Backend Integration

All API calls go through the API Gateway (`http://localhost:8080`):

| Service | Base path |
| --- | --- |
| Auth | `/api/v1/auth` |
| Jobs | `/api/v1/jobs` |
| Profiles | `/api/v1/profiles` |
| Applications | `/api/v1/applications` |

Authentication flow:

1. `POST /api/v1/auth/register` — create a `CANDIDATE` or `RECRUITER` account
2. `POST /api/v1/auth/login` — returns a JWT + user info
3. The Axios interceptor attaches `Authorization: Bearer <token>` to every request
4. On `401`, the session is cleared and the user is redirected to `/login`

## Project Structure

```text
src/
├── api/            # Axios instance + per-service API modules
├── components/     # Reusable UI components (Navbar, JobCard, StatusBadge, ...)
├── context/        # AuthContext (JWT + user state)
├── layouts/        # Public / Seeker / Recruiter layouts
├── pages/          # Public, seeker/ and recruiter/ pages
├── utils/          # Error handler, formatters, constants
├── App.jsx         # Route definitions
├── main.jsx        # Entry point
└── index.css       # Enterprise styling
```

## Roles & Routes

| Role | Dashboard | Key routes |
| --- | --- | --- |
| Job Seeker (`CANDIDATE`) | `/dashboard` | `/jobs`, `/jobs/:id`, `/jobs/:id/apply`, `/applications`, `/profile` |
| Recruiter (`RECRUITER`) | `/recruiter/dashboard` | `/recruiter/jobs`, `/recruiter/jobs/new`, `/recruiter/jobs/:id/edit`, `/recruiter/applications`, `/recruiter/applications/:id`, `/recruiter/profile` |

Protected routes redirect unauthenticated users to `/login`; role mismatches redirect to `/access-denied`.

## Notes

- The legacy vanilla-JS prototype is preserved under `legacy-vanilla/`.
- Application statuses follow the backend enum: `SUBMITTED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW_SCHEDULED`, `REJECTED`, `ACCEPTED`.
- Employment types: `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `REMOTE`.