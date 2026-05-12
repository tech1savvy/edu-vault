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

build:
    docker compose build
    docker compose up -d

# ─── Database ──────────────────────────────────────────────────────────────────
# just db migrate → run migrations
# just db seed    → run seeders
# just db unseed  → undo all seeds

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