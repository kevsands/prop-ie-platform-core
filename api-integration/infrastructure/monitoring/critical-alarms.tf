terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.5.0"
}

# Primary SNS Topic for Critical Alerts
resource "aws_sns_topic" "critical_alerts" {
  name = "prop-ie-${var.environment}-critical-alerts"
  
  tags = {
    Environment = var.environment
    Service     = "monitoring"
    Type        = "critical"
  }
}

# Secondary SNS Topic for Warning Alerts
resource "aws_sns_topic" "warning_alerts" {
  name = "prop-ie-${var.environment}-warning-alerts"
  
  tags = {
    Environment = var.environment
    Service     = "monitoring"
    Type        = "warning"
  }
}

# Informational SNS Topic for non-critical notifications
resource "aws_sns_topic" "info_notifications" {
  name = "prop-ie-${var.environment}-info-notifications"
  
  tags = {
    Environment = var.environment
    Service     = "monitoring"
    Type        = "info"
  }
}

# Email Subscriptions
resource "aws_sns_topic_subscription" "critical_email" {
  topic_arn = aws_sns_topic.critical_alerts.arn
  protocol  = "email"
  endpoint  = var.critical_alert_email
}

resource "aws_sns_topic_subscription" "warning_email" {
  topic_arn = aws_sns_topic.warning_alerts.arn
  protocol  = "email"
  endpoint  = var.warning_alert_email
}

resource "aws_sns_topic_subscription" "info_email" {
  topic_arn = aws_sns_topic.info_notifications.arn
  protocol  = "email"
  endpoint  = var.info_notification_email
}

# SMS Subscription for Critical Alerts
resource "aws_sns_topic_subscription" "critical_sms" {
  count     = var.enable_sms_alerts ? 1 : 0
  topic_arn = aws_sns_topic.critical_alerts.arn
  protocol  = "sms"
  endpoint  = var.oncall_phone_number
}

# Slack Integration via AWS Chatbot (requires AWS Chatbot setup)
resource "aws_sns_topic_policy" "chatbot_policy" {
  arn    = aws_sns_topic.critical_alerts.arn
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "chatbot.amazonaws.com"
        }
        Action = "sns:Publish"
        Resource = aws_sns_topic.critical_alerts.arn
      }
    ]
  })
}

# PagerDuty Integration (if enabled)
resource "aws_sns_topic_subscription" "pagerduty" {
  count     = var.enable_pagerduty ? 1 : 0
  topic_arn = aws_sns_topic.critical_alerts.arn
  protocol  = "https"
  endpoint  = var.pagerduty_endpoint
}

###########################################
# Critical Application Alarms
###########################################

# 5XX Error Rate Alarm
resource "aws_cloudwatch_metric_alarm" "error_rate_critical" {
  alarm_name          = "prop-ie-${var.environment}-5xx-error-rate-critical"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  threshold           = var.error_threshold_5xx_critical
  alarm_description   = "Critical Alert: 5XX error rate exceeds ${var.error_threshold_5xx_critical} in ${var.environment}"
  treat_missing_data  = "notBreaching"
  
  metric_query {
    id          = "e1"
    expression  = "m2/m1*100"
    label       = "Error Rate (%)"
    return_data = "true"
  }
  
  metric_query {
    id = "m1"
    metric {
      namespace   = "AWS/Amplify"
      metric_name = "Requests"
      period      = 60
      stat        = "Sum"
      dimensions = {
        App = var.amplify_app_id
      }
    }
  }
  
  metric_query {
    id = "m2"
    metric {
      namespace   = "AWS/Amplify"
      metric_name = "5XXErrors"
      period      = 60
      stat        = "Sum"
      dimensions = {
        App = var.amplify_app_id
      }
    }
  }
  
  alarm_actions = [aws_sns_topic.critical_alerts.arn]
  ok_actions    = [aws_sns_topic.critical_alerts.arn]
}

