locals {
  name_prefix = "${var.project_name}-${var.environment}"
}

module "app_server" {
  source = "./modules/app-server"

  project_name     = var.project_name
  environment      = var.environment
  instance_type    = var.instance_type
  ami_id           = var.ami_id
  volume_size      = var.volume_size
  volume_type      = var.volume_type
  enable_public_ip = var.enable_public_ip

  ssh_key_pair_name   = var.ssh_key_pair_name
  ssh_public_key_path = var.ssh_public_key_path
  allowed_ssh_cidrs   = var.allowed_ssh_cidrs

  common_tags = var.common_tags
}
