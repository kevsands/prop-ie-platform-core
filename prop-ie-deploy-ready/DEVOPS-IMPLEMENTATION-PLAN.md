# PropIE AWS Platform - DevOps Implementation Plan

This document outlines the comprehensive DevOps strategy for the PropIE AWS platform, including infrastructure setup, CI/CD pipeline configuration, development tools, and monitoring systems.

## 1. AWS Infrastructure Architecture

### Resource Architecture

```
                                  ┌─────────────────────────┐
                                  │       CloudFront        │◄────┐
                                  │    (CDN Distribution)    │     │
                                  └────────────┬────────────┘     │
                                               │                  │
                                               ▼                  │
             ┌─────────────────┐    ┌─────────────────────────┐   │
             │                 │    │        AWS Amplify       │   │
             │      WAF        │◄───┤  (Next.js Application)   │   │
             │  (Web Firewall) │    │                         │   │
             │                 │    └─────────────┬───────────┘   │
             └─────────────────┘                  │               │
                                                  │               │
                                                  ▼               │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────┐     │
│     Cognito     │    │                 │    │             │     │
│  (Auth Service) │◄───┤    AppSync      │◄───┤  API Gateway│─────┘
│                 │    │  (GraphQL API)  │    │             │
└─────────────────┘    │                 │    └─────────────┘
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │                 │
                       │    Lambda       │
                       │  (Functions)    │
                       │                 │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │                 │    │                 │
                       │    DynamoDB     │    │       S3        │
                       │   (Database)    │    │    (Storage)    │
                       │                 │    │                 │
                       └─────────────────┘    └─────────────────┘
```

### Environment Strategy
- **Development**: For active development and feature testing
  - Subdomain: dev.prop-ie-app.com
  - Reduced capacity and resources
  - Looser security controls for easier debugging
  
- **Staging**: For pre-production testing and validation
  - Subdomain: staging.prop-ie-app.com
  - Production-like environment
  - Complete security features enabled
  
- **Production**: Live customer environment
  - Primary domain: prop-ie-app.com
  - Full capacity with auto-scaling
  - Maximum security measures

### IAM & Security Framework
- Implementation of least privilege principles
- Service roles with specific permissions
- Cross-account access for environment separation
- OIDC integration with GitHub Actions for secure CI/CD

## 2. Infrastructure as Code (AWS CDK)

We will use AWS CDK for infrastructure deployment with TypeScript, consolidating the existing Terraform and CloudFormation resources.

### Project Structure
```
/infrastructure/
  /cdk/
    /lib/
      amplify-stack.ts      # Amplify hosting configuration
      appsync-stack.ts      # GraphQL API configuration
      auth-stack.ts         # Cognito user pools and identity pools
      monitoring-stack.ts   # CloudWatch dashboards and alarms
      waf-stack.ts          # Web application firewall rules
      network-stack.ts      # VPC, subnets, and routing configuration
    /bin/
      prop-ie-app.ts        # Entry point for CDK deployment
    cdk.json                # CDK configuration
  /scripts/
    deploy-dev.sh           # Development deployment script
    deploy-staging.sh       # Staging deployment script
    deploy-prod.sh          # Production deployment script
```

### Implementation Steps
1. Convert existing CloudFormation templates to CDK
2. Migrate Terraform configurations to CDK
3. Create shared constructs for reusable components
4. Implement environment-specific configurations
5. Add pipeline for infrastructure deployment

## 3. CI/CD Pipeline Implementation

### Enhanced GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [development, staging, production]
  pull_request:
    types: [opened, synchronize, reopened]
    branches: [development, staging, production]

env:
  NODE_VERSION: 20
  AWS_REGION: us-east-1

