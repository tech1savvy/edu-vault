# EduVault — Justfile
# https://just.systems

# Default: list all recipes
default:
    @just --list

# ─── Docker ─────────────────────────────────────────────────────────────────────
# just up       → start all services
# just down     → stop all services
# just logs     → view all logs
# just logs client → view client logs

up:
    docker compose up -d

down:
    docker compose down

logs service="":
    #!/usr/bin/env sh
    if [ -z "{{service}}" ]; then
      docker compose logs -f
    else
      docker compose logs -f "{{service}}"
    fi

restart service="server":
    docker compose restart "{{service}}"

rebuild:
    docker compose up -d --build

# just full-rebuild → rebuild, migrate, re-seed, clear qdrant, re-sync
full-rebuild: rebuild
    just db migrate
    just db unseed
    just db seed
    just qdrant-clear
    just sync

# ─── Database ──────────────────────────────────────────────────────────────────
# just db migrate → run migrations
# just db seed    → run seeders
# just db unseed  → undo all seeds
# just db undo    → revert last migration

db action="migrate":
    #!/usr/bin/env sh
    if [ "{{action}}" = "migrate" ]; then
      docker compose exec server npx sequelize-cli db:migrate
    elif [ "{{action}}" = "seed" ]; then
      docker compose exec server npx sequelize-cli db:seed:all
    elif [ "{{action}}" = "unseed" ]; then
      docker compose exec server npx sequelize-cli db:seed:undo:all
    elif [ "{{action}}" = "undo" ]; then
      docker compose exec server npx sequelize-cli db:migrate:undo
    else
      echo "Unknown action: {{action}}. Use: migrate, seed, unseed, undo"
    fi

# ─── Qdrant ────────────────────────────────────────────────────────────────────
# just qdrant-clear → wipe all vectors from Qdrant
# just sync         → login as admin and trigger full syn

qdrant-clear:
    #!/usr/bin/env sh
    curl -s -X POST http://localhost:6333/collections/eduvault/points/delete \
      -H "Content-Type: application/json" \
      -d '{"filter": {"must": [{"key": "type", "match": {"value": "resume"}}]}}'
    curl -s -X POST http://localhost:6333/collections/eduvault/points/delete \
      -H "Content-Type: application/json" \
      -d '{"filter": {"must": [{"key": "type", "match": {"value": "job"}}]}}'

sync:
    #!/usr/bin/env sh
    TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"email":"admin@example.com","password":"password123"}' \
      | node -e "process.stdin.on('data',d=>{try{console.log(JSON.parse(d).token)}catch(e){console.log('')}})")
    curl -s -X POST http://localhost:8000/api/sync/all \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json"

clean:
    #!/usr/bin/env sh
    rm -rf client/node_modules server/node_modules
    rm -rf client/package-lock.json server/package-lock.json
    docker compose down --volumes --rmi local

# ─── Setup ──────────────────────────────────────────────────────────────────────

seed:
    just db seed

unseed:
    just db unseed

setup:
    just db migrate
    just db seed || true