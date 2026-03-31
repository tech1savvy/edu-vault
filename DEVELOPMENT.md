# Development Guide

This guide covers local development setup for all EduVault services.

## Prerequisites

- Node.js 20+
- Python 3.10+
- [uv](https://github.com/astral-sh/uv) (Python package manager)
- Docker (for databases only)

## Starting Databases

Start only the required databases with the dev compose file:

```bash
docker compose -f docker-compose.dev.yml up -d
```

This starts:
- **PostgreSQL** on port 5432
- **Qdrant** on port 6333

## Server Setup

```bash
cd server
cp .env.example .env
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm run dev
```

The server runs on http://localhost:8000.

## Client Setup

```bash
cd client
npm install
npm run dev
```

The client runs on http://localhost:5173.

## ML Service Setup

```bash
cd ml
uv sync
uv run uvicorn main:app --reload --port 8001
```

The ML service runs on http://localhost:8001.


## Environment Variables

### Server

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | localhost | PostgreSQL host |
| `DB_USER` | postgres | Database user |
| `DB_PASSWORD` | postgres | Database password |
| `DB_DATABASE` | edu_vault | Database name |
| `DB_PORT` | 5432 | Database port |
| `JWT_SECRET` | dev-secret... | JWT signing secret |
| `ML_SERVICE_URL` | http://localhost:8001 | ML service endpoint |
| `NODE_ENV` | development | Environment |

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

### Database

```bash
# Run migrations
npx sequelize-cli db:migrate

# Revert last migration
npx sequelize-cli db:migrate:undo

# Seed data
npx sequelize-cli db:seed:all

# Create new migration
npx sequelize-cli migration:generate --name add_column

# Create new seeder
npx sequelize-cli seed:generate --name users
```

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
```
