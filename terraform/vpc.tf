# Zuri Market — VPC, subnet, IGW, and routing
# Provisions the network layer the EC2 instance will live in.

# --- VPC ---
# Your own private network within AWS. 10.0.0.0/16 = 65,536 IPs.
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

# --- Public subnet ---
# A slice of the VPC where instances get public IPs.
# map_public_ip_on_launch = true means anything launched here gets a public IP.
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = var.availability_zone
  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-subnet"
  }
}

# --- Internet Gateway ---
# The door connecting the VPC to the public internet.
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# --- Route Table ---
# Routing rules for the subnet. "Anything not local → send to IGW."
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  # 0.0.0.0/0 = "all destinations on the internet"
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

# --- Associate the route table with the subnet ---
# Without this, the subnet doesn't know to use this route table.
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}