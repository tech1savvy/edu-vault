# EduVault

AI-Augmented Centralized Student Profiling platform for Higher Education Institutions.

## Quick Start

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed local setup instructions.

```bash
# Start databases only (for local dev)
docker compose -f docker-compose.dev.yml up -d

# Or start everything in Docker
docker compose up -d
```

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        Docker Compose                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────┐    ┌───────────┐    ┌─────────┐                  │
│  │  Client   │───▶│  Server   │───▶│   ML    │                  │
│  │  (React)  │◀───│ (Express) │    │(FastAPI)│                  │
│  └───────────┘    └─────┬─────┘    └────┬────┘                  │
│                         │               │                       │
│                         ▼               ▼                       │
│                   ┌───────────┐  ┌───────────┐                  │
│                   │ PostgreSQL│  │  Qdrant   │                  │
│                   └───────────┘  │ (Vectors) │                  │
│                                   └───────────┘                  │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │Prometheus│  │ Grafana  │  │Alertmanager │  │Node Exporter│  │
│  │ Metrics  │──│Dashboards│──│ Notifications│  │   Host      │  │
│  │ Storage  │  │  (4 dash)│  │  (email)    │  │   Metrics   │  │
│  └──────────┘  └──────────┘  └─────────────┘  └─────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## Monitoring Stack

The production deployment includes a full observability stack:

| Service | Port | Description |
|---------|------|-------------|
| **Prometheus** | `:9090` | Metrics storage & alert evaluation (5 alert rules) |
| **Grafana** | `:3000` | Dashboards for app, Docker, system, node metrics |
| **Alertmanager** | `:9093` | Alert routing & email notifications (requires SMTP config) |
| **Node Exporter** | `:9100` | Server-level CPU, memory, disk metrics |

Both the **Server** (Express) and **ML** (FastAPI) services expose `/metrics` endpoints instrumented with Prometheus clients. Container-level resource usage can be viewed via `docker stats`.

## Tech Stack

- **Frontend**: React 19, Vite, Bootstrap CSS
- **Backend**: Express.js 5, Sequelize ORM
- **ML Service**: Python, FastAPI, fastembed, Qdrant
- **Database**: PostgreSQL 16
- **Vector DB**: Qdrant
- **Infrastructure**: Docker Compose, Terraform, Ansible
- **Monitoring**: Prometheus, Grafana, Alertmanager, Node Exporter

## Deployment

See [PRODUCTION.md](./PRODUCTION.md) for full deployment instructions including Terraform + Ansible provisioning and monitoring setup.
