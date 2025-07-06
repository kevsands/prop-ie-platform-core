#!/usr/bin/env node

/**
 * Amplify Environment Setup Script
 * 
 * This script helps set up and configure AWS Amplify environments
 * for development, staging, and production environments.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI color codes for formatting
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Initialize readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Environment configurations
const environments = {
  dev: {
    name: 'Development',
    description: 'For local development and feature branches',
    variables: {
      NEXT_PUBLIC_APP_ENV: 'development',
      NEXT_PUBLIC_API_ENDPOINT: 'http://localhost:4000',
      AMPLIFY_AUTH_REGION: 'us-east-1'
    }
  },
  staging: {
    name: 'Staging',
    description: 'For testing before production',
    variables: {
      NEXT_PUBLIC_APP_ENV: 'staging',
      NEXT_PUBLIC_API_ENDPOINT: 'https://api-staging.example.com',
      AMPLIFY_AUTH_REGION: 'us-east-1'
    }
  },
  production: {
    name: 'Production',
    description: 'Live environment',
    variables: {
      NEXT_PUBLIC_APP_ENV: 'production',
      NEXT_PUBLIC_API_ENDPOINT: 'https://api.example.com',
      AMPLIFY_AUTH_REGION: 'us-east-1'
    }
  }
};

/**
 * Helper function to execute commands safely
 */
function runCommand(command) {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    console.error(`${colors.red}Error executing command: ${command}${colors.reset}`);
    console.error(error.stderr || error.message);
    return null;
  }
}

/**
 * Check if Amplify CLI is installed
 */
function checkAmplifyInstallation() {
  console.log(`${colors.blue}Checking Amplify CLI installation...${colors.reset}`);
  
  try {
    const version = execSync('amplify --version', { encoding: 'utf8' });
    console.log(`${colors.green}Found Amplify CLI version: ${version.trim()}${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}Amplify CLI not found. Please install it with:${colors.reset}`);
    console.log(`npm install -g @aws-amplify/cli`);
    return false;
  }
}

/**
 * Check if AWS CLI is installed and configured
 */
function checkAwsCliConfiguration() {
  console.log(`${colors.blue}Checking AWS CLI configuration...${colors.reset}`);
  
  try {
    const identity = execSync('aws sts get-caller-identity', { encoding: 'utf8' });
    const user = JSON.parse(identity);
    console.log(`${colors.green}AWS CLI is configured. User: ${user.Arn}${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}AWS CLI not properly configured. Please run:${colors.reset}`);
    console.log(`aws configure`);
    return false;
  }
}

/**
 * Initialize Amplify in the project if not already initialized
 */
function initializeAmplify() {
  console.log(`${colors.blue}Checking Amplify project status...${colors.reset}`);
  
  if (fs.existsSync('./amplify')) {
    console.log(`${colors.green}Amplify project already initialized.${colors.reset}`);
    return true;
  }
  
  console.log(`${colors.yellow}Initializing Amplify project...${colors.reset}`);
  console.log(`${colors.yellow}Note: You'll be prompted to answer a few questions.${colors.reset}`);
  
  try {
    execSync('amplify init', { stdio: 'inherit' });
    console.log(`${colors.green}Amplify project initialized successfully.${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}Failed to initialize Amplify project:${colors.reset}`, error.message);
    return false;
  }
}

/**
 * Create or configure an environment
 */
