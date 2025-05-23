# Project Configuration
project_name = "prop-transaction"
environment  = "production"
aws_region   = "eu-west-1"
domain_name  = "property-platform.ie"

# Network Configuration
vpc_cidr            = "10.0.0.0/16"
availability_zones  = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
enable_nat_gateway  = true
create_route53_zone = true

# Database Configuration
db_instance_class      = "db.t3.medium"
db_allocated_storage   = 100
db_name                = "propdb"
db_username            = "dbadmin"
create_db_password     = true

# ECS Configuration
ecs_task_cpu       = "1024"
ecs_task_memory    = "2048"
ecs_desired_count  = 2
ecs_min_capacity   = 1
ecs_max_capacity   = 10

# Security Configuration
blocked_ip_addresses = []
blocked_countries    = []
alert_email          = "alerts@property-platform.ie"

# Application Configuration
ecr_repository_url   = "012345678901.dkr.ecr.eu-west-1.amazonaws.com/prop-transaction-app"
app_version          = "latest"

# CloudFront Configuration
cloudfront_price_class = "PriceClass_100"

# Backup Configuration
backup_retention_days = 30

# Multi-region Configuration
enable_multi_region = false
secondary_region    = "eu-west-2"

# Tags
common_tags = {
  Terraform   = "true"
  Application = "prop-transaction-platform"
  Owner       = "DevOps"
  Environment = "production"
}