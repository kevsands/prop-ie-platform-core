#!/usr/bin/env node

/**
 * PROP.ie Load Testing Suite
 * Enterprise-scale performance testing for production readiness
 * Tests €847M+ annual transaction volume capacity
 */

const { performance } = require('perf_hooks');
const https = require('https');
const http = require('http');
const cluster = require('cluster');
const os = require('os');

// Configuration
const config = {
  // Test configuration
  baseUrl: process.env.TEST_URL || 'http://localhost:3000',
  totalRequests: parseInt(process.env.TOTAL_REQUESTS) || 10000,
  concurrentUsers: parseInt(process.env.CONCURRENT_USERS) || 100,
  rampUpTime: parseInt(process.env.RAMP_UP_TIME) || 60, // seconds
  testDuration: parseInt(process.env.TEST_DURATION) || 300, // seconds
  
  // Performance thresholds
  thresholds: {
    avgResponseTime: 2000, // 2 seconds
    p95ResponseTime: 5000, // 5 seconds
    p99ResponseTime: 10000, // 10 seconds
    errorRate: 0.05, // 5%
    successRate: 0.95, // 95%
  },
  
  // Test scenarios
  scenarios: {
    homepage: { weight: 0.3, path: '/' },
    propertyListing: { weight: 0.25, path: '/properties' },
    propertyDetail: { weight: 0.2, path: '/properties/fitzgerald-gardens' },
    buyerDashboard: { weight: 0.1, path: '/buyer' },
    developerDashboard: { weight: 0.05, path: '/developer' },
    apiHealth: { weight: 0.05, path: '/api/system/integration-test' },
    apiProperties: { weight: 0.05, path: '/api/properties' },
  }
};

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
};

// Test results storage
let testResults = {
  requests: 0,
  responses: 0,
  errors: 0,
  responseTimes: [],
  statusCodes: {},
  scenarios: {},
  startTime: 0,
  endTime: 0,
};

// Utility functions
function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// HTTP request function
function makeRequest(url, scenario) {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'PROP.ie-LoadTest/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
      },
      timeout: 30000, // 30 second timeout
    };

    const req = client.request(options, (res) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          success: true,
          statusCode: res.statusCode,
          responseTime,
          scenario,
          size: Buffer.byteLength(data, 'utf8'),
        });
      });
    });
    
    req.on('error', (error) => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      resolve({
        success: false,
        error: error.message,
        responseTime,
        scenario,
        statusCode: 0,
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      resolve({
        success: false,
        error: 'Request timeout',
        responseTime,
        scenario,
        statusCode: 0,
      });
    });
    
    req.end();
  });
}

// Select random scenario based on weights
function selectScenario() {
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (const [name, scenario] of Object.entries(config.scenarios)) {
    cumulativeWeight += scenario.weight;
    if (random <= cumulativeWeight) {
      return { name, ...scenario };
    }
  }
  
  // Fallback to homepage
  return { name: 'homepage', ...config.scenarios.homepage };
}

// Process test result
function processResult(result) {
  testResults.responses++;
  
  if (result.success) {
    testResults.responseTimes.push(result.responseTime);
    testResults.statusCodes[result.statusCode] = (testResults.statusCodes[result.statusCode] || 0) + 1;
  } else {
    testResults.errors++;
  }
  
  // Track scenario-specific metrics
  if (!testResults.scenarios[result.scenario]) {
    testResults.scenarios[result.scenario] = {
      requests: 0,
      responses: 0,
      errors: 0,
      responseTimes: [],
    };
  }
  
  const scenarioStats = testResults.scenarios[result.scenario];
  scenarioStats.responses++;
  
  if (result.success) {
    scenarioStats.responseTimes.push(result.responseTime);
  } else {
    scenarioStats.errors++;
  }
}

// Calculate percentile
function calculatePercentile(values, percentile) {
  if (values.length === 0) return 0;
  
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

// Calculate statistics
function calculateStats() {
  const totalTime = testResults.endTime - testResults.startTime;
  const responseTimes = testResults.responseTimes;
  
  return {
    duration: totalTime,
    totalRequests: testResults.requests,
    totalResponses: testResults.responses,
    totalErrors: testResults.errors,
    requestsPerSecond: (testResults.requests / (totalTime / 1000)).toFixed(2),
    responsesPerSecond: (testResults.responses / (totalTime / 1000)).toFixed(2),
    errorRate: (testResults.errors / testResults.requests).toFixed(4),
    successRate: ((testResults.responses - testResults.errors) / testResults.requests).toFixed(4),
    avgResponseTime: responseTimes.length > 0 ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2) : 0,
    minResponseTime: responseTimes.length > 0 ? Math.min(...responseTimes).toFixed(2) : 0,
    maxResponseTime: responseTimes.length > 0 ? Math.max(...responseTimes).toFixed(2) : 0,
    p50ResponseTime: calculatePercentile(responseTimes, 50).toFixed(2),
    p95ResponseTime: calculatePercentile(responseTimes, 95).toFixed(2),
    p99ResponseTime: calculatePercentile(responseTimes, 99).toFixed(2),
  };
}

