variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "ami_id" {
  description = "Amazon Machine Image ID"
  type        = string
  default     = ""
}

variable "volume_size" {
  description = "Root volume size in GB"
  type        = number
  default     = 20
}

variable "volume_type" {
  description = "EBS volume type"
  type        = string
  default     = "gp3"
}

variable "enable_public_ip" {
  description = "Whether to assign a public IP"
  type        = bool
  default     = true
}

variable "ssh_key_pair_name" {
  description = "Existing SSH key pair name"
  type        = string
  default     = ""
}

variable "ssh_public_key_path" {
  description = "Path to SSH public key file"
  type        = string
  default     = ""
}

variable "allowed_ssh_cidrs" {
  description = "CIDR blocks for SSH access"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "common_tags" {
  description = "Common tags for resources"
  type        = map(string)
  default     = {}
}

variable "create_monitoring_role" {
  description = "Whether to create IAM role for CloudWatch monitoring"
  type        = bool
  default     = false
}

variable "enable_cloudwatch" {
  description = "Whether to create CloudWatch log groups and alarms"
  type        = bool
  default     = false
}

variable "cloudwatch_log_retention" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 7
}

variable "alarm_sns_arn" {
  description = "ARN of SNS topic for CloudWatch alarms (leave empty to skip)"
  type        = string
  default     = ""
}

variable "alarm_email" {
  description = "Email address for CloudWatch alarm notifications (leave empty to skip)"
  type        = string
  default     = ""
}

variable "aws_region" {
  description = "AWS region for CloudWatch resources"
  type        = string
  default     = "ap-south-1"
}
