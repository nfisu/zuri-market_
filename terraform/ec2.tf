# Zuri Market — EC2 Instance
# The application server running in the public subnet.

# Latest Amazon Linux 2023 AMI (eu-west-2)
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

# --- Bootstrap script ---
# Runs once on first boot. Installs k3s + Docker, then makes kubeconfig readable.
locals {
  user_data = <<-EOF
    #!/bin/bash
    set -euxo pipefail

    # Update OS packages
    dnf update -y
    dnf install -y docker

    # Start Docker (handy for debugging k3s containers later)
    systemctl enable --now docker
    usermod -aG docker ec2-user

    # Install k3s
    # --write-kubeconfig-mode 644 makes the kubeconfig file readable
    # without sudo, so 'kubectl' works as ec2-user out of the box.
    curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="--write-kubeconfig-mode 644" sh -

    # Wait for k3s to be ready
    until kubectl get nodes 2>/dev/null | grep -q ' Ready'; do
      sleep 2
    done

    # Mark provisioning complete (used by verification later)
    echo "k3s ready at $(date)" > /home/ec2-user/k3s-ready.txt
    chown ec2-user:ec2-user /home/ec2-user/k3s-ready.txt
  EOF
}

resource "aws_instance" "app" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = "t3.small"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.ec2.id]
  key_name               = aws_key_pair.main.key_name
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  user_data              = local.user_data

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
    encrypted   = true
  }

  tags = {
    Name = "${var.project_name}-app"
  }
}

# --- Output the public IP so you know where to SSH ---
output "instance_public_ip" {
  description = "Public IP of the EC2 app server"
  value       = aws_instance.app.public_ip
}

output "ssh_command" {
  description = "Ready-to-use SSH command"
  value       = "ssh -i ../ssh-key ec2-user@${aws_instance.app.public_ip}"
}