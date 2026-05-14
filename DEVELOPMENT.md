# Development Guide

This guide covers the docker-only development setup for all EduVault services.

## Prerequisites

- Docker (desktop or engine)

## Starting All Services

Start all services with docker compose:

```bash
docker compose up -d
```

This starts:
- **PostgreSQL** on port 5432
- **Qdrant** on port 6333
- **Backend (backend)** on port 8000
- **Client** on port 5173
- **ML Service** on port 8001

## Environment Variables

### Backend (backend)

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | postgres | PostgreSQL host |
| `DB_USER` | postgres | Database user |
| `DB_PASSWORD` | postgres | Database password |
| `DB_DATABASE` | edu_vault | Database name |
| `DB_PORT` | 5432 | Database port |
| `JWT_SECRET` | dev-secret... | JWT signing secret |
| `ML_SERVICE_URL` | http://ml:8001 | ML service endpoint |
| `NODE_ENV` | development | Environment |

### Client

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | http://localhost:8000 | Server API URL |

### ML Service

| Variable | Default | Description |
|----------|---------|-------------|
| `QDRANT_URL` | http://localhost:6333 | Qdrant server URL |
| `QDRANT_COLLECTION` | eduvault | Collection name |
| `EMBEDDING_MODEL` | sentence-transformers/all-MiniLM-L6-v2 | Embedding model |
| `ML_SERVICE_PORT` | 8001 | Service port |

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | student1@example.com | password123 |
| Admin | admin@example.com | password123 |

## Testing

API tests use Bruno CLI and run against live services:

```bash
# Install Bruno CLI
npm install -g @usebruno/cli

# Run all tests
bru run --env ci

# Run specific collection
bru run --env ci --folder server/bruno/auth
```

## Useful Commands

### Docker

```bash
# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f backend

# Restart a service
docker compose restart backend

# Stop all services
docker compose down

# Rebuild services (after code changes)
docker compose build
docker compose up -d
```

### Database

```bash
# Run migrations
docker compose exec backend npx sequelize-cli db:migrate

# Revert last migration
docker compose exec backend npx sequelize-cli db:migrate:undo

# Seed data
docker compose exec backend npx sequelize-cli db:seed:all
```