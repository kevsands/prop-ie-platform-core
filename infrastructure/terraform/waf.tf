# WAFv2 Web ACL for CloudFront (must be in us-east-1)
resource "aws_wafv2_web_acl" "cloudfront" {
  provider = aws.us_east_1
  
  name  = "${var.project_name}-${var.environment}-cf-waf"
  scope = "CLOUDFRONT"

  default_action {
    allow {}
  }

  # Rate limiting rule
  rule {
    name     = "RateLimitRule"
    priority = 1

    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }

    action {
      block {}
    }

    visibility_config {
      sampled_requests_enabled   = true
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-${var.environment}-rate-limit"
    }
  }

  # AWS Managed Core Rule Set
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"

        excluded_rule {
          name = "SizeRestrictions_BODY"
        }
      }
    }

    visibility_config {
      sampled_requests_enabled   = true
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-${var.environment}-common-rules"
    }
  }

  # AWS Managed Known Bad Inputs Rule Set
  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 3

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      sampled_requests_enabled   = true
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-${var.environment}-bad-inputs"
    }
  }

  # SQL Injection Protection
  rule {
    name     = "AWSManagedRulesSQLiRuleSet"
    priority = 4

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      sampled_requests_enabled   = true
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-${var.environment}-sql-injection"
    }
  }

  # Custom rule to block specific IPs
  rule {
    name     = "BlockIPRule"
    priority = 5

    statement {
      ip_set_reference_statement {
        arn = aws_wafv2_ip_set.blocked_ips.arn
      }
    }

    action {
      block {}
    }

    visibility_config {
      sampled_requests_enabled   = true
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-${var.environment}-blocked-ips"
    }
  }

  # Geo-blocking rule (optional)
  rule {
    name     = "GeoBlockingRule"
    priority = 6

    statement {
      geo_match_statement {
        country_codes = var.blocked_countries
      }
    }

    action {
      block {}
    }

    visibility_config {
      sampled_requests_enabled   = true
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-${var.environment}-geo-block"
    }
  }

  visibility_config {
    sampled_requests_enabled   = true
    cloudwatch_metrics_enabled = true
    metric_name                = "${var.project_name}-${var.environment}-waf"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-cf-waf"
    Environment = var.environment
    Project     = var.project_name
  }
}

# WAFv2 Web ACL for ALB (regional)
resource "aws_wafv2_web_acl" "alb" {
  name  = "${var.project_name}-${var.environment}-alb-waf"
  scope = "REGIONAL"

  default_action {
    allow {}
  }

  # Rate limiting rule
  rule {
    name     = "RateLimitRule"
    priority = 1

    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }

    action {
      block {}
    }

    visibility_config {
      sampled_requests_enabled   = true
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-${var.environment}-alb-rate-limit"
    }
  }

  # AWS Managed Core Rule Set
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      sampled_requests_enabled   = true
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project_name}-${var.environment}-alb-common"
    }
  }

  visibility_config {
    sampled_requests_enabled   = true
    cloudwatch_metrics_enabled = true
    metric_name                = "${var.project_name}-${var.environment}-alb-waf"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-alb-waf"
    Environment = var.environment
    Project     = var.project_name
  }
}

# IP Set for blocked IPs
resource "aws_wafv2_ip_set" "blocked_ips" {
  provider = aws.us_east_1
  
  name               = "${var.project_name}-${var.environment}-blocked-ips"
  scope              = "CLOUDFRONT"
  ip_address_version = "IPV4"
  addresses          = var.blocked_ip_addresses

  tags = {
    Name        = "${var.project_name}-${var.environment}-blocked-ips"
    Environment = var.environment
    Project     = var.project_name
  }
}

# Associate WAF with ALB
resource "aws_wafv2_web_acl_association" "alb" {
  resource_arn = aws_alb.main.arn
  web_acl_arn  = aws_wafv2_web_acl.alb.arn
}

# WAF Logging
resource "aws_wafv2_web_acl_logging_configuration" "cloudfront" {
  provider = aws.us_east_1
  
  resource_arn            = aws_wafv2_web_acl.cloudfront.arn
  log_destination_configs = [aws_cloudwatch_log_group.waf_cloudfront.arn]

  depends_on = [
    aws_cloudwatch_log_group.waf_cloudfront
  ]
}

resource "aws_wafv2_web_acl_logging_configuration" "alb" {
  resource_arn            = aws_wafv2_web_acl.alb.arn
  log_destination_configs = [aws_cloudwatch_log_group.waf_alb.arn]

  depends_on = [
    aws_cloudwatch_log_group.waf_alb
  ]
}

# CloudWatch Log Groups for WAF
resource "aws_cloudwatch_log_group" "waf_cloudfront" {
  provider = aws.us_east_1
  
  name              = "/aws/wafv2/${var.project_name}-${var.environment}-cf"
  retention_in_days = 30

  tags = {
    Name        = "${var.project_name}-${var.environment}-waf-cf-logs"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_cloudwatch_log_group" "waf_alb" {
  name              = "/aws/wafv2/${var.project_name}-${var.environment}-alb"
  retention_in_days = 30

  tags = {
    Name        = "${var.project_name}-${var.environment}-waf-alb-logs"
    Environment = var.environment
    Project     = var.project_name
  }
}

# CloudWatch Metric Alarms for WAF
resource "aws_cloudwatch_metric_alarm" "waf_blocked_requests" {
  alarm_name          = "${var.project_name}-${var.environment}-waf-blocked-requests"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "BlockedRequests"
  namespace           = "AWS/WAFV2"
  period              = "300"
  statistic           = "Sum"
  threshold           = "100"
  alarm_description   = "WAF is blocking a high number of requests"

  dimensions = {
    WebACL = aws_wafv2_web_acl.cloudfront.name
    Rule   = "ALL"
  }

  alarm_actions = [aws_sns_topic.alerts.arn]

  tags = {
    Name        = "${var.project_name}-${var.environment}-waf-blocked"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_cloudwatch_metric_alarm" "waf_rate_limit" {
  alarm_name          = "${var.project_name}-${var.environment}-waf-rate-limit"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "BlockedRequests"
  namespace           = "AWS/WAFV2"
  period              = "300"
  statistic           = "Sum"
  threshold           = "50"
  alarm_description   = "Rate limiting is being triggered"

  dimensions = {
    WebACL = aws_wafv2_web_acl.cloudfront.name
    Rule   = "RateLimitRule"
  }

  alarm_actions = [aws_sns_topic.alerts.arn]

  tags = {
    Name        = "${var.project_name}-${var.environment}-waf-rate-limit"
    Environment = var.environment
    Project     = var.project_name
  }
}