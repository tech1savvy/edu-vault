# EduVault Deployment Guide

A step-by-step guide to deploy EduVault on AWS using Terraform and Ansible.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: AWS Setup](#step-1-aws-setup)
3. [Step 2: Local Setup](#step-2-local-setup)
4. [Step 3: Configure Secrets](#step-3-configure-secrets)
5. [Step 4: Deploy Infrastructure](#step-4-deploy-infrastructure)
6. [Step 5: Deploy Application](#step-5-deploy-application)
7. [Step 6: Verify Deployment](#step-6-verify-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

| Tool | Version | Install Guide |
|------|---------|--------------|
| AWS CLI | v2 | [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) |
| Terraform | v1.0+ | [Install Terraform](https://developer.hashicorp.com/terraform/install) |
| Ansible | v2.9+ | `pip install ansible` or [Install Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) |
| Git | Latest | [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) |

### Verify Installation

Open a terminal and run these commands:

```bash
# Check AWS CLI
aws --version
# Expected: aws-cli/2.x.x

# Check Terraform
terraform --version
# Expected: Terraform v1.x.x

# Check Ansible
ansible --version
# Expected: ansible [core x.x.x]

# Check Git
git --version
# Expected: git version x.x.x
```

---

## Step 1: AWS Setup

### 1.1 Create AWS Account

1. Go to [AWS Console](https://aws.amazon.com/)
2. Click "Create an AWS Account"
3. Follow the registration steps
4. Choose "Personal" or "Professional" account

### 1.2 Create IAM User

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click "Users" → "Add users"
3. User name: `eduvault-deploy`
4. Access type: ✅ "Programmatic access"
5. Click "Next: Permissions"
6. Click "Attach existing policies directly"
7. Search and select these policies:
   - ✅ `AmazonEC2FullAccess`
   - ✅ `IAMFullAccess` (for key pairs)
8. Click "Next" → "Next" → "Create user"
9. **IMPORTANT**: Save the `Access key ID` and `Secret access key`

### 1.3 Configure AWS CLI

```bash
# Configure AWS credentials
aws configure

# Enter the following when prompted:
# AWS Access Key ID [None]: YOUR_ACCESS_KEY
# AWS Secret Access Key [None]: YOUR_SECRET_KEY
# Default region name [None]: ap-south-1
# Default output format [None]: json
```

### 1.4 Generate SSH Key (for EC2 access)

```bash
# Check if you have an SSH key
ls ~/.ssh/id_rsa

# If not, create one:
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
# Press Enter to save to default location
# Enter a passphrase (optional, can leave empty)

# Verify your public key
cat ~/.ssh/id_rsa.pub
```

---

## Step 2: Local Setup

### 2.1 Clone the Repository

```bash
# Navigate to where you want to work
cd ~/Projects

# Clone the repository
git clone https://github.com/tech1savvy/edu-vault.git

# Enter the project directory
cd edu-vault
```

### 2.2 Navigate to Infrastructure Directory

```bash
cd infra
```

---

## Step 3: Configure Secrets

### 3.1 Create Secrets File

```bash
cd ansible

# Copy the example file
cp secrets.yml.example secrets.yml

# Edit the secrets file
nano secrets.yml
# OR on Mac:
open -e secrets.yml
```

### 3.2 Edit secrets.yml

Replace the placeholder values with your own secure values:

```yaml
---
# Database settings
postgres_db: edu_vault
postgres_user: postgres
postgres_password: YOUR_SECURE_DB_PASSWORD_HERE  # CHANGE THIS!

# JWT Secret (use a long random string)
jwt_secret: YOUR_LONG_RANDOM_SECRET_HERE  # CHANGE THIS!

# Qdrant collection name
qdrant_collection: eduvault

# Test account credentials
test_user_email: student1@example.com
test_user_password: password123
```

### 3.3 Generate Secure Passwords

Use these commands to generate secure passwords:

```bash
# Generate a random password
openssl rand -base64 32

# Generate JWT secret
openssl rand -hex 64
```

---

## Step 4: Deploy Infrastructure

### 4.1 Initialize Terraform

```bash
cd ../terraform

# Copy and edit terraform variables
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars (optional - defaults work)
nano terraform.tfvars
```

### 4.2 Default terraform.tfvars

The defaults are fine for first-time deployment:

```hcl
project_name   = "eduvault"
environment    = "production"
instance_type  = "t3.micro"
volume_size    = 30
aws_region     = "ap-south-1"
```

### 4.3 Deploy Infrastructure

```bash
# Initialize Terraform (downloads providers)
terraform init

# Preview what will be created
terraform plan

# Deploy infrastructure
terraform apply
# Type 'yes' when prompted
```

### 4.4 Save the Output

**IMPORTANT**: Note the public IP address from the output:

```
Outputs:

public_ip = "13.200.59.174"  # <-- NOTE THIS IP!
instance_id = "i-xxxxxxxxxxxxx"
security_group_id = "sg-xxxxxxxx"
```

### 4.5 Update Ansible Inventory

```bash
cd ../ansible

# Edit the inventory file
nano inventory/hosts.ini
```

Update with your server IP:

```ini
[app_servers]
eduvault-prod ansible_host=YOUR_SERVER_IP_HERE

[app_servers:vars]
app_user=ec2-user
app_dir=/home/ec2-user/edu-vault
app_repo=https://github.com/tech1savvy/edu-vault.git
```

---

## Step 5: Deploy Application

### 5.1 Test Connection

```bash
# Test that Ansible can connect to the server
ansible all -m ping
```

Expected output:
```
eduvault-prod | SUCCESS => {
    "ping": "pong"
}
```

### 5.2 Run Deployment

```bash
# Deploy the application
ansible-playbook playbooks/deploy.yml
```

This will:
1. Install git on the server
2. Install Docker and docker-compose
3. Clone the repository
4. Create environment file
5. Build and start all containers
6. Run database migrations
7. Seed the database

### 5.3 Wait for Deployment

Deployment takes approximately **5-10 minutes** depending on network speed.

---

## Step 6: Verify Deployment

### 6.1 Check Container Status

```bash
# SSH into your server
ssh ec2-user@YOUR_SERVER_IP

# Check running containers
docker-compose ps
```

Expected output:
```
NAME                STATUS
eduvault-backend    Up
eduvault-client     Up
eduvault-ml         Up
eduvault-postgres   Up
eduvault-qdrant     Up
```

### 6.2 Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://YOUR_SERVER_IP:5173 |
| Backend API | http://YOUR_SERVER_IP:8000 |
| ML Service | http://YOUR_SERVER_IP:8001 |
| Qdrant Dashboard | http://YOUR_SERVER_IP:6333 |

### 6.3 Login

- **Email**: student1@example.com
- **Password**: password123

---

## Managing Your Deployment

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail 100
```

### Restart Services

```bash
# Restart all
ansible-playbook playbooks/restart.yml

# Or manually on server:
docker-compose restart
```

### Update Application

```bash
# Pull latest code and rebuild
ansible-playbook playbooks/deploy.yml
```

### Stop Everything

```bash
# On server:
docker-compose down

# To remove containers and volumes:
docker-compose down -v
```

### Destroy Infrastructure

```bash
# WARNING: This deletes everything!
cd infra/terraform
terraform destroy
# Type 'yes' when prompted
```

---

## Troubleshooting

### "Permission denied (publickey)"

1. Check your SSH key exists:
   ```bash
   ls ~/.ssh/id_rsa
   ```

2. Verify key permissions:
   ```bash
   chmod 600 ~/.ssh/id_rsa
   ```

3. Test SSH directly:
   ```bash
   ssh -i ~/.ssh/id_rsa ec2-user@YOUR_IP
   ```

### "Terraform: Could not load plugin"

```bash
cd infra/terraform
rm -rf .terraform
terraform init
```

### "Ansible: Module not found"

```bash
pip install ansible
```

### "Docker containers not starting"

Check logs:
```bash
docker-compose logs
```

Restart Docker:
```bash
sudo systemctl restart docker
```

### "Port already in use"

Check what's using the port:
```bash
sudo netstat -tulpn | grep 5173
```

Kill the process or change the port in docker-compose.yml.

### "Database connection failed"

1. Wait for PostgreSQL to initialize (30 seconds)
2. Check if PostgreSQL is running:
   ```bash
   docker-compose ps postgres
   ```
3. Check logs:
   ```bash
   docker-compose logs postgres
   ```

### "Frontend showing blank page"

1. Check if client is running:
   ```bash
   docker-compose logs client
   ```
2. Rebuild client:
   ```bash
   docker-compose up -d --build client
   ```

---

## Quick Reference

### All Commands in Order

```bash
# 1. Clone repo
git clone https://github.com/tech1savvy/edu-vault.git
cd edu-vault/infra

# 2. Configure AWS
aws configure

# 3. Setup secrets
cd ansible
cp secrets.yml.example secrets.yml
nano secrets.yml

# 4. Deploy infrastructure
cd ../terraform
terraform init
terraform apply

# 5. Update inventory (note the IP from terraform output)
cd ../ansible
nano inventory/hosts.ini

# 6. Deploy application
ansible-playbook playbooks/deploy.yml

# 7. Access at http://SERVER_IP:5173
```

### Service URLs

| Service | Port | URL Example |
|--------|------|-------------|
| Frontend | 5173 | http://13.200.59.174:5173 |
| Backend | 8000 | http://13.200.59.174:8000 |
| ML | 8001 | http://13.200.59.174:8001 |
| Qdrant | 6333 | http://13.200.59.174:6333 |

### Default Credentials

| Purpose | Username | Password |
|---------|----------|----------|
| Student Login | student1@example.com | password123 |
| Database | postgres | (your secrets.yml value) |

---

## Security Notes

- **Never commit `secrets.yml`** to version control
- **Use strong passwords** in production
- **Restrict SSH access** to your IP only (update Security Group)
- **Enable HTTPS** for production use
- **Regular backups**: Configure automated database backups

---

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review container logs: `docker-compose logs`
3. Check AWS EC2 instance status in AWS Console
4. Verify Security Group rules allow the required ports

---

## License

See the main [README.md](../../README.md) for license information.
