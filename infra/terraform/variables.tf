variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name used for resource naming and tagging"
  type        = string
  default     = "eduvault"
}

variable "environment" {
  description = "Environment name (development, staging, production)"
  type        = string
  default     = "development"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "Amazon Machine Image ID. Leave empty to auto-select latest Amazon Linux 2023"
  type        = string
  default     = ""
}

variable "volume_size" {
  description = "Root volume size in GB (minimum 30GB for Amazon Linux 2023)"
  type        = number
  default     = 30
}

variable "volume_type" {
  description = "EBS volume type (gp2, gp3, io1, io2)"
  type        = string
  default     = "gp3"
}

variable "ssh_key_pair_name" {
  description = "Existing SSH key pair name in AWS. If empty, a new key pair will be created"
  type        = string
  default     = ""
}

variable "ssh_public_key_path" {
  description = "Path to SSH public key file (for creating new key pair)"
  type        = string
  default     = ""
}

variable "allowed_ssh_cidrs" {
  description = "CIDR blocks allowed to access SSH"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "enable_public_ip" {
  description = "Whether to assign a public IP to the instance"
  type        = bool
  default     = true
}

variable "common_tags" {
  description = "Common tags applied to all resources"
  type        = map(string)
  default = {
    Project     = "EduVault"
    ManagedBy   = "Terraform"
    Environment = "development"
  }
}
