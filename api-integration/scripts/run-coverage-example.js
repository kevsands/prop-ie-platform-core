#!/usr/bin/env node

/**
 * Example script to demonstrate the coverage dashboard
 * 
 * This script:
 * 1. Runs a subset of tests with coverage enabled
 * 2. Generates the coverage dashboard
 * 3. Opens the dashboard in the default browser
 */

const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m'
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m'
  }
};

// Function to run command and print output in real-time
function runCommand(command, args, options = {}) {
  console.log(`${colors.bright}${colors.fg.blue}> ${command} ${args.join(' ')}${colors.reset}`);
  
  return new Promise((resolve, reject) => {
    const proc = childProcess.spawn(command, args, {
      stdio: 'inherit',
      ...options
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

// Function to open a file in the default browser
function openBrowser(filePath) {
  const platform = os.platform();
  const fullPath = path.resolve(filePath);
  
  let command;
  let args = [];
  
  switch (platform) {
    case 'darwin': // macOS
      command = 'open';
      args = [fullPath];
      break;
    case 'win32': // Windows
      command = 'explorer';
      args = [fullPath];
      break;
    default: // Linux and others
      command = 'xdg-open';
      args = [fullPath];
      break;
  }
  
  return childProcess.spawn(command, args, {
    stdio: 'ignore',
    detached: true
  }).unref();
}

// Main function
async function main() {
  try {
    console.log(`\n${colors.bright}${colors.fg.green}=== Running Coverage Dashboard Example ===${colors.reset}\n`);
    
    // Step 1: Run tests with coverage
    console.log(`\n${colors.bright}${colors.fg.cyan}Step 1: Running tests with coverage${colors.reset}\n`);
    await runCommand('npm', ['test', '--', '--coverage', '--testPathPattern=utils']);
    
    // Step 2: Generate the coverage dashboard
    console.log(`\n${colors.bright}${colors.fg.cyan}Step 2: Generating the coverage dashboard${colors.reset}\n`);
    await runCommand('node', ['scripts/coverage-dashboard.js', '--save']);
    
    // Step 3: Open the dashboard in the default browser
    console.log(`\n${colors.bright}${colors.fg.cyan}Step 3: Opening the dashboard in browser${colors.reset}\n`);
    const dashboardPath = path.join(process.cwd(), 'coverage-dashboard', 'index.html');
    if (fs.existsSync(dashboardPath)) {
      openBrowser(dashboardPath);
      console.log(`${colors.fg.green}Dashboard opened in your default browser!${colors.reset}`);
    } else {
      console.log(`${colors.fg.red}Dashboard file not found at ${dashboardPath}${colors.reset}`);
    }
    
    console.log(`\n${colors.bright}${colors.fg.green}=== Coverage Dashboard Example Complete ===${colors.reset}\n`);
    console.log(`To run the full test suite with coverage and generate the dashboard:`);
    console.log(`${colors.fg.yellow}npm run test:with-dashboard${colors.reset}`);
    
  } catch (error) {
    console.error(`${colors.fg.red}Error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

main();