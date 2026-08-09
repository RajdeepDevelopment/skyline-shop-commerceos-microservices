# ---------------------------------------------------------------------------
# AWS deployment variables. Set in terraform.tfvars (see terraform.tfvars.example).
# ---------------------------------------------------------------------------

variable "aws_region" {
  description = "AWS region for the deployment"
  type        = string
  default     = "us-east-1"
}

variable "project" {
  description = "Project name used in resource naming"
  type        = string
  default     = "skyline-shop"
}

variable "environment" {
  description = "Deployment environment (staging/production)"
  type        = string
  default     = "staging"
}

variable "tags" {
  description = "Common tags applied to all resources"
  type        = map(string)
  default = {
    project     = "skyline-shop"
    environment = "staging"
    managed-by  = "terraform"
  }
}

# --- VPC -------------------------------------------------------------------
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones to spread subnets across"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

# --- EKS -------------------------------------------------------------------
variable "eks_version" {
  description = "Kubernetes version for the EKS cluster"
  type        = string
  default     = "1.31"
}

variable "node_group_instance_types" {
  description = "Instance types for EKS managed node groups"
  type        = list(string)
  default     = ["m6i.large"]
}

variable "node_group_desired_size" {
  description = "Desired node count per managed node group"
  type        = number
  default     = 2
}

variable "node_group_min_size" {
  description = "Minimum node count per managed node group"
  type        = number
  default     = 1
}

variable "node_group_max_size" {
  description = "Maximum node count per managed node group"
  type        = number
  default     = 6
}

variable "enable_cluster_autoscaler" {
  description = "Deploy Cluster Autoscaler for the node groups"
  type        = bool
  default     = true
}

# --- Managed data services ---------------------------------------------------
# AWS-managed equivalents of the data plane. The in-cluster Postgres/Redis/ES
# manifests were removed from k8s/ — the app gets its data-plane endpoints from
# per-environment overlay ConfigMaps (k8s/overlays/<env>/configmap-data.yml),
# filled from `terraform output` when these flags are enabled.

variable "enable_rds" {
  description = "Provision managed RDS PostgreSQL instances"
  type        = bool
  default     = false
}

variable "rds_engine_version" {
  description = "PostgreSQL engine version for RDS"
  type        = string
  default     = "16.4"
}

variable "rds_instance_class" {
  description = "Instance class for RDS instances"
  type        = string
  default     = "db.t3.small"
}

variable "rds_master_username" {
  description = "Master username for RDS instances (overridable; rotate in prod)"
  type        = string
  default     = "root"
}

variable "rds_allocated_storage" {
  description = "Allocated storage (GB) per RDS instance"
  type        = number
  default     = 20
}

variable "enable_elasticache" {
  description = "Provision managed ElastiCache Redis cluster"
  type        = bool
  default     = false
}

variable "elasticache_node_type" {
  description = "Node type for ElastiCache cluster"
  type        = string
  default     = "cache.t3.micro"
}

variable "enable_opensearch" {
  description = "Provision managed OpenSearch domain"
  type        = bool
  default     = false
}

variable "opensearch_instance_type" {
  description = "Instance type for OpenSearch data nodes"
  type        = string
  default     = "t3.small.search"
}

variable "opensearch_instance_count" {
  description = "Number of OpenSearch data nodes"
  type        = number
  default     = 3
}

# --- IAM / CI ---------------------------------------------------------------
variable "ci_github_repos" {
  description = "GitHub repos allowed to assume the CI deploy role (format: org/repo)"
  type        = list(string)
  default     = ["rajdeepsadhu/skyline-shop-commerceos-microservices"]
}
