# ---------------------------------------------------------------------------
# Skyline Shop — AWS Terraform IaC
#
# Provisions the AWS-side of the ecommerce platform:
#   - VPC + networking
#   - EKS cluster + node groups (workloads stay K8s-native: existing k8s/ + ArgoCD)
#   - Managed data services (RDS PostgreSQL, ElastiCache Redis, OpenSearch)
#   - IAM identities/roles for CI/CD and service accounts (IRSA)
#   - ECR repositories for the microservice images
#
# Design goal: provider-agnostic, K8s-native. The application layer is plain
# Kubernetes (k8s/ overlays) so migrating to GKE or AKS later means swapping
# this Terraform, not the app.
# ---------------------------------------------------------------------------

terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.30"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.14"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # Enable when you have an S3 backend (bucket must exist first):
  # backend "s3" {
  #   bucket         = "skyline-shop-tfstate"
  #   key            = "aws/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "skyline-shop-tfstate-lock"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = var.tags
  }
}

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  token                  = data.aws_eks_cluster_auth.this.token
}

provider "helm" {
  kubernetes {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    token                  = data.aws_eks_cluster_auth.this.token
  }
}

data "aws_eks_cluster_auth" "this" {
  name = module.eks.cluster_name
}
