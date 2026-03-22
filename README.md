# EduVault

AI-Augmented Centralized Student Profiling platform for Higher Education Institutions.

## Quick Start

```bash
# 1. Start all services
docker compose up -d

# 2. Setup database
docker compose exec backend pnpm exec sequelize-cli db:migrate
docker compose exec backend pnpm exec sequelize-cli db:seed:all

# 3. Open frontend
http://localhost:5173
```

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | student1@example.com | password123 |
| Admin | admin@example.com | password123 |

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Docker Compose                │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────┐    ┌───────────┐    ┌─────────┐  │
│  │  Client   │───▶│  Server   │───▶│   ML    │  │
│  │  (React)  │◀───│ (Express) │    │(FastAPI)│  │
│  └───────────┘    └─────┬─────┘    └────┬────┘  │
│                         │               │       │
│                         ▼               ▼       │
│                   ┌───────────┐  ┌───────────┐  │
│                   │ PostgreSQL│  │  Qdrant   │  │
│                   └───────────┘  │ (Vectors) │  │
│                                   └───────────┘  │
└─────────────────────────────────────────────────┘
```

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Express.js, Sequelize ORM
- **ML Service**: Python, FastAPI, fastembed, Qdrant
- **Database**: PostgreSQL
- **Vector DB**: Qdrant
- **Infrastructure**: Docker Compose
