# AGENTS.md

## Critical Rules

1. **NEVER use npm** - Always use `pnpm` for Node.js package management
2. **NEVER install packages globally** - Do not run `npm install -g` or `pnpm add -g` on the user's system
3. **Use Docker Compose for all development** - Do not run services locally

### Docker Compose (Single File)
The project uses a single `docker-compose.yml` with environment variable defaults. All services start automatically with sensible defaults.

```bash
# Start all services (no .env file required)
docker compose up -d

# View logs for all services
docker compose logs -f

# View logs for a specific service
docker compose logs -f backend

# Restart a service after code changes
docker compose restart backend

# Stop all services
docker compose down

# Rebuild and start (after package.json/pyproject.toml changes)
docker compose up -d --build
```

### Environment Variables (Optional Override)
All values have defaults. Override only when needed:

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_DB` | `edu_vault` | Database name |
| `DB_HOST` | `postgres` | Database host |
| `ML_SERVICE_URL` | `http://ml:8001` | ML service HTTP endpoint |
| `QDRANT_URL` | `http://qdrant:6333` | Qdrant vector DB |
| `NODE_ENV` | `development` | Node.js environment |
| `JWT_SECRET` | `dev-secret-key-change-in-production` | JWT signing secret |

### Database Migrations (via Docker)
```bash
docker compose exec backend pnpm exec sequelize-cli db:migrate
docker compose exec backend pnpm exec sequelize-cli db:seed:all
```

### Service URLs
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| ML Service | http://localhost:8001 |
| Qdrant Dashboard | http://localhost:6333/dashboard |

## Code Style

### JavaScript/Node.js (server/)
- **Module system**: CommonJS (`require`/`module.exports`)
- **Variables**: `const` by default, `let` only when reassigning. Never `var`.
- **Naming**: camelCase functions/variables, PascalCase classes
- **Files**: `*.service.js`, `*.controller.js`, `*.repository.js`, `*.routes.js`
- **Async**: Use async/await. Wrap in try/catch for error handling.
- **Exports**: `module.exports = { func1, func2 }`

```javascript
const { SyncService } = require('../../ml/sync.service');

const getUser = async (id) => {
  try {
    return await userRepository.findById(id);
  } catch (error) {
    logger.error('Failed to get user:', error);
    throw error;
  }
};

module.exports = { getUser };
```

### Python (ml/)
- **Naming**: snake_case functions/variables, PascalCase classes
- **Type hints**: Required on all function signatures
- **Imports**: stdlib → third-party → local (blank lines between)
- **Private**: Single leading underscore (`_client`, `_ensure_collection`)
- **Singletons**: Global with lazy initialization

```python
from qdrant_client import QdrantClient
from config import QDRANT_URL
from logger import logger

_client: QdrantClient | None = None

def get_client() -> QdrantClient:
    global _client
    if _client is None:
        _client = QdrantClient(url=QDRANT_URL)
        logger.info(f"Connected to Qdrant at {QDRANT_URL}")
    return _client
```

## Project Structure

```
edu-vault/
├── client/              # React + Vite frontend
├── server/              # Express.js backend
│   ├── config/          # DB, logger config
│   ├── features/        # Domain modules (auth, resume, ml)
│   ├── models/          # Sequelize models
│   └── routes.js        # Route definitions
├── ml/                  # Python FastAPI microservice
│   ├── main.py          # FastAPI app with endpoints
│   ├── config.py        # Environment config
│   ├── embedding_service.py
│   ├── qdrant_service.py
│   └── logger.py
└── docker-compose.yml   # Single orchestration file with defaults
```

## Architecture

- **ML Service**: FastAPI HTTP server for embeddings and matching
- **Vector DB**: Qdrant for similarity search
- **Communication**: Backend → ML Service via HTTP (axios)
- **Logging**: Winston (JS), Python logging (console + files)
- **Auth**: JWT with role-based access (student, administrator)
- **Docker**: Single docker-compose.yml with environment variable defaults

## Troubleshooting / Bug Fix

### Bug Fix Workflow
When fixing bugs, follow this order:
1. **Fix Bruno (.bru) files first** - Fix API testing files before touching business logic
2. **Use Bruno CLI to test** - `cd server/bruno && bru run <folder> --env-file ./env.bru.env`
3. **If Bruno tests pass but API fails** - Then fix business logic files

### Bruno CLI Testing
```bash
# Run all tests in a folder
cd server/bruno
bru run User --env-file ./env.bru.env

# Run all tests recursively
bru run Resume -r --env-file ./env.bru.env

# Run multiple folders
bru run User Resume Job-Descriptions ML -r --env-file ./env.bru.env
```

### Common Bruno Issues

#### Issue: `body:json` not working (variables not substituted)
**Fix**: Change `body:json` syntax to separate `body` block:
```
post {
  url: {{baseURL}}/api/auth/login
  body: json
}

headers {
  Content-Type: application/json
}

body {
  {
    "email": "{{testUserEmail}}",
    "password": "{{testUserPassword}}"
  }
}
```

#### Issue: Environment variables not found (ENOTFOUND {{baseurl}})
**Fix**: Ensure `env.bru.env` uses correct format:
```
vars {
  baseURL: http://localhost:8000
  testUserEmail: student1@example.com
  testUserPassword: password123
}
```

#### Issue: Update/Delete tests fail with 400/404
**Fix**: Update IDs in .bru files to match seeded data. Query database:
```bash
docker compose exec postgres psql -U postgres -d edu_vault -c "SELECT id FROM \"Skills\";"
```

### Common ML Service Issues

#### Issue: Qdrant point ID format error
**Error**: `value user-14 is not a valid point ID`
**Fix**: Qdrant requires UUID or integer IDs. Use `uuid.uuid5()`:
```python
import uuid

def _string_to_uuid(s: str) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_DNS, s))

# When upserting:
PointStruct(id=_string_to_uuid(vector_id), vector=embedding, ...)
```

#### Issue: Qdrant query_points returns 404 with compatible client
**Fix**: Use httpx for direct HTTP calls to Qdrant REST API:
```python
import httpx

def query_similar(embedding: list[float], limit: int = 10, filter_type: str | None = None) -> list[dict]:
    with httpx.Client(base_url=QDRANT_URL, timeout=30.0) as client:
        payload = {
            "vector": embedding,
            "limit": limit,
            "with_payload": True,
        }
        if filter_type:
            payload["filter"] = {
                "must": [{"key": "type", "match": {"value": filter_type}}]
            }
        
        response = client.post(f"/collections/{QDRANT_COLLECTION}/points/search", json=payload)
        response.raise_for_status()
        return response.json()["result"]
```

### Database Issues

#### Issue: Seeder fails with "Key already exists"
**Fix**: Undo seeders and re-run:
```bash
docker compose exec backend pnpm exec sequelize-cli db:seed:undo:all
docker compose exec backend pnpm exec sequelize-cli db:seed:all
```

#### Issue: Migration fails
**Fix**: Check migration order and dependencies. Run migrations separately:
```bash
docker compose exec backend pnpm exec sequelize-cli db:migrate
```
