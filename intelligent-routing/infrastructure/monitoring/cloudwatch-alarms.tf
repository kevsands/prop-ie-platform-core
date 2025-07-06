terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.5.0"
}

provider "aws" {
  region = var.aws_region
}

# SNS Topic for Alarms
resource "aws_sns_topic" "amplify_alerts" {
  name = "prop-ie-${var.environment}-amplify-alerts"
}

resource "aws_sns_topic_subscription" "email_subscription" {
  topic_arn = aws_sns_topic.amplify_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# Amplify Error Rate Alarm
resource "aws_cloudwatch_metric_alarm" "amplify_4xx_errors" {
  alarm_name          = "prop-ie-${var.environment}-amplify-4xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "4XXErrors"
  namespace           = "AWS/Amplify"
  period              = 300
  statistic           = "Sum"
  threshold           = var.error_threshold_4xx
  alarm_description   = "This alarm monitors Amplify 4XX errors"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    App = var.amplify_app_id
  }
  
  alarm_actions = [aws_sns_topic.amplify_alerts.arn]
  ok_actions    = [aws_sns_topic.amplify_alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "amplify_5xx_errors" {
  alarm_name          = "prop-ie-${var.environment}-amplify-5xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "5XXErrors"
  namespace           = "AWS/Amplify"
  period              = 300
  statistic           = "Sum"
  threshold           = var.error_threshold_5xx
  alarm_description   = "This alarm monitors Amplify 5XX errors"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    App = var.amplify_app_id
  }
  
  alarm_actions = [aws_sns_topic.amplify_alerts.arn]
  ok_actions    = [aws_sns_topic.amplify_alerts.arn]
}

# Amplify Latency Alarm
resource "aws_cloudwatch_metric_alarm" "amplify_latency" {
  alarm_name          = "prop-ie-${var.environment}-amplify-latency"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "Latency"
  namespace           = "AWS/Amplify"
  period              = 300
  statistic           = "Average"
  threshold           = var.latency_threshold_ms
  alarm_description   = "This alarm monitors Amplify latency"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    App = var.amplify_app_id
  }
  
  alarm_actions = [aws_sns_topic.amplify_alerts.arn]
  ok_actions    = [aws_sns_topic.amplify_alerts.arn]
}

# AppSync API Error Alarm
resource "aws_cloudwatch_metric_alarm" "appsync_errors" {
  alarm_name          = "prop-ie-${var.environment}-appsync-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "5XXError"
  namespace           = "AWS/AppSync"
  period              = 300
  statistic           = "Sum"
  threshold           = var.appsync_error_threshold
  alarm_description   = "This alarm monitors AppSync 5XX errors"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    GraphQLAPIId = var.appsync_api_id
  }
  
  alarm_actions = [aws_sns_topic.amplify_alerts.arn]
  ok_actions    = [aws_sns_topic.amplify_alerts.arn]
}

