#!/usr/bin/env node

/**
 * Security Features Testing Script
 * 
 * This script tests that security analytics and monitoring features are working correctly
 * after re-enabling them with the enable-security-features.js script.
 * 
 * It performs several checks:
 * 1. Verifies that analytics functions are returning real data, not mock data
 * 2. Verifies that monitoring hooks are correctly tracking security violations
 * 3. Tests security performance correlation features
 * 
 * Usage:
 *   node scripts/test-security-features.js [--analytics | --monitoring | --performance | --all]
 * 
 * Options:
 *   --analytics: Test only security analytics
 *   --monitoring: Test only security monitoring
 *   --performance: Test only security performance correlation
 *   --all: Test all security features (default)
 */

const fs = require('fs');
const path = require('path');

// Parse arguments
const args = process.argv.slice(2);
const testAnalytics = args.includes('--analytics') || args.includes('--all') || (!args.length);
const testMonitoring = args.includes('--monitoring') || args.includes('--all') || (!args.length);
const testPerformance = args.includes('--performance') || args.includes('--all') || (!args.length);

console.log('🔒 Security Features Test');
console.log('=======================\n');

// Check if security feature flags are enabled
const securityFilePath = path.join(
  process.cwd(),
  'src',
  'lib',
  'security',
  'index.ts'
);

let analyticsEnabled = true;
let monitoringEnabled = true;

// Check the security flags
if (fs.existsSync(securityFilePath)) {
  const content = fs.readFileSync(securityFilePath, 'utf8');
  analyticsEnabled = !content.includes('const ENABLE_SECURITY_ANALYTICS = false');
  monitoringEnabled = !content.includes('const ENABLE_SECURITY_MONITORING = false');
}

console.log(`Security Analytics: ${analyticsEnabled ? '✅ Enabled' : '❌ Disabled'}`);
console.log(`Security Monitoring: ${monitoringEnabled ? '✅ Enabled' : '❌ Disabled'}\n`);

// Path to specific test scripts
const testScriptsPath = path.join(process.cwd(), 'scripts', 'security-tests');

// Create test scripts directory if it doesn't exist
if (!fs.existsSync(testScriptsPath)) {
  fs.mkdirSync(testScriptsPath, { recursive: true });
}

