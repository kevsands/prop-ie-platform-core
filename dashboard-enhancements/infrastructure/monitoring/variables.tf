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

variable "amplify_app_id" {
  description = "The ID of the Amplify App"
  type        = string
}

variable "appsync_api_id" {
  description = "The ID of the AppSync API"
  type        = string
}

variable "cognito_user_pool_id" {
  description = "The ID of the Cognito User Pool"
  type        = string
}

variable "dynamodb_table_name" {
  description = "The name of the DynamoDB table"
  type        = string
}

variable "graphql_lambda_name" {
  description = "The name of the GraphQL Lambda function"
  type        = string
}

variable "s3_bucket_name" {
  description = "The name of the S3 bucket"
  type        = string
}

variable "alert_email" {
  description = "Email address to send alerts to"
  type        = string
}

# Thresholds for alarms
variable "error_threshold_4xx" {
  description = "Threshold for 4XX errors before alerting"
  type        = number
  default     = 50
}

variable "error_threshold_5xx" {
  description = "Threshold for 5XX errors before alerting"
  type        = number
  default     = 5
}

variable "latency_threshold_ms" {
  description = "Threshold for latency in milliseconds before alerting"
  type        = number
  default     = 3000
}

variable "appsync_error_threshold" {
  description = "Threshold for AppSync errors before alerting"
  type        = number
  default     = 5
}

variable "auth_failure_threshold" {
  description = "Threshold for authentication failures before alerting"
  type        = number
  default     = 10
}

variable "graphql_error_threshold" {
  description = "Threshold for GraphQL errors before alerting"
  type        = number
  default     = 10
}

variable "cognito_throttle_threshold" {
  description = "Threshold for Cognito throttling before alerting"
  type        = number
  default     = 5
}

variable "dynamodb_throttle_threshold" {
  description = "Threshold for DynamoDB throttling before alerting"
  type        = number
  default     = 5
}

variable "lambda_error_threshold" {
  description = "Threshold for Lambda errors before alerting"
  type        = number
  default     = 5
}

variable "lambda_duration_threshold_ms" {
  description = "Threshold for Lambda duration in milliseconds before alerting"
  type        = number
  default     = 5000
}

variable "s3_error_threshold" {
  description = "Threshold for S3 errors before alerting"
  type        = number
  default     = 5
}