jobs:
  # Validation phase
  validate:
    name: Validate Code
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Validate Package Lock
        run: npm run verify-lockfile

      - name: Type Check
        run: npm run type-check

      - name: Lint Code
        run: npm run lint

      - name: Security Check
        run: npm run security-check
        
      - name: Check Dependencies
        run: npm audit --production

  # Testing phase
  test:
    name: Run Tests
    needs: validate
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Unit Tests
        run: npm run test:ci
        
      - name: Run Integration Tests
        run: npm run test:integration
        
      - name: Upload Test Coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
          
      - name: Run Accessibility Tests
        run: npm run a11y-audit:ci

  # Infrastructure validation
  infra-validate:
    name: Validate Infrastructure
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          
      - name: Install CDK
        run: npm install -g aws-cdk
        
      - name: CDK Synth
        working-directory: ./infrastructure/cdk
        run: |
          npm ci
          cdk synth
          
      - name: Scan IaC for security issues
        uses: bridgecrewio/checkov-action@master
        with:
          directory: ./infrastructure
          framework: cloudformation,terraform,kubernetes
          output_format: sarif
          output_file: checkov.sarif

  # Build preview for PRs
  build-preview:
    name: Build Preview
    if: github.event_name == 'pull_request'
    needs: [test, infra-validate]
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Application
        env:
          NEXT_PUBLIC_APP_ENV: preview
          NEXT_PUBLIC_API_ENDPOINT: https://preview-api.prop-ie-app.com
        run: npm run build

      - name: Bundle Analysis
        run: npm run performance:analyze
        
      - name: Upload Build Artifact
        uses: actions/upload-artifact@v4
        with:
          name: nextjs-build
          path: .next/
          retention-days: 1

  # PR Preview deployment
  deploy-preview:
    name: Deploy PR Preview
    if: github.event_name == 'pull_request'
    needs: build-preview
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Download Build Artifact
        uses: actions/download-artifact@v4
        with:
          name: nextjs-build
          path: .next/

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AMPLIFY_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Generate Preview URL (Branch-Based)
        id: preview-url
        run: |
          BRANCH_NAME=$(echo ${{ github.head_ref }} | sed 's/[^a-zA-Z0-9]/-/g')
          PR_ID=${{ github.event.pull_request.number }}
          echo "PREVIEW_URL=https://pr-${PR_ID}.${BRANCH_NAME}.amplifyapp.com" >> $GITHUB_ENV
          echo "preview_url=https://pr-${PR_ID}.${BRANCH_NAME}.amplifyapp.com" >> $GITHUB_OUTPUT

      - name: Deploy to AWS Amplify
        run: |
          aws amplify start-job \
            --app-id ${{ secrets.AMPLIFY_APP_ID }} \
            --branch-name ${{ github.head_ref }} \
            --job-type DEPLOY

      - name: Comment Preview URL
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 Preview deployment is ready! Visit: ${{ steps.preview-url.outputs.preview_url }}`
            })

  # Performance testing
  performance-test:
    name: Performance Testing
    if: github.event_name == 'pull_request'
    needs: deploy-preview
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Lighthouse CI
        run: npx lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
          LHCI_URL: ${{ env.PREVIEW_URL }}

      - name: Run Performance Tests
        run: npm run performance:ci

  # Production deployment
  deploy-production:
    name: Deploy to Production
    if: github.event_name == 'push' && github.ref == 'refs/heads/production'
    needs: [test, infra-validate]
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    environment:
      name: production
      url: https://prop-ie-app.com
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AMPLIFY_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Trigger Amplify Deployment
        run: |
          aws amplify start-job \
            --app-id ${{ secrets.AMPLIFY_APP_ID }} \
            --branch-name production \
            --job-type RELEASE
            
      - name: Notify Deployment
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Production Deployment Completed :rocket:",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Production Deployment Completed*\n:rocket: <https://prop-ie-app.com|View Live Site>"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

  # Staging and Development deployments (similar structure to production)
  deploy-staging:
    name: Deploy to Staging
    if: github.event_name == 'push' && github.ref == 'refs/heads/staging'
    needs: [test, infra-validate]
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    environment:
      name: staging
      url: https://staging.prop-ie-app.com
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AMPLIFY_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Trigger Amplify Deployment
        run: |
          aws amplify start-job \
            --app-id ${{ secrets.AMPLIFY_APP_ID }} \
            --branch-name staging \
            --job-type RELEASE

  deploy-development:
    name: Deploy to Development
    if: github.event_name == 'push' && github.ref == 'refs/heads/development'
    needs: [test, infra-validate]
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    environment:
      name: development
      url: https://dev.prop-ie-app.com
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AMPLIFY_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Trigger Amplify Deployment
        run: |
          aws amplify start-job \
            --app-id ${{ secrets.AMPLIFY_APP_ID }} \
            --branch-name development \
            --job-type RELEASE
```

### Deployment Strategy

**Branch-Based Environment Mapping**:
- `development` branch → Development environment
- `staging` branch → Staging environment
- `production` branch → Production environment

**Pull Request (PR) Previews**:
- Automated Amplify branch-based deployments
- Unique URL per PR: `https://pr-{PR_ID}.{BRANCH_NAME}.amplifyapp.com`
- Teardown upon PR close

**Progressive Deployment Strategy**:
1. Deploy to Development automatically on commit
2. Manual promotion to Staging with approval
3. Manual promotion to Production with approval and scheduled window

## 4. Docker and Local Development Environment

### Docker Configuration

Create a Docker setup for consistent local development:

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Use non-root user
USER appuser

# Start the application
CMD ["npm", "start"]
```

### Docker Compose for Development

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - node_modules:/app/node_modules
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_APP_ENV=development
      - NEXT_PUBLIC_API_ENDPOINT=http://localhost:4000
      - NEXT_PUBLIC_APP_URL=http://localhost:3000
    depends_on:
      - api-mock

  api-mock:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - ./mock-server:/app
    ports:
      - "4000:4000"
    command: npm run start:mock-server

volumes:
  node_modules:
```

### Local Development Scripts

Create helper scripts to simplify the development workflow:

```bash
#!/bin/bash
# dev-start.sh

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Docker is not running. Please start Docker first."
  exit 1
fi

# Build and start containers
docker-compose up -d

# Set up local environment mocks
echo "Setting up local mocks..."
npm run setup-mocks

# Open browser
echo "Opening application in browser..."
open http://localhost:3000

echo "Development environment started successfully!"
```

## 5. Monitoring and Alerting

### CloudWatch Dashboard Configuration

