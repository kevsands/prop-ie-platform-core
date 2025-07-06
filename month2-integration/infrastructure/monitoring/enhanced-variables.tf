# Additional variables for enhanced monitoring dashboards

variable "api_latency_threshold_ms" {
  description = "Threshold for API latency in milliseconds before alerting"
  type        = number
  default     = 1000
}

variable "cloudfront_distribution_id" {
  description = "The ID of the CloudFront distribution"
  type        = string
  default     = ""
}

variable "frontend_lcp_threshold_ms" {
  description = "Threshold for Largest Contentful Paint in milliseconds"
  type        = number
  default     = 2500 # Google Core Web Vitals "good" threshold
}

variable "frontend_fid_threshold_ms" {
  description = "Threshold for First Input Delay in milliseconds"
  type        = number
  default     = 100 # Google Core Web Vitals "good" threshold
}

variable "frontend_cls_threshold" {
  description = "Threshold for Cumulative Layout Shift"
  type        = number
  default     = 0.1 # Google Core Web Vitals "good" threshold
}

variable "api_error_rate_threshold" {
  description = "Threshold for API error rate percentage"
  type        = number
  default     = 1.0 # 1% error rate threshold
}

variable "concurrent_users_threshold" {
  description = "Threshold for maximum concurrent users"
  type        = number
  default     = 100
}

variable "memory_utilization_threshold" {
  description = "Threshold for memory utilization percentage"
  type        = number
  default     = 80
}

variable "cpu_utilization_threshold" {
  description = "Threshold for CPU utilization percentage"
  type        = number
  default     = 70
}

variable "dynamodb_consumed_capacity_threshold" {
  description = "Threshold for DynamoDB consumed capacity percentage"
  type        = number
  default     = 80
}

variable "s3_storage_threshold_gb" {
  description = "Threshold for S3 storage in GB"
  type        = number
  default     = 50
}

variable "auth_failure_max_threshold" {
  description = "Maximum threshold for authentication failures before alerting"
  type        = number
  default     = 20
}

variable "unauthorized_access_threshold" {
  description = "Threshold for unauthorized access attempts"
  type        = number
  default     = 10
}

variable "waf_block_threshold" {
  description = "Threshold for WAF blocked requests"
  type        = number
  default     = 100
}

variable "api_throttle_threshold" {
  description = "Threshold for API throttled requests"
  type        = number
  default     = 10
}