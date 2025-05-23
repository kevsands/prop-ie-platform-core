# Terraform Configuration
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  backend "s3" {
    # These will be filled in during terraform init
    # bucket = "terraform-state-bucket"
    # key    = "prop-transaction/terraform.tfstate"
    # region = "eu-west-1"
    # dynamodb_table = "terraform-state-lock"
    # encrypt = true
  }
}

# Provider Configuration
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = merge(
      var.common_tags,
      {
        Environment = var.environment
        Project     = var.project_name
        ManagedBy   = "Terraform"
      }
    )
  }
}

# Provider for CloudFront (must be in us-east-1)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = merge(
      var.common_tags,
      {
        Environment = var.environment
        Project     = var.project_name
        ManagedBy   = "Terraform"
      }
    )
  }
}

# Route53 Hosted Zone
resource "aws_route53_zone" "main" {
  count = var.create_route53_zone ? 1 : 0
  name  = var.domain_name

  tags = {
    Name        = var.domain_name
    Environment = var.environment
    Project     = var.project_name
  }
}

# ACM Certificate for CloudFront (in us-east-1)
resource "aws_acm_certificate" "main" {
  provider          = aws.us_east_1
  domain_name       = var.domain_name
  validation_method = "DNS"

  subject_alternative_names = [
    "*.${var.domain_name}"
  ]

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-cert"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Certificate validation records for CloudFront cert
resource "aws_route53_record" "cert_validation" {
  provider = aws.us_east_1
  
  for_each = {
    for dvo in aws_acm_certificate.main.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = var.create_route53_zone ? aws_route53_zone.main[0].zone_id : var.route53_zone_id
}

# Certificate validation for CloudFront cert
resource "aws_acm_certificate_validation" "main" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.main.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# Secrets Manager Secrets
resource "aws_secretsmanager_secret" "db_password" {
  name = "${var.project_name}-${var.environment}-db-password"

  tags = {
    Name        = "${var.project_name}-${var.environment}-db-password"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = var.create_db_password ? random_password.db_password[0].result : var.db_password
}

resource "random_password" "db_password" {
  count   = var.create_db_password ? 1 : 0
  length  = 32
  special = true
}

resource "aws_secretsmanager_secret" "nextauth_secret" {
  name = "${var.project_name}-${var.environment}-nextauth-secret"

  tags = {
    Name        = "${var.project_name}-${var.environment}-nextauth-secret"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_secretsmanager_secret_version" "nextauth_secret" {
  secret_id     = aws_secretsmanager_secret.nextauth_secret.id
  secret_string = random_password.nextauth_secret.result
}

resource "random_password" "nextauth_secret" {
  length  = 64
  special = true
}

resource "aws_secretsmanager_secret" "stripe_api_key" {
  name = "${var.project_name}-${var.environment}-stripe-api-key"

  tags = {
    Name        = "${var.project_name}-${var.environment}-stripe-api-key"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_secretsmanager_secret" "resend_api_key" {
  name = "${var.project_name}-${var.environment}-resend-api-key"

  tags = {
    Name        = "${var.project_name}-${var.environment}-resend-api-key"
    Environment = var.environment
    Project     = var.project_name
  }
}

# KMS Keys for encryption
resource "aws_kms_key" "main" {
  description             = "${var.project_name}-${var.environment}-kms-key"
  deletion_window_in_days = 10
  enable_key_rotation     = true

  tags = {
    Name        = "${var.project_name}-${var.environment}-kms-key"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_kms_alias" "main" {
  name          = "alias/${var.project_name}-${var.environment}"
  target_key_id = aws_kms_key.main.key_id
}

# ECR Repository
data "aws_ecr_repository" "app" {
  name = "${var.project_name}-app"
}

# Data sources
data "aws_caller_identity" "current" {}

# Optional variables
variable "route53_zone_id" {
  description = "Existing Route53 zone ID (if not creating new)"
  type        = string
  default     = ""
}

variable "db_password" {
  description = "Existing database password (if not creating new)"
  type        = string
  default     = ""
  sensitive   = true
}