```typescript
// dashboard-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';

export class DashboardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dashboard = new cloudwatch.Dashboard(this, 'PropIEDashboard', {
      dashboardName: 'PropIE-Application-Dashboard',
    });

    // Add Amplify metrics
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'Amplify Request Metrics',
        left: [
          new cloudwatch.Metric({
            namespace: 'AWS/Amplify',
            metricName: 'Requests',
            dimensionsMap: {
              App: 'prop-ie-aws-app',
            },
            statistic: 'Sum',
            period: cdk.Duration.minutes(1),
          }),
          new cloudwatch.Metric({
            namespace: 'AWS/Amplify',
            metricName: '4XXErrors',
            dimensionsMap: {
              App: 'prop-ie-aws-app',
            },
            statistic: 'Sum',
            period: cdk.Duration.minutes(1),
          }),
          new cloudwatch.Metric({
            namespace: 'AWS/Amplify',
            metricName: '5XXErrors',
            dimensionsMap: {
              App: 'prop-ie-aws-app',
            },
            statistic: 'Sum',
            period: cdk.Duration.minutes(1),
          }),
        ],
      }),
      new cloudwatch.GraphWidget({
        title: 'Amplify Performance',
        left: [
          new cloudwatch.Metric({
            namespace: 'AWS/Amplify',
            metricName: 'Latency',
            dimensionsMap: {
              App: 'prop-ie-aws-app',
            },
            statistic: 'Average',
            period: cdk.Duration.minutes(1),
          }),
        ],
      })
    );

    // Add AppSync metrics
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'AppSync API Metrics',
        left: [
          new cloudwatch.Metric({
            namespace: 'AWS/AppSync',
            metricName: 'Latency',
            dimensionsMap: {
              GraphQLAPIId: 'prop-ie-graphql-api',
            },
            statistic: 'Average',
            period: cdk.Duration.minutes(1),
          }),
          new cloudwatch.Metric({
            namespace: 'AWS/AppSync',
            metricName: '5XXError',
            dimensionsMap: {
              GraphQLAPIId: 'prop-ie-graphql-api',
            },
            statistic: 'Sum',
            period: cdk.Duration.minutes(1),
          }),
        ],
      })
    );

    // Add Lambda metrics
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'Lambda Performance',
        left: [
          new cloudwatch.Metric({
            namespace: 'AWS/Lambda',
            metricName: 'Duration',
            dimensionsMap: {
              FunctionName: 'prop-ie-graphql-handler',
            },
            statistic: 'Average',
            period: cdk.Duration.minutes(1),
          }),
          new cloudwatch.Metric({
            namespace: 'AWS/Lambda',
            metricName: 'Errors',
            dimensionsMap: {
              FunctionName: 'prop-ie-graphql-handler',
            },
            statistic: 'Sum',
            period: cdk.Duration.minutes(1),
          }),
          new cloudwatch.Metric({
            namespace: 'AWS/Lambda',
            metricName: 'Invocations',
            dimensionsMap: {
              FunctionName: 'prop-ie-graphql-handler',
            },
            statistic: 'Sum',
            period: cdk.Duration.minutes(1),
          }),
        ],
      })
    );

    // Add custom application metrics
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'Business Metrics',
        left: [
          new cloudwatch.Metric({
            namespace: 'PropIE/Business',
            metricName: 'ActiveUsers',
            statistic: 'Average',
            period: cdk.Duration.minutes(5),
          }),
          new cloudwatch.Metric({
            namespace: 'PropIE/Business',
            metricName: 'PropertyViews',
            statistic: 'Sum',
            period: cdk.Duration.minutes(5),
          }),
        ],
      })
    );
  }
}
```

### Alarm Configuration (Enhanced)

Extend the existing CloudWatch alarms with custom business metrics:

```typescript
// alarms-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';

export class AlarmsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create SNS topic for alerts
    const alertTopic = new sns.Topic(this, 'PropIEAlerts', {
      displayName: 'PropIE Alerts',
    });

    // Add email subscribers
    alertTopic.addSubscription(new subscriptions.EmailSubscription('devops@prop-ie.com'));
    alertTopic.addSubscription(new subscriptions.EmailSubscription('oncall@prop-ie.com'));

    // Add Slack webhook integration
    alertTopic.addSubscription(
      new subscriptions.UrlSubscription('https://hooks.slack.com/services/your-webhook-path', {
        protocol: sns.SubscriptionProtocol.HTTPS,
      })
    );

    // Create alarms for critical services
    
    // 1. Amplify 5XX Errors
    const amplify5xxAlarm = new cloudwatch.Alarm(this, 'Amplify5xxAlarm', {
      metric: new cloudwatch.Metric({
        namespace: 'AWS/Amplify',
        metricName: '5XXErrors',
        dimensionsMap: {
          App: 'prop-ie-aws-app',
        },
        statistic: 'Sum',
        period: cdk.Duration.minutes(1),
      }),
      threshold: 5,
      evaluationPeriods: 1,
      alarmDescription: 'Amplify is returning 5XX errors',
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    amplify5xxAlarm.addAlarmAction(new cloudwatch.SnsAction(alertTopic));
    
    // 2. AppSync Errors
    const appsyncErrorsAlarm = new cloudwatch.Alarm(this, 'AppSyncErrorsAlarm', {
      metric: new cloudwatch.Metric({
        namespace: 'AWS/AppSync',
        metricName: '5XXError',
        dimensionsMap: {
          GraphQLAPIId: 'prop-ie-graphql-api',
        },
        statistic: 'Sum',
        period: cdk.Duration.minutes(1),
      }),
      threshold: 5,
      evaluationPeriods: 1,
      alarmDescription: 'AppSync API is returning errors',
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    appsyncErrorsAlarm.addAlarmAction(new cloudwatch.SnsAction(alertTopic));
    
    // 3. Lambda Duration (Performance)
    const lambdaDurationAlarm = new cloudwatch.Alarm(this, 'LambdaDurationAlarm', {
      metric: new cloudwatch.Metric({
        namespace: 'AWS/Lambda',
        metricName: 'Duration',
        dimensionsMap: {
          FunctionName: 'prop-ie-graphql-handler',
        },
        statistic: 'Average',
        period: cdk.Duration.minutes(5),
      }),
      threshold: 1000, // 1 second
      evaluationPeriods: 3,
      alarmDescription: 'Lambda execution time is high',
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    lambdaDurationAlarm.addAlarmAction(new cloudwatch.SnsAction(alertTopic));

    // 4. Business Metric: Failed Logins
    const failedLoginsAlarm = new cloudwatch.Alarm(this, 'FailedLoginsAlarm', {
      metric: new cloudwatch.Metric({
        namespace: 'PropIE/Security',
        metricName: 'FailedLoginAttempts',
        statistic: 'Sum',
        period: cdk.Duration.minutes(5),
      }),
      threshold: 10,
      evaluationPeriods: 1,
      alarmDescription: 'High number of failed login attempts detected',
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    failedLoginsAlarm.addAlarmAction(new cloudwatch.SnsAction(alertTopic));

    // 5. Composite Critical Services Alarm
    new cloudwatch.CompositeAlarm(this, 'CriticalServicesAlarm', {
      alarmRule: cloudwatch.AlarmRule.anyOf(
        cloudwatch.AlarmRule.fromAlarm(amplify5xxAlarm, cloudwatch.AlarmState.ALARM),
        cloudwatch.AlarmRule.fromAlarm(appsyncErrorsAlarm, cloudwatch.AlarmState.ALARM)
      ),
      alarmDescription: 'Critical services are experiencing issues',
    }).addAlarmAction(new cloudwatch.SnsAction(alertTopic));
  }
}
```

