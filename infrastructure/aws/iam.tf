# ---------------------------------------------------------------------------
# IAM identities — CI/CD deploy role + IRSA roles for the microservices
# ---------------------------------------------------------------------------

# --- CI/CD deploy role (GitHub Actions via OIDC) ---------------------------
resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

locals {
  github_repo_list = [for repo in var.ci_github_repos : "repo:${repo}:*"]
}

resource "aws_iam_role" "ci_deploy" {
  name = "${var.project}-${var.environment}-ci-deploy"
  description = "Assumed by GitHub Actions to deploy Skyline Shop to EKS/ECR"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = aws_iam_openid_connect_provider.github.arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          }
          StringLike = {
            "token.actions.githubusercontent.com:sub" = local.github_repo_list
          }
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_policy" "ci_deploy" {
  name        = "${var.project}-${var.environment}-ci-deploy"
  description = "Permissions for CI to push images and update EKS"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "EcrPush"
        Effect = "Allow"
        Action = [
          "ecr:BatchGetImage",
          "ecr:BatchCheckLayerAvailability",
          "ecr:CompleteLayerUpload",
          "ecr:GetDownloadUrlForLayer",
          "ecr:InitiateLayerUpload",
          "ecr:PutImage",
          "ecr:GetAuthorizationToken"
        ]
        Resource = ["*"]
      },
      {
        Sid    = "EksAccess"
        Effect = "Allow"
        Action = [
          "eks:DescribeCluster",
          "eks:AccessKubernetesApi"
        ]
        Resource = ["*"]
      },
      {
        Sid    = "S3Artifacts"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.build_artifacts.arn,
          "${aws_s3_bucket.build_artifacts.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ci_deploy" {
  role       = aws_iam_role.ci_deploy.name
  policy_arn = aws_iam_policy.ci_deploy.arn
}

# --- IRSA: IAM Roles for Service Accounts -----------------------------------
# One role per microservice so pods assume least-privilege AWS permissions.
# Add service_account annotations to the k8s deployments to bind them.

locals {
  services = ["api-gateway", "auth", "user", "product", "inventory", "cart", "order", "payment", "notification", "analytics"]
}

resource "aws_iam_policy" "service_common" {
  name        = "${var.project}-${var.environment}-service-common"
  description = "Common AWS permissions for Skyline Shop microservices"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3"
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.product_images.arn,
          "${aws_s3_bucket.product_images.arn}/*",
          aws_s3_bucket.build_artifacts.arn,
          "${aws_s3_bucket.build_artifacts.arn}/*"
        ]
      },
      {
        Sid    = "Secrets"
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:ListSecrets"
        ]
        Resource = ["*"]
      },
      {
        Sid    = "Ssm"
        Effect = "Allow"
        Action = [
          "ssm:GetParameter",
          "ssm:GetParameters",
          "ssm:PutParameter"
        ]
        Resource = ["arn:aws:ssm:${var.aws_region}:*:parameter/skyline-shop/*"]
      }
    ]
  })
}

resource "aws_iam_role" "service_accounts" {
  for_each = toset(local.services)

  name = "${var.project}-${var.environment}-${each.value}-sa"
  description = "IRSA role for the ${each.value} microservice"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = module.eks.oidc_provider_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${module.eks.oidc_provider}:sub" = "system:serviceaccount:${var.environment == "production" ? "ecommerce-production" : "ecommerce-staging"}:${each.value}-service"
          }
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_role_policy_attachment" "service_accounts" {
  for_each = toset(local.services)

  role       = aws_iam_role.service_accounts[each.key].name
  policy_arn = aws_iam_policy.service_common.arn
}

# --- Cluster Autoscaler IRSA ------------------------------------------------
resource "aws_iam_role" "cluster_autoscaler" {
  name = "${var.project}-${var.environment}-cluster-autoscaler"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = module.eks.oidc_provider_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${module.eks.oidc_provider}:sub" = "system:serviceaccount:kube-system:cluster-autoscaler"
          }
        }
      }
    ]
  })

  tags = var.tags
}

resource "aws_iam_policy" "cluster_autoscaler" {
  name        = "${var.project}-${var.environment}-cluster-autoscaler"
  description = "Permissions for Cluster Autoscaler to resize EKS node groups"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "autoscaling:DescribeAutoScalingGroups",
          "autoscaling:DescribeAutoScalingInstances",
          "autoscaling:DescribeLaunchConfigurations",
          "autoscaling:DescribeTags",
          "autoscaling:SetDesiredCapacity",
          "autoscaling:TerminateInstanceInAutoScalingGroup"
        ]
        Resource = ["*"]
      },
      {
        Effect = "Allow"
        Action = [
          "ec2:DescribeLaunchTemplateVersions",
          "ec2:DescribeInstanceTypes",
          "eks:DescribeNodegroup"
        ]
        Resource = ["*"]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cluster_autoscaler" {
  role       = aws_iam_role.cluster_autoscaler.name
  policy_arn = aws_iam_policy.cluster_autoscaler.arn
}
