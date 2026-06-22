# Zuri Market — input variables
# Configurable values referenced from other .tf files using var.<name>

variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "eu-west-2"
}

variable "project_name" {
  description = "Project name prefix used in resource names"
  type        = string
  default     = "zuri-market"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "availability_zone" {
  description = "AZ to deploy the subnet into (must be in aws_region)"
  type        = string
  default     = "eu-west-2a"
}

variable "home_ip_cidr" {
  description = "Your home/office public IP in CIDR form, e.g. 81.2.3.4/32. Used to restrict SSH access."
  type        = string
  # No default — must be provided in terraform.tfvars
}

variable "ssh_public_key" {
  description = "Public SSH key for the EC2 admin user"
  type        = string
  # No default — must be provided in terraform.tfvars
}