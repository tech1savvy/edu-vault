# LOGGING

Quick reference for reading logs across all services during development.

> **Note for AI agents**: `.log` files are gitignored and cannot be read with file-reading tools. Use the `run_command` shell commands below instead.

---

## Log locations

| Service | File | Level | Contents |
|---|---|---|---|
| `/server` | `server/combined.log` | DEBUG+ | All requests and app events |
| `/server` | `server/error.log` | ERROR only | Errors only |
| `/ml` | `ml/combined.log` | DEBUG+ | All ML service events |
| `/ml` | `ml/error.log` | ERROR only | Errors only |
| `/client` | — | — | Browser `console.error` only, no log files |

---

## Reading logs (shell commands)

```bash
# Last 100 lines of a log
tail -n 100 server/combined.log
tail -n 100 ml/combined.log

# Errors only (live stream)
tail -f server/error.log
tail -f ml/error.log

# Search for a specific term
grep "userId" server/combined.log
grep "ERROR" server/combined.log | tail -30

# Search across all logs at once
grep -r "ERROR" server/ ml/ --include="*.log"
```

## Docker (if services are running as containers)

```bash
docker logs eduvault-server --tail 100
docker logs eduvault-ml --tail 100

# Live stream
docker logs eduvault-server -f
```

---

## Log formats

**Server** (Winston — `combined.log`)
```
2026-04-27 08:00:00 info  GET /api/resume/heading 200 12ms
2026-04-27 08:00:01 error Error syncing resume: { message: '...', stack: '...' }
```

**ML** (Python logging — `combined.log`)
```
2026-04-27 08:00:00 INFO semantic-ranking: Syncing resume for user 42
2026-04-27 08:00:01 DEBUG semantic-ranking: Upserted vector: user-42
2026-04-27 08:00:02 ERROR semantic-ranking: Failed to sync user 7: connection refused
```

---

## Libraries

| Service | Library |
|---|---|
| `/server` | [winston](https://github.com/winstonjs/winston) + [morgan](https://github.com/expressjs/morgan) |
| `/ml` | Python stdlib `logging` with custom `ColorFormatter` (`ml/logger.py`) |
| `/client` | None — `console.error` in catch blocks only |