async function configureEnvironment(envName) {
  return new Promise((resolve) => {
    if (!environments[envName]) {
      console.log(`${colors.red}Unknown environment: ${envName}${colors.reset}`);
      resolve(false);
      return;
    }
    
    const env = environments[envName];
    console.log(`\n${colors.cyan}Configuring ${env.name} Environment${colors.reset}`);
    console.log(`${colors.blue}Description: ${env.description}${colors.reset}`);
    
    rl.question(`${colors.yellow}Do you want to set up the ${envName} environment? (y/n) ${colors.reset}`, async (answer) => {
      if (answer.toLowerCase() !== 'y') {
        console.log(`${colors.blue}Skipping ${envName} environment setup.${colors.reset}`);
        resolve(false);
        return;
      }
      
      console.log(`${colors.blue}Creating ${envName} environment...${colors.reset}`);
      
      try {
        // Create Amplify environment if it doesn't exist
        const envCheckOutput = runCommand('amplify env list');
        if (!envCheckOutput || !envCheckOutput.includes(envName)) {
          console.log(`${colors.blue}Creating new Amplify environment: ${envName}${colors.reset}`);
          execSync(`amplify env add --name ${envName}`, { stdio: 'inherit' });
        } else {
          console.log(`${colors.green}Environment ${envName} already exists.${colors.reset}`);
          execSync(`amplify env checkout ${envName}`, { stdio: 'inherit' });
        }
        
        // Set environment variables
        console.log(`${colors.blue}Setting environment variables...${colors.reset}`);
        for (const [key, value] of Object.entries(env.variables)) {
          execSync(`amplify update-app --variable ${key}=${value}`, { stdio: 'inherit' });
          console.log(`${colors.green}Set ${key}=${value}${colors.reset}`);
        }
        
        console.log(`${colors.green}Successfully configured ${envName} environment.${colors.reset}`);
        resolve(true);
      } catch (error) {
        console.error(`${colors.red}Error configuring ${envName} environment:${colors.reset}`, error.message);
        resolve(false);
      }
    });
  });
}

/**
 * Save environment configuration to a file
 */
function saveEnvConfig(envName) {
  if (!environments[envName]) return;
  
  const env = environments[envName];
  const envFilePath = `.env.${envName}`;
  
  console.log(`${colors.blue}Saving ${envName} configuration to ${envFilePath}...${colors.reset}`);
  
  let envContent = `# ${env.name} Environment Configuration\n# ${env.description}\n\n`;
  
  for (const [key, value] of Object.entries(env.variables)) {
    envContent += `${key}=${value}\n`;
  }
  
  try {
    fs.writeFileSync(envFilePath, envContent);
    console.log(`${colors.green}Successfully saved configuration to ${envFilePath}${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error saving configuration:${colors.reset}`, error.message);
  }
}

/**
 * Create a template for Amplify configuration
 */
function createAmplifyYmlTemplate() {
  const amplifyYmlPath = 'amplify.yml';
  
  if (fs.existsSync(amplifyYmlPath)) {
    console.log(`${colors.yellow}amplify.yml already exists. Skipping template creation.${colors.reset}`);
    return;
  }
  
  console.log(`${colors.blue}Creating Amplify configuration template...${colors.reset}`);
  
  const amplifyYml = `version: 1
backend:
  phases:
    build:
      commands:
        - '# Execute Amplify CLI with the helper script'
        - amplifyPush --simple
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
        - npm run verify-aws-config
    build:
      commands:
        - echo "Building application..."
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
test:
  phases:
    preTest:
      commands:
        - npm ci
        - npm run test:ci
  artifacts:
    baseDirectory: coverage
    files:
      - '**/*'
`;
  
  try {
    fs.writeFileSync(amplifyYmlPath, amplifyYml);
    console.log(`${colors.green}Successfully created ${amplifyYmlPath}${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}Error creating Amplify configuration template:${colors.reset}`, error.message);
  }
}

/**
 * Main function
 */
async function main() {
  console.log(`${colors.cyan}AWS Amplify Environment Setup${colors.reset}`);
  console.log('=============================\n');
  
  // Check prerequisites
  const isAmplifyInstalled = checkAmplifyInstallation();
  const isAwsCliConfigured = checkAwsCliConfiguration();
  
  if (!isAmplifyInstalled || !isAwsCliConfigured) {
    console.log(`${colors.red}Please install the required tools and try again.${colors.reset}`);
    rl.close();
    return;
  }
  
  // Initialize Amplify if needed
  const isAmplifyInitialized = initializeAmplify();
  if (!isAmplifyInitialized) {
    rl.close();
    return;
  }
  
  // Configure environments
  await configureEnvironment('dev');
  await configureEnvironment('staging');
  await configureEnvironment('production');
  
  // Save environment configurations
  saveEnvConfig('dev');
  saveEnvConfig('staging');
  saveEnvConfig('production');
  
  // Create Amplify configuration template
  createAmplifyYmlTemplate();
  
  console.log(`\n${colors.cyan}Environment Setup Complete${colors.reset}`);
  console.log(`${colors.green}You can now use 'amplify env checkout <env-name>' to switch between environments.${colors.reset}`);
  rl.close();
}

// Run the script
main().catch(error => {
  console.error(`${colors.red}Error:${colors.reset}`, error);
  rl.close();
});