# Warning Error Rate Alarm
resource "aws_cloudwatch_metric_alarm" "error_rate_warning" {
  alarm_name          = "prop-ie-${var.environment}-5xx-error-rate-warning"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  threshold           = var.error_threshold_5xx_warning
  alarm_description   = "Warning: 5XX error rate exceeds ${var.error_threshold_5xx_warning} in ${var.environment}"
  treat_missing_data  = "notBreaching"
  
  metric_query {
    id          = "e1"
    expression  = "m2/m1*100"
    label       = "Error Rate (%)"
    return_data = "true"
  }
  
  metric_query {
    id = "m1"
    metric {
      namespace   = "AWS/Amplify"
      metric_name = "Requests"
      period      = 60
      stat        = "Sum"
      dimensions = {
        App = var.amplify_app_id
      }
    }
  }
  
  metric_query {
    id = "m2"
    metric {
      namespace   = "AWS/Amplify"
      metric_name = "5XXErrors"
      period      = 60
      stat        = "Sum"
      dimensions = {
        App = var.amplify_app_id
      }
    }
  }
  
  alarm_actions = [aws_sns_topic.warning_alerts.arn]
  ok_actions    = [aws_sns_topic.warning_alerts.arn]
}

# API Critical Latency Alarm
resource "aws_cloudwatch_metric_alarm" "api_latency_critical" {
  alarm_name          = "prop-ie-${var.environment}-api-latency-critical"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "Latency"
  namespace           = "AWS/AppSync"
  period              = 60
  statistic           = "p99"
  threshold           = var.api_latency_threshold_critical
  alarm_description   = "Critical Alert: API latency (p99) exceeds ${var.api_latency_threshold_critical}ms in ${var.environment}"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    GraphQLAPIId = var.appsync_api_id
  }
  
  alarm_actions = [aws_sns_topic.critical_alerts.arn]
  ok_actions    = [aws_sns_topic.critical_alerts.arn]
}

# API Warning Latency Alarm
resource "aws_cloudwatch_metric_alarm" "api_latency_warning" {
  alarm_name          = "prop-ie-${var.environment}-api-latency-warning"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "Latency"
  namespace           = "AWS/AppSync"
  period              = 60
  statistic           = "p95"
  threshold           = var.api_latency_threshold_warning
  alarm_description   = "Warning: API latency (p95) exceeds ${var.api_latency_threshold_warning}ms in ${var.environment}"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    GraphQLAPIId = var.appsync_api_id
  }
  
  alarm_actions = [aws_sns_topic.warning_alerts.arn]
  ok_actions    = [aws_sns_topic.warning_alerts.arn]
}

# Frontend Latency Alarm
resource "aws_cloudwatch_metric_alarm" "frontend_latency" {
  alarm_name          = "prop-ie-${var.environment}-frontend-latency"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "Latency"
  namespace           = "AWS/Amplify"
  period              = 60
  statistic           = "p95"
  threshold           = var.frontend_latency_threshold
  alarm_description   = "Warning: Frontend latency (p95) exceeds ${var.frontend_latency_threshold}ms in ${var.environment}"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    App = var.amplify_app_id
  }
  
  alarm_actions = [aws_sns_topic.warning_alerts.arn]
  ok_actions    = [aws_sns_topic.warning_alerts.arn]
}

# Lambda Error Alarm
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "prop-ie-${var.environment}-lambda-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 60
  statistic           = "Sum"
  threshold           = var.lambda_error_threshold
  alarm_description   = "Critical Alert: Lambda function has ${var.lambda_error_threshold}+ errors in ${var.environment}"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    FunctionName = var.graphql_lambda_name
  }
  
  alarm_actions = [aws_sns_topic.critical_alerts.arn]
  ok_actions    = [aws_sns_topic.critical_alerts.arn]
}

# Lambda Duration Alarm
resource "aws_cloudwatch_metric_alarm" "lambda_duration" {
  alarm_name          = "prop-ie-${var.environment}-lambda-duration"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "Duration"
  namespace           = "AWS/Lambda"
  period              = 60
  statistic           = "p95"
  threshold           = var.lambda_duration_threshold_critical
  alarm_description   = "Warning: Lambda duration (p95) exceeds ${var.lambda_duration_threshold_critical}ms in ${var.environment}"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    FunctionName = var.graphql_lambda_name
  }
  
  alarm_actions = [aws_sns_topic.warning_alerts.arn]
  ok_actions    = [aws_sns_topic.warning_alerts.arn]
}

