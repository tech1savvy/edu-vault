# EduVault Server

Backend server for EduVault, a platform for managing educational and professional records with AI-powered resume-job matching.

## Tech Stack

- **express** - Web framework for REST API
- **sequelize** - ORM for PostgreSQL database
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **joi** - Request body validation
- **axios** - HTTP client for ML service communication
- **winston** + **morgan** - Logging (application + HTTP requests)
- **cors** - Cross-origin resource sharing for frontend
- **dotenv** - Environment variable management

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- Docker (for running all services)

### Installation

```bash
pnpm install
```

### Configuration

Create a `.env` file in the `server/` directory:

```bash
cp .env.example .env
```

### Database Setup

```bash
# Run migrations
pnpm exec sequelize-cli db:migrate

# Seed sample data
pnpm exec sequelize-cli db:seed:all
```

### Running

```bash
pnpm dev    # Development with nodemon
pnpm start  # Production
```

### Seeded Data

| Role | Email | Password |
|------|-------|----------|
| Student | student1@example.com | password123 |
| Admin | admin@example.com | password123 |

---

## API Documentation

### Base URL

`http://localhost:8000`

### Authentication

Most endpoints require a Bearer Token. Use the JWT token from `/api/auth/login`.

---

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new student | No |
| POST | `/api/auth/login` | Login | No |

**Signup:**
```json
{ "name": "John Doe", "email": "user@example.com", "password": "password123" }
```

**Login:**
```json
{ "email": "user@example.com", "password": "password123" }
```

**Response:**
```json
{ "user": { "id": 1, "name": "John Doe", "email": "user@example.com", "role": "student" }, "token": "eyJhbG..." }
```

---

### Resume (Student Role Required)

All resume endpoints require Bearer Token with student role.

#### Heading

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resume/heading` | Get user's heading |
| POST | `/api/resume/heading` | Create/Update heading |

```json
{
  "name": "John Doe",
  "role": "Software Engineer",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "location": "New York",
  "link": "linkedin.com/in/johndoe"
}
```

#### Skills

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resume/skills` | Get all skills |
| POST | `/api/resume/skills` | Add skill |
| PUT | `/api/resume/skills/:id` | Update skill |
| DELETE | `/api/resume/skills/:id` | Delete skill |

```json
{ "name": "TypeScript", "level": "Intermediate" }
```

#### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resume/projects` | Get all projects |
| POST | `/api/resume/projects` | Add project |
| PUT | `/api/resume/projects/:id` | Update project |
| DELETE | `/api/resume/projects/:id` | Delete project |

```json
{
  "title": "Project Title",
  "description": "Description",
  "techStack": "React, Node.js",
  "timeline": "2 months",
  "type": "Personal",
  "collaborators": "None"
}
```

#### Achievements

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resume/achievements` | Get all achievements |
| POST | `/api/resume/achievements` | Add achievement |
| PUT | `/api/resume/achievements/:id` | Update achievement |
| DELETE | `/api/resume/achievements/:id` | Delete achievement |

```json
{ "title": "Award for Creativity", "description": "Received an award...", "date": "2022" }
```

#### Certifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resume/certifications` | Get all certifications |
| POST | `/api/resume/certifications` | Add certification |
| PUT | `/api/resume/certifications/:id` | Update certification |
| DELETE | `/api/resume/certifications/:id` | Delete certification |

```json
{
  "name": "GCP Certified Developer",
  "issuer": "Google Cloud",
  "date": "2021",
  "credentialId": "ABC123XYZ"
}
```

#### Education

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resume/education` | Get all education |
| POST | `/api/resume/education` | Add education |
| PUT | `/api/resume/education/:id` | Update education |
| DELETE | `/api/resume/education/:id` | Delete education |

```json
{
  "institution": "University of ABC",
  "degree": "Master of Science",
  "fieldOfStudy": "Computer Science",
  "duration": "2018-2020",
  "details": "Specialized in AI"
}
```

#### Experiences

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resume/experiences` | Get all experiences |
| POST | `/api/resume/experiences` | Add experience |
| PUT | `/api/resume/experiences/:id` | Update experience |
| DELETE | `/api/resume/experiences/:id` | Delete experience |

```json
{
  "type": "Part-time",
  "company": "Google",
  "role": "Software Engineer",
  "duration": "2020-Present",
  "details": "Developed software"
}
```

---

### Job Descriptions (Admin Role Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/job-descriptions` | Get all job descriptions |
| GET | `/api/job-descriptions/:id` | Get job description by ID |
| POST | `/api/job-descriptions` | Create job description |
| PUT | `/api/job-descriptions/:id` | Update job description |
| DELETE | `/api/job-descriptions/:id` | Delete job description |
| POST | `/api/job-descriptions/:id/match` | Match job with resumes |

**Create Job:**
```json
{
  "title": "Software Engineer",
  "description": "We are looking for...",
  "requirements": "B.S. in CS, 3+ years experience"
}
```

**Match Response:**
```json
[
  {
    "score": 0.95,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Engineer"
    }
  },
  {
    "score": 0.88,
    "user": {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "Developer"
    }
  }
]
```

---

### Sync (Admin Role Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sync/all` | Trigger full sync of all resumes and jobs to ML service |

```bash
curl -X POST http://localhost:8000/api/sync/all \
  -H "Authorization: Bearer <admin_token>"
```

**Response:**
```json
{
  "status": "ok",
  "message": "Synced 10 resumes and 8 job descriptions",
  "synced_users": 10,
  "failed_users": [],
  "synced_jobs": 8,
  "failed_jobs": []
}
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_DB` | edu_vault | Database name |
| `DB_HOST` | postgres | Database host |
| `DB_USER` | postgres | Database user |
| `DB_PASSWORD` | postgres | Database password |
| `JWT_SECRET` | dev-secret-key... | JWT signing secret |
| `ML_SERVICE_URL` | http://ml:8001 | ML service endpoint |
| `NODE_ENV` | development | Environment |