### Custom Metrics Collection

Implement application-level metrics with CloudWatch agent:

```javascript
// src/lib/monitoring/metrics.ts
import { CloudWatch } from '@aws-sdk/client-cloudwatch';

export class Metrics {
  private cloudwatch: CloudWatch;
  private namespace: string;
  
  constructor() {
    this.cloudwatch = new CloudWatch({ region: process.env.AWS_REGION });
    this.namespace = `PropIE/${process.env.NEXT_PUBLIC_APP_ENV}`;
  }
  
  async putMetric(name: string, value: number, unit = 'Count', dimensions: Record<string, string> = {}) {
    try {
      const dimensionList = Object.entries(dimensions).map(([Name, Value]) => ({ Name, Value }));
      
      await this.cloudwatch.putMetricData({
        Namespace: this.namespace,
        MetricData: [
          {
            MetricName: name,
            Value: value,
            Unit: unit,
            Dimensions: dimensionList,
            Timestamp: new Date(),
          },
        ],
      });
      
      console.log(`Published metric ${name}: ${value} ${unit}`);
    } catch (error) {
      console.error('Error publishing metric:', error);
    }
  }
  
  // Convenience methods for common metrics
  async trackActiveUsers(count: number) {
    return this.putMetric('ActiveUsers', count);
  }
  
  async trackPageView(page: string) {
    return this.putMetric('PageViews', 1, 'Count', { Page: page });
  }
  
  async trackApiLatency(api: string, latencyMs: number) {
    return this.putMetric('ApiLatency', latencyMs, 'Milliseconds', { Api: api });
  }
  
  async trackBusinessEvent(eventType: string) {
    return this.putMetric('BusinessEvents', 1, 'Count', { EventType: eventType });
  }
}

export const metrics = new Metrics();
```

## 6. Environment Configuration and Secrets Management

### AWS Parameter Store for Configuration

```typescript
// src/lib/config/parameters.ts
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm';

export class ParameterStore {
  private ssm: SSMClient;
  private cache: Map<string, { value: string; timestamp: number }> = new Map();
  private cacheTTL: number = 5 * 60 * 1000; // 5 minutes
  
  constructor() {
    this.ssm = new SSMClient({ region: process.env.AWS_REGION });
  }
  
  async getParameter(name: string, useCache = true): Promise<string> {
    const paramPath = `/prop-ie/${process.env.NEXT_PUBLIC_APP_ENV}/${name}`;
    
    // Check cache first
    if (useCache) {
      const cached = this.cache.get(paramPath);
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        return cached.value;
      }
    }
    
    try {
      const command = new GetParameterCommand({
        Name: paramPath,
        WithDecryption: true,
      });
      
      const response = await this.ssm.send(command);
      
      if (response.Parameter?.Value) {
        // Update cache
        this.cache.set(paramPath, {
          value: response.Parameter.Value,
          timestamp: Date.now(),
        });
        
        return response.Parameter.Value;
      }
      
      throw new Error(`Parameter ${name} not found`);
    } catch (error) {
      console.error(`Error fetching parameter ${name}:`, error);
      throw error;
    }
  }
  
  async getEnvironmentConfig(): Promise<Record<string, string>> {
    const configParams = await this.getParameter('config');
    
    try {
      return JSON.parse(configParams);
    } catch (error) {
      console.error('Error parsing environment config:', error);
      return {};
    }
  }
}

export const parameterStore = new ParameterStore();
```

### Secrets Rotation with Lambda

```typescript
// infrastructure/cdk/lib/secrets-rotation-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';

export class SecretsRotationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create API key secret
    const apiKeySecret = new secretsmanager.Secret(this, 'ApiKeySecret', {
      secretName: `/prop-ie/${props?.env?.name}/api-key`,
      description: 'API Key for external services',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'prop-ie-app' }),
        generateStringKey: 'api_key',
        excludePunctuation: true,
        includeSpace: false,
        passwordLength: 32,
      },
    });

    // Create rotation Lambda
    const rotationFunction = new lambda.Function(this, 'ApiKeyRotationFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/secrets-rotation'),
      environment: {
        SECRET_ARN: apiKeySecret.secretArn,
        EXTERNAL_API_ENDPOINT: 'https://api.external-service.com',
      },
      timeout: cdk.Duration.minutes(5),
    });

    // Grant permissions
    apiKeySecret.grantRead(rotationFunction);
    apiKeySecret.grantWrite(rotationFunction);
    
    // Add API permissions
    rotationFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['secretsmanager:DescribeSecret', 'secretsmanager:GetSecretValue', 'secretsmanager:PutSecretValue'],
      resources: [apiKeySecret.secretArn],
    }));

    // Schedule rotation
    const rotationRule = new events.Rule(this, 'RotationSchedule', {
      schedule: events.Schedule.cron({ hour: '0', minute: '0', weekDay: 'MON' }), // Every Monday at midnight
    });
    
    rotationRule.addTarget(new targets.LambdaFunction(rotationFunction));
  }
}
```

## 7. Development Tools and Documentation

### Development Environment Setup Guide

