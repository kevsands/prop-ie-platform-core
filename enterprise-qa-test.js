#!/usr/bin/env node
// Enterprise QA Test Suite

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

// Test configuration
const tests = {
  typescript: {
    name: 'TypeScript Compilation',
    command: 'npx tsc --noEmit',
    critical: true
  },
  lint: {
    name: 'ESLint',
    command: 'npm run lint',
    critical: false
  },
  unitTests: {
    name: 'Unit Tests',
    command: 'npm test -- --watchAll=false',
    critical: true
  },
  coverage: {
    name: 'Test Coverage',
    command: 'npm test -- --coverage --watchAll=false',
    critical: false
  },
  build: {
    name: 'Production Build',
    command: 'npm run build',
    critical: true
  },
  security: {
    name: 'Security Audit',
    command: 'npm audit',
    critical: false
  }
};

// Performance benchmarks
const performanceBenchmarks = {
  buildTime: 120000, // 2 minutes
  testTime: 60000,   // 1 minute
  pageLoadTime: 3000 // 3 seconds
};

// API endpoints to test
const apiEndpoints = [
  '/api/auth/session',
  '/api/auth/csrf',
  '/api/developments',
  '/api/units',
  '/api/properties',
  '/api/users'
];

function runCommand(command, silent = false) {
  try {
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return { success: true, output };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      output: error.stdout || error.stderr || ''
    };
  }
}

function testEndpoint(endpoint) {
  const url = `http://localhost:3000${endpoint}`;
  try {
    const result = runCommand(`curl -s -o /dev/null -w "%{http_code}" ${url}`, true);
    const statusCode = parseInt(result.output.trim());
    return {
      endpoint,
      status: statusCode,
      success: statusCode >= 200 && statusCode < 500
    };
  } catch (error) {
    return {
      endpoint,
      status: 'error',
      success: false,
      error: error.message
    };
  }
}

function analyzeCodeQuality() {
  console.log(`\n${colors.blue}📊 Code Quality Analysis${colors.reset}`);
  
  // Check for TODO comments
  const todoCount = runCommand('grep -r "TODO\\|FIXME" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | wc -l', true);
  console.log(`   TODOs/FIXMEs: ${todoCount.output.trim()}`);
  
  // Check for console.log statements
  const consoleCount = runCommand('grep -r "console\\.log" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | wc -l', true);
  console.log(`   Console.log statements: ${consoleCount.output.trim()}`);
  
  // Check for any debug code
  const debugCount = runCommand('grep -r "debugger\\|debug:" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | wc -l', true);
  console.log(`   Debug statements: ${debugCount.output.trim()}`);
}

function checkSecurity() {
  console.log(`\n${colors.blue}🔒 Security Analysis${colors.reset}`);
  
  // Check for hardcoded secrets
  const secretPatterns = [
    'password.*=.*["\'][^"\']+["\']',
    'api[_-]?key.*=.*["\'][^"\']+["\']',
    'secret.*=.*["\'][^"\']+["\']'
  ];
  
  let totalSecrets = 0;
  secretPatterns.forEach(pattern => {
    const result = runCommand(`grep -r -i "${pattern}" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | wc -l`, true);
    totalSecrets += parseInt(result.output.trim());
  });
  
  console.log(`   Potential hardcoded secrets: ${totalSecrets}`);
  
  // Check for unsafe operations
  const unsafePatterns = ['eval\\(', 'dangerouslySetInnerHTML'];
  unsafePatterns.forEach(pattern => {
    const result = runCommand(`grep -r "${pattern}" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | wc -l`, true);
    console.log(`   ${pattern} usage: ${result.output.trim()}`);
  });
}

