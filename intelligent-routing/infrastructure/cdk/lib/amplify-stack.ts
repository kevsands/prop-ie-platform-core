import * as cdk from 'aws-cdk-lib';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';

export interface AmplifyStackProps extends cdk.StackProps {
  environment: string;
  domainName: string;
  repositoryUrl: string;
  githubToken: cdk.SecretValue;
  appsyncApiId?: string;
  cognitoUserPoolId?: string;
  s3BucketName?: string;
  tags?: { [key: string]: string };
}

export class AmplifyStack extends cdk.Stack {
  public readonly amplifyApp: amplify.App;
  public readonly amplifyBranch: amplify.Branch;
  
  // Get region and account with different method names to avoid collisions
  public getRegionValue(): string {
    return cdk.Stack.of(this).region;
  }
  
  public getAccountValue(): string {
    return cdk.Stack.of(this).account;
  }

  constructor(scope: Construct, id: string, props: AmplifyStackProps) {
    super(scope, id, props);

    // IAM role for Amplify
    const amplifyRole = new iam.Role(this, 'AmplifyRole', {
      roleName: `prop-ie-amplify-role-${props.environment}`,
      assumedBy: new iam.ServicePrincipal('amplify.amazonaws.com'),
    });

    // Amplify permissions policy
    const amplifyPolicy = new iam.Policy(this, 'AmplifyPolicy', {
      policyName: `prop-ie-amplify-policy-${props.environment}`,
      statements: [
        new iam.PolicyStatement({
          actions: [
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents',
          ],
          effect: iam.Effect.ALLOW,
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          actions: [
            's3:GetObject',
            's3:PutObject',
            's3:DeleteObject',
            's3:ListBucket',
          ],
          effect: iam.Effect.ALLOW,
          resources: [
            `arn:aws:s3:::${props.s3BucketName || 'prop-ie-app-assets'}`,
            `arn:aws:s3:::${props.s3BucketName || 'prop-ie-app-assets'}/*`,
          ],
        }),
        new iam.PolicyStatement({
          actions: [
            'cognito-idp:DescribeUserPool',
            'cognito-idp:DescribeUserPoolClient',
          ],
          effect: iam.Effect.ALLOW,
          resources: ['*'],
        }),
        new iam.PolicyStatement({
          actions: [
            'appsync:GraphQL',
          ],
          effect: iam.Effect.ALLOW,
          resources: [`arn:aws:appsync:${this.getRegionValue()}:${this.getAccountValue()}:apis/${props.appsyncApiId || '*'}/*`],
        }),
        new iam.PolicyStatement({
          actions: [
            'cloudwatch:PutMetricData',
            'cloudwatch:GetMetricData',
            'cloudwatch:ListMetrics',
          ],
          effect: iam.Effect.ALLOW,
          resources: ['*'],
        }),
      ],
    });

    // Attach policy to role
    amplifyPolicy.attachToRole(amplifyRole);

    // Create the Amplify app
    this.amplifyApp = new amplify.App(this, 'PropIEApp', {
      appName: `prop-ie-aws-app-${props.environment}`,
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: props.repositoryUrl.split('/')[3],
        repository: props.repositoryUrl.split('/')[4],
        oauthToken: props.githubToken,
      }),
      role: amplifyRole,
      environmentVariables: {
        NEXT_PUBLIC_AWS_REGION: cdk.Stack.of(this).region,
        NODE_OPTIONS: '--max-old-space-size=4096',
      },
      buildSpec: codebuild.BuildSpec.fromObjectToYaml({
        version: 1,
        frontend: {
          phases: {
            preBuild: {
              commands: [
                'if [ "${AWS_BRANCH}" = "production" ]; then export NODE_ENV=production; elif [ "${AWS_BRANCH}" = "staging" ]; then export NODE_ENV=staging; else export NODE_ENV=development; fi',
                'echo "Building for environment: ${NODE_ENV}"',
                'npm ci',
                'npm run verify-lockfile',
                'npm run security-check',
              ],
            },
            build: {
              commands: [
                'echo "Running build for branch: ${AWS_BRANCH}"',
                'echo "NEXT_PUBLIC_AWS_REGION=${AWS_REGION}" >> .env',
                'if [ "${AWS_BRANCH}" = "production" ]; then npm run build:prod; elif [ "${AWS_BRANCH}" = "staging" ]; then npm run build:staging; else npm run build; fi',
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
      customRules: [
        {
          source: '/<*>',
          target: '/index.html',
          status: amplify.RedirectStatus.NOT_FOUND_REWRITE,
        },
        {
          source: '^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)',
          target: '/index.html',
          status: amplify.RedirectStatus.REWRITE,
        },
      ],
      customResponseHeaders: [
        {
          pattern: '**/*',
          headers: {
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.amazonaws.com https://*.amplifyapp.com https://*.execute-api.*.amazonaws.com https://www.google-analytics.com; frame-src 'self'; object-src 'none';",
          },
        },
      ],
    });

    // Create the branch based on environment
    const branchName = props.environment === 'prod' ? 'production' : props.environment;
    
    // Define environment variables specific to the branch
    const envVars: { [key: string]: string } = {
      NEXT_PUBLIC_APP_ENV: props.environment,
      NEXT_TELEMETRY_DISABLED: '1',
      AWS_REGION: cdk.Stack.of(this).region,
    };

    // Set API endpoint based on environment
    if (props.environment === 'prod') {
      envVars.NEXT_PUBLIC_API_ENDPOINT = 'https://api.prop-ie-app.com';
      envVars.NEXT_PUBLIC_APP_URL = 'https://prop-ie-app.com';
    } else if (props.environment === 'staging') {
      envVars.NEXT_PUBLIC_API_ENDPOINT = 'https://staging-api.prop-ie-app.com';
      envVars.NEXT_PUBLIC_APP_URL = 'https://staging.prop-ie-app.com';
    } else {
      envVars.NEXT_PUBLIC_API_ENDPOINT = 'https://dev-api.prop-ie-app.com';
      envVars.NEXT_PUBLIC_APP_URL = 'https://dev.prop-ie-app.com';
    }

    // Add Cognito and S3 environment variables if provided
    if (props.cognitoUserPoolId) {
      envVars.NEXT_PUBLIC_USER_POOLS_ID = props.cognitoUserPoolId;
      envVars.COGNITO_USER_POOL_ID = props.cognitoUserPoolId;
    }
    
    if (props.s3BucketName) {
      envVars.NEXT_PUBLIC_S3_BUCKET = props.s3BucketName;
      envVars.S3_BUCKET = props.s3BucketName;
    }
    
    // Add AppSync API ID if provided
    if (props.appsyncApiId) {
      envVars.GRAPHQL_ENDPOINT = `https://${props.appsyncApiId}.appsync-api.${cdk.Stack.of(this).region}.amazonaws.com/graphql`;
      envVars.NEXT_PUBLIC_GRAPHQL_ENDPOINT = `https://${props.appsyncApiId}.appsync-api.${cdk.Stack.of(this).region}.amazonaws.com/graphql`;
    }

    // Create the Amplify branch with environment variables
    this.amplifyBranch = this.amplifyApp.addBranch(branchName, {
      stage: props.environment === 'prod' ? 'PRODUCTION' : 
             props.environment === 'staging' ? 'BETA' : 'DEVELOPMENT',
      environmentVariables: envVars,
      autoBuild: true,
    });

    // Create a webhook for automatic deployments using AWS Amplify API directly via custom resource
    const webhookId = `amplify-webhook-${props.environment}`;
    
    // Use custom resource to create the webhook
    const webhook = new cr.AwsCustomResource(this, webhookId, {
      onCreate: {
        service: 'Amplify',
        action: 'createWebhook',
        parameters: {
          appId: this.amplifyApp.appId,
          branchName: this.amplifyBranch.branchName,
          description: `${props.environment} branch webhook`
        },
        physicalResourceId: cr.PhysicalResourceId.of(`${this.amplifyApp.appId}-${this.amplifyBranch.branchName}-webhook`)
      },
      onDelete: {
        service: 'Amplify',
        action: 'deleteWebhook',
        parameters: {
          webhookId: new cr.PhysicalResourceIdReference()
        }
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE
      })
    });

    // Domain setup (if domain name is provided)
    if (props.domainName) {
      // Add domain to Amplify app
      const domain = this.amplifyApp.addDomain(props.domainName, {
        enableAutoSubdomain: true,
        autoSubdomainCreationPatterns: ['*', 'pr*'],
      });

      // Add specific subdomain mapping based on environment
      if (props.environment === 'prod') {
        domain.mapRoot(this.amplifyBranch);
      } else {
        domain.mapSubDomain(this.amplifyBranch, props.environment);
      }
    }

    // Output important values
    new cdk.CfnOutput(this, 'AmplifyAppId', {
      value: this.amplifyApp.appId,
      description: 'Amplify App ID',
      exportName: `PropIE-${props.environment}-AmplifyAppId`,
    });

    new cdk.CfnOutput(this, 'AmplifyBranchName', {
      value: this.amplifyBranch.branchName,
      description: 'Amplify Branch Name',
      exportName: `PropIE-${props.environment}-AmplifyBranchName`,
    });

    if (props.domainName) {
      new cdk.CfnOutput(this, 'AmplifyDomainName', {
        value: props.environment === 'prod' ? 
               `https://${props.domainName}` : 
               `https://${props.environment}.${props.domainName}`,
        description: 'Amplify App URL',
        exportName: `PropIE-${props.environment}-AmplifyDomainName`,
      });
    }

    new cdk.CfnOutput(this, 'WebhookUrl', {
      value: webhook.getResponseField('webhookUrl') || 'Webhook URL not available',
      description: 'Webhook URL for triggering deployments',
      exportName: `PropIE-${props.environment}-WebhookUrl`,
    });
  }
}