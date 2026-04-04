# EduVault

AI-Augmented Centralized Student Profiling platform for Higher Education Institutions.

## Quick Start

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed setup instructions.

```bash
# Start databases only (for local dev)
docker compose -f docker-compose.dev.yml up -d

# Or start everything in Docker
docker compose up -d
```

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

- **Frontend**: React 18, Vite, Bootstrap CSS
- **Backend**: Express.js, Sequelize ORM
- **ML Service**: Python, FastAPI, fastembed, Qdrant
- **Database**: PostgreSQL
- **Vector DB**: Qdrant
- **Infrastructure**: Docker Compose
