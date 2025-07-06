#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AmplifyStack } from '../lib/amplify-stack';
// Import other stacks as they are implemented
// import { AppsyncStack } from '../lib/appsync-stack';
// import { AuthStack } from '../lib/auth-stack';
// import { MonitoringStack } from '../lib/monitoring-stack';
// import { WafStack } from '../lib/waf-stack';
// import { NetworkStack } from '../lib/network-stack';
const app = new cdk.App();
// Get environment and parameters from context
const environment = app.node.tryGetContext('environment') || 'dev';
const repositoryUrl = app.node.tryGetContext('repositoryUrl') || 'https://github.com/your-org/prop-ie-aws-app';
const domainName = app.node.tryGetContext('domainName') || 'prop-ie-app.com';
const githubTokenSecret = app.node.tryGetContext('githubTokenSecret') || 'github-token';
// Create the complete CDK environment tag set
const environmentTags = {
    Environment: environment,
    Project: 'PropIE',
    ManagedBy: 'CDK',
};
// Retrieve secrets from AWS Secrets Manager at synthesis time
const githubToken = cdk.SecretValue.secretsManager(githubTokenSecret);
// Define a base construct ID prefix for consistency
const idPrefix = `PropIE${environment.charAt(0).toUpperCase() + environment.slice(1)}`;
// Create stacks
// Note: These would usually be created in order of dependency
// Create AWS Amplify App and Hosting Stack
const amplifyStack = new AmplifyStack(app, `${idPrefix}AmplifyStack`, {
    environment,
    domainName,
    repositoryUrl,
    githubToken,
    // These values would come from other stacks in a complete implementation
    // appsyncApiId: appsyncStack.graphqlApi.apiId,
    // cognitoUserPoolId: authStack.userPool.userPoolId,
    // s3BucketName: storageStack.assetBucket.bucketName,
    tags: environmentTags,
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
    },
});
/*
// These stacks would be implemented and used in a complete solution
// Auth Stack (Cognito)
const authStack = new AuthStack(app, `${idPrefix}AuthStack`, {
  environment,
  tags: environmentTags,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
});

// AppSync API Stack
const appsyncStack = new AppsyncStack(app, `${idPrefix}AppsyncStack`, {
  environment,
  userPool: authStack.userPool,
  tags: environmentTags,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
});

// Monitoring Stack
const monitoringStack = new MonitoringStack(app, `${idPrefix}MonitoringStack`, {
  environment,
  amplifyAppId: amplifyStack.amplifyApp.appId,
  appsyncApiId: appsyncStack.graphqlApi.apiId,
  tags: environmentTags,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
});

// WAF Web Application Firewall Stack
const wafStack = new WafStack(app, `${idPrefix}WafStack`, {
  environment,
  tags: environmentTags,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  },
});
*/ 
