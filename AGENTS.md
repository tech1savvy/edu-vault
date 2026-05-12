# Agent Guidelines for EduVault

## Project Overview

EduVault is a resume-building platform with three services:
- **client/** - React 19 + Vite frontend (Bootstrap 5, dark theme)
- **server/** - Express.js 5 backend (Sequelize ORM, JWT auth)
- **ml/** - Python FastAPI service (fastembed, Qdrant vector DB)

## Development Setup

All services run in Docker:
```bash
docker compose up -d
```

This starts:
- **PostgreSQL** (port 5432)
- **Qdrant** (port 6333)
- **Server** (port 8000)
- **ML Service** (port 8001)
- **Client** (port 5173)

### Database Setup
```bash
# Run migrations
docker compose exec server npx sequelize-cli db:migrate

# Seed data
docker compose exec server npx sequelize-cli db:seed:all
```

## Commands

### Docker
```bash
docker compose up -d          # Start all services
docker compose logs -f        # View logs
docker compose logs -f client # View specific service logs
docker compose restart client # Restart a service
docker compose down         # Stop all services
docker compose build        # Rebuild after code changes
```

### Testing (Bruno API Tests)
```bash
# Install Bruno CLI globally
npm install -g @usebruno/cli

# Run all tests
bru run --env ci

# Run specific collection
bru run --env ci --folder server/bruno/auth
```

## Code Style Guidelines

### JavaScript (Server)
- Use **CommonJS** (`require`/`module.exports`) - server uses ESM-incompatible Express 5
- 2-space indentation
- Semantic naming: `camelCase` for variables/functions, `PascalCase` for constructors
- Async/await over raw promises; always wrap in try/catch in controllers
- Use `asyncHandler` pattern for route handlers

### JavaScript (Client)
- **ES Modules** (`import`/`export`)
- 2-space indentation
- Components: PascalCase files and component names
- Hooks: `use` prefix (e.g., `useAuth`)
- CSS files colocated with pages: `PageName.css`

### Python (ML Service)
- 4-space indentation
- Follow PEP 8 conventions
- Type hints preferred for function signatures
- Use `loguru` for logging

### General Patterns

**Server 4-Layer Architecture:**
```
features/{feature}/
├── {feature}.routes.js       # Route definitions + middleware
├── {feature}.controller.js   # Request/response handling
├── {feature}.service.js      # Business logic
├── {feature}.repository.js   # Database operations
└── index.js                  # Re-export all layers
```

**Route Middleware Order:**
```javascript
router.post('/', authenticateToken, authorizeRoles('administrator'), createHandler);
```

**Error Handling:**
- Controllers: use `asyncHandler` wrapper
- Services: throw custom errors or return `{ success: false, error }`
- Never expose stack traces in production

**Database:**
- Use Sequelize models in `models/` directory
- Migrations via `sequelize-cli`
- Repository pattern for all DB access

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `userId`, `isActive` |
| Constants | UPPER_SNAKE | `MAX_RETRY_COUNT` |
| Files (JS) | kebab-case | `user-service.js` |
| Files (React) | PascalCase | `UserProfile.jsx` |
| Database tables | snake_case | `user_skills` |
| Environment vars | UPPER_SNAKE | `DB_HOST` |

### Imports

**Server:**
```javascript
const { asyncHandler } = require('../middleware');
const { User, Skill } = require('../models');
```

**Client:**
```javascript
import { useAuth } from '../context';
import { userApi } from '../services/api';
```

### React Component Patterns

```jsx
// View component
export default function Skills() {
  const { user } = useAuth();
  // ...
}

// Form component (separate file)
export default function SkillsForm({ onSubmit, initialData }) {
  // ...
}
```

### API Response Format

```javascript
// Success
res.json({ success: true, data: result });

// Error
res.status(400).json({ success: false, error: 'Validation failed' });
```

## Testing

Integration tests use Bruno CLI and live against running services:
- Test files: `server/bruno/` organized by feature
- Environment: `--env ci` uses CI environment variables
- Results: JUnit XML format uploaded to CI

## Environment Variables

| Service | Variable | Description |
|---------|----------|-------------|
| Server | `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, `DB_PORT` | PostgreSQL connection |
| Server | `JWT_SECRET` | Token signing secret |
| Server | `ML_SERVICE_URL` | ML service endpoint |
| Client | `VITE_API_BASE_URL` | Server API URL |
| ML | `QDRANT_URL` | Qdrant server URL |
| ML | `QDRANT_COLLECTION` | Vector collection name |

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | student1@example.com | password123 |
| Admin | admin@example.com | password123 |

## Important Notes

- All services run in Docker
- Server uses **CommonJS** - do NOT convert to ES modules