```markdown
# PropIE AWS Platform - Local Development Guide

This guide explains how to set up and use the local development environment for the PropIE AWS platform.

## Prerequisites

- Docker Desktop installed and running
- Git
- Node.js 20.x (for local builds without Docker)
- AWS CLI configured with developer credentials

## Quick Start

1. Clone the repository:
   ```
   git clone https://github.com/your-org/prop-ie-aws-app.git
   cd prop-ie-aws-app
   ```

2. Start the development environment:
   ```
   ./dev-start.sh
   ```

   This will:
   - Build and start Docker containers
   - Set up local mocks for AWS services
   - Open the application in your browser

3. Access the application at http://localhost:3000

## Available Services

The development environment provides the following local services:

- **Next.js App**: http://localhost:3000
- **API Mock Server**: http://localhost:4000
- **DynamoDB Local**: http://localhost:8000
- **Local S3**: http://localhost:9000

## Testing

- Run unit tests: `npm run test`
- Run integration tests: `npm run test:integration`
- Run E2E tests: `npm run test:e2e`

## AWS Service Mocking

The development environment uses localstack to mock AWS services. You can interact with these services using the AWS CLI with the `--endpoint-url` parameter:

```bash
# List local S3 buckets
aws --endpoint-url=http://localhost:9000 s3 ls

# Query local DynamoDB
aws --endpoint-url=http://localhost:8000 dynamodb scan --table-name Properties
```

## Environment Variables

Local environment variables are stored in the `.env.local` file. A sample file is provided as `.env.example`.

## Deployment Testing

To test a deployment locally before pushing:

```bash
npm run build
npm run start
```

This will build and serve the application in production mode.

## Troubleshooting

If you encounter issues with the development environment:

1. Check Docker container status:
   ```
   docker-compose ps
   ```

2. View container logs:
   ```
   docker-compose logs -f app
   ```

3. Restart the development environment:
   ```
   docker-compose down
   ./dev-start.sh
   ```
```

### AWS Integration Testing Guide

Create a guide for developers to test AWS integrations locally and in development:

```markdown
# AWS Integration Testing Guide

This guide provides information on testing AWS integrations both locally and in the development environment.

## Local Testing with AWS Mocks

### Using AWS Mocks for Local Development

The development environment includes mock implementations of AWS services. These mocks provide a way to test AWS integrations without connecting to actual AWS services.

To use the mock services:

1. Start the local environment:
   ```
   ./dev-start.sh
   ```

2. The following AWS services are mocked locally:
   - DynamoDB
   - S3
   - Lambda
   - AppSync
   - Cognito (authentication flow)

### Configuring Mock Behaviors

Mock service behaviors can be customized by modifying the files in the `mock-server/aws` directory:

- `dynamodb.js` - Configure DynamoDB tables and initial data
- `s3.js` - Configure S3 buckets and initial objects
- `lambda.js` - Configure Lambda function responses
- `cognito.js` - Configure auth flow responses

## Testing Against Real AWS Services

For more comprehensive testing, you can configure the local environment to connect to actual AWS services in the development environment.

### Prerequisites

1. AWS IAM credentials with appropriate permissions
2. AWS CLI configured with your credentials

### Configuration

1. Create a `.env.aws` file with your AWS configuration:
   ```
   NEXT_PUBLIC_APP_ENV=development
   NEXT_PUBLIC_API_ENDPOINT=https://dev-api.prop-ie-app.com
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   USE_REAL_AWS=true
   AWS_PROFILE=prop-ie-dev
   ```

2. Start the environment with AWS integration:
   ```
   ./dev-start-aws.sh
   ```

This will start the application configured to use the real AWS services in the development environment.

### Security Considerations

- Never use production AWS credentials for local development
- Use IAM roles with minimal permissions for development
- Do not store AWS credentials in version control

## Integration Testing in CI/CD

The CI/CD pipeline includes automated integration tests against a real AWS development environment.

To run these tests locally:

```bash
npm run test:integration:aws
```

This will run the integration test suite against the development AWS environment.
```

## 8. Deployment Procedures Documentation

### Deployment Process Guide

```markdown
# PropIE AWS Platform - Deployment Guide

This document outlines the deployment processes for the PropIE AWS platform across all environments.

## Deployment Environments

The platform supports three deployment environments:

1. **Development** (dev.prop-ie-app.com)
   - Branch: `development`
   - Purpose: Active development and feature testing
   - Deployment: Automatic on commit to development branch

2. **Staging** (staging.prop-ie-app.com)
   - Branch: `staging` 
   - Purpose: Pre-production testing and validation
   - Deployment: Manual promotion with approval

3. **Production** (prop-ie-app.com)
   - Branch: `production`
   - Purpose: Live customer environment
   - Deployment: Manual promotion with approval and scheduled window

## Deployment Methods

### Automated CI/CD Deployments

The CI/CD pipeline automatically handles deployments based on git workflow:

1. **Pull Request Previews**
   - Every PR gets a unique preview URL
   - Format: `https://pr-{PR_ID}.{BRANCH_NAME}.amplifyapp.com`
   - Automatically deployed when PR is created or updated
   - Automatically torn down when PR is closed

2. **Branch Deployments**
   - Commits to `development`, `staging`, or `production` branches trigger deployments
   - GitHub Actions workflow runs validation, testing, and deployment

### Manual Deployment Process

In case the automated deployment needs to be bypassed:

1. **Infrastructure Deployment**:
   ```bash
   cd infrastructure/cdk
   npm run deploy:dev    # Deploy to Development
   npm run deploy:stage  # Deploy to Staging
   npm run deploy:prod   # Deploy to Production
   ```

