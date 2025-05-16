# Production Rollback Procedures

This document outlines the rollback procedures for the PropIE AWS application in case of deployment failures or critical issues in production.

## Table of Contents

1. [Rollback Overview](#rollback-overview)
2. [Blue/Green Deployment Rollback](#bluegreen-deployment-rollback)
3. [Manual Rollback Procedures](#manual-rollback-procedures)
4. [Database Rollback Procedures](#database-rollback-procedures)
5. [Automated Rollback Triggers](#automated-rollback-triggers)
6. [Post-Rollback Actions](#post-rollback-actions)
7. [Emergency Contacts](#emergency-contacts)

## Rollback Overview

Our application uses a blue/green deployment strategy to minimize downtime and provide quick rollback capabilities. In this strategy:

- **Blue Environment**: The current production environment
- **Green Environment**: The new version being deployed

If issues are detected in the green environment, traffic can be quickly routed back to the blue environment.

## Blue/Green Deployment Rollback

### Automatic Traffic Shifting Rollback

1. **Detect Issues**: Monitoring detects elevated error rates or performance degradation
2. **Abort Traffic Shift**: The traffic shifting process is automatically paused
3. **Revert Traffic**: Traffic is automatically shifted back to the blue environment
4. **Alert Team**: Notification is sent to the DevOps team via SNS

### Command Line Rollback

To manually rollback a blue/green deployment:

```bash
# 1. Check current deployment status
aws amplify get-app --app-id $AMPLIFY_APP_ID

# 2. Switch traffic back to blue environment (previous production)
aws amplify update-domain-association \
  --app-id $AMPLIFY_APP_ID \
  --domain-name prop-ie-app.com \
  --sub-domain-settings prefix=,branchName=production

# 3. Verify traffic routing
aws amplify get-domain-association \
  --app-id $AMPLIFY_APP_ID \
  --domain-name prop-ie-app.com
```

## Manual Rollback Procedures

If the automated procedures fail, follow these manual rollback steps:

### 1. Rollback Amplify Deployment

```bash
# Identify the last successful deployment from production branch
LAST_SUCCESSFUL_JOB=$(aws amplify list-jobs \
  --app-id $AMPLIFY_APP_ID \
  --branch-name production \
  --max-results 10 \
  --query 'jobSummaries[?status==`SUCCEED`].jobId | [0]' \
  --output text)

# Start a redeploy using the last successful job's artifact
aws amplify start-deployment \
  --app-id $AMPLIFY_APP_ID \
  --branch-name production \
  --job-id $LAST_SUCCESSFUL_JOB
```

### 2. Rollback Infrastructure Changes

If infrastructure changes need to be rolled back:

```bash
# Rollback CloudFormation stack to previous version
aws cloudformation rollback-stack \
  --stack-name prop-ie-${ENVIRONMENT}-appsync-stack

# Alternatively, update the stack with a previous template
aws cloudformation update-stack \
  --stack-name prop-ie-${ENVIRONMENT}-appsync-stack \
  --template-body file://backup/appsync-previous.yml \
  --parameters file://backup/appsync-parameters-previous.json
```

## Database Rollback Procedures

### DynamoDB Rollback

DynamoDB uses point-in-time recovery for rollbacks:

1. **Identify the rollback point**: Determine the timestamp to roll back to
2. **Create a recovery table**:

```bash
aws dynamodb restore-table-to-point-in-time \
  --source-table-name prop-ie-production-data \
  --target-table-name prop-ie-production-data-recovery \
  --use-latest-restorable-time \
  --sse-specification-override Enabled=true
```

3. **Verify the restored data** in the recovery table
4. **Swap tables** by updating the application's environment variables to point to the recovery table

## Automated Rollback Triggers

The following metrics trigger automated rollbacks:

| Metric | Threshold | Window | Action |
|--------|-----------|--------|--------|
| 5XX Error Rate | >5% | 5 minutes | Automatic rollback |
| Latency (p99) | >3000ms | 5 minutes | Alert, manual decision |
| Authentication Failures | >20 | 5 minutes | Alert, manual decision |
| Memory Usage | >85% | 5 minutes | Alert, manual decision |

## Post-Rollback Actions

After a rollback is performed:

1. **Document the incident**: Record what happened, why rollback was needed
2. **Analyze root cause**: Investigate what caused the issue
3. **Fix the issues**: Address the root cause in the development environment
4. **Improve tests**: Add tests to prevent similar issues
5. **Update monitoring**: Adjust monitoring if the issue wasn't caught early enough
6. **Update this rollback procedure**: If any gaps were identified in the rollback process

## Emergency Contacts

In case of critical issues requiring immediate attention:

| Role | Name | Contact Method | Hours |
|------|------|----------------|-------|
| DevOps Lead | TBD | Phone: XXX-XXX-XXXX | 24/7 |
| Backend Lead | TBD | Phone: XXX-XXX-XXXX | 9am-5pm |
| Frontend Lead | TBD | Phone: XXX-XXX-XXXX | 9am-5pm |
| AWS Support | N/A | AWS Support Portal | 24/7 |

Always escalate issues according to the severity matrix in the incident response playbook.