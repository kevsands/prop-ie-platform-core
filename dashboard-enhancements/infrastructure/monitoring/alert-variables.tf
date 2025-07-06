# Enhanced alerting variables

variable "critical_alert_email" {
  description = "Email address to send critical alerts to"
  type        = string
  default     = "alerts-critical@propie.example.com"
}

variable "warning_alert_email" {
  description = "Email address to send warning alerts to"
  type        = string
  default     = "alerts-warning@propie.example.com"
}

variable "info_notification_email" {
  description = "Email address to send informational notifications to"
  type        = string
  default     = "alerts-info@propie.example.com"
}

variable "enable_sms_alerts" {
  description = "Whether to enable SMS alerts for critical issues"
  type        = bool
  default     = true
}

variable "oncall_phone_number" {
  description = "Phone number for on-call engineer (include country code)"
  type        = string
  default     = "+15551234567"
}

variable "enable_pagerduty" {
  description = "Whether to enable PagerDuty integration"
  type        = bool
  default     = false
}

variable "pagerduty_endpoint" {
  description = "PagerDuty webhook endpoint"
  type        = string
  default     = "https://events.pagerduty.com/integration/abcdef12345/enqueue"
}

# Critical thresholds
variable "error_threshold_5xx_critical" {
  description = "Critical threshold for 5XX error rate percentage"
  type        = number
  default     = 5 # 5% error rate or higher is critical
}

variable "error_threshold_5xx_warning" {
  description = "Warning threshold for 5XX error rate percentage"
  type        = number
  default     = 1 # 1% error rate is a warning
}

variable "api_latency_threshold_critical" {
  description = "Critical threshold for API latency in milliseconds"
  type        = number
  default     = 2000 # 2 seconds p99 latency is critical
}

variable "api_latency_threshold_warning" {
  description = "Warning threshold for API latency in milliseconds"
  type        = number
  default     = 1000 # 1 second p95 latency is a warning
}

variable "frontend_latency_threshold" {
  description = "Threshold for frontend latency in milliseconds"
  type        = number
  default     = 3000 # 3 seconds is considered slow for frontend
}

variable "lambda_error_threshold" {
  description = "Threshold for Lambda errors before triggering alarm"
  type        = number
  default     = 5
}

variable "lambda_duration_threshold_critical" {
  description = "Critical threshold for Lambda duration in milliseconds"
  type        = number
  default     = 5000 # 5 seconds is very slow for Lambda
}

variable "dynamodb_throttle_threshold" {
  description = "Threshold for DynamoDB throttled requests"
  type        = number
  default     = 10
}

variable "api_gateway_error_threshold" {
  description = "Threshold for API Gateway 5XX errors"
  type        = number
  default     = 10
}

variable "auth_failure_threshold" {
  description = "Threshold for authentication failures"
  type        = number
  default     = 20
}

variable "waf_blocked_threshold" {
  description = "Threshold for WAF blocked requests"
  type        = number
  default     = 100
}

# Operational thresholds
variable "active_users_threshold" {
  description = "Threshold for maximum active users"
  type        = number
  default     = 1000
}

variable "api_requests_threshold" {
  description = "Threshold for maximum API requests per minute"
  type        = number
  default     = 5000
}

variable "database_connections_threshold" {
  description = "Threshold for maximum database connections"
  type        = number
  default     = 80 # 80% of maximum connections
}