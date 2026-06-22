# Zuri Market — IAM role for the EC2 instance
# Grants the EC2 permission to read from AWS Secrets Manager.

# --- The role itself ---
# Think of this as a "job title" the EC2 instance assumes.
resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-ec2-role"

  # Who is allowed to assume this role? Only EC2 instances.
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })

  tags = {
    Name = "${var.project_name}-ec2-role"
  }
}

# --- What this role is ALLOWED to do ---
# Read any secret tagged with our project name. Tight scope.
resource "aws_iam_role_policy" "secrets_read" {
  name = "${var.project_name}-secrets-read"
  role = aws_iam_role.ec2_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ]
      Resource = "arn:aws:secretsmanager:${var.aws_region}:*:secret:${var.project_name}/*"
    }]
  })
}

# --- Bridge between role and EC2 instance ---
# AWS quirk: you attach a role to an EC2 via an "instance profile" wrapper.
resource "aws_iam_instance_profile" "ec2_profile" {
  name = "${var.project_name}-ec2-profile"
  role = aws_iam_role.ec2_role.name
}