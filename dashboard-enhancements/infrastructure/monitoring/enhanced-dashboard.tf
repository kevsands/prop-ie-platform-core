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

# Production Performance Dashboard
resource "aws_cloudwatch_dashboard" "production_performance_dashboard" {
  dashboard_name = "prop-ie-${var.environment}-performance-enhanced"
  
  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "text"
        x      = 0
        y      = 0
        width  = 24
        height = 2
        properties = {
          markdown = <<-EOT
            # PropIE Production Monitoring Dashboard
            
            This dashboard provides comprehensive monitoring of all production services and infrastructure.
            **Environment**: ${var.environment}
            **Last Updated**: ${formatdate("YYYY-MM-DD", timestamp())}
          EOT
        }
      },
      
      # Application Overview - Key Metrics
      {
        type   = "metric"
        x      = 0
        y      = 2
        width  = 24
        height = 6
        properties = {
          metrics = [
            ["AWS/Amplify", "Requests", "App", var.amplify_app_id, {"label": "Total Requests", "stat": "Sum"}],
            [".", "5XXErrors", ".", ".", {"label": "5XX Errors", "stat": "Sum"}],
            [".", "4XXErrors", ".", ".", {"label": "4XX Errors", "stat": "Sum"}],
            ["PropIE/${var.environment}/API", "APIRequestsTotal", {"label": "API Requests", "stat": "Sum"}],
            ["PropIE/${var.environment}/API", "APIErrorsTotal", {"label": "API Errors", "stat": "Sum"}]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Application Traffic Overview",
          period     = 60,
          stat       = "Sum",
          yAxis      = {
            left: {
              min: 0
            }
          },
          annotations = {
            horizontal: [
              {
                value: var.error_threshold_5xx,
                label: "Error Threshold",
                color: "#d62728"
              }
            ]
          }
        }
      },
      
      # Latency Metrics
      {
        type   = "metric"
        x      = 0
        y      = 8
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Amplify", "Latency", "App", var.amplify_app_id, {"label": "Avg Latency", "stat": "Average"}],
            ["...", {"label": "p50 Latency", "stat": "p50"}],
            ["...", {"label": "p90 Latency", "stat": "p90"}],
            ["...", {"label": "p99 Latency", "stat": "p99"}]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Frontend Latency (ms)",
          period     = 60,
          annotations = {
            horizontal: [
              {
                value: var.latency_threshold_ms,
                label: "Latency Threshold",
                color: "#d62728"
              }
            ]
          }
        }
      },
      
      # API Latency
      {
        type   = "metric"
        x      = 12
        y      = 8
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/AppSync", "Latency", "GraphQLAPIId", var.appsync_api_id, {"label": "Avg API Latency", "stat": "Average"}],
            ["...", {"label": "p90 API Latency", "stat": "p90"}],
            ["...", {"label": "p99 API Latency", "stat": "p99"}],
            ["PropIE/${var.environment}/API", "EndpointLatency", {"label": "REST API Latency", "stat": "Average"}]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "API Latency (ms)",
          period     = 60,
          annotations = {
            horizontal: [
              {
                value: var.api_latency_threshold_ms,
                label: "API Latency Threshold",
                color: "#d62728"
              }
            ]
          }
        }
      },
      
      # Lambda Performance Metrics
      {
        type   = "metric"
        x      = 0
        y      = 14
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Duration", "FunctionName", var.graphql_lambda_name, {"label": "Avg Duration", "stat": "Average"}],
            ["...", {"label": "p90 Duration", "stat": "p90"}],
            ["...", {"label": "p99 Duration", "stat": "p99"}]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Lambda Duration (ms)",
          period     = 60,
          annotations = {
            horizontal: [
              {
                value: var.lambda_duration_threshold_ms,
                label: "Duration Threshold",
                color: "#d62728"
              }
            ]
          }
        }
      },
      
      # Lambda Errors and Throttles
      {
        type   = "metric"
        x      = 12
        y      = 14
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "Errors", "FunctionName", var.graphql_lambda_name, {"label": "Errors", "stat": "Sum"}],
            [".", "Throttles", ".", ".", {"label": "Throttles", "stat": "Sum"}],
            [".", "IteratorAge", ".", ".", {"label": "Iterator Age", "stat": "Maximum"}],
            [".", "DeadLetterErrors", ".", ".", {"label": "DLQ Errors", "stat": "Sum"}]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Lambda Errors",
          period     = 60
        }
      },
      
      # DynamoDB Performance
      {
        type   = "metric"
        x      = 0
        y      = 20
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "ConsumedReadCapacityUnits", "TableName", var.dynamodb_table_name, {"label": "Read Capacity", "stat": "Sum"}],
            [".", "ConsumedWriteCapacityUnits", ".", ".", {"label": "Write Capacity", "stat": "Sum"}]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "DynamoDB Capacity Units",
          period     = 60
        }
      },
      
      # DynamoDB Throttling & Latency
      {
        type   = "metric"
        x      = 12
        y      = 20
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/DynamoDB", "ThrottledRequests", "TableName", var.dynamodb_table_name, "Operation", "GetItem", {"label": "GetItem Throttles"}],
            ["...", "Operation", "Query", {"label": "Query Throttles"}],
            ["...", "Operation", "PutItem", {"label": "PutItem Throttles"}],
            ["...", "Operation", "UpdateItem", {"label": "UpdateItem Throttles"}]
          ],
          view       = "timeSeries",
          stacked    = true,
          region     = var.aws_region,
          title      = "DynamoDB Throttled Requests",
          period     = 60
        }
      },
      
      # Front-end Performance Metrics
      {
        type   = "metric"
        x      = 0
        y      = 26
        width  = 24
        height = 6
        properties = {
          metrics = [
            ["PropIE/${var.environment}/Frontend", "FirstContentfulPaint", {"label": "First Contentful Paint", "stat": "Average"}],
            [".", "DomInteractive", {"label": "DOM Interactive", "stat": "Average"}],
            [".", "FirstInputDelay", {"label": "First Input Delay", "stat": "p95"}],
            [".", "LargestContentfulPaint", {"label": "Largest Contentful Paint", "stat": "Average"}],
            [".", "CumulativeLayoutShift", {"label": "Layout Shift", "stat": "Average", "yAxis": "right"}]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Frontend Performance Metrics",
          period     = 300
        }
      },
      
      # CloudFront Metrics
      {
        type   = "metric"
        x      = 0
        y      = 32
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/CloudFront", "Requests", "DistributionId", var.cloudfront_distribution_id, "Region", "Global", {"label": "Requests"}],
            [".", "BytesDownloaded", ".", ".", ".", ".", {"label": "Bytes Downloaded"}],
            [".", "BytesUploaded", ".", ".", ".", ".", {"label": "Bytes Uploaded"}]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = "us-east-1", # CloudFront metrics are always in us-east-1
          title      = "CloudFront Traffic",
          period     = 60
        }
      },
      
      # CloudFront Error Rates
      {
        type   = "metric"
        x      = 12
        y      = 32
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/CloudFront", "4xxErrorRate", "DistributionId", var.cloudfront_distribution_id, "Region", "Global", {"label": "4xx Error Rate"}],
            [".", "5xxErrorRate", ".", ".", ".", ".", {"label": "5xx Error Rate"}],
            [".", "TotalErrorRate", ".", ".", ".", ".", {"label": "Total Error Rate"}]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = "us-east-1", # CloudFront metrics are always in us-east-1
          title      = "CloudFront Error Rates",
          period     = 60
        }
      },
      
      # WAF Metrics
      {
        type   = "metric"
        x      = 0
        y      = 38
        width  = 24
        height = 6
        properties = {
          metrics = [
            ["AWS/WAFV2", "BlockedRequests", "WebACL", "PropIEWebACL", "Region", "us-east-1", {"label": "Blocked Requests"}],
            [".", "AllowedRequests", ".", ".", ".", ".", {"label": "Allowed Requests"}],
            [".", "CountedRequests", ".", ".", ".", ".", {"label": "Counted Requests"}]
          ],
          view       = "timeSeries",
          stacked    = true,
          region     = "us-east-1", 
          title      = "WAF Request Handling",
          period     = 60
        }
      },
      
      # Business Metrics 
      {
        type   = "metric"
        x      = 0
        y      = 44
        width  = 24
        height = 6
        properties = {
          metrics = [
            ["PropIE/${var.environment}/Business", "UserRegistrations", {"label": "New Users", "stat": "Sum"}],
            [".", "PropertyViews", {"label": "Property Views", "stat": "Sum"}],
            [".", "PropertyInquiries", {"label": "Property Inquiries", "stat": "Sum"}],
            [".", "Sales", {"label": "Sales", "stat": "Sum"}]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Business Metrics",
          period     = 3600 # Hourly aggregation for business metrics
        }
      },
      
      # Memory Usage
      {
        type   = "metric"
        x      = 0
        y      = 50
        width  = 12 
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "MemoryUtilization", "FunctionName", var.graphql_lambda_name, {"label": "Memory Utilization %", "stat": "Maximum"}]
          ],
          view       = "gauge",
          region     = var.aws_region,
          title      = "Lambda Memory Utilization",
          period     = 300,
          yAxis      = {
            left: {
              min: 0,
              max: 100
            }
          },
          gauge: {
            min: 0,
            max: 100,
            colors: [
              { color: "#2ca02c", from: 0, to: 60 },
              { color: "#f0ad4e", from: 60, to: 80 },
              { color: "#d62728", from: 80, to: 100 }
            ]
          }
        }
      },
      
      # Error Heatmap
      {
        type   = "metric"
        x      = 12
        y      = 50
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["PropIE/${var.environment}/API", "Errors", "Endpoint", "auth", {"label": "Auth Errors"}],
            ["...", "Endpoint", "properties", {"label": "Properties Errors"}],
            ["...", "Endpoint", "users", {"label": "Users Errors"}],
            ["...", "Endpoint", "purchases", {"label": "Purchases Errors"}],
            ["...", "Endpoint", "customization", {"label": "Customization Errors"}]
          ],
          view       = "heatMap",
          stacked    = false,
          region     = var.aws_region,
          title      = "API Errors by Endpoint",
          period     = 300
        }
      },
      
      # Log Insights for Errors
      {
        type   = "log"
        x      = 0
        y      = 56
        width  = 24
        height = 6
        properties = {
          query = "SOURCE '/aws/lambda/${var.graphql_lambda_name}' | filter @message like /Error|Exception|error|exception/ | stats count() as errorCount by bin(30m)",
          region     = var.aws_region,
          title      = "Lambda Errors Over Time",
          view       = "timeSeries"
        }
      }
    ]
  })
}

