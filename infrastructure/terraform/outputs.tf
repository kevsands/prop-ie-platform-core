# Network Outputs
output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "List of private subnet IDs"
  value       = aws_subnet.private[*].id
}

output "database_subnet_ids" {
  description = "List of database subnet IDs"
  value       = aws_subnet.database[*].id
}

# Load Balancer Outputs
output "alb_dns_name" {
  description = "The DNS name of the ALB"
  value       = aws_alb.main.dns_name
}

output "alb_arn" {
  description = "The ARN of the ALB"
  value       = aws_alb.main.arn
}

# CloudFront Outputs
output "cloudfront_distribution_id" {
  description = "The ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.main.id
}

output "cloudfront_domain_name" {
  description = "The domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.main.domain_name
}

output "cloudfront_distribution_arn" {
  description = "The ARN of the CloudFront distribution"
  value       = aws_cloudfront_distribution.main.arn
}

# Database Outputs
output "db_instance_endpoint" {
  description = "The endpoint of the RDS instance"
  value       = aws_db_instance.main.endpoint
}

output "db_instance_id" {
  description = "The ID of the RDS instance"
  value       = aws_db_instance.main.id
}

output "db_instance_arn" {
  description = "The ARN of the RDS instance"
  value       = aws_db_instance.main.arn
}

# ECS Outputs
output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "ecs_cluster_arn" {
  description = "The ARN of the ECS cluster"
  value       = aws_ecs_cluster.main.arn
}

output "ecs_service_name" {
  description = "The name of the ECS service"
  value       = aws_ecs_service.app.name
}

# S3 Outputs
output "s3_documents_bucket" {
  description = "The name of the documents S3 bucket"
  value       = aws_s3_bucket.documents.id
}

output "s3_uploads_bucket" {
  description = "The name of the uploads S3 bucket"
  value       = aws_s3_bucket.uploads.id
}

output "s3_static_assets_bucket" {
  description = "The name of the static assets S3 bucket"
  value       = aws_s3_bucket.static_assets.id
}

output "s3_backups_bucket" {
  description = "The name of the backups S3 bucket"
  value       = aws_s3_bucket.backups.id
}

# Security Outputs
output "waf_cloudfront_acl_id" {
  description = "The ID of the CloudFront WAF ACL"
  value       = aws_wafv2_web_acl.cloudfront.id
}

output "waf_alb_acl_id" {
  description = "The ID of the ALB WAF ACL"
  value       = aws_wafv2_web_acl.alb.id
}

# Monitoring Outputs
output "sns_topic_arn" {
  description = "The ARN of the SNS topic for alerts"
  value       = aws_sns_topic.alerts.arn
}

output "cloudwatch_dashboard_url" {
  description = "The URL of the CloudWatch dashboard"
  value       = "https://${var.aws_region}.console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=${aws_cloudwatch_dashboard.main.dashboard_name}"
}

# IAM Outputs
output "ecs_task_role_arn" {
  description = "The ARN of the ECS task role"
  value       = aws_iam_role.ecs_task_role.arn
}

output "ecs_execution_role_arn" {
  description = "The ARN of the ECS execution role"
  value       = aws_iam_role.ecs_execution_role.arn
}

# Secrets Manager Outputs
output "db_password_secret_arn" {
  description = "The ARN of the database password secret"
  value       = aws_secretsmanager_secret.db_password.arn
}

# Route53 Outputs
output "route53_zone_id" {
  description = "The ID of the Route53 zone"
  value       = var.create_route53_zone ? aws_route53_zone.main[0].zone_id : ""
}

output "route53_name_servers" {
  description = "The name servers for the Route53 zone"
  value       = var.create_route53_zone ? aws_route53_zone.main[0].name_servers : []
}

# Application URL
output "application_url" {
  description = "The URL of the application"
  value       = "https://${var.domain_name}"
}

# ECR Repository
output "ecr_repository_url" {
  description = "The URL of the ECR repository"
  value       = var.ecr_repository_url
}

# Connection Information
output "connection_info" {
  description = "Connection information for various services"
  value = {
    application_url = "https://${var.domain_name}"
    alb_url        = "https://${aws_alb.main.dns_name}"
    cloudfront_url = "https://${aws_cloudfront_distribution.main.domain_name}"
    database = {
      endpoint = aws_db_instance.main.endpoint
      port     = aws_db_instance.main.port
      database = var.db_name
      username = var.db_username
    }
  }
  sensitive = true
}