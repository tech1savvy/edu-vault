output "instance" {
  description = "EC2 instance details"
  value = {
    id                = module.app_server.instance_id
    public_ip         = module.app_server.public_ip
    private_ip        = module.app_server.private_ip
    availability_zone = module.app_server.availability_zone
  }
}

output "ssh_connection" {
  description = "SSH connection command"
  value       = "ssh -i ${local.ssh_key_file} ec2-user@${module.app_server.public_ip}"
}

output "ssh_key_file" {
  description = "Path to SSH private key file (if created)"
  value       = local.ssh_key_file
  sensitive   = true
}

output "ssh_key_name" {
  description = "SSH key pair name used"
  value       = local.ssh_key_name
}

output "security_group" {
  description = "Security group details"
  value = {
    id   = module.app_server.security_group_id
    name = module.app_server.security_group_name
  }
}

output "ports_open" {
  description = "List of open ports and their purposes"
  value = {
    "22"   = "SSH"
    "80"   = "HTTP"
    "443"  = "HTTPS"
    "5173" = "Client (React Frontend)"
    "8000" = "Backend (Express API)"
    "8001" = "ML Service (FastAPI)"
  }
}

output "docker_commands" {
  description = "Commands to run Docker Compose after SSH"
  value = {
    clone_repo = "git clone <repo-url> && cd eduvault"
    start      = "docker compose up -d"
    logs       = "docker compose logs -f"
  }
}

locals {
  ssh_key_name = var.ssh_key_pair_name != "" ? var.ssh_key_pair_name : "${local.name_prefix}-key"
  ssh_key_file = var.ssh_key_pair_name != "" ? "" : "${path.cwd}/${local.ssh_key_name}.pem"
}