# Real-time Operations Dashboard
resource "aws_cloudwatch_dashboard" "real_time_operations_dashboard" {
  dashboard_name = "prop-ie-${var.environment}-operations"
  
  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "text"
        x      = 0
        y      = 0
        width  = 24
        height = 2
        properties = {
          markdown = <<-EOT
            # PropIE Real-time Operations Dashboard
            
            This dashboard provides real-time operational metrics and status of key services.
            **Environment**: ${var.environment}
            **Last Updated**: ${formatdate("YYYY-MM-DD", timestamp())}
          EOT
        }
      },
      
      # Service Health Status
      {
        type   = "metric"
        x      = 0
        y      = 2
        width  = 24
        height = 4
        properties = {
          metrics = [
            ["PropIE/${var.environment}/Status", "FrontendHealth", {"label": "Frontend"}],
            [".", "APIHealth", {"label": "API"}],
            [".", "DatabaseHealth", {"label": "Database"}],
            [".", "AuthHealth", {"label": "Authentication"}],
            [".", "StorageHealth", {"label": "Storage"}]
          ],
          view       = "gauge",
          stacked    = false,
          region     = var.aws_region,
          title      = "Service Health Status",
          period     = 60,
          stat       = "Average", 
          gauge: {
            min: 0,
            max: 100,
            colors: [
              { color: "#d62728", from: 0, to: 33 },
              { color: "#f0ad4e", from: 33, to: 67 },
              { color: "#2ca02c", from: 67, to: 100 }
            ]
          }
        }
      },
      
      # Active Users
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["PropIE/${var.environment}/Users", "ActiveUsers", {"label": "Active Users", "stat": "Maximum"}]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Active Users (Real-time)",
          period     = 60,
          stat       = "Maximum"
        }
      },
      
      # User Activity by Page
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          metrics = [
            ["PropIE/${var.environment}/Users", "PageViews", "Page", "home", {"label": "Home Page"}],
            ["...", "Page", "properties", {"label": "Properties Page"}],
            ["...", "Page", "customization", {"label": "Customization Page"}],
            ["...", "Page", "checkout", {"label": "Checkout"}],
            ["...", "Page", "profile", {"label": "User Profile"}]
          ],
          view       = "timeSeries",
          stacked    = true,
          region     = var.aws_region,
          title      = "Page Views",
          period     = 60,
          stat       = "Sum"
        }
      },
      
      # API Requests by Endpoint
      {
        type   = "metric"
        x      = 0
        y      = 12
        width  = 24
        height = 6
        properties = {
          metrics = [
            ["PropIE/${var.environment}/API", "Requests", "Endpoint", "properties", {"label": "Properties"}],
            ["...", "Endpoint", "users", {"label": "Users"}],
            ["...", "Endpoint", "auth", {"label": "Authentication"}],
            ["...", "Endpoint", "customization", {"label": "Customization"}],
            ["...", "Endpoint", "checkout", {"label": "Checkout"}]
          ],
          view       = "timeSeries",
          stacked    = true,
          region     = var.aws_region,
          title      = "API Requests by Endpoint",
          period     = 60,
          stat       = "Sum"
        }
      },
      
      # System Resource Usage
      {
        type   = "metric"
        x      = 0
        y      = 18
        width  = 24
        height = 6
        properties = {
          metrics = [
            ["AWS/Lambda", "ConcurrentExecutions", "FunctionName", var.graphql_lambda_name, {"label": "Lambda Concurrency"}],
            ["AWS/DynamoDB", "ProvisionedReadCapacityUnits", "TableName", var.dynamodb_table_name, {"label": "DynamoDB Read Capacity"}],
            [".", "ProvisionedWriteCapacityUnits", ".", ".", {"label": "DynamoDB Write Capacity"}],
            ["AWS/S3", "BucketSizeBytes", "BucketName", var.s3_bucket_name, "StorageType", "StandardStorage", {"label": "S3 Storage (GB)", "period": 86400}]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "System Resource Usage",
          period     = 300
        }
      },
      
      # Recent Errors Log
      {
        type   = "log"
        x      = 0
        y      = 24
        width  = 24
        height = 8
        properties = {
          query = "SOURCE '/aws/lambda/${var.graphql_lambda_name}' | filter @message like /Error|Exception|error|exception/ | sort @timestamp desc | limit 20",
          region     = var.aws_region,
          title      = "Recent Error Logs",
          view       = "table"
        }
      },
      
      # Security Events
      {
        type   = "metric"
        x      = 0
        y      = 32
        width  = 24
        height = 6
        properties = {
          metrics = [
            ["PropIE/${var.environment}/Security", "AuthFailures", {"label": "Auth Failures", "stat": "Sum"}],
            [".", "UnauthorizedAccess", {"label": "Unauthorized Access Attempts", "stat": "Sum"}],
            ["AWS/WAFV2", "BlockedRequests", "WebACL", "PropIEWebACL", {"label": "WAF Blocked Requests", "stat": "Sum"}]
          ],
          view       = "timeSeries",
          stacked    = false,
          region     = var.aws_region,
          title      = "Security Events",
          period     = 60
        }
      }
    ]
  })
}

# Export dashboards as JSON files for version control
resource "local_file" "performance_dashboard_json" {
  content  = aws_cloudwatch_dashboard.production_performance_dashboard.dashboard_body
  filename = "${path.module}/dashboards/performance-dashboard.json"
}

resource "local_file" "operations_dashboard_json" {
  content  = aws_cloudwatch_dashboard.real_time_operations_dashboard.dashboard_body
  filename = "${path.module}/dashboards/operations-dashboard.json"
}

# Create dashboard directory if it doesn't exist
resource "null_resource" "create_dashboard_dir" {
  provisioner "local-exec" {
    command = "mkdir -p ${path.module}/dashboards"
  }
}

output "performance_dashboard_url" {
  description = "URL for the Production Performance Dashboard"
  value       = "https://${var.aws_region}.console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=${aws_cloudwatch_dashboard.production_performance_dashboard.dashboard_name}"
}

output "operations_dashboard_url" {
  description = "URL for the Real-time Operations Dashboard"
  value       = "https://${var.aws_region}.console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=${aws_cloudwatch_dashboard.real_time_operations_dashboard.dashboard_name}"
}