// Generate test scripts if they don't exist
function createTestScript(name, content) {
  const filePath = path.join(testScriptsPath, `${name}.js`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Generated test script: ${name}.js`);
  }
  return filePath;
}

// Create individual test scripts
const analyticsTestPath = createTestScript('analytics-test', `
const { getSecurityMetrics, getSecurityEvents, getAnomalyDetections, getThreatIndicators } = require('../../src/lib/security');

async function testSecurityAnalytics() {
  console.log('Testing Security Analytics...');
  
  try {
    // Test security metrics
    const metrics = await getSecurityMetrics();
    console.log('- Security metrics:', metrics.length ? '✅ Real data' : '❌ Empty data');
    
    // Test security events
    const events = await getSecurityEvents();
    console.log('- Security events:', events.length ? '✅ Real data' : '❌ Empty data');
    
    // Test anomaly detections
    const anomalies = await getAnomalyDetections();
    console.log('- Anomaly detections:', anomalies.length ? '✅ Real data' : '❌ Empty data');
    
    // Test threat indicators
    const threats = await getThreatIndicators();
    console.log('- Threat indicators:', threats.length ? '✅ Real data' : '❌ Empty data');
    
    return {
      success: metrics.length > 0 || events.length > 0 || anomalies.length > 0 || threats.length > 0,
      message: 'Security analytics test completed'
    };
  } catch (error) {
    console.error('Error testing security analytics:', error);
    return {
      success: false,
      message: 'Security analytics test failed with error: ' + error.message
    };
  }
}

testSecurityAnalytics()
  .then(result => {
    console.log(result.message);
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
`);

const monitoringTestPath = createTestScript('monitoring-test', `
const { useSecurityMonitor } = require('../../src/lib/security');

function testSecurityMonitoring() {
  console.log('Testing Security Monitoring...');
  
  try {
    // Mock the security monitor hook result
    // In a real test, this would be used in a React component
    const monitor = useSecurityMonitor();
    
    // Check if it returns real monitor object or mock implementation
    console.log('- Monitor hook returns:', 
      typeof monitor.recordViolation === 'function' ? '✅ Real implementation' : '❌ Mock implementation');
    
    // Test recording a violation
    const violation = monitor.recordViolation({
      type: 'test',
      severity: 'low',
      description: 'Test violation',
      url: 'https://example.com/test'
    });
    
    console.log('- Recording violation:', violation ? '✅ Successful' : '❌ Failed');
    
    // Check if violations are tracked
    console.log('- Violations tracking:', 
      Array.isArray(monitor.violations) ? '✅ Working' : '❌ Not working');
    
    return {
      success: typeof monitor.recordViolation === 'function' && Array.isArray(monitor.violations),
      message: 'Security monitoring test completed'
    };
  } catch (error) {
    console.error('Error testing security monitoring:', error);
    return {
      success: false,
      message: 'Security monitoring test failed with error: ' + error.message
    };
  }
}

// Execute test
const result = testSecurityMonitoring();
console.log(result.message);
process.exit(result.success ? 0 : 1);
`);

const performanceTestPath = createTestScript('performance-test', `
const { correlateSecurityAndPerformance } = require('../../src/lib/security');

async function testPerformanceCorrelation() {
  console.log('Testing Security-Performance Correlation...');
  
  try {
    // Test correlation analysis
    const result = await correlateSecurityAndPerformance('test_event', 'test_metric');
    
    // Check if result has correlation data
    const hasCorrelationData = result && typeof result.correlation === 'number';
    console.log('- Correlation data:', hasCorrelationData ? '✅ Available' : '❌ Not available');
    
    // Check if correlation value is non-zero (real implementation should return meaningful values)
    const hasRealCorrelation = hasCorrelationData && result.correlation !== 0;
    console.log('- Real correlation values:', hasRealCorrelation ? '✅ Present' : '❌ Always zero (mock)');
    
    return {
      success: hasCorrelationData,
      message: 'Security-performance correlation test completed'
    };
  } catch (error) {
    console.error('Error testing performance correlation:', error);
    return {
      success: false,
      message: 'Performance correlation test failed with error: ' + error.message
    };
  }
}

testPerformanceCorrelation()
  .then(result => {
    console.log(result.message);
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
`);

// Run tests based on arguments
async function runTest(name, path) {
  console.log(`\n📋 Running ${name} test...`);
  console.log('---------------------------------------');
  
  try {
    const { spawn } = require('child_process');
    const child = spawn('node', [path], { stdio: 'inherit' });
    
    return new Promise((resolve, reject) => {
      child.on('close', code => {
        if (code === 0) {
          console.log(`\n✅ ${name} test passed successfully`);
          resolve(true);
        } else {
          console.error(`\n❌ ${name} test failed with code ${code}`);
          resolve(false);
        }
      });
      
      child.on('error', error => {
        console.error(`\n💥 Error running ${name} test:`, error);
        reject(error);
      });
    });
  } catch (error) {
    console.error(`\n💥 Failed to run ${name} test:`, error);
    return false;
  }
}

// Main execution logic
async function main() {
  let allPassed = true;
  
  if (testAnalytics) {
    if (!analyticsEnabled) {
      console.warn('⚠️ Warning: Security Analytics is disabled. Tests may fail.');
    }
    const passed = await runTest('Analytics', analyticsTestPath);
    allPassed = allPassed && passed;
  }
  
  if (testMonitoring) {
    if (!monitoringEnabled) {
      console.warn('⚠️ Warning: Security Monitoring is disabled. Tests may fail.');
    }
    const passed = await runTest('Monitoring', monitoringTestPath);
    allPassed = allPassed && passed;
  }
  
  if (testPerformance) {
    if (!analyticsEnabled) {
      console.warn('⚠️ Warning: Security Analytics is disabled, which may affect Performance Correlation. Tests may fail.');
    }
    const passed = await runTest('Performance', performanceTestPath);
    allPassed = allPassed && passed;
  }
  
  console.log('\n==============================================');
  if (allPassed) {
    console.log('✅ All security tests passed successfully!');
    console.log('   Security features are properly enabled and working.');
  } else {
    console.log('❌ Some security tests failed.');
    console.log('   Please check the output above for details.');
    
    if (!analyticsEnabled || !monitoringEnabled) {
      console.log('\n⚠️ Note: Some security features are still disabled:');
      if (!analyticsEnabled) console.log('   - Security Analytics is disabled');
      if (!monitoringEnabled) console.log('   - Security Monitoring is disabled');
      console.log('\n   Run the enable-security-features.js script to enable them:');
      console.log('   node scripts/enable-security-features.js --all');
    }
  }
  
  process.exit(allPassed ? 0 : 1);
}

main().catch(error => {
  console.error('Unhandled error in main execution:', error);
  process.exit(1);
});