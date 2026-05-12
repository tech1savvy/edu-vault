# LOGGING

Quick reference for reading logs across all services during development.

---

## Docker

All services run in Docker, so logs are accessed via `docker compose`:

```bash
# View all logs (live stream)
just logs

# View specific service logs
just logs server
just logs ml
just logs client

# Last 100 lines of a service
docker compose logs --tail 100 server
docker compose logs --tail 100 ml

# Follow specific service
docker compose logs -f server
docker compose logs -f ml
```

### Container names

| Service | Container            |
| ------- | -------------------- |
| server  | `eduvault-backend`   |
| ml      | `eduvault-ml`        |
| client  | `eduvault-client`    |
| postgres| `eduvault-postgres`  |
| qdrant  | `eduvault-qdrant`    |

Direct docker logs:
```bash
docker logs eduvault-backend --tail 100
docker logs eduvault-ml --tail 100
```

---

## Log formats

**Server** (Express logs via morgan)
```
GET /api/resume/heading 200 12ms
POST /api/auth/login 401 5ms
```

**ML** (Python logging)
```
INFO: Syncing resume for user 42
DEBUG: Upserted vector: user-42
ERROR: Failed to sync user 7: connection refused
```

---

## Libraries

| Service | Library |
| ------- | ------- |
| server  | [morgan](https://github.com/expressjs/morgan) |
| ml      | Python stdlib `logging` |
| client  | None — `console.error` in catch blocks only |