# ---------------------------------------------------------------------------
# Outputs — consumed by CI/CD, ArgoCD, and the env-switch scripts
# ---------------------------------------------------------------------------

output "cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "EKS cluster API endpoint"
  value       = module.eks.cluster_endpoint
}

output "cluster_certificate_authority_data" {
  description = "EKS cluster CA data"
  value       = module.eks.cluster_certificate_authority_data
}

output "cluster_security_group_id" {
  description = "EKS cluster security group"
  value       = module.eks.cluster_security_group_id
}

output "oidc_provider_arn" {
  description = "OIDC provider ARN used for IRSA"
  value       = module.eks.oidc_provider_arn
}

output "ci_deploy_role_arn" {
  description = "IAM role ARN for GitHub Actions CI/CD"
  value       = aws_iam_role.ci_deploy.arn
}

output "ecr_repository_urls" {
  description = "ECR repository URLs per service"
  value       = { for k, v in aws_ecr_repository.services : k => v.repository_url }
}

output "s3_product_images_bucket" {
  description = "S3 bucket for product images"
  value       = aws_s3_bucket.product_images.bucket
}

output "s3_build_artifacts_bucket" {
  description = "S3 bucket for build artifacts"
  value       = aws_s3_bucket.build_artifacts.bucket
}

output "rds_endpoint" {
  description = "RDS endpoint (when enabled)"
  value       = var.enable_rds ? aws_db_instance.this[0].endpoint : null
}

output "elasticache_endpoint" {
  description = "ElastiCache Redis endpoint (when enabled)"
  value       = var.enable_elasticache ? aws_elasticache_cluster.redis[0].cache_nodes[0].address : null
}

output "opensearch_endpoint" {
  description = "OpenSearch domain endpoint (when enabled)"
  value       = var.enable_opensearch ? aws_opensearch_domain.this[0].endpoint : null
}
