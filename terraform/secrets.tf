# Zuri Market — AWS Secrets Manager
# Stores application secrets, encrypted at rest, with IAM-controlled access.

# --- The secret container ---
# Think of this as a named, encrypted slot in AWS.
resource "aws_secretsmanager_secret" "backend" {
  name        = "${var.project_name}/backend"
  description = "Zuri Market backend secrets (API key, etc.)"

  # 0 days = immediate deletion when destroyed (no recovery window).
  # Production would use 7-30 days to allow undo. We're a learning project.
  recovery_window_in_days = 0

  tags = {
    Name = "${var.project_name}-backend-secret"
  }
}

# --- The value inside the secret ---
# AWS Secrets Manager stores values as strings; JSON is the convention
# so you can put multiple key-value pairs in one secret.
resource "aws_secretsmanager_secret_version" "backend" {
  secret_id = aws_secretsmanager_secret.backend.id

  secret_string = jsonencode({
    API_SECRET_KEY = var.backend_api_secret_key
  })
}

# --- Output the secret's ARN so we can reference it from Kubernetes ---
output "backend_secret_arn" {
  description = "ARN of the backend secret in AWS Secrets Manager"
  value       = aws_secretsmanager_secret.backend.arn
}