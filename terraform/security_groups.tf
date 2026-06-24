# Zuri Market — Security Groups
# Controls inbound and outbound traffic for the EC2 instance.
resource "aws_security_group" "ec2" {
  name        = "${var.project_name}-ec2-sg"
  description = "Allow SSH from home, HTTP/HTTPS from anywhere"
  vpc_id      = aws_vpc.main.id

  # SSH — only from your IP
  ingress {
    description = "SSH from home"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.home_ip_cidr]
  }

  # CAPSTONE DEMO ONLY: SSH from GitHub Actions runners
  # GitHub Actions uses dynamic IPs across many ranges, so we open SSH to the world
  # for CI/CD. Production: use AWS SSM Session Manager or a self-hosted GitHub runner
  # inside the VPC, eliminating this rule entirely.
  ingress {
    description = "SSH from GitHub Actions (CI/CD)"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP — public
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS — public
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Kubernetes API — only from your IP (kubectl access)
  ingress {
    description = "k3s API from home"
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = [var.home_ip_cidr]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-ec2-sg"
  }
}