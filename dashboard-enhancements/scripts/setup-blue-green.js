#!/usr/bin/env node

/**
 * This script sets up AWS resources for blue/green deployment
 * It creates the necessary infrastructure to support blue/green deployment using
 * AWS CloudFormation for AppSync and Amplify
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  appName: 'prop-ie-aws-app',
  region: process.env.AWS_REGION || 'us-east-1',
  prodBranch: 'production',
  stagingBranch: 'staging',
  environment: process.env.ENVIRONMENT || 'production',
  amplifyAppId: process.env.AMPLIFY_APP_ID,
  domain: 'prop-ie-app.com',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@propie.example.com'
};

// Helper for running AWS CLI commands
const aws = (service, command, options = {}) => {
  const optionStr = Object.entries(options)
    .map(([key, value]) => `--${key} ${JSON.stringify(value)}`)
    .join(' ');
  
  const cmd = `aws ${service} ${command} ${optionStr} --region ${config.region}`;
  console.log(`Running: ${cmd}`);
  
  try {
    const result = execSync(cmd, { encoding: 'utf8' });
    return JSON.parse(result);
  } catch (error) {
    console.error(`Error executing AWS command: ${error.message}`);
    console.error(`Command output: ${error.stdout || 'No output'}`);
    return null;
  }
};

// Create Blue/Green deployment setup
async function setupBlueGreenDeployment() {
  console.log('Setting up Blue/Green deployment capabilities...');
  
  // 1. Create the production traffic configuration
  console.log('Creating production traffic configurations...');
  
  // Create Blue environment (main production)
  const blueEnv = aws('amplify', 'get-branch', {
    'app-id': config.amplifyAppId,
    'branch-name': config.prodBranch
  });
  
  if (!blueEnv) {
    console.error('Failed to fetch production branch information');
    process.exit(1);
  }
  
  // Create Green environment for new deployments
  console.log('Creating Green environment for new deployments...');
  
  const greenBranchName = `${config.prodBranch}-green`;
  try {
    // Check if green branch exists
    aws('amplify', 'get-branch', {
      'app-id': config.amplifyAppId,
      'branch-name': greenBranchName
    });
    console.log('Green branch already exists');
  } catch (error) {
    // Create green branch if it doesn't exist
    aws('amplify', 'create-branch', {
      'app-id': config.amplifyAppId,
      'branch-name': greenBranchName,
      'stage': 'PRODUCTION',
      'enable-auto-build': false,
      'environment-variables': {
        'NEXT_PUBLIC_APP_ENV': 'production',
        'NEXT_PUBLIC_API_ENDPOINT': 'https://api.prop-ie-app.com',
        'NEXT_PUBLIC_APP_URL': 'https://green.prop-ie-app.com',
        'NODE_ENV': 'production'
      }
    });
    console.log('Created Green branch');
  }
  
  // 2. Set up DNS for blue/green environments
  console.log('Setting up DNS for Blue/Green environments...');
  
  // Get domain association
  const domainAssociations = aws('amplify', 'list-domain-associations', {
    'app-id': config.amplifyAppId
  });
  
  if (!domainAssociations || !domainAssociations.domainAssociations || domainAssociations.domainAssociations.length === 0) {
    console.log('Creating domain association...');
    
    aws('amplify', 'create-domain-association', {
      'app-id': config.amplifyAppId,
      'domain-name': config.domain,
      'sub-domain-settings': [
        {
          'prefix': '',
          'branch-name': config.prodBranch
        },
        {
          'prefix': 'green',
          'branch-name': greenBranchName
        },
        {
          'prefix': 'staging',
          'branch-name': config.stagingBranch
        }
      ]
    });
  } else {
    console.log('Domain association exists, updating...');
    
    // Check if green subdomain is configured
    const existingDomain = domainAssociations.domainAssociations[0];
    const greenSubdomain = existingDomain.subDomains.find(sd => sd.prefix === 'green');
    
    if (!greenSubdomain) {
      console.log('Adding green subdomain...');
      
      // Create a new subdomains array with the green subdomain
      const updatedSubdomains = [
        ...existingDomain.subDomains,
        {
          'prefix': 'green',
          'branchName': greenBranchName
        }
      ];
      
      aws('amplify', 'update-domain-association', {
        'app-id': config.amplifyAppId,
        'domain-name': config.domain,
        'sub-domain-settings': updatedSubdomains.map(sd => ({
          'prefix': sd.prefix,
          'branch-name': sd.branchName
        }))
      });
    } else {
      console.log('Green subdomain already configured');
    }
  }
  
  // 3. Create CloudWatch alarm for automatic rollback
  console.log('Creating CloudWatch alarm for automatic rollback monitoring...');
  
  aws('cloudwatch', 'put-metric-alarm', {
    'alarm-name': `${config.appName}-production-error-rate-alarm`,
    'alarm-description': 'Alarm to monitor error rate in production for automatic rollback',
    'metric-name': '5XXErrors',
    'namespace': 'AWS/Amplify',
    'statistic': 'Sum',
    'dimensions': [
      {
        'Name': 'App',
        'Value': config.amplifyAppId
      },
      {
        'Name': 'Branch',
        'Value': config.prodBranch
      }
    ],
    'period': 60,
    'evaluation-periods': 5,
    'threshold': 10,
    'comparison-operator': 'GreaterThanThreshold',
    'alarm-actions': [
      // SNS topic ARN for alerting - will need to be created separately
    ]
  });
  
  // 4. Create SNS topic for deployment notifications
  console.log('Creating SNS topic for deployment notifications...');
  
  const snsTopic = aws('sns', 'create-topic', {
    'name': `${config.appName}-deployment-notifications`
  });
  
  if (snsTopic && snsTopic.TopicArn) {
    // Subscribe admin email to notifications
    aws('sns', 'subscribe', {
      'topic-arn': snsTopic.TopicArn,
      'protocol': 'email',
      'endpoint': config.adminEmail
    });
    
    console.log(`Created SNS topic: ${snsTopic.TopicArn}`);
  }
  
  console.log('Blue/Green deployment setup complete!');
  console.log('Make sure to configure your CI/CD pipeline to use the blue-green deployment process.');
}

// Run the setup
setupBlueGreenDeployment().catch(error => {
  console.error('Error setting up Blue/Green deployment:', error);
  process.exit(1);
});