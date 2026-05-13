# Production Deployment

This guide covers deploying the full EduVault stack (app + monitoring) on AWS EC2 using Terraform + Ansible.

## Architecture

The production environment runs 10 Docker containers on a single EC2 instance:

| Container | Service | Description |
|-----------|---------|-------------|
| `eduvault-postgres` | PostgreSQL 16 | Primary database |
| `eduvault-qdrant` | Qdrant 1.9 | Vector database |
| `eduvault-backend` | Express 5 API | Business logic, port `:8000` |
| `eduvault-ml` | FastAPI | ML service, port `:8001` |
| `eduvault-client` | React 19 | Frontend, port `:5173` |
| `eduvault-prometheus` | Prometheus 2.53 | Metrics storage, port `:9090` |
| `eduvault-grafana` | Grafana 11.1 | Dashboards, port `:3000` |
| `eduvault-alertmanager` | Alertmanager 0.27 | Alert routing, port `:9093` |
| `eduvault-node-exporter` | Node Exporter 1.8 | Host metrics, port `:9100` |
| `eduvault-cadvisor` | cAdvisor latest | Container metrics, port `:8080` |

## Prerequisites

- Terraform installed locally
- Ansible installed locally (`ansible-playbook`, `ansible-galaxy`)
- SSH key at `~/.ssh/id_rsa` (public key will be imported to AWS)
- AWS credentials configured (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`)
- Docker & docker-compose available locally for testing

## Full Redeploy from Scratch

### Step 1: Provision EC2 with Terraform

```bash
cd infra/terraform

# Review variables, then apply
terraform apply -auto-approve
```

This creates:
- VPC with public subnet, IGW, route table
- Security group (ports: 22, 80, 443, 5173, 8000, 8001, 3000, 6333, 8080, 9090, 9093, 9100)
- EC2 t3.small instance (30GB gp3, Amazon Linux 2023)
- Elastic IP
- IAM role for CloudWatch metrics
- CloudWatch dashboard + alarms (optional)
- SSH key pair (imports `~/.ssh/id_rsa.pub`)

Wait ~3 minutes for `user_data.sh` to install Docker & docker-compose.

### Step 2: Deploy with Ansible

```bash
cd infra/ansible

# Install required Ansible collection
ansible-galaxy collection install community.docker

# Run the deploy playbook
ansible-playbook playbooks/deploy.yml
```

This runs four roles:
1. **common** — installs git
2. **docker** — ensures Docker + docker-compose are installed
3. **app** — clones repo, creates `.env`, builds & starts containers, runs migrations + seeds
4. **monitoring** — copies Prometheus/Grafana/Alertmanager configs, creates volumes

> **Note**: The EC2 uses the standalone `docker-compose` binary (v1 hyphenated), NOT the `docker compose` plugin. The Ansible playbooks and the AGENTS.md both use `docker-compose` accordingly.

### Step 3: Overlay Monitoring Files

The GitHub repo's `docker-compose.yml` only has the 5 app services. The monitoring changes are local:

```bash
# From the repo root:
scp -i ~/.ssh/id_rsa docker-compose.yml ec2-user@<IP>:/home/ec2-user/eduvault/
scp -i ~/.ssh/id_rsa server/app.js ec2-user@<IP>:/home/ec2-user/eduvault/server/
scp -i ~/.ssh/id_rsa ml/main.py ec2-user@<IP>:/home/ec2-user/eduvault/ml/
scp -ri ~/.ssh/id_rsa monitoring ec2-user@<IP>:/home/ec2-user/eduvault/
```

Then rebuild and restart:

```bash
ssh -i ~/.ssh/id_rsa ec2-user@<IP>
cd /home/ec2-user/eduvault
docker-compose up -d --build
docker-compose exec -T backend npx sequelize-cli db:migrate
docker-compose exec -T backend npx sequelize-cli db:seed:all
```

## Service URLs

| Service | URL | Default Credentials |
|---------|-----|---------------------|
| **Backend API** | `http://<IP>:8000` | — |
| **ML Service** | `http://<IP>:8001` | — |
| **Prometheus** | `http://<IP>:9090` | — |
| **Grafana** | `http://<IP>:3000` | `admin / admin` |
| **Alertmanager** | `http://<IP>:9093` | — |
| **Node Exporter** | `http://<IP>:9100` | — |
| **cAdvisor** | `http://<IP>:8080` | — |

### Grafana Dashboards

4 dashboards are auto-provisioned:

| Dashboard | Description |
|-----------|-------------|
| **Node Exporter - System Overview** | CPU, memory, disk, network |
| **Docker Container Monitoring** | Per-container CPU, memory, network I/O |
| **EduVault Application** | Backend request rate, error rate, latency (from `/metrics`) |
| **EduVault** | Legacy overview dashboard |

### Alert Rules (Prometheus)

5 alert rules loaded:

| Alert | Condition | Severity |
|-------|-----------|----------|
| `HighCPULoad` | CPU > 80% for 5m | warning |
| `HighMemoryUsage` | Memory > 80% for 5m | warning |
| `DiskSpaceLow` | Disk < 15% free for 5m | critical |
| `ServiceDown` | Any `up == 0` for 1m | critical |
| `BackendHighErrorRate` | 5xx rate > 5% over 5m | warning |

Alerts are routed through Alertmanager to email (`admin@example.com`). Requires an SMTP server to be configured in `secrets.yml`.

## Configuration Files

| Path | Purpose |
|------|---------|
| `monitoring/prometheus/prometheus.yml` | Scrape targets, global settings |
| `monitoring/prometheus/alert.rules.yml` | Alert rule definitions |
| `monitoring/alertmanager/alertmanager.yml` | Receivers, routing, inhibit rules |
| `monitoring/grafana/grafana.ini` | Grafana server config |
| `monitoring/grafana/datasources/datasource.yml` | Prometheus data source |
| `monitoring/grafana/dashboards/providers/dashboards.yml` | Dashboard provisioning |
| `monitoring/grafana/dashboards/json/*.json` | Dashboard JSON models |
| `infra/ansible/roles/monitoring/` | Ansible role for provisioning monitoring configs |
| `infra/terraform/modules/app-server/` | Terraform module for EC2 + monitoring IAM |

## Environment Variables

| Variable | Source | Purpose |
|----------|--------|---------|
| `DB_PASSWORD` | `.env` / `secrets.yml` | PostgreSQL connection |
| `POSTGRES_PASSWORD` | `.env` / `secrets.yml` | PostgreSQL container init |
| `JWT_SECRET` | `.env` / `secrets.yml` | Token signing |
| `GF_SECURITY_ADMIN_PASSWORD` | `docker-compose.yml` | Grafana login |
| `smtp_host` | `secrets.yml` | Alertmanager email relay |
| `alert_email` | `secrets.yml` | Alert notification recipient |

## Security Notes

- Do NOT commit `infra/ansible/secrets.yml` or `infra/terraform/terraform.tfvars` (both are gitignored)
- Change default passwords before production use (Grafana, PostgreSQL, JWT)
- Alertmanager SMTP should use an authenticated relay (SES, SendGrid) — `localhost:25` won't deliver
- The security group allows all ports from `0.0.0.0/0` — restrict to trusted IPs in production
