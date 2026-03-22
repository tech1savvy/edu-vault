# EduVault Server

Backend API for EduVault. Runs in Docker only - see [root README](../README.md).

## Tech Stack

- **Express.js** - Web framework
- **Sequelize** - PostgreSQL ORM
- **JWT** - Authentication
- **Winston** - Logging
- **axios** - HTTP client for ML service

## API Documentation

### Base URL

`http://localhost:8000`

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new student |
| POST | `/api/auth/login` | Login |

**Login Response:**
```json
{ "user": { "id": 1, "name": "John", "role": "student" }, "token": "eyJhbG..." }
```

### Resume (Student Role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/resume/heading` | User heading |
| GET/POST | `/api/resume/skills` | Skills |
| GET/POST | `/api/resume/projects` | Projects |
| GET/POST | `/api/resume/experiences` | Work experience |
| GET/POST | `/api/resume/education` | Education |
| GET/POST | `/api/resume/achievements` | Achievements |
| GET/POST | `/api/resume/certifications` | Certifications |

### Job Descriptions (Admin Role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/job-descriptions` | List all |
| POST | `/api/job-descriptions` | Create |
| PUT | `/api/job-descriptions/:id` | Update |
| DELETE | `/api/job-descriptions/:id` | Delete |
| POST | `/api/job-descriptions/:id/match` | Match resumes |

### Sync (Admin Role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sync/all` | Sync all data to ML service |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_DB` | edu_vault | Database name |
| `DB_HOST` | postgres | Database host |
| `DB_USER` | postgres | Database user |
| `DB_PASSWORD` | postgres | Database password |
| `JWT_SECRET` | dev-secret... | JWT signing secret |
| `ML_SERVICE_URL` | http://ml:8001 | ML service endpoint |
| `NODE_ENV` | development | Environment |