2. **Application Deployment**:
   ```bash
   # Configure AWS credentials
   aws configure --profile prop-ie-amplify
   
   # Trigger Amplify deployment
   aws amplify start-job \
     --app-id $AMPLIFY_APP_ID \
     --branch-name $BRANCH_NAME \
     --job-type RELEASE \
     --profile prop-ie-amplify
   ```

## Rollback Procedures

If a deployment causes issues, follow these rollback procedures:

### Quick Rollback (Last Good Version)

1. Navigate to the AWS Amplify Console
2. Select the affected branch
3. Go to "Deployment history"
4. Find the last successful deployment
5. Click "Redeploy this version"

### Full Rollback (Git-based)

1. Revert the problematic changes in git:
   ```bash
   git revert <commit-hash>
   git push origin <branch-name>
   ```

2. The CI/CD pipeline will automatically deploy the reverted version

### Infrastructure Rollback

For infrastructure changes:

1. Use AWS CloudFormation or CDK to roll back:
   ```bash
   cd infrastructure/cdk
   cdk deploy <stack-name> --parameters version=<previous-version>
   ```

2. If necessary, restore from backup:
   ```bash
   # Example: Restore DynamoDB from backup
   aws dynamodb restore-table-from-backup \
     --target-table-name PropIE-Properties \
     --backup-arn <backup-arn>
   ```

## Deployment Verification

After each deployment, verify the following:

1. **Application Functionality**:
   - Run automated smoke tests
   - Verify critical user flows manually

2. **Infrastructure Health**:
   - Check CloudWatch dashboards for error spikes
   - Verify all resources are properly provisioned

3. **Security Verification**:
   - Validate WAF rules are active
   - Check for any unauthorized access attempts

## Maintenance Window Procedures

For scheduled maintenance:

1. **Pre-Maintenance**:
   - Create maintenance announcement 48 hours in advance
   - Send notification to all stakeholders
   - Prepare rollback plan

2. **During Maintenance**:
   - Enable maintenance mode banner
   - Execute planned changes
   - Monitor logs and metrics closely

3. **Post-Maintenance**:
   - Verify all systems are operational
   - Send completion notification
   - Document any issues encountered
```

## 9. Security Integration

### WAF Integration

Implement the existing WAF configurations from CloudFormation as CDK:

```typescript
// infrastructure/cdk/lib/waf-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';

export class WafStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Log bucket for WAF
    const wafLogBucket = new s3.Bucket(this, 'WafLogBucket', {
      bucketName: `prop-ie-${props?.env?.name}-waf-logs`,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(90),
          id: 'LogRetention',
        },
      ],
      versioned: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    // Tor exit node IP set
    const torExitNodeIpSet = new wafv2.CfnIPSet(this, 'TorExitNodeIpSet', {
      name: `prop-ie-${props?.env?.name}-tor-exit-nodes`,
      scope: 'CLOUDFRONT',
      ipAddressVersion: 'IPV4',
      addresses: [], // Initially empty, filled by Lambda
    });

    // CloudFront WAF Web ACL
    const cloudFrontWebAcl = new wafv2.CfnWebACL(this, 'CloudFrontWebAcl', {
      name: `prop-ie-${props?.env?.name}-cloudfront-waf`,
      scope: 'CLOUDFRONT',
      defaultAction: { allow: {} },
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: `prop-ie-${props?.env?.name}-cloudfront-waf`,
      },
      rules: [
        // AWS Managed Rules - Common
        {
          name: 'AWS-AWSManagedRulesCommonRuleSet',
          priority: 0,
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesCommonRuleSet',
              excludedRules: [],
            },
          },
          overrideAction: { none: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'CommonRules',
          },
        },
        // SQL Injection Protection
        {
          name: 'AWS-AWSManagedRulesSQLiRuleSet',
          priority: 1,
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesSQLiRuleSet',
              excludedRules: [],
            },
          },
          overrideAction: { none: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'SQLiRules',
          },
        },
        // Cross-Site Scripting Protection
        {
          name: 'AWS-AWSManagedRulesKnownBadInputsRuleSet',
          priority: 2,
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesKnownBadInputsRuleSet',
              excludedRules: [],
            },
          },
          overrideAction: { none: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'KnownBadInputs',
          },
        },
        // Bot Control
        {
          name: 'AWS-AWSManagedRulesBotControlRuleSet',
          priority: 3,
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesBotControlRuleSet',
              excludedRules: [],
            },
          },
          overrideAction: { none: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'BotControlRules',
          },
        },
        // Rate-based rule
        {
          name: 'RateBasedRule',
          priority: 4,
          statement: {
            rateBasedStatement: {
              limit: 2000,
              aggregateKeyType: 'IP',
            },
          },
          action: { block: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'RateBasedRule',
          },
        },
        // Block known malicious IP addresses
        {
          name: 'AWS-AWSManagedRulesAmazonIpReputationList',
          priority: 5,
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesAmazonIpReputationList',
              excludedRules: [],
            },
          },
          overrideAction: { none: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'IPReputationList',
          },
        },
        // Block China IPs if enabled
        {
          name: 'BlockChinaIPs',
          priority: 6,
          statement: {
            geoMatchStatement: {
              countryCodes: ['CN'],
            },
          },
          action: { block: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'BlockChinaIPs',
          },
        },
        // Block Tor exit nodes
        {
          name: 'BlockTorExitNodes',
          priority: 7,
          statement: {
            ipSetReferenceStatement: {
              arn: torExitNodeIpSet.attrArn,
            },
          },
          action: { block: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'BlockTorExitNodes',
          },
        },
        // Prevent path traversal attacks
        {
          name: 'PreventPathTraversal',
          priority: 8,
          statement: {
            byteMatchStatement: {
              searchString: '../',
              fieldToMatch: { uriPath: {} },
              textTransformations: [
                {
                  priority: 0,
                  type: 'URL_DECODE',
                },
              ],
              positionalConstraint: 'CONTAINS',
            },
          },
          action: { block: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: 'PreventPathTraversal',
          },
        },
      ],
    });

    // Lambda function to update Tor exit node IP list
    const torExitNodeUpdaterFunction = new lambda.Function(this, 'TorExitNodeUpdaterFunction', {
      functionName: `prop-ie-${props?.env?.name}-tor-exit-updater`,
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/tor-exit-updater'),
      environment: {
        IP_SET_ID: torExitNodeIpSet.attrId,
        IP_SET_NAME: `prop-ie-${props?.env?.name}-tor-exit-nodes`,
        IP_SET_SCOPE: 'CLOUDFRONT',
      },
      timeout: cdk.Duration.minutes(5),
      memorySize: 256,
    });

    // Grant Lambda permission to update IP Set
    torExitNodeUpdaterFunction.addToRolePolicy(new cdk.aws_iam.PolicyStatement({
      actions: [
        'wafv2:GetIPSet',
        'wafv2:UpdateIPSet',
      ],
      resources: [torExitNodeIpSet.attrArn],
    }));

    // CloudWatch Event to trigger Lambda
    const torExitNodeUpdaterSchedule = new events.Rule(this, 'TorExitNodeUpdaterSchedule', {
      description: 'Schedule for updating Tor exit node IP list',
      schedule: events.Schedule.rate(cdk.Duration.hours(12)),
    });

    torExitNodeUpdaterSchedule.addTarget(new targets.LambdaFunction(torExitNodeUpdaterFunction));
  }
}
```

### Security Monitoring Integration

```typescript
// src/lib/security/monitoring.ts
import { CloudWatch } from '@aws-sdk/client-cloudwatch';
import { SNS } from '@aws-sdk/client-sns';

