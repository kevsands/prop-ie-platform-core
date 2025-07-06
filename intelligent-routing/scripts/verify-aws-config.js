#!/usr/bin/env node

/**
 * AWS Environment Configuration Verification Script
 * 
 * This script verifies that AWS credentials and Amplify configuration
 * are properly set up for both development and CI/CD environments.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for better readability
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}AWS Environment Configuration Verification${colors.reset}`);
console.log('-----------------------------------------');

const issues = [];
const warnings = [];
let isAmplifyConfigured = false;

// Check for AWS credentials
function checkAwsCredentials() {
  console.log(`\n${colors.blue}Checking AWS credentials...${colors.reset}`);
  
  try {
    // This will throw if credentials aren't configured
    const awsRegion = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
    console.log(`AWS Region: ${awsRegion || 'Not set'}`);
    
    // Check if credentials are set
    const hasEnvCredentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;
    if (hasEnvCredentials) {
      console.log(`${colors.green}✓ AWS credentials found in environment variables${colors.reset}`);
    } else {
      // Check if credentials exist in ~/.aws/credentials
      const homeDir = process.env.HOME || process.env.USERPROFILE;
      const awsCredentialsPath = path.join(homeDir, '.aws', 'credentials');
      
      if (fs.existsSync(awsCredentialsPath)) {
        console.log(`${colors.green}✓ AWS credentials found in credentials file${colors.reset}`);
      } else {
        console.log(`${colors.red}✗ AWS credentials not found${colors.reset}`);
        issues.push('AWS credentials not configured');
      }
    }
    
    // Check if we can actually connect to AWS
    try {
      execSync('aws sts get-caller-identity', { stdio: 'ignore' });
      console.log(`${colors.green}✓ Successfully authenticated with AWS${colors.reset}`);
    } catch (error) {
      console.log(`${colors.red}✗ Failed to authenticate with AWS${colors.reset}`);
      issues.push('AWS authentication failed');
    }
  } catch (error) {
    console.log(`${colors.red}✗ Error checking AWS credentials: ${error.message}${colors.reset}`);
    issues.push('AWS credentials check failed');
  }
}

// Check Amplify configuration
function checkAmplifyConfig() {
  console.log(`\n${colors.blue}Checking Amplify configuration...${colors.reset}`);
  
  const awsExportsPath = path.join(process.cwd(), 'src', 'aws-exports.js');
  const amplifyDirPath = path.join(process.cwd(), 'amplify');
  
  if (fs.existsSync(awsExportsPath)) {
    console.log(`${colors.green}✓ aws-exports.js found${colors.reset}`);
    isAmplifyConfigured = true;
  } else {
    console.log(`${colors.red}✗ aws-exports.js not found${colors.reset}`);
    issues.push('aws-exports.js file is missing');
  }
  
  if (fs.existsSync(amplifyDirPath)) {
    console.log(`${colors.green}✓ amplify directory found${colors.reset}`);
  } else {
    if (isAmplifyConfigured) {
      console.log(`${colors.yellow}⚠ amplify directory not found, but aws-exports.js exists${colors.reset}`);
      warnings.push('amplify directory missing but aws-exports.js exists - this may be intentional in CI/CD');
    } else {
      console.log(`${colors.red}✗ amplify directory not found${colors.reset}`);
      issues.push('amplify directory is missing');
    }
  }
  
  // Check amplify configuration files
  const amplifyConfigPath = path.join(process.cwd(), 'amplify.yml');
  if (fs.existsSync(amplifyConfigPath)) {
    console.log(`${colors.green}✓ amplify.yml found${colors.reset}`);
    
    try {
      // Validate amplify.yml format
      const amplifyCfg = fs.readFileSync(amplifyConfigPath, 'utf8');
      if (!amplifyCfg.includes('version:') || !amplifyCfg.includes('backend:') || !amplifyCfg.includes('frontend:')) {
        console.log(`${colors.yellow}⚠ amplify.yml may have formatting issues${colors.reset}`);
        warnings.push('amplify.yml may be incorrectly formatted');
      }
    } catch (error) {
      console.log(`${colors.red}✗ Error reading amplify.yml: ${error.message}${colors.reset}`);
      issues.push('Error reading amplify.yml');
    }
  } else {
    console.log(`${colors.yellow}⚠ amplify.yml not found${colors.reset}`);
    warnings.push('amplify.yml is missing - required for Amplify deployments');
  }
}

// Check for environment variables
function checkEnvironmentVariables() {
  console.log(`\n${colors.blue}Checking environment variables...${colors.reset}`);
  
  const requiredEnvVars = [
    'NEXT_PUBLIC_APP_ENV',
    'NEXT_PUBLIC_API_ENDPOINT',
    'NEXT_PUBLIC_APP_URL'
  ];
  
  const missingVars = [];
  
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`${colors.green}✓ ${envVar} is set${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ ${envVar} is not set${colors.reset}`);
      missingVars.push(envVar);
    }
  }
  
  if (missingVars.length > 0) {
    issues.push(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

// Run checks
checkAwsCredentials();
checkAmplifyConfig();
checkEnvironmentVariables();

// Output summary
console.log('\n-----------------------------------------');
console.log(`${colors.cyan}Verification Summary${colors.reset}`);

if (issues.length === 0 && warnings.length === 0) {
  console.log(`${colors.green}All checks passed! AWS environment is correctly configured.${colors.reset}`);
  process.exit(0);
} else {
  if (issues.length > 0) {
    console.log(`\n${colors.red}Issues (${issues.length}):${colors.reset}`);
    issues.forEach((issue, index) => {
      console.log(`${colors.red}${index + 1}. ${issue}${colors.reset}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log(`\n${colors.yellow}Warnings (${warnings.length}):${colors.reset}`);
    warnings.forEach((warning, index) => {
      console.log(`${colors.yellow}${index + 1}. ${warning}${colors.reset}`);
    });
  }
  
  // Exit with error code if there are issues
  if (issues.length > 0) {
    process.exit(1);
  } else {
    process.exit(0); // Warnings only, still pass
  }
}