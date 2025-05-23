# CloudWatch Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project_name}-${var.environment}-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ClusterName", aws_ecs_cluster.main.name, "ServiceName", aws_ecs_service.app.name],
            [".", "MemoryUtilization", ".", ".", ".", "."]
          ]
          view    = "timeSeries"
          region  = var.aws_region
          title   = "ECS Service Utilization"
          period  = 300
          stat    = "Average"
        }
      },
      {
        type   = "metric"
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", aws_alb.main.arn_suffix],
            [".", "RequestCount", ".", "."]
          ]
          view    = "timeSeries"
          region  = var.aws_region
          title   = "ALB Performance"
          period  = 300
          stat    = "Average"
        }
      },
      {
        type   = "metric"
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", aws_db_instance.main.id],
            [".", "DatabaseConnections", ".", "."],
            [".", "FreeableMemory", ".", "."]
          ]
          view    = "timeSeries"
          region  = var.aws_region
          title   = "RDS Performance"
          period  = 300
          stat    = "Average"
        }
      },
      {
        type   = "metric"
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/CloudFront", "BytesDownloaded", "DistributionId", aws_cloudfront_distribution.main.id],
            [".", "Requests", ".", "."],
            [".", "BytesUploaded", ".", "."]
          ]
          view    = "timeSeries"
          region  = "us-east-1"
          title   = "CloudFront Metrics"
          period  = 300
          stat    = "Sum"
        }
      }
    ]
  })
}

# SNS Topic for alerts
resource "aws_sns_topic" "alerts" {
  name = "${var.project_name}-${var.environment}-alerts"

  kms_master_key_id = "alias/aws/sns"

  tags = {
    Name        = "${var.project_name}-${var.environment}-alerts"
    Environment = var.environment
    Project     = var.project_name
  }
}

# SNS Topic subscription
resource "aws_sns_topic_subscription" "alerts_email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "application" {
  name              = "/aws/application/${var.project_name}-${var.environment}"
  retention_in_days = 30

  tags = {
    Name        = "${var.project_name}-${var.environment}-app-logs"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_cloudwatch_log_group" "error" {
  name              = "/aws/application/${var.project_name}-${var.environment}/error"
  retention_in_days = 90

  tags = {
    Name        = "${var.project_name}-${var.environment}-error-logs"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_cloudwatch_log_group" "security" {
  name              = "/aws/application/${var.project_name}-${var.environment}/security"
  retention_in_days = 365

  tags = {
    Name        = "${var.project_name}-${var.environment}-security-logs"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Log Metric Filters
resource "aws_cloudwatch_log_metric_filter" "error_count" {
  name           = "${var.project_name}-${var.environment}-error-count"
  pattern        = "[timestamp, request_id, event_type=ERROR*, ...]"
  log_group_name = aws_cloudwatch_log_group.application.name

  metric_transformation {
    name      = "ErrorCount"
    namespace = "${var.project_name}/${var.environment}"
    value     = "1"
  }
}

resource "aws_cloudwatch_log_metric_filter" "auth_failures" {
  name           = "${var.project_name}-${var.environment}-auth-failures"
  pattern        = "[timestamp, request_id, event_type=AUTH_FAILURE*, ...]"
  log_group_name = aws_cloudwatch_log_group.security.name

  metric_transformation {
    name      = "AuthFailures"
    namespace = "${var.project_name}/${var.environment}"
    value     = "1"
  }
}

# Custom Metric Alarms
resource "aws_cloudwatch_metric_alarm" "high_error_rate" {
  alarm_name          = "${var.project_name}-${var.environment}-high-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "ErrorCount"
  namespace           = "${var.project_name}/${var.environment}"
  period              = "300"
  statistic           = "Sum"
  threshold           = "50"
  alarm_description   = "This metric monitors application error rate"

  alarm_actions = [aws_sns_topic.alerts.arn]

  tags = {
    Name        = "${var.project_name}-${var.environment}-high-error-rate"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_cloudwatch_metric_alarm" "auth_failures" {
  alarm_name          = "${var.project_name}-${var.environment}-auth-failures"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "AuthFailures"
  namespace           = "${var.project_name}/${var.environment}"
  period              = "300"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "This metric monitors authentication failures"

  alarm_actions = [aws_sns_topic.alerts.arn]

  tags = {
    Name        = "${var.project_name}-${var.environment}-auth-failures"
    Environment = var.environment
    Project     = var.project_name
  }
}

# AWS X-Ray for distributed tracing
resource "aws_xray_sampling_rule" "main" {
  rule_name     = "${var.project_name}-${var.environment}-sampling"
  priority      = 1000
  reservoir_size = 1
  fixed_rate     = 0.1
  url_path       = "*"
  host           = "*"
  http_method    = "*"
  service_type   = "*"
  service_name   = "*"
  version        = 1

  attributes = {
    Project     = var.project_name
    Environment = var.environment
  }
}

# CloudWatch Synthetics Canary (for endpoint monitoring)
resource "aws_synthetics_canary" "main" {
  name                 = "${var.project_name}-${var.environment}-canary"
  artifact_s3_location = "s3://${aws_s3_bucket.synthetics.id}/canary/"
  execution_role_arn   = aws_iam_role.synthetics.arn
  handler              = "apiCanary.handler"
  zip_file             = data.archive_file.synthetics_canary.output_path
  runtime_version      = "syn-nodejs-puppeteer-3.7"

  schedule {
    expression = "rate(5 minutes)"
  }

  vpc_config {
    subnet_ids         = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.synthetics.id]
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-canary"
    Environment = var.environment
    Project     = var.project_name
  }
}

# S3 bucket for Synthetics
resource "aws_s3_bucket" "synthetics" {
  bucket = "${var.project_name}-${var.environment}-synthetics"

  tags = {
    Name        = "${var.project_name}-${var.environment}-synthetics"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Block public access to synthetics bucket
resource "aws_s3_bucket_public_access_block" "synthetics" {
  bucket = aws_s3_bucket.synthetics.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# IAM role for Synthetics
resource "aws_iam_role" "synthetics" {
  name = "${var.project_name}-${var.environment}-synthetics-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name        = "${var.project_name}-${var.environment}-synthetics-role"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Attach policies to Synthetics role
resource "aws_iam_role_policy_attachment" "synthetics_lambda_basic" {
  role       = aws_iam_role.synthetics.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "synthetics_vpc" {
  role       = aws_iam_role.synthetics.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

# Security group for Synthetics
resource "aws_security_group" "synthetics" {
  name        = "${var.project_name}-${var.environment}-synthetics-sg"
  description = "Security group for Synthetics Canary"
  vpc_id      = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-synthetics-sg"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Archive file for Synthetics canary
data "archive_file" "synthetics_canary" {
  type        = "zip"
  output_path = "${path.module}/canary.zip"

  source {
    content  = <<-EOF
      const synthetics = require('Synthetics');
      const log = require('SyntheticsLogger');

      const apiCanary = async function () {
        const page = await synthetics.getPage();
        const response = await page.goto('https://${var.domain_name}/api/health');
        
        if (response.status() !== 200) {
          throw new Error(`Health check failed with status: ${response.status()}`);
        }
        
        log.info('Health check passed');
      };

      exports.handler = async () => {
        await synthetics.executeStep('healthCheck', apiCanary);
      };
    EOF
    filename = "nodejs/node_modules/apiCanary.js"
  }
}