export class SecurityMonitoring {
  private cloudwatch: CloudWatch;
  private sns: SNS;
  private namespace: string;
  private alertTopicArn: string;
  
  constructor() {
    this.cloudwatch = new CloudWatch({ region: process.env.AWS_REGION });
    this.sns = new SNS({ region: process.env.AWS_REGION });
    this.namespace = `PropIE/${process.env.NEXT_PUBLIC_APP_ENV}/Security`;
    this.alertTopicArn = process.env.SECURITY_ALERT_TOPIC_ARN || '';
  }
  
  async trackFailedLogin(username: string, ipAddress: string, userAgent: string) {
    const dimensions = {
      Username: username,
      IPAddress: ipAddress.substring(0, 10) + '***', // Partial IP for privacy
    };
    
    await this.cloudwatch.putMetricData({
      Namespace: this.namespace,
      MetricData: [
        {
          MetricName: 'FailedLoginAttempts',
          Value: 1,
          Unit: 'Count',
          Dimensions: Object.entries(dimensions).map(([Name, Value]) => ({ Name, Value })),
          Timestamp: new Date(),
        },
      ],
    });
    
    // Log the event with more details
    console.log('Failed login attempt:', {
      username,
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  }
  
  async trackSuspiciousActivity(type: string, details: Record<string, any>) {
    // Send immediate alert for suspicious activity
    if (this.alertTopicArn) {
      await this.sns.publish({
        TopicArn: this.alertTopicArn,
        Subject: `[${process.env.NEXT_PUBLIC_APP_ENV}] Suspicious Activity Detected: ${type}`,
        Message: JSON.stringify({
          type,
          details,
          environment: process.env.NEXT_PUBLIC_APP_ENV,
          timestamp: new Date().toISOString(),
        }, null, 2),
      });
    }
    
    // Record metric
    await this.cloudwatch.putMetricData({
      Namespace: this.namespace,
      MetricData: [
        {
          MetricName: 'SuspiciousActivity',
          Value: 1,
          Unit: 'Count',
          Dimensions: [{ Name: 'Type', Value: type }],
          Timestamp: new Date(),
        },
      ],
    });
  }
  
  async trackApiSecurityEvent(api: string, event: string, count = 1) {
    await this.cloudwatch.putMetricData({
      Namespace: this.namespace,
      MetricData: [
        {
          MetricName: 'ApiSecurityEvents',
          Value: count,
          Unit: 'Count',
          Dimensions: [
            { Name: 'Api', Value: api },
            { Name: 'Event', Value: event },
          ],
          Timestamp: new Date(),
        },
      ],
    });
  }
}

export const securityMonitoring = new SecurityMonitoring();
```

## 10. Blue-Green Deployment Configuration

```typescript
// infrastructure/cdk/lib/blue-green-deployment-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as codedeploy from 'aws-cdk-lib/aws-codedeploy';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class BlueGreenDeploymentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Amplify applications for Blue/Green
    const blueApp = new amplify.App(this, 'PropIEBlueApp', {
      appName: 'prop-ie-blue',
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: 'your-org',
        repository: 'prop-ie-aws-app',
        oauthToken: cdk.SecretValue.secretsManager('github-token'),
      }),
      environmentVariables: {
        NEXT_PUBLIC_DEPLOYMENT_COLOR: 'blue',
      },
      buildSpec: cdk.aws_codebuild.BuildSpec.fromObjectToYaml({
        version: '1.0',
        frontend: {
          phases: {
            preBuild: {
              commands: [
                'npm ci',
              ],
            },
            build: {
              commands: [
                'npm run build',
              ],
            },
          },
          artifacts: {
            baseDirectory: '.next',
            files: ['**/*'],
          },
          cache: {
            paths: ['node_modules/**/*', '.next/cache/**/*'],
          },
        },
      }),
    });

    const greenApp = new amplify.App(this, 'PropIEGreenApp', {
      appName: 'prop-ie-green',
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: 'your-org',
        repository: 'prop-ie-aws-app',
        oauthToken: cdk.SecretValue.secretsManager('github-token'),
      }),
      environmentVariables: {
        NEXT_PUBLIC_DEPLOYMENT_COLOR: 'green',
      },
      buildSpec: cdk.aws_codebuild.BuildSpec.fromObjectToYaml({
        version: '1.0',
        frontend: {
          phases: {
            preBuild: {
              commands: [
                'npm ci',
              ],
            },
            build: {
              commands: [
                'npm run build',
              ],
            },
          },
          artifacts: {
            baseDirectory: '.next',
            files: ['**/*'],
          },
          cache: {
            paths: ['node_modules/**/*', '.next/cache/**/*'],
          },
        },
      }),
    });

    // Create branches
    const blueProdBranch = blueApp.addBranch('production');
    const greenProdBranch = greenApp.addBranch('production');

    // Domain and DNS
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: 'Z1234567890ABC',
      zoneName: 'prop-ie-app.com',
    });

    // Blue/Green switch Lambda
    const blueGreenSwitchFunction = new lambda.Function(this, 'BlueGreenSwitchFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/blue-green-switch'),
      environment: {
        BLUE_APP_ID: blueApp.appId,
        GREEN_APP_ID: greenApp.appId,
        HOSTED_ZONE_ID: hostedZone.hostedZoneId,
        DOMAIN_NAME: 'prop-ie-app.com',
      },
    });

    // Grant permissions
    blueGreenSwitchFunction.addToRolePolicy(new cdk.aws_iam.PolicyStatement({
      actions: ['route53:ChangeResourceRecordSets', 'route53:ListResourceRecordSets'],
      resources: [hostedZone.hostedZoneArn],
    }));

    // CodeDeploy for blue/green deployments
    const application = new codedeploy.LambdaApplication(this, 'BlueGreenDeploymentApp');

    const deploymentGroup = new codedeploy.LambdaDeploymentGroup(this, 'BlueGreenDeploymentGroup', {
      application,
      deploymentConfig: codedeploy.LambdaDeploymentConfig.CANARY_10PERCENT_5MINUTES,
      alias: new lambda.Alias(this, 'BlueGreenSwitchAlias', {
        aliasName: 'current',
        version: blueGreenSwitchFunction.currentVersion,
      }),
      deploymentGroupName: 'prop-ie-blue-green',
      alarms: [],
    });
  }
}
```

## 11. Disaster Recovery Plan

```markdown
# PropIE AWS Platform - Disaster Recovery Plan

