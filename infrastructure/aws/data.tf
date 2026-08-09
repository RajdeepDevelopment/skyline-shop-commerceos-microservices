# ---------------------------------------------------------------------------
# Managed data services (optional) — RDS PostgreSQL, ElastiCache Redis,
# OpenSearch. The app consumes their endpoints via per-environment overlay
# ConfigMaps (k8s/overlays/<env>/configmap-data.yml). Disabled by default;
# enable per-environment by setting the matching variable to true.
# ---------------------------------------------------------------------------

locals {
  private_subnet_ids = aws_subnet.private[*].id
}

# --- Security groups for managed data services ------------------------------
resource "aws_security_group" "data_plane" {
  count = (var.enable_rds || var.enable_elasticache || var.enable_opensearch) ? 1 : 0

  name        = "${var.project}-${var.environment}-data-plane"
  description = "Allow application traffic to managed data services"
  vpc_id      = aws_vpc.this.id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
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

# --- RDS PostgreSQL ----------------------------------------------------------
resource "aws_db_subnet_group" "main" {
  count = var.enable_rds ? 1 : 0

  name       = "${var.project}-${var.environment}-rds"
  subnet_ids = local.private_subnet_ids

  tags = var.tags
}

resource "random_password" "rds" {
  count   = var.enable_rds ? 1 : 0
  length  = 24
  special = false
}

resource "aws_db_instance" "this" {
  count = var.enable_rds ? 1 : 0

  identifier     = "${var.project}-${var.environment}-postgres"
  engine         = "postgres"
  engine_version = var.rds_engine_version

  instance_class    = var.rds_instance_class
  allocated_storage = var.rds_allocated_storage
  storage_encrypted = true

  db_name  = "auth_db"
  username = var.rds_master_username
  password = random_password.rds[0].result

  db_subnet_group_name   = aws_db_subnet_group.main[0].name
  vpc_security_group_ids = [aws_security_group.data_plane[0].id]

  multi_az            = var.environment == "production" ? true : false
  backup_retention_period = var.environment == "production" ? 30 : 7
  deletion_protection = var.environment == "production" ? true : false
  skip_final_snapshot = var.environment != "production"

  tags = var.tags
}

# --- ElastiCache Redis -------------------------------------------------------
resource "aws_elasticache_subnet_group" "main" {
  count = var.enable_elasticache ? 1 : 0

  name       = "${var.project}-${var.environment}-redis"
  subnet_ids = local.private_subnet_ids

  tags = var.tags
}

resource "aws_elasticache_cluster" "redis" {
  count = var.enable_elasticache ? 1 : 0

  cluster_id           = "${var.project}-${var.environment}-redis"
  engine               = "redis"
  node_type            = var.elasticache_node_type
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379

  subnet_group_name  = aws_elasticache_subnet_group.main[0].name
  security_group_ids = [aws_security_group.data_plane[0].id]

  tags = var.tags
}

# --- OpenSearch --------------------------------------------------------------
resource "aws_opensearch_domain" "this" {
  count = var.enable_opensearch ? 1 : 0

  domain_name    = "${var.project}-${var.environment}"
  engine_version = "OpenSearch_2.13"

  cluster_config {
    instance_type  = var.opensearch_instance_type
    instance_count = var.opensearch_instance_count

    zone_awareness_enabled = var.opensearch_instance_count > 1

    dedicated_master_enabled = var.environment == "production"
  }

  vpc_options {
    subnet_ids         = local.private_subnet_ids
    security_group_ids = [aws_security_group.data_plane[0].id]
  }

  encrypt_at_rest {
    enabled = true
  }

  node_to_node_encryption {
    enabled = true
  }

  domain_endpoint_options {
    enforce_https       = true
    tls_security_policy = "Policy-Min-TLS-1-2-2019-07"
  }

  tags = var.tags
}