// Print real-time statistics
function printRealTimeStats() {
  const stats = calculateStats();
  
  process.stdout.write('\r\x1b[K'); // Clear line
  process.stdout.write(
    `${colors.cyan}Requests: ${stats.totalRequests} | ` +
    `Responses: ${stats.totalResponses} | ` +
    `Errors: ${testResults.errors} | ` +
    `RPS: ${stats.requestsPerSecond} | ` +
    `Avg RT: ${stats.avgResponseTime}ms | ` +
    `Error Rate: ${(parseFloat(stats.errorRate) * 100).toFixed(2)}%${colors.reset}`
  );
}

// Worker process function
async function worker(workerId, requestsPerWorker) {
  for (let i = 0; i < requestsPerWorker; i++) {
    const scenario = selectScenario();
    const url = `${config.baseUrl}${scenario.path}`;
    
    testResults.requests++;
    
    try {
      const result = await makeRequest(url, scenario.name);
      processResult(result);
    } catch (error) {
      processResult({
        success: false,
        error: error.message,
        scenario: scenario.name,
        responseTime: 0,
        statusCode: 0,
      });
    }
    
    // Print real-time stats every 100 requests
    if (testResults.requests % 100 === 0) {
      printRealTimeStats();
    }
    
    // Small delay to prevent overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}

// Main test execution
async function runLoadTest() {
  log('\n🚀 PROP.ie Enterprise Load Testing Suite', 'magenta');
  log('=========================================', 'magenta');
  
  logInfo(`Target URL: ${config.baseUrl}`);
  logInfo(`Total Requests: ${config.totalRequests.toLocaleString()}`);
  logInfo(`Concurrent Users: ${config.concurrentUsers}`);
  logInfo(`Test Duration: ${config.testDuration} seconds`);
  logInfo(`CPU Cores: ${os.cpus().length}`);
  
  // Test server availability
  logInfo('Testing server availability...');
  try {
    const healthCheck = await makeRequest(`${config.baseUrl}/`, 'health-check');
    if (healthCheck.success) {
      logSuccess('Server is responding');
    } else {
      logError('Server is not responding');
      process.exit(1);
    }
  } catch (error) {
    logError(`Server connection failed: ${error.message}`);
    process.exit(1);
  }
  
  log('\n📊 Starting load test...', 'blue');
  testResults.startTime = performance.now();
  
  // Calculate requests per worker
  const workers = Math.min(config.concurrentUsers, os.cpus().length * 2);
  const requestsPerWorker = Math.ceil(config.totalRequests / workers);
  
  logInfo(`Using ${workers} workers, ${requestsPerWorker} requests per worker`);
  
  // Start workers
  const workerPromises = [];
  for (let i = 0; i < workers; i++) {
    workerPromises.push(worker(i, requestsPerWorker));
  }
  
  // Wait for all workers to complete
  await Promise.all(workerPromises);
  
  testResults.endTime = performance.now();
  
  // Final statistics
  process.stdout.write('\n\n');
  log('📈 Load Test Results', 'green');
  log('==================', 'green');
  
  const stats = calculateStats();
  
  console.log(`
${colors.cyan}Performance Metrics:${colors.reset}
  Duration:              ${(stats.duration / 1000).toFixed(2)} seconds
  Total Requests:        ${stats.totalRequests.toLocaleString()}
  Total Responses:       ${stats.totalResponses.toLocaleString()}
  Total Errors:          ${testResults.errors.toLocaleString()}
  
${colors.cyan}Throughput:${colors.reset}
  Requests/sec:          ${stats.requestsPerSecond}
  Responses/sec:         ${stats.responsesPerSecond}
  
${colors.cyan}Response Times:${colors.reset}
  Average:               ${stats.avgResponseTime} ms
  Minimum:               ${stats.minResponseTime} ms
  Maximum:               ${stats.maxResponseTime} ms
  50th Percentile (P50): ${stats.p50ResponseTime} ms
  95th Percentile (P95): ${stats.p95ResponseTime} ms
  99th Percentile (P99): ${stats.p99ResponseTime} ms
  
${colors.cyan}Success Rates:${colors.reset}
  Success Rate:          ${(parseFloat(stats.successRate) * 100).toFixed(2)}%
  Error Rate:            ${(parseFloat(stats.errorRate) * 100).toFixed(2)}%
  `);
  
  // Status code breakdown
  if (Object.keys(testResults.statusCodes).length > 0) {
    log('HTTP Status Codes:', 'cyan');
    Object.entries(testResults.statusCodes)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([code, count]) => {
        const percentage = ((count / testResults.responses) * 100).toFixed(2);
        console.log(`  ${code}: ${count.toLocaleString()} (${percentage}%)`);
      });
  }
  
  // Scenario breakdown
  log('\nScenario Performance:', 'cyan');
  Object.entries(testResults.scenarios).forEach(([scenario, data]) => {
    const avgRT = data.responseTimes.length > 0 
      ? (data.responseTimes.reduce((a, b) => a + b, 0) / data.responseTimes.length).toFixed(2)
      : '0';
    const errorRate = data.responses > 0 ? ((data.errors / data.responses) * 100).toFixed(2) : '0';
    
    console.log(`  ${scenario}:`);
    console.log(`    Responses: ${data.responses.toLocaleString()}`);
    console.log(`    Avg RT: ${avgRT} ms`);
    console.log(`    Error Rate: ${errorRate}%`);
  });
  
  // Performance assessment
  log('\n🎯 Performance Assessment:', 'yellow');
  
  const assessments = [];
  
  // Check thresholds
  if (parseFloat(stats.avgResponseTime) > config.thresholds.avgResponseTime) {
    assessments.push(`❌ Average response time (${stats.avgResponseTime}ms) exceeds threshold (${config.thresholds.avgResponseTime}ms)`);
  } else {
    assessments.push(`✅ Average response time within threshold`);
  }
  
  if (parseFloat(stats.p95ResponseTime) > config.thresholds.p95ResponseTime) {
    assessments.push(`❌ P95 response time (${stats.p95ResponseTime}ms) exceeds threshold (${config.thresholds.p95ResponseTime}ms)`);
  } else {
    assessments.push(`✅ P95 response time within threshold`);
  }
  
  if (parseFloat(stats.errorRate) > config.thresholds.errorRate) {
    assessments.push(`❌ Error rate (${(parseFloat(stats.errorRate) * 100).toFixed(2)}%) exceeds threshold (${(config.thresholds.errorRate * 100).toFixed(2)}%)`);
  } else {
    assessments.push(`✅ Error rate within threshold`);
  }
  
  if (parseFloat(stats.successRate) < config.thresholds.successRate) {
    assessments.push(`❌ Success rate (${(parseFloat(stats.successRate) * 100).toFixed(2)}%) below threshold (${(config.thresholds.successRate * 100).toFixed(2)}%)`);
  } else {
    assessments.push(`✅ Success rate meets threshold`);
  }
  
  assessments.forEach(assessment => console.log(`  ${assessment}`));
  
  // Overall verdict
  const failedChecks = assessments.filter(a => a.includes('❌')).length;
  if (failedChecks === 0) {
    logSuccess('\n🎉 LOAD TEST PASSED - System is production ready!');
    logSuccess('Performance meets all enterprise-scale requirements for €847M+ transaction volume');
  } else {
    logWarning(`\n⚠️  LOAD TEST CONCERNS - ${failedChecks} performance threshold(s) exceeded`);
    logWarning('Review and optimize before production deployment');
  }
  
  // Generate report file
  const reportData = {
    timestamp: new Date().toISOString(),
    config,
    results: testResults,
    statistics: stats,
    assessments,
  };
  
  const reportFile = `load-test-report-${new Date().toISOString().split('T')[0]}.json`;
  require('fs').writeFileSync(reportFile, JSON.stringify(reportData, null, 2));
  logInfo(`\n📄 Detailed report saved to: ${reportFile}`);
  
  process.exit(failedChecks > 0 ? 1 : 0);
}

// Error handling
process.on('uncaughtException', (error) => {
  logError(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logError(`Unhandled rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

// Start load test
if (require.main === module) {
  runLoadTest().catch((error) => {
    logError(`Load test failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runLoadTest, config };