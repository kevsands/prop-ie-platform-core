#!/usr/bin/env node
/**
 * Enterprise-grade server startup script with health checks and recovery mechanisms
 */

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const MAX_RETRIES = 5;
const HEALTH_CHECK_INTERVAL = 5000; // 5 seconds
const STARTUP_TIMEOUT = 30000; // 30 seconds

// Logging utilities
const log = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`),
};

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create log streams
const accessLog = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });
const errorLog = fs.createWriteStream(path.join(logsDir, 'error.log'), { flags: 'a' });

// Kill existing processes on port
async function killProcessOnPort(port) {
  return new Promise((resolve) => {
    const killCommand = process.platform === 'win32' 
      ? `netstat -ano | findstr :${port} | findstr LISTENING`
      : `lsof -ti :${port}`;
    
    const kill = spawn('sh', ['-c', `${killCommand} | xargs kill -9`], {
      stdio: 'ignore'
    });
    
    kill.on('exit', () => {
      log.info(`Cleared port ${port}`);
      resolve();
    });
  });
}

// Health check function
function performHealthCheck() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: '/api/health',
      method: 'GET',
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        reject(new Error(`Health check failed with status ${res.statusCode}`));
      }
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Health check timeout'));
    });

    req.end();
  });
}

// Main server startup function
async function startServer(retryCount = 0) {
  if (retryCount > MAX_RETRIES) {
    log.error(`Failed to start server after ${MAX_RETRIES} attempts`);
    process.exit(1);
  }

  try {
    // Kill any existing processes on the port
    await killProcessOnPort(PORT);
    
    log.info(`Starting Next.js server on ${HOST}:${PORT} (attempt ${retryCount + 1}/${MAX_RETRIES})`);
    
    // Start the Next.js server
    const server = spawn('npm', ['run', 'dev'], {
      env: { ...process.env, PORT, HOST },
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true,
    });

    // Handle stdout
    server.stdout.on('data', (data) => {
      const message = data.toString();
      log.info(message);
      accessLog.write(`${new Date().toISOString()} - ${message}\n`);
    });

    // Handle stderr
    server.stderr.on('data', (data) => {
      const message = data.toString();
      log.error(message);
      errorLog.write(`${new Date().toISOString()} - ${message}\n`);
    });

    // Handle server exit
    server.on('exit', (code, signal) => {
      if (code !== 0) {
        log.error(`Server exited with code ${code}, signal ${signal}`);
        setTimeout(() => startServer(retryCount + 1), 5000);
      }
    });

    // Wait for server to be ready
    let startupChecks = 0;
    const startupCheckInterval = setInterval(async () => {
      startupChecks++;
      
      if (startupChecks * 1000 > STARTUP_TIMEOUT) {
        clearInterval(startupCheckInterval);
        log.error('Server startup timeout');
        server.kill();
        startServer(retryCount + 1);
        return;
      }

      try {
        // Check if port is open
        const portOpen = await new Promise((resolve) => {
          const client = new http.Agent();
          const req = http.get(`http://${HOST}:${PORT}`, { agent: client }, (res) => {
            resolve(true);
          });
          req.on('error', () => resolve(false));
          req.end();
        });

        if (portOpen) {
          clearInterval(startupCheckInterval);
          log.info(`Server is ready at http://${HOST}:${PORT}`);
          
          // Start health monitoring
          setInterval(async () => {
            try {
              await performHealthCheck();
              log.info('Health check passed');
            } catch (error) {
              log.warn(`Health check failed: ${error.message}`);
            }
          }, HEALTH_CHECK_INTERVAL);
        }
      } catch (error) {
        // Still waiting for startup
      }
    }, 1000);

  } catch (error) {
    log.error(`Server startup error: ${error.message}`);
    setTimeout(() => startServer(retryCount + 1), 5000);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log.info('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log.info('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Create health check endpoint if it doesn't exist
const healthCheckPath = path.join(__dirname, '..', 'src', 'app', 'api', 'health', 'route.ts');
if (!fs.existsSync(healthCheckPath)) {
  const healthDir = path.dirname(healthCheckPath);
  if (!fs.existsSync(healthDir)) {
    fs.mkdirSync(healthDir, { recursive: true });
  }
  
  fs.writeFileSync(healthCheckPath, `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
}
`);
  log.info('Created health check endpoint');
}

// Start the server
log.info('Initializing enterprise server startup...');
startServer();