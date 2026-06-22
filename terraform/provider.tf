# Zuri Market — Terraform provider configuration
# Tells Terraform which cloud (AWS) and which region to operate in.

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = "zuri-market"
      ManagedBy = "terraform"
      Owner     = "nfisu"
    }
  }
}