# DynamoDB Throttled Requests Alarm
resource "aws_cloudwatch_metric_alarm" "dynamodb_throttles" {
  alarm_name          = "prop-ie-${var.environment}-dynamodb-throttles"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "ThrottledRequests"
  namespace           = "AWS/DynamoDB"
  period              = 60
  statistic           = "Sum"
  threshold           = var.dynamodb_throttle_threshold
  alarm_description   = "Critical Alert: DynamoDB has ${var.dynamodb_throttle_threshold}+ throttled requests in ${var.environment}"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    TableName = var.dynamodb_table_name
  }
  
  alarm_actions = [aws_sns_topic.critical_alerts.arn]
  ok_actions    = [aws_sns_topic.critical_alerts.arn]
}

# API Gateway 5XX Errors Alarm
resource "aws_cloudwatch_metric_alarm" "api_gateway_errors" {
  alarm_name          = "prop-ie-${var.environment}-api-gateway-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "5XXError"
  namespace           = "AWS/ApiGateway"
  period              = 60
  statistic           = "Sum"
  threshold           = var.api_gateway_error_threshold
  alarm_description   = "Critical Alert: API Gateway has ${var.api_gateway_error_threshold}+ 5XX errors in ${var.environment}"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    ApiName = "${var.environment}-api"
    Stage   = "prod"
  }
  
  alarm_actions = [aws_sns_topic.critical_alerts.arn]
  ok_actions    = [aws_sns_topic.critical_alerts.arn]
}

# Authentication Failures Alarm
resource "aws_cloudwatch_metric_alarm" "auth_failures" {
  alarm_name          = "prop-ie-${var.environment}-auth-failures"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "AuthFailures"
  namespace           = "PropIE/${var.environment}/Security"
  period              = 60
  statistic           = "Sum"
  threshold           = var.auth_failure_threshold
  alarm_description   = "Critical Alert: ${var.auth_failure_threshold}+ authentication failures detected in ${var.environment}"
  treat_missing_data  = "notBreaching"
  
  alarm_actions = [aws_sns_topic.critical_alerts.arn]
  ok_actions    = [aws_sns_topic.critical_alerts.arn]
}

# WAF Blocked Requests High Alert
resource "aws_cloudwatch_metric_alarm" "waf_blocked_requests" {
  alarm_name          = "prop-ie-${var.environment}-waf-blocked-requests"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "BlockedRequests"
  namespace           = "AWS/WAFV2"
  period              = 60
  statistic           = "Sum"
  threshold           = var.waf_blocked_threshold
  alarm_description   = "Warning: WAF has blocked ${var.waf_blocked_threshold}+ requests in ${var.environment}"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    WebACL  = "PropIEWebACL"
    Region  = "us-east-1"
  }
  
  alarm_actions = [aws_sns_topic.warning_alerts.arn]
  ok_actions    = [aws_sns_topic.warning_alerts.arn]
}

# Composite Alarm - High Severity Critical Failure
resource "aws_cloudwatch_composite_alarm" "critical_service_failure" {
  alarm_name = "prop-ie-${var.environment}-critical-service-failure"
  
  alarm_rule = join(" OR ", [
    "ALARM(${aws_cloudwatch_metric_alarm.error_rate_critical.alarm_name})",
    "ALARM(${aws_cloudwatch_metric_alarm.api_latency_critical.alarm_name})",
    "ALARM(${aws_cloudwatch_metric_alarm.lambda_errors.alarm_name})",
    "ALARM(${aws_cloudwatch_metric_alarm.dynamodb_throttles.alarm_name})",
    "ALARM(${aws_cloudwatch_metric_alarm.api_gateway_errors.alarm_name})"
  ])
  
  alarm_description = "CRITICAL SERVICE FAILURE: Multiple critical alarms have been triggered in ${var.environment}. Immediate attention required!"
  
  alarm_actions = [
    aws_sns_topic.critical_alerts.arn
  ]
  
  # If using PagerDuty, add here
  count = var.enable_pagerduty ? 1 : 0
  # Only trigger auto-incident if really enabled
  # dynamic alarm_actions in aws_cloudwatch_composite_alarm not directly supported
}