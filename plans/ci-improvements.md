# CI Workflow Improvements Plan

## Overview

Enhancements to `.github/workflows/ci.yml` for better integration testing, linting, and reliability.

---

## Improvements

### 1. Backend Linting

**Branch**: `ci/backend-lint`

Add ESLint for backend code.

**Files to add:**
- `server/.eslintrc.json` - ESLint config (extend `eslint:recommended`, add Node/ES6 rules)
- `server/package.json` - Add `lint` script if missing

**Changes to `ci.yml`:**
```yaml
lint-backend:
  name: Lint Backend
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 20
    - name: Install dependencies
      run: cd server && npm install
    - name: Lint
      run: cd server && npm run lint
```

---

### 2. Better Health Checks

**Branch**: `ci/health-checks`

Replace `sleep 15` with proper health checks.

**Changes:**
- Update `docker-compose.yml` to add healthchecks for backend and ml services
- Update `ci.yml` to use `docker compose wait` or poll `/health` endpoints

```yaml
- name: Wait for services
  run: |
    echo "Waiting for backend..."
    until curl -sf http://localhost:8000/api/health; do sleep 2; done
    echo "Waiting for ML service..."
    until curl -sf http://localhost:8001/health; do sleep 2; done
    echo "Services ready"
```

---

### 3. Test Database Isolation

**Branch**: `ci/test-isolation`

Ensure clean state before each test run.

**Changes to `ci.yml`:**
```yaml
- name: Clean database
  run: |
    docker compose exec -T backend pnpm exec sequelize-cli db:migrate:undo:all || true
    docker compose exec -T backend pnpm exec sequelize-cli db:migrate
```

---

### 4. Service Health Verification

**Branch**: `ci/service-health`

Check all services are healthy before running tests.

**Changes to `ci.yml`:**
```yaml
- name: Verify all services healthy
  run: |
    echo "Checking backend..."
    curl -sf http://localhost:8000 || exit 1
    echo "Checking ML service..."
    curl -sf http://localhost:8001/health || exit 1
    echo "Checking PostgreSQL..."
    docker compose exec -T postgres pg_isready || exit 1
    echo "All services healthy"
```

---

### 5. Test Coverage Reporting

**Branch**: `ci/coverage`

Add test coverage reporting.

**Changes:**
- Update Bruno tests to generate coverage
- Or add Jest/Supertest for unit tests with coverage
- Upload coverage reports to GitHub

```yaml
- name: Upload coverage
  uses: codecov/codecov-action@v4
  with:
    files: ./coverage/coverage.xml
```

---

## Implementation Order

| Priority | Branch | Description |
|----------|--------|-------------|
| 1 | `ci/backend-lint` | Add backend ESLint |
| 2 | `ci/health-checks` | Replace sleep with health checks |
| 3 | `ci/test-isolation` | Clean database before tests |
| 4 | `ci/service-health` | Verify all services before tests |
| 5 | `ci/coverage` | Add coverage reporting |

---

## Files Summary

| File | Change |
|------|--------|
| `.github/workflows/ci.yml` | Add backend lint, improve health checks |
| `server/.eslintrc.json` | New - ESLint config |
| `server/package.json` | Add lint script |
| `docker-compose.yml` | Add healthchecks (optional) |

---

## Acceptance Criteria

- [ ] Backend code is linted on every PR
- [ ] Services are verified healthy before tests run
- [ ] Tests run on clean database state
- [ ] All services (backend, ML, Postgres) are health-checked
- [ ] Test coverage is tracked over time
