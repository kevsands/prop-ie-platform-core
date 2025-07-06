# Operational Runbooks

This document provides step-by-step procedures for handling common operational scenarios for the PropIE AWS application.

## Table of Contents

1. [High Error Rate Runbook](#high-error-rate-runbook)
2. [Performance Degradation Runbook](#performance-degradation-runbook)
3. [DynamoDB Throttling Runbook](#dynamodb-throttling-runbook)
4. [Lambda Function Errors Runbook](#lambda-function-errors-runbook)
5. [API Gateway Issues Runbook](#api-gateway-issues-runbook)
6. [Authentication Service Failures Runbook](#authentication-service-failures-runbook)
7. [Frontend Deployment Issues Runbook](#frontend-deployment-issues-runbook)
8. [Security Incident Response](#security-incident-response)
9. [Database Maintenance Runbook](#database-maintenance-runbook)
10. [Disaster Recovery Runbook](#disaster-recovery-runbook)

## High Error Rate Runbook

### Symptoms
- CloudWatch alarm for 5XX error rate triggered
- Elevated error counts in application logs
- User reports of application failures

### Initial Assessment
1. **Check CloudWatch Dashboard**: Open the CloudWatch dashboard for the environment:
   ```
   https://${AWS_REGION}.console.aws.amazon.com/cloudwatch/home?region=${AWS_REGION}#dashboards:name=prop-ie-${ENVIRONMENT}-dashboard
   ```

2. **Identify Error Source**:
   - Check if errors are from Amplify, API Gateway, AppSync, or Lambda
   - Use the "Recent Error Logs" widget on the dashboard to see error details

3. **Check Recent Deployments**:
   - Check if any deployments occurred before errors started:
   ```bash
   aws amplify list-jobs --app-id ${AMPLIFY_APP_ID} --branch-name ${BRANCH_NAME} --max-results 10
   ```

### Resolution Steps

#### If errors are related to recent deployment:
1. **Rollback to previous version**:
   ```bash
   # Get the last successful job ID
   LAST_SUCCESSFUL_JOB=$(aws amplify list-jobs \
     --app-id ${AMPLIFY_APP_ID} \
     --branch-name ${BRANCH_NAME} \
     --max-results 10 \
     --query 'jobSummaries[?status==`SUCCEED`].jobId | [0]' \
     --output text)
   
   # Start a redeploy using the last successful job's artifact
   aws amplify start-deployment \
     --app-id ${AMPLIFY_APP_ID} \
     --branch-name ${BRANCH_NAME} \
     --job-id ${LAST_SUCCESSFUL_JOB}
   ```

2. **Monitor error rates**:
   - Watch the error rate metric to ensure it decreases
   - Create a JIRA ticket to investigate root cause

#### If errors are Lambda-related:
1. **Check Lambda logs**:
   ```bash
   aws logs filter-log-events \
     --log-group-name /aws/lambda/${LAMBDA_FUNCTION_NAME} \
     --filter-pattern "ERROR" \
     --start-time $(date -d "30 minutes ago" +%s)000
   ```

2. **Check for Lambda throttling or timeouts**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/Lambda \
     --metric-name Throttles \
     --start-time $(date -d "30 minutes ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 60 \
     --statistics Sum \
     --dimensions Name=FunctionName,Value=${LAMBDA_FUNCTION_NAME}
   ```

3. **Increase Lambda concurrency limit if needed**:
   ```bash
   aws lambda put-function-concurrency \
     --function-name ${LAMBDA_FUNCTION_NAME} \
     --reserved-concurrent-executions 100
   ```

#### If errors are API Gateway related:
1. **Check API Gateway logs**:
   ```bash
   aws logs filter-log-events \
     --log-group-name API-Gateway-Execution-Logs_${API_ID}/prod \
     --filter-pattern "Error"
   ```

2. **Check for API throttling**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/ApiGateway \
     --metric-name ThrottleCount \
     --start-time $(date -d "30 minutes ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 60 \
     --statistics Sum \
     --dimensions Name=ApiName,Value=${API_NAME} Name=Stage,Value=prod
   ```

3. **If needed, increase throttling limits**:
   ```bash
   aws apigateway update-stage \
     --rest-api-id ${API_ID} \
     --stage-name prod \
     --patch-operations op=replace,path=/throttling/rateLimit,value=1000
   ```

### Verification
1. Monitor the error rate in CloudWatch
2. Verify functionality through a test user journey
3. Update incident status in alerting system

## Performance Degradation Runbook

### Symptoms
- Latency alarms triggered
- Slow response times reported by users
- Increased processing times in logs

### Initial Assessment
1. **Check CloudWatch Dashboard**:
   - Look at the "Frontend Latency" and "API Latency" widgets
   - Check "Lambda Duration" metrics

2. **Check for traffic spikes**:
   - Review request volume metrics
   - Check if active user count has increased significantly

3. **Check resource utilization**:
   - Lambda concurrency and memory usage
   - DynamoDB consumed capacity
   - API Gateway request volume

### Resolution Steps

#### For Frontend Performance Issues:
1. **Check CDN and CloudFront metrics**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/CloudFront \
     --metric-name OriginLatency \
     --start-time $(date -d "30 minutes ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 60 \
     --statistics Average \
     --dimensions Name=DistributionId,Value=${CLOUDFRONT_ID} Name=Region,Value=Global
   ```

2. **Check if cache hit ratio is low**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/CloudFront \
     --metric-name CacheHitRate \
     --start-time $(date -d "24 hours ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 3600 \
     --statistics Average \
     --dimensions Name=DistributionId,Value=${CLOUDFRONT_ID} Name=Region,Value=Global
   ```

3. **Review the latest deployment for performance regressions**:
   - Check for new large JavaScript bundles
   - Review Core Web Vitals metrics

#### For API Performance Issues:
1. **Check AppSync or API Gateway metrics**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/AppSync \
     --metric-name Latency \
     --start-time $(date -d "1 hour ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 60 \
     --statistics p99 \
     --dimensions Name=GraphQLAPIId,Value=${APPSYNC_API_ID}
   ```

2. **Check Lambda execution duration**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/Lambda \
     --metric-name Duration \
     --start-time $(date -d "1 hour ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 60 \
     --statistics p95 \
     --dimensions Name=FunctionName,Value=${LAMBDA_FUNCTION_NAME}
   ```

3. **Check DynamoDB performance**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/DynamoDB \
     --metric-name SuccessfulRequestLatency \
     --start-time $(date -d "1 hour ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 60 \
     --statistics Average \
     --dimensions Name=TableName,Value=${TABLE_NAME} Name=Operation,Value=Query
   ```

#### For Resource Scaling:
1. **Increase Lambda memory/CPU**:
   ```bash
   aws lambda update-function-configuration \
     --function-name ${LAMBDA_FUNCTION_NAME} \
     --memory-size 2048
   ```

2. **Scale DynamoDB (if provisioned)**:
   ```bash
   aws dynamodb update-table \
     --table-name ${TABLE_NAME} \
     --provisioned-throughput ReadCapacityUnits=100,WriteCapacityUnits=50
   ```

3. **Update API Gateway throttling limits**:
   ```bash
   aws apigateway update-stage \
     --rest-api-id ${API_ID} \
     --stage-name prod \
     --patch-operations op=replace,path=/throttling/rateLimit,value=1000
   ```

### Verification
1. Monitor latency metrics to verify improvement
2. Run performance tests to validate fixes
3. Document findings and solutions

## DynamoDB Throttling Runbook

### Symptoms
- DynamoDB throttling alarms triggered
- Increased error rates in application
- "ProvisionedThroughputExceededException" in logs

### Initial Assessment
1. **Check current throttling metrics**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/DynamoDB \
     --metric-name ThrottledRequests \
     --start-time $(date -d "30 minutes ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 60 \
     --statistics Sum \
     --dimensions Name=TableName,Value=${TABLE_NAME}
   ```

2. **Check consumed capacity**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/DynamoDB \
     --metric-name ConsumedReadCapacityUnits \
     --start-time $(date -d "30 minutes ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 60 \
     --statistics Sum \
     --dimensions Name=TableName,Value=${TABLE_NAME}
   ```

3. **Check if throttling is for specific operations**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/DynamoDB \
     --metric-name ThrottledRequests \
     --start-time $(date -d "30 minutes ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 60 \
     --statistics Sum \
     --dimensions Name=TableName,Value=${TABLE_NAME} Name=Operation,Value=Query
   ```

### Resolution Steps

#### For On-Demand Capacity Mode:
1. **Check if on-demand scaling is adequate**:
   - On-demand tables can scale to 4x the previous peak
   - If traffic is more than 4x previous peak, consider switching to provisioned capacity

2. **Optimize queries to reduce consumed capacity**:
   - Check for full table scans in logs
   - Verify proper use of indexes
   - Look for hot partition keys

#### For Provisioned Capacity Mode:
1. **Increase read and/or write capacity**:
   ```bash
   aws dynamodb update-table \
     --table-name ${TABLE_NAME} \
     --provisioned-throughput ReadCapacityUnits=100,WriteCapacityUnits=50
   ```

2. **Enable auto-scaling if not already enabled**:
   ```bash
   aws application-autoscaling register-scalable-target \
     --service-namespace dynamodb \
     --resource-id table/${TABLE_NAME} \
     --scalable-dimension dynamodb:table:ReadCapacityUnits \
     --min-capacity 5 \
     --max-capacity 1000
   
   aws application-autoscaling put-scaling-policy \
     --service-namespace dynamodb \
     --resource-id table/${TABLE_NAME} \
     --scalable-dimension dynamodb:table:ReadCapacityUnits \
     --policy-name ReadAutoScalingPolicy \
     --policy-type TargetTrackingScaling \
     --target-tracking-scaling-policy-configuration file://read-policy.json
   ```

3. **Update application to use exponential backoff and retry logic**:
   - Review code for proper retry patterns
   - Implement caching for frequently accessed items

### Long-term Solutions
1. **Implement DynamoDB DAX for caching**
2. **Optimize data access patterns**
3. **Consider implementing read replicas for read-heavy workloads**

### Verification
1. Monitor throttling metrics to ensure improvement
2. Verify application functionality
3. Document capacity requirements for future planning

## Lambda Function Errors Runbook

### Symptoms
- CloudWatch alarms for Lambda errors
- Error messages in Lambda logs
- Increased API error rates

### Initial Assessment
1. **Check Lambda error logs**:
   ```bash
   aws logs filter-log-events \
     --log-group-name /aws/lambda/${LAMBDA_FUNCTION_NAME} \
     --filter-pattern "ERROR" \
     --start-time $(date -d "30 minutes ago" +%s)000
   ```

2. **Check Lambda metrics**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/Lambda \
     --metric-name Errors \
     --start-time $(date -d "30 minutes ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 60 \
     --statistics Sum \
     --dimensions Name=FunctionName,Value=${LAMBDA_FUNCTION_NAME}
   ```

3. **Check invocation volume**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/Lambda \
     --metric-name Invocations \
     --start-time $(date -d "30 minutes ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 60 \
     --statistics Sum \
     --dimensions Name=FunctionName,Value=${LAMBDA_FUNCTION_NAME}
   ```

### Resolution Steps

#### For Runtime Errors:
1. **Analyze error patterns in logs**:
   - Look for recurring exception types
   - Check if errors correlate with specific input patterns
   - Review stack traces for root causes

2. **Check Lambda environment variables**:
   ```bash
   aws lambda get-function-configuration \
     --function-name ${LAMBDA_FUNCTION_NAME}
   ```

3. **If the error is from a recent deployment, rollback**:
   ```bash
   aws lambda list-versions-by-function \
     --function-name ${LAMBDA_FUNCTION_NAME}
   
   aws lambda update-alias \
     --function-name ${LAMBDA_FUNCTION_NAME} \
     --name production \
     --function-version <PREVIOUS_VERSION>
   ```

#### For Timeout Errors:
1. **Check if function duration is close to timeout**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/Lambda \
     --metric-name Duration \
     --start-time $(date -d "30 minutes ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 60 \
     --statistics Maximum \
     --dimensions Name=FunctionName,Value=${LAMBDA_FUNCTION_NAME}
   ```

2. **Increase timeout if needed**:
   ```bash
   aws lambda update-function-configuration \
     --function-name ${LAMBDA_FUNCTION_NAME} \
     --timeout 30
   ```

3. **Consider breaking down complex functions into smaller steps**

#### For Memory/CPU Issues:
1. **Check memory utilization**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/Lambda \
     --metric-name MemoryUtilization \
     --start-time $(date -d "30 minutes ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 60 \
     --statistics Maximum \
     --dimensions Name=FunctionName,Value=${LAMBDA_FUNCTION_NAME}
   ```

2. **Increase memory allocation if needed**:
   ```bash
   aws lambda update-function-configuration \
     --function-name ${LAMBDA_FUNCTION_NAME} \
     --memory-size 2048
   ```

### Verification
1. Monitor error rates to ensure resolution
2. Test Lambda function with sample events
3. Document root cause and solution

## API Gateway Issues Runbook

### Symptoms
- API Gateway error alarms triggered
- Increased latency or error rates in API calls
- Client reports of API failures

### Initial Assessment
1. **Check API Gateway dashboard**:
   - Look at 4XX and 5XX error metrics
   - Review latency trends
   - Check throttling metrics

2. **Check API Gateway logs**:
   ```bash
   aws logs filter-log-events \
     --log-group-name API-Gateway-Execution-Logs_${API_ID}/prod \
     --filter-pattern "Error"
   ```

3. **Verify API Gateway integration status**:
   ```bash
   aws apigateway get-method \
     --rest-api-id ${API_ID} \
     --resource-id ${RESOURCE_ID} \
     --http-method GET
   ```

### Resolution Steps

#### For 5XX Errors:
1. **Check if backend service (Lambda) is failing**:
   - Review Lambda error logs
   - Check if Lambda function is being throttled
   - Verify Lambda permission policy is correct

2. **Check integration timeout settings**:
   ```bash
   aws apigateway get-integration \
     --rest-api-id ${API_ID} \
     --resource-id ${RESOURCE_ID} \
     --http-method GET
   ```

3. **Update timeout if needed**:
   ```bash
   aws apigateway update-integration \
     --rest-api-id ${API_ID} \
     --resource-id ${RESOURCE_ID} \
     --http-method GET \
     --patch-operations op=replace,path=/timeoutInMillis,value=29000
   ```

#### For 4XX Errors:
1. **Check if client requests are properly formatted**:
   - Review request validation settings
   - Check for missing required parameters
   - Verify authentication is working correctly

2. **Analyze which endpoints have the most 4XX errors**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/ApiGateway \
     --metric-name4XXError \
     --start-time $(date -d "30 minutes ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 60 \
     --statistics Sum \
     --dimensions Name=ApiName,Value=${API_NAME} Name=Resource,Value=${RESOURCE_PATH} Name=Method,Value=POST Name=Stage,Value=prod
   ```

3. **Check API Gateway authorization settings**:
   ```bash
   aws apigateway get-authorizer \
     --rest-api-id ${API_ID} \
     --authorizer-id ${AUTHORIZER_ID}
   ```

#### For Throttling Issues:
1. **Check current throttling settings**:
   ```bash
   aws apigateway get-stage \
     --rest-api-id ${API_ID} \
     --stage-name prod
   ```

2. **Increase throttling limits if needed**:
   ```bash
   aws apigateway update-stage \
     --rest-api-id ${API_ID} \
     --stage-name prod \
     --patch-operations op=replace,path=/throttling/rateLimit,value=1000 op=replace,path=/throttling/burstLimit,value=2000
   ```

### Verification
1. Monitor API Gateway metrics
2. Test API endpoints for functionality
3. Verify client applications are working correctly

## Authentication Service Failures Runbook

### Symptoms
- Authentication/authorization failures in application
- Cognito service metrics showing errors
- Users reporting login issues

### Initial Assessment
1. **Check Cognito service health**:
   - Review AWS Service Health Dashboard
   - Check CloudWatch metrics for Cognito user pools

2. **Check authentication error logs**:
   ```bash
   aws logs filter-log-events \
     --log-group-name /aws/lambda/${AUTH_LAMBDA_FUNCTION} \
     --filter-pattern "Authentication error" \
     --start-time $(date -d "30 minutes ago" +%s)000
   ```

3. **Check authentication metrics**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/Cognito \
     --metric-name SignInSuccesses \
     --start-time $(date -d "30 minutes ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 60 \
     --statistics Sum \
     --dimensions Name=UserPool,Value=${USER_POOL_ID}
   
   aws cloudwatch get-metric-statistics \
     --namespace AWS/Cognito \
     --metric-name SignInFailures \
     --start-time $(date -d "30 minutes ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 60 \
     --statistics Sum \
     --dimensions Name=UserPool,Value=${USER_POOL_ID}
   ```

### Resolution Steps

#### For Cognito Configuration Issues:
1. **Check Cognito app client settings**:
   ```bash
   aws cognito-idp describe-user-pool-client \
     --user-pool-id ${USER_POOL_ID} \
     --client-id ${CLIENT_ID}
   ```

2. **Verify client secrets haven't been rotated unexpectedly**:
   - Check if client secrets are still valid
   - Review any recent changes to Cognito configuration

3. **Check identity pool configuration**:
   ```bash
   aws cognito-identity describe-identity-pool \
     --identity-pool-id ${IDENTITY_POOL_ID}
   ```

#### For Authentication Flow Issues:
1. **Check if tokens are being properly validated**:
   - Review token validation logic in application
   - Verify JWT settings (issuer, audience, etc.)

2. **Verify client-side authentication flow**:
   - Check browser console for authentication errors
   - Review network requests for authentication endpoints

3. **Test authentication manually**:
   ```bash
   aws cognito-idp admin-initiate-auth \
     --user-pool-id ${USER_POOL_ID} \
     --client-id ${CLIENT_ID} \
     --auth-flow ADMIN_NO_SRP_AUTH \
     --auth-parameters USERNAME=${TEST_USERNAME},PASSWORD=${TEST_PASSWORD}
   ```

#### For MFA Issues:
1. **Check MFA configuration**:
   ```bash
   aws cognito-idp describe-user-pool \
     --user-pool-id ${USER_POOL_ID}
   ```

2. **If needed, temporarily disable MFA for testing**:
   ```bash
   aws cognito-idp set-user-pool-mfa-config \
     --user-pool-id ${USER_POOL_ID} \
     --mfa-configuration OFF
   ```

   > Note: Only do this in development/staging environments, not production!

### Verification
1. Test authentication flow with test users
2. Monitor authentication success/failure metrics
3. Verify client applications can authenticate properly

## Frontend Deployment Issues Runbook

### Symptoms
- Amplify deployment failures
- Frontend application not loading correctly
- Visual or functional regressions

### Initial Assessment
1. **Check Amplify deployment status**:
   ```bash
   aws amplify get-job \
     --app-id ${AMPLIFY_APP_ID} \
     --branch-name ${BRANCH_NAME} \
     --job-id ${JOB_ID}
   ```

2. **Review deployment logs**:
   ```bash
   aws amplify get-job-details \
     --app-id ${AMPLIFY_APP_ID} \
     --branch-name ${BRANCH_NAME} \
     --job-id ${JOB_ID}
   ```

3. **Check CloudFront distribution status**:
   ```bash
   aws cloudfront get-distribution \
     --id ${CLOUDFRONT_ID}
   ```

### Resolution Steps

#### For Build Failures:
1. **Analyze build logs for errors**:
   - Look for npm/yarn errors
   - Check for missing dependencies
   - Verify environment variables are set correctly

2. **Check if the failure is related to tests**:
   - If tests are failing, review test logs
   - Consider temporarily disabling tests for urgent fixes:
   ```bash
   aws amplify update-branch \
     --app-id ${AMPLIFY_APP_ID} \
     --branch-name ${BRANCH_NAME} \
     --framework "Next.js - SSR" \
     --environment-variables TEST_SKIP=true
   ```

3. **Manually trigger a new build**:
   ```bash
   aws amplify start-job \
     --app-id ${AMPLIFY_APP_ID} \
     --branch-name ${BRANCH_NAME} \
     --job-type RELEASE
   ```

#### For Cache Invalidation Issues:
1. **Create CloudFront invalidation**:
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id ${CLOUDFRONT_ID} \
     --paths "/*"
   ```

2. **Check invalidation status**:
   ```bash
   aws cloudfront get-invalidation \
     --distribution-id ${CLOUDFRONT_ID} \
     --id ${INVALIDATION_ID}
   ```

#### For Rollback:
1. **Identify the last successful deployment**:
   ```bash
   aws amplify list-jobs \
     --app-id ${AMPLIFY_APP_ID} \
     --branch-name ${BRANCH_NAME} \
     --max-results 10
   ```

2. **Redeploy using the last successful build artifacts**:
   ```bash
   aws amplify start-deployment \
     --app-id ${AMPLIFY_APP_ID} \
     --branch-name ${BRANCH_NAME} \
     --job-id ${LAST_SUCCESSFUL_JOB_ID}
   ```

### Verification
1. Test the application in a browser
2. Verify critical user flows are working
3. Check browser console for JavaScript errors

## Security Incident Response

Refer to the detailed [SECURITY-INCIDENT-RESPONSE.md](../SECURITY-INCIDENT-RESPONSE.md) document for the complete security incident response procedure. Below is a summary of initial steps:

### Initial Detection and Assessment
1. **Identify the potential security incident**:
   - Review WAF logs for unusual patterns
   - Check authentication failure logs
   - Analyze API access patterns

2. **Assess severity and impact**:
   - Determine what systems are affected
   - Evaluate potential data exposure
   - Estimate impact on users

3. **Activate incident response team**:
   - Notify security team lead
   - Involve necessary stakeholders
   - Establish communication channel

### Containment Steps
1. **Isolate affected systems if possible**:
   - For compromised user accounts, disable:
   ```bash
   aws cognito-idp admin-disable-user \
     --user-pool-id ${USER_POOL_ID} \
     --username ${USERNAME}
   ```

2. **Block suspicious IPs using WAF**:
   ```bash
   # Get current IP set
   aws wafv2 get-ip-set \
     --name ${IP_SET_NAME} \
     --scope REGIONAL \
     --id ${IP_SET_ID}
   
   # Update with new IPs to block
   aws wafv2 update-ip-set \
     --name ${IP_SET_NAME} \
     --scope REGIONAL \
     --id ${IP_SET_ID} \
     --addresses ${CURRENT_IPS} ${NEW_BLOCKED_IP}/32 \
     --lock-token ${LOCK_TOKEN}
   ```

3. **Rotate affected credentials**:
   - Update affected API keys
   - Rotate compromised secrets

### Follow-up Actions
1. Document incident details
2. Conduct post-incident analysis
3. Implement preventive measures

## Database Maintenance Runbook

### Planned Maintenance Tasks
1. **Check DynamoDB consumed capacity**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/DynamoDB \
     --metric-name ConsumedReadCapacityUnits \
     --start-time $(date -d "7 days ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 3600 \
     --statistics Average \
     --dimensions Name=TableName,Value=${TABLE_NAME}
   ```

2. **Adjust capacity based on usage patterns**:
   ```bash
   aws dynamodb update-table \
     --table-name ${TABLE_NAME} \
     --provisioned-throughput ReadCapacityUnits=100,WriteCapacityUnits=50
   ```

3. **Update auto-scaling settings if needed**:
   ```bash
   aws application-autoscaling put-scaling-policy \
     --service-namespace dynamodb \
     --resource-id table/${TABLE_NAME} \
     --scalable-dimension dynamodb:table:ReadCapacityUnits \
     --policy-name ReadAutoScalingPolicy \
     --policy-type TargetTrackingScaling \
     --target-tracking-scaling-policy-configuration file://read-policy.json
   ```

4. **Verify backups are running correctly**:
   ```bash
   aws dynamodb describe-continuous-backups \
     --table-name ${TABLE_NAME}
   ```

5. **Create on-demand backup if needed**:
   ```bash
   aws dynamodb create-backup \
     --table-name ${TABLE_NAME} \
     --backup-name ${TABLE_NAME}-backup-$(date +%Y%m%d)
   ```

### Monitoring Database Performance
1. **Check DynamoDB operation latency**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/DynamoDB \
     --metric-name SuccessfulRequestLatency \
     --start-time $(date -d "24 hours ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 3600 \
     --statistics Average \
     --dimensions Name=TableName,Value=${TABLE_NAME} Name=Operation,Value=Query
   ```

2. **List tables with their sizes**:
   ```bash
   aws dynamodb list-tables
   
   for table in $(aws dynamodb list-tables --query 'TableNames[]' --output text); do
     echo "Table: $table"
     aws dynamodb describe-table --table-name $table --query 'Table.TableSizeBytes'
   done
   ```

3. **Check for throttled requests**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/DynamoDB \
     --metric-name ThrottledRequests \
     --start-time $(date -d "7 days ago" -u +"%Y-%m-%dT%H:%M:%SZ") \
     --end-time $(date -u +"%Y-%m-%dT%H:%M:%SZ") \
     --period 86400 \
     --statistics Sum \
     --dimensions Name=TableName,Value=${TABLE_NAME}
   ```

## Disaster Recovery Runbook

### Emergency Recovery Procedures
1. **Assess the disaster impact**:
   - Identify affected systems and services
   - Determine recovery priority
   - Estimate recovery time

2. **Recover DynamoDB data**:
   ```bash
   # Check available backups
   aws dynamodb list-backups \
     --table-name ${TABLE_NAME}
   
   # Restore from backup
   aws dynamodb restore-table-from-backup \
     --target-table-name ${TABLE_NAME}-restored \
     --backup-arn ${BACKUP_ARN}
   ```

3. **Recover S3 data if needed**:
   ```bash
   # Check versioning status
   aws s3api get-bucket-versioning \
     --bucket ${BUCKET_NAME}
   
   # List available versions of objects
   aws s3api list-object-versions \
     --bucket ${BUCKET_NAME} \
     --prefix ${PREFIX}
   
   # Restore specific version
   aws s3api copy-object \
     --bucket ${BUCKET_NAME} \
     --copy-source ${BUCKET_NAME}/${OBJECT_KEY}?versionId=${VERSION_ID} \
     --key ${OBJECT_KEY}
   ```

4. **Deploy application to recovery environment**:
   ```bash
   aws amplify start-job \
     --app-id ${RECOVERY_AMPLIFY_APP_ID} \
     --branch-name ${BRANCH_NAME} \
     --job-type RELEASE
   ```

5. **Update DNS if needed**:
   ```bash
   aws route53 change-resource-record-sets \
     --hosted-zone-id ${HOSTED_ZONE_ID} \
     --change-batch file://dns-changes.json
   ```

### Testing Recovery Procedures
1. **Regularly test recovery procedures**:
   - Schedule quarterly recovery drills
   - Test restoring from backups
   - Validate application functionality in recovered state

2. **Document recovery time objectives (RTO) and results**:
   - Track actual recovery time vs. objectives
   - Identify bottlenecks in recovery process
   - Improve procedures based on test results