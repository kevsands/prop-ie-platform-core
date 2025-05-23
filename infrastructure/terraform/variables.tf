# Project Variables
variable "project_name" {
  description = "The name of the project"
  type        = string
  default     = "prop-transaction"
}

variable "environment" {
  description = "The deployment environment"
  type        = string
  default     = "production"
}

variable "aws_region" {
  description = "The AWS region to deploy resources"
  type        = string
  default     = "eu-west-1"
}

variable "domain_name" {
  description = "The domain name for the application"
  type        = string
}

# Network Variables
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway for private subnets"
  type        = bool
  default     = true
}

# Database Variables
variable "db_instance_class" {
  description = "The instance class for RDS"
  type        = string
  default     = "db.t3.medium"
}

variable "db_allocated_storage" {
  description = "The allocated storage for RDS in GB"
  type        = number
  default     = 100
}

variable "db_name" {
  description = "The name of the database"
  type        = string
  default     = "propdb"
}

variable "db_username" {
  description = "The username for the database"
  type        = string
  default     = "dbadmin"
}

# ECS Variables
variable "ecs_task_cpu" {
  description = "The amount of CPU for ECS task"
  type        = string
  default     = "1024"
}

variable "ecs_task_memory" {
  description = "The amount of memory for ECS task"
  type        = string
  default     = "2048"
}

variable "ecs_desired_count" {
  description = "The desired number of ECS tasks"
  type        = number
  default     = 2
}

variable "ecs_min_capacity" {
  description = "The minimum number of ECS tasks"
  type        = number
  default     = 1
}

variable "ecs_max_capacity" {
  description = "The maximum number of ECS tasks"
  type        = number
  default     = 10
}

# Security Variables
variable "blocked_ip_addresses" {
  description = "List of IP addresses to block"
  type        = list(string)
  default     = []
}

variable "blocked_countries" {
  description = "List of country codes to block"
  type        = list(string)
  default     = []
}

# Monitoring Variables
variable "alert_email" {
  description = "Email address for alerts"
  type        = string
}

# Application Variables
variable "ecr_repository_url" {
  description = "The URL of the ECR repository"
  type        = string
}

variable "app_version" {
  description = "The version of the application to deploy"
  type        = string
  default     = "latest"
}

# CloudFront Variables
variable "cloudfront_price_class" {
  description = "The CloudFront price class"
  type        = string
  default     = "PriceClass_100"
}

# RDS Variables
variable "rds_instance_class" {
  description = "The instance class for RDS"
  type        = string
  default     = "db.t3.medium"
}

# Secrets Manager Variables
variable "create_db_password" {
  description = "Whether to create a new database password"
  type        = bool
  default     = true
}

# Backup Variables
variable "backup_retention_days" {
  description = "The number of days to retain backups"
  type        = number
  default     = 30
}

# Route53 Variables
variable "create_route53_zone" {
  description = "Whether to create a new Route53 zone"
  type        = bool
  default     = true
}

# Private Subnet IDs (from networking.tf)
variable "private_subnet_ids" {
  description = "List of private subnet IDs"
  type        = list(string)
  default     = []
}

# VPC ID (from networking.tf)
variable "vpc_id" {
  description = "The VPC ID"
  type        = string
  default     = ""
}

# Tags
variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default = {
    Terraform   = "true"
    Application = "prop-transaction-platform"
  }
}

# Provider configuration for multi-region
variable "enable_multi_region" {
  description = "Enable multi-region deployment"
  type        = bool
  default     = false
}

variable "secondary_region" {
  description = "Secondary AWS region for DR"
  type        = string
  default     = "eu-west-2"
}