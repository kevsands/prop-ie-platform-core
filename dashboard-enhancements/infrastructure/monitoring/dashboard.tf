resource "aws_cloudwatch_dashboard" "main_dashboard" {
  dashboard_name = "prop-ie-${var.environment}-dashboard"
  
  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 24
        height = 6
        properties = {
          metrics = [
            ["AWS/Amplify", "Requests", "App", var.amplify_app_id],
            [".", "BytesDownloaded", ".", "."],
            [".", "BytesUploaded", ".", "."],
            [".", "4XXErrors", ".", "."],
            [".", "5XXErrors", ".", "."]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Amplify App Metrics",
          period     = 300,
          stat       = "Sum"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Amplify", "4XXErrors", "App", var.amplify_app_id],
            [".", "5XXErrors", ".", "."]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Amplify Error Rates",
          period     = 300,
          stat       = "Sum"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Amplify", "Latency", "App", var.amplify_app_id, {"stat": "Average"}],
            ["...", {"stat": "p90"}],
            ["...", {"stat": "p99"}]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Amplify Latency",
          period     = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 12
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/AppSync", "Latency", "GraphQLAPIId", var.appsync_api_id],
            [".", "4XXError", ".", "."],
            [".", "5XXError", ".", "."]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "AppSync API Metrics",
          period     = 300
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 12
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Cognito", "SignInSuccesses", "UserPool", var.cognito_user_pool_id],
            [".", "SignUpSuccesses", ".", "."],
            [".", "TokenRefreshSuccesses", ".", "."]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Cognito Authentication Metrics",
          period     = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 18
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/S3", "BucketSizeBytes", "BucketName", var.s3_bucket_name, "StorageType", "StandardStorage"],
            [".", "NumberOfObjects", ".", ".", "StorageType", "AllStorageTypes"]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "S3 Storage Metrics",
          period     = 86400,
          stat       = "Average"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 18
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Cognito", "SignUpThrottles", "UserPool", var.cognito_user_pool_id],
            [".", "SignInThrottles", ".", "."],
            [".", "TokenRefreshThrottles", ".", "."],
            [".", "ForgotPasswordThrottles", ".", "."]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Cognito Throttling Metrics",
          period     = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 24
        width  = 24
        height = 6
        properties = {
          metrics = [
            ["PropIE/${var.environment}/Security", "AuthFailures"],
            [".", "UnauthorizedAccess"],
            ["PropIE/${var.environment}/API", "GraphQLErrors"]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Application Security Metrics",
          period     = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 30
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", var.graphql_lambda_name],
            [".", "Errors", ".", "."],
            [".", "Throttles", ".", "."]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Lambda Metrics",
          period     = 300
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 30
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Duration", "FunctionName", var.graphql_lambda_name, {"stat": "Average"}],
            ["...", {"stat": "p90"}],
            ["...", {"stat": "Maximum"}]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Lambda Duration",
          period     = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 36
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", var.dynamodb_table_name],
            [".", "ConsumedWriteCapacityUnits", ".", "."]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "DynamoDB Consumed Capacity",
          period     = 300
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 36
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "ThrottledRequests", "TableName", var.dynamodb_table_name, "Operation", "GetItem"],
            ["...", "Operation", "PutItem"],
            ["...", "Operation", "Query"],
            ["...", "Operation", "Scan"]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "DynamoDB Throttled Requests",
          period     = 300
        }
      }
    ]
  })
}

# Performance Dashboard specifically for front-end metrics
resource "aws_cloudwatch_dashboard" "performance_dashboard" {
  dashboard_name = "prop-ie-${var.environment}-performance"
  
  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 24
        height = 6
        properties = {
          metrics = [
            ["AWS/Amplify", "Latency", "App", var.amplify_app_id, {"stat": "Average"}],
            ["...", {"stat": "p50"}],
            ["...", {"stat": "p90"}],
            ["...", {"stat": "p99"}]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Amplify Page Load Times",
          period     = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Amplify", "BytesDownloaded", "App", var.amplify_app_id],
            [".", "BytesUploaded", ".", "."]
          ],
          view       = "timeSeries",
          stacked    = true,
          region     = var.aws_region,
          title      = "Amplify Bandwidth Usage",
          period     = 300,
          stat       = "Sum"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/AppSync", "Latency", "GraphQLAPIId", var.appsync_api_id, {"stat": "Average"}],
            ["...", {"stat": "p90"}],
            ["...", {"stat": "Maximum"}]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "GraphQL API Latency",
          period     = 300
        }
      },
      {
        type   = "text"
        x      = 0
        y      = 12
        width  = 24
        height = 3
        properties = {
          markdown = <<-EOT
            ## Performance Monitoring Guide
            
            * **Page Load Time**: The average, p50, p90, and p99 load times for the application
            * **Bandwidth Usage**: The amount of data transferred to and from the application
            * **GraphQL API Latency**: The response time for GraphQL API requests
            
            **Testing Tools**:
            * Run `npm run performance:test` locally to test with Lighthouse
            * CI pipeline runs automatic performance tests with each pull request
          EOT
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 15
        width  = 24
        height = 6
        properties = {
          metrics = [
            ["AWS/CloudFront", "TotalErrorRate", "DistributionId", var.cloudfront_distribution_id, {"stat": "Average"}],
            [".", "4xxErrorRate", ".", ".", {"stat": "Average"}],
            [".", "5xxErrorRate", ".", ".", {"stat": "Average"}]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = "us-east-1", # CloudFront metrics are always in us-east-1
          title      = "CDN Error Rates",
          period     = 300
        }
      }
    ]
  })
}

# Security Dashboard
resource "aws_cloudwatch_dashboard" "security_dashboard" {
  dashboard_name = "prop-ie-${var.environment}-security"
  
  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 24
        height = 6
        properties = {
          metrics = [
            ["PropIE/${var.environment}/Security", "AuthFailures"],
            [".", "UnauthorizedAccess"]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Authentication & Authorization Failures",
          period     = 300
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Cognito", "SignInSuccesses", "UserPool", var.cognito_user_pool_id],
            [".", "SignInFailures", ".", "."]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Cognito Sign-In Metrics",
          period     = 300
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/WAF", "BlockedRequests", "WebACL", "PropIEWebACL", "Rule", "RateBasedRule"],
            ["...", "Rule", "AWS-AWSManagedRulesBotControlRuleSet"]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "WAF Blocked Requests",
          period     = 300
        }
      },
      {
        type   = "log"
        x      = 0
        y      = 12
        width  = 24
        height = 6
        properties = {
          query = "SOURCE '/app/prop-ie-${var.environment}/security' | fields @timestamp, severity, action, description\n| filter severity in ['ERROR', 'CRITICAL']\n| sort @timestamp desc\n| limit 100",
          region     = var.aws_region,
          title      = "Security Logs",
          view       = "table"
        }
      }
    ]
  })
}