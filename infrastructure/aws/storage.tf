# ---------------------------------------------------------------------------
# Storage — S3 buckets for product images and build artifacts, ECR repos
# ---------------------------------------------------------------------------

resource "aws_s3_bucket" "product_images" {
  bucket = "${var.project}-${var.environment}-product-images"

  tags = var.tags
}

resource "aws_s3_bucket_versioning" "product_images" {
  bucket = aws_s3_bucket.product_images.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "product_images" {
  bucket = aws_s3_bucket.product_images.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "build_artifacts" {
  bucket = "${var.project}-${var.environment}-build-artifacts"

  tags = var.tags
}

resource "aws_s3_bucket_versioning" "build_artifacts" {
  bucket = aws_s3_bucket.build_artifacts.id
  versioning_configuration {
    status = "Enabled"
  }
}

# --- ECR: one repo per microservice -----------------------------------------
resource "aws_ecr_repository" "services" {
  for_each = toset(["api-gateway", "auth", "user", "product", "inventory", "cart", "order", "payment", "notification", "analytics"])

  name                 = "${var.project}/${each.value}"
  image_tag_mutability = "MUTABLE"
  force_delete         = var.environment != "production"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = var.tags
}

resource "aws_ecr_lifecycle_policy" "services" {
  for_each = aws_ecr_repository.services

  repository = each.value.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 20 images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 20
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}
