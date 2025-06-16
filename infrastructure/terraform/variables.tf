variable "aws_region" {
  description = "The AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment (development, staging, production)"
  type        = string
  default     = "development"
  
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be one of: development, staging, production."
  }
}

variable "repository_url" {
  description = "GitHub repository URL"
  type        = string
  default     = "https://github.com/organization/prop-ie-aws-app"
}

variable "github_access_token" {
  description = "GitHub personal access token for Amplify"
  type        = string
  sensitive   = true
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "prop-ie-app.com"
}

variable "cognito_mfa_configuration" {
  description = "MFA configuration for Cognito User Pool"
  type        = string
  default     = "OPTIONAL"
  
  validation {
    condition     = contains(["OFF", "OPTIONAL", "REQUIRED"], var.cognito_mfa_configuration)
    error_message = "MFA configuration must be one of: OFF, OPTIONAL, REQUIRED."
  }
}

variable "enable_advanced_security" {
  description = "Enable advanced security features for Cognito User Pool"
  type        = bool
  default     = true
}

variable "cloudwatch_retention_days" {
  description = "Retention period in days for CloudWatch Logs"
  type        = number
  default     = 14
  
  validation {
    condition     = var.cloudwatch_retention_days >= 1 && var.cloudwatch_retention_days <= 3653
    error_message = "CloudWatch retention days must be between 1 and 3653."
  }
}