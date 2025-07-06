output "amplify_app_id" {
  description = "ID of the Amplify App"
  value       = aws_amplify_app.prop_ie_app.id
}

output "amplify_app_default_domain" {
  description = "Default domain for the Amplify App"
  value       = aws_amplify_app.prop_ie_app.default_domain
}

output "development_branch_webhook_url" {
  description = "Webhook URL for the development branch"
  value       = aws_amplify_webhook.development.webhook_url
  sensitive   = true
}

output "staging_branch_webhook_url" {
  description = "Webhook URL for the staging branch"
  value       = aws_amplify_webhook.staging.webhook_url
  sensitive   = true
}

output "production_branch_webhook_url" {
  description = "Webhook URL for the production branch"
  value       = aws_amplify_webhook.production.webhook_url
  sensitive   = true
}

output "cognito_user_pool_id" {
  description = "ID of the Cognito User Pool"
  value       = data.aws_cloudformation_stack.cognito.outputs["UserPoolId"]
}

output "cognito_user_pool_client_id" {
  description = "ID of the Cognito User Pool Client"
  value       = data.aws_cloudformation_stack.cognito.outputs["UserPoolClientId"]
}

output "cognito_identity_pool_id" {
  description = "ID of the Cognito Identity Pool"
  value       = data.aws_cloudformation_stack.cognito.outputs["IdentityPoolId"]
}

output "appsync_api_id" {
  description = "ID of the AppSync API"
  value       = data.aws_cloudformation_stack.appsync.outputs["GraphQLApiId"]
}

output "appsync_api_endpoint" {
  description = "GraphQL endpoint URL"
  value       = data.aws_cloudformation_stack.appsync.outputs["GraphQLApiEndpoint"]
}

output "storage_bucket_name" {
  description = "Name of the S3 bucket for storage"
  value       = data.aws_cloudformation_stack.cognito.outputs["S3BucketName"]
}

output "alerts_topic_arn" {
  description = "ARN of the SNS topic for alerts"
  value       = data.aws_cloudformation_stack.monitoring.outputs["AlertsTopicArn"]
}