This document outlines the disaster recovery procedures for the PropIE AWS platform.

## Recovery Objectives

- **Recovery Time Objective (RTO)**: 1 hour for critical systems
- **Recovery Point Objective (RPO)**: 5 minutes for database, 24 hours for static content

## Disaster Scenarios

### 1. Infrastructure Failure

#### AWS Region Outage
**Recovery Procedure**:
1. Trigger DR pipeline to deploy to backup region:
   ```bash
   ./scripts/dr-activate.sh us-west-2
   ```
2. Update DNS to point to backup region
3. Notify all stakeholders

#### Amplify Service Disruption
**Recovery Procedure**:
1. Deploy static assets to S3 + CloudFront:
   ```bash
   ./scripts/static-fallback-deploy.sh
   ```
2. Update DNS to point to CloudFront
3. Implement temporary service notices for any reduced functionality

### 2. Data Loss or Corruption

#### DynamoDB Data Loss
**Recovery Procedure**:
1. Identify the point-in-time to restore to
2. Execute DynamoDB point-in-time recovery:
   ```bash
   aws dynamodb restore-table-from-backup \
     --target-table-name PropIE-Properties \
     --backup-arn arn:aws:dynamodb:us-east-1:123456789012:table/PropIE-Properties/backup/01234567890123-abc123
   ```
3. Verify data integrity
4. Update application to use restored table if necessary

#### S3 Data Loss
**Recovery Procedure**:
1. Restore from versioned backups:
   ```bash
   aws s3 sync s3://prop-ie-backup-bucket/assets/ s3://prop-ie-assets/ --source-region us-west-2 --region us-east-1
   ```
2. Verify data integrity

### 3. Security Breach

**Recovery Procedure**:
1. Execute security incident response playbook:
   ```bash
   ./scripts/security-incident-response.sh
   ```
2. Rotate all credentials and keys
3. Restore from last known good state
4. Conduct security audit
5. Report to appropriate authorities if required

## Backup Strategy

### Database Backups
- DynamoDB Point-in-Time Recovery enabled
- Daily export to S3 for redundancy
- Cross-region replication for critical data

### Application Backups
- AWS Amplify generates build artifacts for each deployment
- Artifacts stored in S3 with versioning
- Critical configurations backed up to Parameter Store

### Infrastructure Backups
- Infrastructure as Code stored in version control
- CDK/CloudFormation templates backed up to S3
- State files versioned and backed up

## Testing and Validation

The DR plan should be tested quarterly:

1. **Table-top Exercise**: Team walkthrough of recovery procedures
2. **Technical Test**: Deployment to backup region without traffic routing
3. **Full DR Test**: Complete recovery simulation with traffic routing

## Key Contacts

- **Primary Contact**: DevOps Lead (devops-lead@prop-ie.com, +1-555-123-4567)
- **Secondary Contact**: CTO (cto@prop-ie.com, +1-555-234-5678)
- **AWS Support**: Enterprise Support (Case #12345, +1-888-AWS-HELP)

## Recovery Verification Checklist

After executing recovery procedures, verify:

- [ ] All services are responsive
- [ ] Data integrity confirmed
- [ ] Security controls active
- [ ] Monitoring and alerting functional
- [ ] User authentication working
- [ ] Business critical functions operational
- [ ] Notification sent to stakeholders
```