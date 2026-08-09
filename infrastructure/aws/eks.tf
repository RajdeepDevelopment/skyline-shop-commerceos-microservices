# ---------------------------------------------------------------------------
# EKS cluster + managed node groups
# ---------------------------------------------------------------------------

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "${var.project}-${var.environment}"
  cluster_version = var.eks_version

  cluster_endpoint_public_access = var.environment == "production" ? false : true

  vpc_id     = aws_vpc.this.id
  subnet_ids = aws_subnet.private[*].id

  cluster_addons = {
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
    vpc-cni = {
      most_recent = true
    }
    # Enable so we can write to S3 from pods (S3 VPC endpoint is already there)
    s3 = {
      most_recent = true
    }
  }

  eks_managed_node_groups = {
    main = {
      name         = "${var.project}-${var.environment}-nodes"
      instance_types = var.node_group_instance_types
      min_size     = var.node_group_min_size
      max_size     = var.node_group_max_size
      desired_size = var.node_group_desired_size

      subnet_ids = aws_subnet.private[*].id

      tags = merge(var.tags, {
        "k8s.io/cluster-autoscaler/enabled"             = "true"
        "k8s.io/cluster-autoscaler/${var.project}-${var.environment}" = "owned"
      })
    }
  }

  tags = var.tags
}
