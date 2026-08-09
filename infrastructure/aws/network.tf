# ---------------------------------------------------------------------------
# Network — VPC, subnets, NAT gateways, routes
# ---------------------------------------------------------------------------

data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  azs       = var.availability_zones
  az_count  = length(local.azs)
}

resource "aws_vpc" "this" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(var.tags, { Name = "${var.project}-${var.environment}-vpc" })
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id

  tags = merge(var.tags, { Name = "${var.project}-${var.environment}-igw" })
}

# Public subnets (one per AZ) — NAT gateways, load balancers
resource "aws_subnet" "public" {
  count                   = local.az_count
  vpc_id                  = aws_vpc.this.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 8, count.index)
  availability_zone       = local.azs[count.index]
  map_public_ip_on_launch = true

  tags = merge(var.tags, {
    Name                     = "${var.project}-${var.environment}-public-${count.index}"
    "kubernetes.io/role/elb" = "1"
  })
}

# Private subnets (one per AZ) — EKS nodes, RDS, ElastiCache, OpenSearch
resource "aws_subnet" "private" {
  count             = local.az_count
  vpc_id            = aws_vpc.this.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, local.az_count + count.index)
  availability_zone = local.azs[count.index]

  tags = merge(var.tags, {
    Name                              = "${var.project}-${var.environment}-private-${count.index}"
    "kubernetes.io/role/internal-elb" = "1"
  })
}

resource "aws_eip" "nat" {
  count  = local.az_count
  domain = "vpc"

  tags = merge(var.tags, { Name = "${var.project}-${var.environment}-nat-eip-${count.index}" })
}

resource "aws_nat_gateway" "this" {
  count         = local.az_count
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index]

  tags = merge(var.tags, { Name = "${var.project}-${var.environment}-nat-${count.index}" })
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }

  tags = merge(var.tags, { Name = "${var.project}-${var.environment}-public-rt" })
}

resource "aws_route_table_association" "public" {
  count          = local.az_count
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  count  = local.az_count
  vpc_id = aws_vpc.this.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.this[count.index].id
  }

  tags = merge(var.tags, { Name = "${var.project}-${var.environment}-private-rt-${count.index}" })
}

resource "aws_route_table_association" "private" {
  count          = local.az_count
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private[count.index].id
}

# VPC endpoints for EKS + managed services (keeps traffic off the internet)
resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_vpc.this.id
  service_name      = "com.amazonaws.${var.aws_region}.s3"
  route_table_ids   = [aws_route_table.public.id, aws_route_table.private[0].id]
  vpc_endpoint_type = "Gateway"

  tags = merge(var.tags, { Name = "${var.project}-${var.environment}-s3-vpce" })
}

resource "aws_vpc_endpoint" "ecr" {
  vpc_id              = aws_vpc.this.id
  service_name        = "com.amazonaws.${var.aws_region}.ecr.dkr"
  subnet_ids          = aws_subnet.private[*].id
  private_dns_enabled = true
  security_group_ids  = [aws_security_group.vpc_endpoints.id]

  tags = merge(var.tags, { Name = "${var.project}-${var.environment}-ecr-vpce" })
}

resource "aws_security_group" "vpc_endpoints" {
  name        = "${var.project}-${var.environment}-vpce"
  description = "Allow HTTPS from private subnets to VPC endpoints"
  vpc_id      = aws_vpc.this.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [var.vpc_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = var.tags
}