async function runEnterpriseQA() {
  console.log(`${colors.bright}🚀 Enterprise QA Test Suite${colors.reset}`);
  console.log('='.repeat(40));
  
  const results = {
    tests: {},
    api: [],
    quality: {},
    security: {},
    timestamp: new Date().toISOString()
  };
  
  // Run all tests
  console.log(`\n${colors.blue}🧪 Running Tests${colors.reset}`);
  for (const [key, test] of Object.entries(tests)) {
    process.stdout.write(`   ${test.name}... `);
    const startTime = Date.now();
    const result = runCommand(test.command);
    const duration = Date.now() - startTime;
    
    results.tests[key] = {
      name: test.name,
      success: result.success,
      duration,
      critical: test.critical
    };
    
    if (result.success) {
      console.log(`${colors.green}✓${colors.reset} (${duration}ms)`);
    } else {
      console.log(`${colors.red}✗${colors.reset} (${duration}ms)`);
      if (test.critical) {
        console.log(`${colors.red}   CRITICAL: ${test.name} failed${colors.reset}`);
      }
    }
  }
  
  // Test API endpoints (only if server is running)
  console.log(`\n${colors.blue}🌐 Testing API Endpoints${colors.reset}`);
  const serverCheck = runCommand('curl -s http://localhost:3000', true);
  if (serverCheck.success) {
    for (const endpoint of apiEndpoints) {
      const result = testEndpoint(endpoint);
      results.api.push(result);
      console.log(`   ${endpoint}: ${result.success ? colors.green + '✓' : colors.red + '✗'} ${colors.reset}(${result.status})`);
    }
  } else {
    console.log('   Server not running - skipping API tests');
  }
  
  // Code quality analysis
  analyzeCodeQuality();
  
  // Security checks
  checkSecurity();
  
  // Performance metrics
  console.log(`\n${colors.blue}⚡ Performance Metrics${colors.reset}`);
  if (results.tests.build && results.tests.build.success) {
    const buildOk = results.tests.build.duration < performanceBenchmarks.buildTime;
    console.log(`   Build time: ${results.tests.build.duration}ms ${buildOk ? colors.green + '✓' : colors.yellow + '⚠'} ${colors.reset}`);
  }
  
  if (results.tests.unitTests && results.tests.unitTests.success) {
    const testOk = results.tests.unitTests.duration < performanceBenchmarks.testTime;
    console.log(`   Test time: ${results.tests.unitTests.duration}ms ${testOk ? colors.green + '✓' : colors.yellow + '⚠'} ${colors.reset}`);
  }
  
  // Summary
  console.log(`\n${colors.bright}📋 Summary${colors.reset}`);
  const passedTests = Object.values(results.tests).filter(t => t.success).length;
  const totalTests = Object.keys(results.tests).length;
  const criticalPassed = Object.values(results.tests).filter(t => t.critical && t.success).length;
  const criticalTotal = Object.values(results.tests).filter(t => t.critical).length;
  
  console.log(`   Tests passed: ${passedTests}/${totalTests}`);
  console.log(`   Critical tests: ${criticalPassed}/${criticalTotal}`);
  console.log(`   API endpoints working: ${results.api.filter(a => a.success).length}/${results.api.length}`);
  
  // Overall status
  const allCriticalPassed = criticalPassed === criticalTotal;
  const overallStatus = allCriticalPassed ? 'PASSED' : 'FAILED';
  const statusColor = allCriticalPassed ? colors.green : colors.red;
  
  console.log(`\n${colors.bright}Overall Status: ${statusColor}${overallStatus}${colors.reset}`);
  
  // Save results
  fs.writeFileSync('enterprise-qa-results.json', JSON.stringify(results, null, 2));
  console.log('\n📄 Detailed results saved to enterprise-qa-results.json');
  
  // Generate HTML report
  generateHTMLReport(results);
}

function generateHTMLReport(results) {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Enterprise QA Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #333; color: white; padding: 20px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
        .passed { color: green; }
        .failed { color: red; }
        .warning { color: orange; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f5f5f5; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Enterprise QA Report</h1>
        <p>Generated: ${results.timestamp}</p>
    </div>
    
    <div class="section">
        <h2>Test Results</h2>
        <table>
            <tr>
                <th>Test</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Critical</th>
            </tr>
            ${Object.entries(results.tests).map(([key, test]) => `
                <tr>
                    <td>${test.name}</td>
                    <td class="${test.success ? 'passed' : 'failed'}">${test.success ? 'PASSED' : 'FAILED'}</td>
                    <td>${test.duration}ms</td>
                    <td>${test.critical ? 'Yes' : 'No'}</td>
                </tr>
            `).join('')}
        </table>
    </div>
    
    <div class="section">
        <h2>API Endpoints</h2>
        <table>
            <tr>
                <th>Endpoint</th>
                <th>Status Code</th>
                <th>Result</th>
            </tr>
            ${results.api.map(endpoint => `
                <tr>
                    <td>${endpoint.endpoint}</td>
                    <td>${endpoint.status}</td>
                    <td class="${endpoint.success ? 'passed' : 'failed'}">${endpoint.success ? 'WORKING' : 'FAILED'}</td>
                </tr>
            `).join('')}
        </table>
    </div>
</body>
</html>
  `;
  
  fs.writeFileSync('enterprise-qa-report.html', html);
  console.log('📄 HTML report saved to enterprise-qa-report.html');
}

// Run the QA suite
runEnterpriseQA();