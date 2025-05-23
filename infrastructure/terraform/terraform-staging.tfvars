# Project Configuration
project_name = "prop-transaction"
environment  = "staging"
aws_region   = "eu-west-1"
domain_name  = "staging.property-platform.ie"

# Network Configuration
vpc_cidr            = "10.0.0.0/16"
availability_zones  = ["eu-west-1a", "eu-west-1b"]  # Reduced AZs for cost saving
enable_nat_gateway  = true
create_route53_zone = false  # Use existing zone and create subdomain

# Database Configuration
db_instance_class      = "db.t3.small"  # Smaller instance for staging
db_allocated_storage   = 50             # Less storage for staging
db_name                = "propdb"
db_username            = "dbadmin"
create_db_password     = true

# ECS Configuration
ecs_task_cpu       = "512"   # Smaller CPU allocation
ecs_task_memory    = "1024"  # Less memory for staging
ecs_desired_count  = 1       # Single instance for staging
ecs_min_capacity   = 1
ecs_max_capacity   = 3       # Lower max capacity

# Security Configuration
blocked_ip_addresses = []
blocked_countries    = []
alert_email          = "staging-alerts@property-platform.ie"

# Application Configuration
ecr_repository_url   = "012345678901.dkr.ecr.eu-west-1.amazonaws.com/prop-transaction-app"
app_version          = "staging"

# CloudFront Configuration
cloudfront_price_class = "PriceClass_100"

# Backup Configuration
backup_retention_days = 7  # Lower retention for staging

# Multi-region Configuration
enable_multi_region = false
secondary_region    = ""

# Tags
common_tags = {
  Terraform   = "true"
  Application = "prop-transaction-platform"
  Owner       = "DevOps"
  Environment = "staging"
}