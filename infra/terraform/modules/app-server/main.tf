locals {
  name_prefix  = "${var.project_name}-${var.environment}"
  ssh_key_name = var.ssh_key_pair_name != "" ? var.ssh_key_pair_name : "${local.name_prefix}-key"
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-vpc"
  })
}

resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = data.aws_availability_zones.available.names[0]
  map_public_ip_on_launch = true

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-subnet"
  })
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-igw"
  })
}

resource "aws_route_table" "main" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-rt"
  })
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.main.id
}

resource "aws_security_group" "app" {
  name        = "${local.name_prefix}-sg"
  description = "Security group for EduVault application servers"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.allowed_ssh_cidrs
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Client (React Frontend)"
    from_port   = 5173
    to_port     = 5173
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Backend (Express API)"
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "ML Service (FastAPI)"
    from_port   = 8001
    to_port     = 8001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Qdrant Dashboard"
    from_port   = 6333
    to_port     = 6333
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-sg"
  })
}

resource "aws_key_pair" "app_key" {
  count      = var.ssh_key_pair_name == "" ? 1 : 0
  key_name   = local.ssh_key_name
  public_key = file(var.ssh_public_key_path != "" ? var.ssh_public_key_path : pathexpand("~/.ssh/id_rsa.pub"))

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-key"
  })
}

resource "aws_instance" "app_server" {
  ami           = var.ami_id != "" ? var.ami_id : data.aws_ami.amzlinux2023.id
  instance_type = var.instance_type

  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.app.id]
  associate_public_ip_address = var.enable_public_ip

  root_block_device {
    volume_size = var.volume_size
    volume_type = var.volume_type
    encrypted   = true
  }

  key_name = local.ssh_key_name

  user_data = templatefile("${path.module}/user_data.sh", {
    project_name           = var.project_name
    docker_compose_version = "2.24.0"
  })

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-instance"
  })
}

resource "aws_eip" "app_server" {
  count  = var.enable_public_ip ? 1 : 0
  domain = "vpc"

  instance = aws_instance.app_server.id

  tags = merge(var.common_tags, {
    Name = "${local.name_prefix}-eip"
  })
}

data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_ami" "amzlinux2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.app_server.id
}

output "public_ip" {
  description = "Public IP address"
  value       = var.enable_public_ip ? aws_eip.app_server[0].public_ip : aws_instance.app_server.public_ip
}

output "private_ip" {
  description = "Private IP address"
  value       = aws_instance.app_server.private_ip
}

output "availability_zone" {
  description = "Availability zone"
  value       = aws_instance.app_server.availability_zone
}

output "security_group_id" {
  description = "Security group ID"
  value       = aws_security_group.app.id
}

output "security_group_name" {
  description = "Security group name"
  value       = aws_security_group.app.name
}

output "vpc_id" {
  description = "VPC ID"
  value       = aws_vpc.main.id
}

output "subnet_id" {
  description = "Subnet ID"
  value       = aws_subnet.public.id
}
