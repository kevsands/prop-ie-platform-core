#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const USE_HTTPS = BASE_URL.startsWith('https');
const client = USE_HTTPS ? https : http;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Helper function to make HTTP requests
async function makeRequest(endpoint, method = 'GET', data = null) {
  const url = new URL(endpoint, BASE_URL);
  
  const options = {
    hostname: url.hostname,
    port: url.port || (USE_HTTPS ? 443 : 80),
    path: url.pathname + url.search,
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  
  if (data) {
    options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
  }
  
  return new Promise((resolve, reject) => {
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test health endpoint
async function testHealthEndpoint() {
  console.log(`${colors.cyan}Testing Health Endpoint...${colors.reset}`);
  
  try {
    const response = await makeRequest('/api/health');
    
    if (response.status === 200) {
      console.log(`${colors.green}✓ Health check passed${colors.reset}`);
      console.log(`  Status: ${response.data.status}`);
      console.log(`  Version: ${response.data.version}`);
      console.log(`  Uptime: ${formatUptime(response.data.uptime)}`);
      console.log(`  Environment: ${response.data.environment}`);
      
      // Check individual services
      if (response.data.checks) {
        console.log(`\n${colors.cyan}Service Checks:${colors.reset}`);
        Object.entries(response.data.checks).forEach(([service, check]) => {
          const statusColor = check.status === 'ok' ? colors.green : colors.red;
          console.log(`  ${service}: ${statusColor}${check.status}${colors.reset}`);
          if (check.responseTime) {
            console.log(`    Response time: ${check.responseTime}ms`);
          }
        });
      }
      
      // Show system resources
      if (response.data.system) {
        console.log(`\n${colors.cyan}System Resources:${colors.reset}`);
        const mem = response.data.system.memory;
        const cpu = response.data.system.cpu;
        console.log(`  Memory: ${mem.percentUsed.toFixed(1)}% used (${formatBytes(mem.used)} / ${formatBytes(mem.total)})`);
        console.log(`  CPU: ${cpu.percentUsed.toFixed(1)}% used (${cpu.cores} cores)`);
        console.log(`  Load Average: ${cpu.loadAverage.map(l => l.toFixed(2)).join(', ')}`);
      }
    } else {
      console.log(`${colors.red}✗ Health check failed with status ${response.status}${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}✗ Health endpoint error: ${error.message}${colors.reset}`);
  }
}

// Test metrics endpoint
async function testMetricsEndpoint() {
  console.log(`\n${colors.cyan}Testing Metrics Endpoint...${colors.reset}`);
  
  try {
    const response = await makeRequest('/api/metrics');
    
    if (response.status === 200) {
      console.log(`${colors.green}✓ Metrics endpoint working${colors.reset}`);
      
      const metrics = response.data;
      
      // Performance metrics
      if (metrics.performance) {
        console.log(`\n${colors.cyan}Performance Metrics:${colors.reset}`);
        console.log(`  Average Response Time: ${metrics.performance.averageResponseTime.toFixed(2)}ms`);
        console.log(`  Requests/sec: ${metrics.performance.requestsPerSecond.toFixed(2)}`);
        console.log(`  Error Rate: ${(metrics.performance.errorRate * 100).toFixed(2)}%`);
        console.log(`  Total Requests: ${metrics.performance.totalRequests}`);
        console.log(`  Total Errors: ${metrics.performance.totalErrors}`);
      }
      
      // Database metrics
      if (metrics.database) {
        console.log(`\n${colors.cyan}Database Metrics:${colors.reset}`);
        console.log(`  Active Connections: ${metrics.database.connections.active}`);
        console.log(`  Idle Connections: ${metrics.database.connections.idle}`);
        console.log(`  Query Performance: ${metrics.database.queryPerformance.averageTime.toFixed(2)}ms avg`);
      }
      
      // Cache metrics
      if (metrics.cache) {
        console.log(`\n${colors.cyan}Cache Metrics:${colors.reset}`);
        console.log(`  Hit Rate: ${(metrics.cache.hitRate * 100).toFixed(1)}%`);
        console.log(`  Miss Rate: ${(metrics.cache.missRate * 100).toFixed(1)}%`);
        console.log(`  Active Keys: ${metrics.cache.keys}`);
      }
      
      // Top endpoints
      if (metrics.endpoints && metrics.endpoints.length > 0) {
        console.log(`\n${colors.cyan}Top Endpoints:${colors.reset}`);
        metrics.endpoints.slice(0, 5).forEach(ep => {
          console.log(`  ${ep.method} ${ep.path}`);
          console.log(`    Requests: ${ep.count}, Avg Time: ${ep.averageTime.toFixed(2)}ms, Error Rate: ${(ep.errorRate * 100).toFixed(2)}%`);
        });
      }
    } else {
      console.log(`${colors.red}✗ Metrics check failed with status ${response.status}${colors.reset}`);
    }
  } catch (error) {
    console.log(`${colors.red}✗ Metrics endpoint error: ${error.message}${colors.reset}`);
  }
}

// Load test to generate metrics
async function generateLoad() {
  console.log(`\n${colors.cyan}Generating load for metrics...${colors.reset}`);
  
  const endpoints = [
    '/api/properties',
    '/api/developments',
    '/api/units',
    '/api/users/me'
  ];
  
  const requests = [];
  const numRequests = 50;
  
  for (let i = 0; i < numRequests; i++) {
    const endpoint = endpoints[i % endpoints.length];
    requests.push(
      makeRequest(endpoint).catch(err => ({ error: err.message, endpoint }))
    );
  }
  
  const startTime = Date.now();
  const results = await Promise.all(requests);
  const duration = Date.now() - startTime;
  
  const successful = results.filter(r => !r.error && r.status < 400).length;
  const failed = results.length - successful;
  
  console.log(`${colors.green}✓ Load test completed${colors.reset}`);
  console.log(`  Total Requests: ${requests.length}`);
  console.log(`  Successful: ${successful}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Duration: ${duration}ms`);
  console.log(`  Average: ${(duration / requests.length).toFixed(2)}ms per request`);
}

// Helper functions
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

function formatBytes(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

// Main execution
async function main() {
  console.log(`${colors.bright}Prop.ie Monitoring System Test${colors.reset}`);
  console.log(`Base URL: ${BASE_URL}\n`);
  
  try {
    await testHealthEndpoint();
    await testMetricsEndpoint();
    
    const args = process.argv.slice(2);
    if (args.includes('--load')) {
      await generateLoad();
      console.log('\nWaiting 5 seconds for metrics to update...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      await testMetricsEndpoint();
    }
    
    console.log(`\n${colors.green}${colors.bright}All tests completed!${colors.reset}`);
  } catch (error) {
    console.log(`\n${colors.red}${colors.bright}Test failed: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Help text
if (process.argv.includes('--help')) {
  console.log(`
Usage: node test-monitoring.js [options]

Options:
  --load    Generate load to test metrics collection
  --help    Show this help message

Environment Variables:
  BASE_URL  The base URL of the application (default: http://localhost:3000)

Examples:
  node test-monitoring.js
  node test-monitoring.js --load
  BASE_URL=https://propie.com node test-monitoring.js
  `);
  process.exit(0);
}

// Run the tests
main().catch(console.error);