# Custom Application-level Metric Alarms
resource "aws_cloudwatch_metric_alarm" "auth_failures" {
  alarm_name          = "prop-ie-${var.environment}-auth-failures"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "AuthFailures"
  namespace           = "PropIE/${var.environment}/Security"
  period              = 300
  statistic           = "Sum"
  threshold           = var.auth_failure_threshold
  alarm_description   = "This alarm monitors authentication failures"
  treat_missing_data  = "notBreaching"
  
  alarm_actions = [aws_sns_topic.amplify_alerts.arn]
  ok_actions    = [aws_sns_topic.amplify_alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "graphql_errors" {
  alarm_name          = "prop-ie-${var.environment}-graphql-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "GraphQLErrors"
  namespace           = "PropIE/${var.environment}/API"
  period              = 300
  statistic           = "Sum"
  threshold           = var.graphql_error_threshold
  alarm_description   = "This alarm monitors GraphQL errors"
  treat_missing_data  = "notBreaching"
  
  alarm_actions = [aws_sns_topic.amplify_alerts.arn]
  ok_actions    = [aws_sns_topic.amplify_alerts.arn]
}

# Cognito Authentication Throttling Alarm
resource "aws_cloudwatch_metric_alarm" "cognito_throttles" {
  alarm_name          = "prop-ie-${var.environment}-cognito-throttles"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "SignInThrottles"
  namespace           = "AWS/Cognito"
  period              = 300
  statistic           = "Sum"
  threshold           = var.cognito_throttle_threshold
  alarm_description   = "This alarm monitors Cognito authentication throttling"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    UserPool = var.cognito_user_pool_id
  }
  
  alarm_actions = [aws_sns_topic.amplify_alerts.arn]
  ok_actions    = [aws_sns_topic.amplify_alerts.arn]
}

# DynamoDB Throttling Alarm
resource "aws_cloudwatch_metric_alarm" "dynamodb_throttles" {
  alarm_name          = "prop-ie-${var.environment}-dynamodb-throttles"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "ThrottledRequests"
  namespace           = "AWS/DynamoDB"
  period              = 300
  statistic           = "Sum"
  threshold           = var.dynamodb_throttle_threshold
  alarm_description   = "This alarm monitors DynamoDB throttled requests"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    TableName = var.dynamodb_table_name
  }
  
  alarm_actions = [aws_sns_topic.amplify_alerts.arn]
  ok_actions    = [aws_sns_topic.amplify_alerts.arn]
}

# Lambda Error Alarm
resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  alarm_name          = "prop-ie-${var.environment}-lambda-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = var.lambda_error_threshold
  alarm_description   = "This alarm monitors Lambda function errors"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    FunctionName = var.graphql_lambda_name
  }
  
  alarm_actions = [aws_sns_topic.amplify_alerts.arn]
  ok_actions    = [aws_sns_topic.amplify_alerts.arn]
}

# S3 Error Alarm
resource "aws_cloudwatch_metric_alarm" "s3_errors" {
  alarm_name          = "prop-ie-${var.environment}-s3-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "5xxErrors"
  namespace           = "AWS/S3"
  period              = 300
  statistic           = "Sum"
  threshold           = var.s3_error_threshold
  alarm_description   = "This alarm monitors S3 5xx errors"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    BucketName = var.s3_bucket_name
  }
  
  alarm_actions = [aws_sns_topic.amplify_alerts.arn]
  ok_actions    = [aws_sns_topic.amplify_alerts.arn]
}

# Lambda Duration Alarm (Performance Monitoring)
resource "aws_cloudwatch_metric_alarm" "lambda_duration" {
  alarm_name          = "prop-ie-${var.environment}-lambda-duration"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 3
  metric_name         = "Duration"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Average"
  threshold           = var.lambda_duration_threshold_ms
  alarm_description   = "This alarm monitors Lambda function execution time"
  treat_missing_data  = "notBreaching"
  
  dimensions = {
    FunctionName = var.graphql_lambda_name
  }
  
  alarm_actions = [aws_sns_topic.amplify_alerts.arn]
  ok_actions    = [aws_sns_topic.amplify_alerts.arn]
}

# Composite Alarm for Critical Services
resource "aws_cloudwatch_composite_alarm" "critical_services" {
  alarm_name = "prop-ie-${var.environment}-critical-services"
  
  alarm_rule = join(" OR ", [
    "ALARM(${aws_cloudwatch_metric_alarm.amplify_5xx_errors.alarm_name})",
    "ALARM(${aws_cloudwatch_metric_alarm.appsync_errors.alarm_name})",
    "ALARM(${aws_cloudwatch_metric_alarm.lambda_errors.alarm_name})",
    "ALARM(${aws_cloudwatch_metric_alarm.cognito_throttles.alarm_name})"
  ])
  
  alarm_actions = [aws_sns_topic.amplify_alerts.arn]
  ok_actions    = [aws_sns_topic.amplify_alerts.arn]
}