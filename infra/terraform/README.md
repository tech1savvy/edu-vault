# Infrastructure as Code - AWS EC2 Deployment

## Overview

This Terraform configuration deploys EduVault on a single EC2 instance with Docker.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    VPC (10.0.0.0/16)                     │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Subnet (10.0.1.0/24)                  │ │
│  │  ┌──────────────────────────────────────────────┐  │ │
│  │  │         EC2 t3.micro Instance               │  │ │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐       │  │ │
│  │  │  │ Client  │ │ Backend │ │   ML    │       │  │ │
│  │  │  │  :5173   │ │  :8000  │ │  :8001  │       │  │ │
│  │  │  └─────────┘ └─────────┘ └─────────┘       │  │ │
│  │  │  ┌─────────┐ ┌─────────┐                   │  │ │
│  │  │  │Postgres │ │ Qdrant │                   │  │ │
│  │  │  │  :5432   │ │  :6333 │                   │  │ │
│  │  │  └─────────┘ └─────────┘                   │  │ │
│  │  └──────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────┘ │
│                          ▲                               │
│                          │ Route Table                   │
│                    ┌─────┴─────┐                        │
│                    │  Internet  │                        │
│                    │  Gateway   │                        │
│                    └───────────┘                         │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

- Terraform >= 1.0.0
- AWS CLI configured with credentials
- SSH key pair (or will be created automatically)

## Quick Start

```bash
# Navigate to terraform directory
cd infra/terraform

# Copy and configure variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your settings

# Initialize Terraform
terraform init

# Plan changes
terraform plan

# Apply changes
terraform apply

# Note the SSH key location from outputs
# Connect to instance: ssh -i <key>.pem ec2-user@<public-ip>
```

## Configuration

### terraform.tfvars

| Variable | Description | Default |
|----------|-------------|---------|
| `aws_region` | AWS region | `ap-south-1` |
| `project_name` | Project name for resources | `eduvault` |
| `environment` | Environment name | `development` |
| `instance_type` | EC2 instance type | `t3.micro` |
| `ssh_key_pair_name` | Existing AWS key pair name | `""` (creates new) |
| `allowed_ssh_cidrs` | CIDRs allowed for SSH | `["0.0.0.0/0"]` |

## Security Group Ports

| Port | Service | Purpose |
|------|---------|---------|
| 22 | SSH | Remote administration |
| 80 | HTTP | Web traffic |
| 443 | HTTPS | Secure web |
| 5173 | Client | React frontend |
| 8000 | Backend | Express API |
| 8001 | ML | FastAPI service |

## Deployment

After SSH into the instance:

```bash
# Clone repository
git clone <repo-url> && cd eduvault

# Create environment file
cat > .env << EOF
DB_HOST=postgres
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_DATABASE=edu_vault
DB_PORT=5432
JWT_SECRET=your-jwt-secret
ML_SERVICE_URL=http://ml:8001
NODE_ENV=production
EOF

# Start services
docker compose up -d

# Run migrations
docker compose exec backend npx sequelize-cli db:migrate
docker compose exec backend npx sequelize-cli db:seed:all
```

## Teammate Collaboration

### Option 1: Shared Key Pair
1. One team member creates a key pair in AWS Console
2. Share the key name in `ssh_key_pair_name` variable
3. Share the private key securely (encrypted message)

### Option 2: Individual Key Pairs
1. Each member creates their own key pair in AWS Console
2. Use `ssh_public_key_path` to reference local public key
3. Terraform creates key pair on first apply

### Remote State (Optional)
Uncomment `backend.tf.example` and configure S3 backend for team state sharing.

## Cost

- **t3.micro**: ~$8-10/month (if outside free tier)
- **Storage**: ~$2/month (20GB gp3)
- **Total**: ~$10-12/month

## Cleanup

```bash
terraform destroy
```
