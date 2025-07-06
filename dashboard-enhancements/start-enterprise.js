#!/usr/bin/env node

/**
 * Enterprise-grade Next.js Development Server
 * Features:
 * - Comprehensive error handling
 * - Real-time monitoring
 * - Auto-recovery mechanisms
 * - Performance optimizations
 */

const { spawn } = require('child_process');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  retryAttempts: 3,
  retryDelay: 5000,
  memoryLimit: '4096'
};

// Logging utilities
const log = {
  info: (msg) => console.log(chalk.blue('[INFO]'), msg),
  success: (msg) => console.log(chalk.green('[SUCCESS]'), msg),
  error: (msg) => console.error(chalk.red('[ERROR]'), msg),
  warn: (msg) => console.warn(chalk.yellow('[WARN]'), msg)
};

// Environment validation
function validateEnvironment() {
  log.info('Validating environment...');
  
  // Check Node version
  const nodeVersion = process.version;
  const requiredVersion = 'v18.0.0';
  
  if (nodeVersion < requiredVersion) {
    log.error(`Node.js ${requiredVersion} or higher required. Current: ${nodeVersion}`);
    process.exit(1);
  }
  
  // Check for required files
  const requiredFiles = ['package.json', 'next.config.js', '.env.local'];
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    log.warn(`Missing files: ${missingFiles.join(', ')}`);
  }
  
  log.success('Environment validation completed');
}

// Clean previous builds
function cleanPreviousBuilds() {
  log.info('Cleaning previous builds...');
  
  try {
    const nextDir = path.join(process.cwd(), '.next');
    if (fs.existsSync(nextDir)) {
      fs.rmSync(nextDir, { recursive: true, force: true });
    }
    log.success('Previous builds cleaned');
  } catch (error) {
    log.warn('Could not clean previous builds: ' + error.message);
  }
}

// Start development server with monitoring
function startServer(attempt = 1) {
  log.info(`Starting development server (attempt ${attempt}/${config.retryAttempts})...`);
  
  const serverProcess = spawn('npx', ['next', 'dev', '-p', config.port], {
    stdio: 'pipe',
    env: {
      ...process.env,
      NODE_OPTIONS: `--max-old-space-size=${config.memoryLimit}`
    }
  });
  
  let isReady = false;
  
  // Handle stdout
  serverProcess.stdout.on('data', (data) => {
    const output = data.toString();
    
    if (output.includes('Ready in')) {
      isReady = true;
      log.success(`Server ready at http://${config.host}:${config.port}`);
      log.info('Press CTRL+C to stop');
    }
    
    if (output.includes('Error')) {
      log.error(output);
    } else if (output.includes('Warning')) {
      log.warn(output);
    } else {
      console.log(output.trim());
    }
  });
  
  // Handle stderr
  serverProcess.stderr.on('data', (data) => {
    const error = data.toString();
    
    if (error.includes('EADDRINUSE')) {
      log.error(`Port ${config.port} is already in use`);
      process.exit(1);
    } else {
      log.error(error);
    }
  });
  
  // Handle process exit
  serverProcess.on('exit', (code) => {
    if (code !== 0 && !isReady && attempt < config.retryAttempts) {
      log.warn(`Server exited with code ${code}. Retrying in ${config.retryDelay}ms...`);
      setTimeout(() => startServer(attempt + 1), config.retryDelay);
    } else if (code !== 0) {
      log.error(`Server failed to start after ${config.retryAttempts} attempts`);
      process.exit(1);
    }
  });
  
  // Handle process errors
  serverProcess.on('error', (error) => {
    log.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  });
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    log.info('Shutting down gracefully...');
    serverProcess.kill('SIGTERM');
    process.exit(0);
  });
}

// Main execution
async function main() {
  console.log(chalk.bold.cyan('\n🚀 Enterprise Next.js Development Server\n'));
  
  try {
    validateEnvironment();
    cleanPreviousBuilds();
    startServer();
  } catch (error) {
    log.error(`Startup failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { main };
