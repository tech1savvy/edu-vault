# ML Service

Python microservice for AI-powered resume-job matching in EduVault.

## Overview

This service handles:
- Generating text embeddings using fastembed (ONNX-based, CPU-optimized)
- Storing and searching vectors in Qdrant
- Processing match requests via REST API
- Full sync of all resumes and job descriptions from PostgreSQL

## Architecture

```
Frontend → Backend → ML Service (FastAPI) → Qdrant
                    ↕ PostgreSQL
```

## Dependencies

| Dependency | Purpose |
|------------|---------|
| **fastembed** | ONNX-based text embeddings (CPU-optimized, no GPU required) |
| **fastapi** | Fast async web framework with automatic OpenAPI documentation |
| **uvicorn** | ASGI server for running FastAPI |
| **qdrant-client** | Vector database client for storing/searching embeddings |
| **httpx** | HTTP client for Qdrant REST API (avoids gRPC version compatibility issues) |
| **python-dotenv** | Environment variable management |
| **psycopg2-binary** | PostgreSQL adapter for full sync database queries |

## Development

Runs in Docker only. See main `docker-compose.yml` at project root.

```bash
# Build
docker compose build ml

# Run
docker compose up -d ml

# Logs
docker compose logs -f ml
```

For local development:

```bash
# Install dependencies
uv sync

# Run
uv run uvicorn main:app --reload --port 8001
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/embed` | POST | Generate embedding for text |
| `/sync/resume` | POST | Sync single resume embedding |
| `/sync/job` | POST | Sync single job description embedding |
| `/sync/all` | POST | Sync all resumes and jobs from PostgreSQL |
| `/match` | POST | Find similar resumes for a job |

---

## API Examples

### Health Check

```bash
curl http://localhost:8001/health
```

**Response:**
```json
{"status":"healthy"}
```

---

### Generate Embedding

```bash
curl -X POST http://localhost:8001/embed \
  -H "Content-Type: application/json" \
  -d '{"text": "Software engineer with 5 years of experience in Python and JavaScript"}'
```

**Response:**
```json
{"embedding": [0.123, -0.456, ...]}
```

---

### Sync Resume

```bash
curl -X POST http://localhost:8001/sync/resume \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "text": "John Doe, Software Engineer, Python, JavaScript"}'
```

**Response:**
```json
{"status": "ok", "user_id": 1}
```

---

### Sync Job Description

```bash
curl -X POST http://localhost:8001/sync/job \
  -H "Content-Type: application/json" \
  -d '{"job_id": 1, "text": "Senior Engineer\nWe are looking for...\nRequirements: B.S. in CS"}'
```

**Response:**
```json
{"status": "ok", "job_id": 1}
```

---

### Find Matches

```bash
curl -X POST http://localhost:8001/match \
  -H "Content-Type: application/json" \
  -d '{"job_id": 1, "text": "Senior Engineer...", "limit": 10}'
```

**Response:**
```json
{
  "job_id": 1,
  "matches": [
    {
      "vector_id": "uuid-here",
      "score": 0.89,
      "external_id": "user-1",
      "type": "resume",
      "user_id": 1
    }
  ]
}
```

---

### Full Sync (All Resumes & Jobs)

```bash
curl -X POST http://localhost:8001/sync/all
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

## Files

| File | Purpose |
|------|---------|
| `main.py` | FastAPI app with all endpoints |
| `config.py` | Environment variables |
| `logger.py` | Logging (console with timestamps) |
| `embedding_service.py` | fastembed wrapper for embeddings |
| `qdrant_service.py` | Qdrant client for vector storage |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `QDRANT_URL` | http://qdrant:6333 | Qdrant server URL |
| `QDRANT_COLLECTION` | eduvault | Collection name |
| `EMBEDDING_MODEL` | sentence-transformers/all-MiniLM-L6-v2 | Embedding model |
| `ML_SERVICE_PORT` | 8001 | Service port |
| `DB_HOST` | postgres | PostgreSQL host |
| `DB_PORT` | 5432 | PostgreSQL port |
| `POSTGRES_DB` | edu_vault | Database name |
| `DB_USER` | postgres | Database user |
| `DB_PASSWORD` | postgres | Database password |

---

## Embedding Model

Uses `sentence-transformers/all-MiniLM-L6-v2`:
- 384 dimensions
- CPU-optimized (ONNX runtime)
- ~80MB model size
- Fast inference (~10ms per text)
