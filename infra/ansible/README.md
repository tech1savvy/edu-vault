# EduVault Ansible Playbooks

Ansible playbooks for deploying and managing EduVault on AWS EC2.

## Structure

```
infra/ansible/
├── ansible.cfg              # Ansible configuration
├── inventory/
│   └── hosts.ini            # Server inventory
├── playbooks/
│   ├── deploy.yml           # Full deployment playbook
│   └── restart.yml          # Restart services only
├── roles/
│   ├── common/              # Git, system packages
│   ├── docker/              # Docker installation
│   └── app/                 # App deployment (clone, env, build, migrate)
│       └── templates/
│           └── .env.j2      # Environment template
├── secrets.yml.example      # Vault variables template
└── README.md
```

## Prerequisites

1. **Ansible installed**:
   ```bash
   pip install ansible
   pip install community.docker
   ```

2. **SSH access to server** with your private key

3. **Vault password** for secrets

## Setup

### 1. Configure Inventory

Edit `inventory/hosts.ini` with your server IP:
```ini
[app_servers]
eduvault-prod ansible_host=YOUR_SERVER_IP
```

### 2. Create Secrets Vault

```bash
# Create encrypted vault
ansible-vault create secrets.yml

# Or from example
cp secrets.yml.example secrets.yml
ansible-vault encrypt secrets.yml
```

Edit `secrets.yml` with your values:
```yaml
postgres_db: edu_vault
postgres_user: postgres
postgres_password: your_secure_password
jwt_secret: your_jwt_secret
qdrant_collection: eduvault
test_user_email: student1@example.com
test_user_password: password123
```

### 3. Install Collections

```bash
ansible-galaxy collection install community.docker
```

## Usage

### Full Deployment

```bash
ansible-playbook -i inventory/hosts.ini playbooks/deploy.yml --ask-vault-pass
```

### Restart Services Only

```bash
ansible-playbook -i inventory/hosts.ini playbooks/restart.yml --ask-vault-pass
```

### Partial Execution with Tags

```bash
# Install Docker only
ansible-playbook -i inventory/hosts.ini playbooks/deploy.yml --tags docker --ask-vault-pass

# Clone/update repo only
ansible-playbook -i inventory/hosts.ini playbooks/deploy.yml --tags clone --ask-vault-pass

# Build containers only
ansible-playbook -i inventory/hosts.ini playbooks/deploy.yml --tags build --ask-vault-pass

# Run migrations only
ansible-playbook -i inventory/hosts.ini playbooks/deploy.yml --tags migrate --ask-vault-pass
```

## Tags Available

| Tag | Description |
|-----|-------------|
| `common` | Install git, system packages |
| `docker` | Install Docker Engine + Compose |
| `clone` | Clone/update repository |
| `env` | Create environment file |
| `build` | Build Docker images |
| `migrate` | Run database migrations |
| `start` | Start containers |

## Verification

After deployment, verify services:

```bash
# SSH to server
ssh -i ~/.ssh/id_rsa ec2-user@YOUR_SERVER_IP

# Check containers
cd ~/eduvault && docker-compose ps

# Test API
curl http://localhost:8000/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@example.com","password":"password123"}'
```

## Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://YOUR_IP:5173 |
| Backend | http://YOUR_IP:8000 |
| ML | http://YOUR_IP:8001 |
| Qdrant Dashboard | http://YOUR_IP:6333/dashboard |

## Troubleshooting

### SSH Connection Issues
```bash
# Test connectivity
ansible all -i inventory/hosts.ini -m ping
```

### Docker Not Running
```bash
# On server
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user
```

### Container Logs
```bash
# View all logs
docker-compose -f ~/eduvault/docker-compose.yml logs -f

# View specific service
docker-compose -f ~/eduvault/docker-compose.yml logs -f backend
```

## For Teammates

1. Clone the repo
2. Copy `secrets.yml.example` to `secrets.yml`
3. Ask team lead for vault password
4. Run `ansible-vault edit secrets.yml` to add your values
5. Run deployment with `--ask-vault-pass`
