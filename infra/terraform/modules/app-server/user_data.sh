#!/bin/bash
set -e

echo "=== EduVault Server Setup ==="
echo "Project: ${project_name}"

export DEBIAN_FRONTEND=noninteractive

echo "=== Updating system ==="
yum update -y

echo "=== Installing Docker ==="
yum install -y docker
systemctl enable docker
systemctl start docker

echo "=== Installing Docker Compose ==="
curl -sL "https://github.com/docker/compose/releases/download/v${docker_compose_version}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
docker compose version

echo "=== Adding ec2-user to docker group ==="
usermod -aG docker ec2-user

echo "=== Configuring firewall (optional) ==="
systemctl disable firewalld 2>/dev/null || true

echo "=== Docker setup complete ==="
echo "To deploy EduVault:"
echo "  1. SSH into the instance"
echo "  2. git clone <your-repo>"
echo "  3. cd eduvault"
echo "  4. docker compose up -d"
