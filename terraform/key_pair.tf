# Zuri Market — SSH Key Pair
# Registers your public key with AWS so you can SSH into EC2 instances.
resource "aws_key_pair" "main" {
  key_name   = "${var.project_name}-key"
  public_key = var.ssh_public_key
  tags = {
    Name = "${var.project_name}-key"
  }
}