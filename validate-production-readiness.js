#!/usr/bin/env node

/**
 * Production Readiness Validation Script
 * 
 * This script validates that the PropIE platform is ready for production deployment
 * by checking all critical systems, configurations, and performance metrics.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');
const http = require('http');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Validation results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

// Helper functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  let color = colors.reset;
  let prefix = 'ℹ️';
  
  switch (type) {
    case 'success':
      color = colors.green;
      prefix = '✅';
      results.passed++;
      break;
    case 'error':
      color = colors.red;
      prefix = '❌';
      results.failed++;
      break;
    case 'warning':
      color = colors.yellow;
      prefix = '⚠️';
      results.warnings++;
      break;
    case 'info':
      color = colors.blue;
      prefix = 'ℹ️';
      break;
  }
  
  const logMessage = `${prefix} ${message}`;
  console.log(`${color}${logMessage}${colors.reset}`);
  
  results.details.push({
    timestamp,
    type,
    message
  });
}

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`${description} exists`, 'success');
    return true;
  } else {
    log(`${description} missing: ${filePath}`, 'error');
    return false;
  }
}

function executeCommand(command, description, required = true) {
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    log(`${description} - OK`, 'success');
    return output;
  } catch (error) {
    if (required) {
      log(`${description} - Failed: ${error.message}`, 'error');
    } else {
      log(`${description} - Warning: ${error.message}`, 'warning');
    }
    return null;
  }
}

function testServerResponse(url, timeout = 5000) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, { timeout }, (res) => {
      resolve({
        status: res.statusCode,
        headers: res.headers,
        success: res.statusCode === 200
      });
    });
    
    req.on('error', () => {
      resolve({ success: false, error: 'Connection failed' });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
  });
}

async function validateProductionReadiness() {
  console.log(`${colors.blue}${colors.bold}`);
  console.log('🚀 PropIE Production Readiness Validation');
  console.log('==========================================');
  console.log(`${colors.reset}`);
  
  // 1. Check Node.js and npm versions
  log('Checking Node.js environment...', 'info');
  const nodeVersion = executeCommand('node --version', 'Node.js version check');
  const npmVersion = executeCommand('npm --version', 'npm version check');
  
  if (nodeVersion) {
    const version = nodeVersion.trim().replace('v', '');
    const majorVersion = parseInt(version.split('.')[0]);
    if (majorVersion >= 18) {
      log(`Node.js version ${version} is compatible`, 'success');
    } else {
      log(`Node.js version ${version} is too old. Need 18+`, 'error');
    }
  }
  
  // 2. Check project structure
  log('Validating project structure...', 'info');
  checkFileExists('package.json', 'Package.json');
  checkFileExists('next.config.js', 'Next.js configuration');
  checkFileExists('amplify.yml', 'Amplify build configuration');
  checkFileExists('src/app/page.tsx', 'Main application page');
  checkFileExists('prisma/schema.prisma', 'Database schema');
  
  // 3. Check dependencies
  log('Checking dependencies...', 'info');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Check critical dependencies
  const criticalDeps = [
    'next',
    'react',
    'react-dom',
    '@prisma/client',
    'tailwindcss'
  ];
  
  criticalDeps.forEach(dep => {
    if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
      log(`Dependency ${dep} found`, 'success');
    } else {
      log(`Critical dependency ${dep} missing`, 'error');
    }
  });
  
  // 4. TypeScript validation
  log('Running TypeScript validation...', 'info');
  executeCommand('npm run typecheck', 'TypeScript compilation', false);
  
  // 5. Build test
  log('Testing production build...', 'info');
  executeCommand('npm run build', 'Production build test');
  
  // 6. Check environment configuration
  log('Validating environment configuration...', 'info');
  
  const envFiles = [
    '.env.example',
    '.env.production.deploy',
    'amplify.yml'
  ];
  
  envFiles.forEach(file => {
    checkFileExists(file, `Environment file ${file}`);
  });
  
  // 7. Database schema validation
  log('Validating database schema...', 'info');
  executeCommand('npx prisma validate', 'Prisma schema validation');
  executeCommand('npx prisma generate', 'Prisma client generation', false);
  
  // 8. Security headers validation
  log('Checking security configuration...', 'info');
  
  if (fs.existsSync('next.config.js')) {
    const nextConfig = fs.readFileSync('next.config.js', 'utf8');
    
    const securityFeatures = [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Strict-Transport-Security',
      'Content-Security-Policy'
    ];
    
    securityFeatures.forEach(feature => {
      if (nextConfig.includes(feature)) {
        log(`Security header ${feature} configured`, 'success');
      } else {
        log(`Security header ${feature} not found`, 'warning');
      }
    });
  }
  
  // 9. Test local server if running
  log('Testing local server response...', 'info');
  
  const serverTest = await testServerResponse('http://localhost:3000');
  if (serverTest.success) {
    log('Local server responding correctly', 'success');
    
    // Check security headers in response
    const securityHeaders = [
      'strict-transport-security',
      'x-content-type-options',
      'x-frame-options'
    ];
    
    securityHeaders.forEach(header => {
      if (serverTest.headers?.[header]) {
        log(`Security header ${header} present in response`, 'success');
      } else {
        log(`Security header ${header} missing in response`, 'warning');
      }
    });
  } else {
    log('Local server not responding (this is OK if not running)', 'warning');
  }
  
  // 10. Performance optimization checks
  log('Checking performance optimizations...', 'info');
  
  // Check for performance-related files
  checkFileExists('src/lib/cache/realTimeCacheManager.ts', 'Cache manager');
  checkFileExists('src/lib/realtime/connectionPoolManager.ts', 'Connection pool manager');
  checkFileExists('src/lib/performance/performanceOptimizationService.ts', 'Performance optimization service');
  
  // 11. Real-time features validation
  log('Validating real-time features...', 'info');
  checkFileExists('src/services/realTimeWebSocketServer.ts', 'WebSocket server');
  checkFileExists('start-realtime-server.js', 'Real-time server startup script');
  
  // 12. Component analysis
  log('Analyzing component structure...', 'info');
  
  try {
    const srcDir = path.join(process.cwd(), 'src');
    const componentsDir = path.join(srcDir, 'components');
    
    if (fs.existsSync(componentsDir)) {
      const componentFiles = execSync(`find ${componentsDir} -name "*.tsx" | wc -l`, { encoding: 'utf8' });
      const componentCount = parseInt(componentFiles.trim());
      
      if (componentCount > 300) {
        log(`Found ${componentCount} components - Excellent component coverage`, 'success');
      } else if (componentCount > 100) {
        log(`Found ${componentCount} components - Good component coverage`, 'success');
      } else {
        log(`Found ${componentCount} components - Limited component coverage`, 'warning');
      }
    }
  } catch (error) {
    log('Could not analyze component structure', 'warning');
  }
  
  // 13. Route analysis
  log('Analyzing application routes...', 'info');
  
  try {
    const appDir = path.join(process.cwd(), 'src', 'app');
    if (fs.existsSync(appDir)) {
      const routeFiles = execSync(`find ${appDir} -name "page.tsx" | wc -l`, { encoding: 'utf8' });
      const routeCount = parseInt(routeFiles.trim());
      
      if (routeCount > 200) {
        log(`Found ${routeCount} routes - Comprehensive application`, 'success');
      } else if (routeCount > 50) {
        log(`Found ${routeCount} routes - Good route coverage`, 'success');
      } else {
        log(`Found ${routeCount} routes - Basic application`, 'warning');
      }
    }
  } catch (error) {
    log('Could not analyze route structure', 'warning');
  }
  
  // 14. Generate deployment readiness report
  log('Generating deployment readiness report...', 'info');
  
  const report = {
    timestamp: new Date().toISOString(),
    platform: 'PropIE Enterprise Platform',
    readinessScore: Math.round((results.passed / (results.passed + results.failed)) * 100),
    summary: {
      totalChecks: results.passed + results.failed + results.warnings,
      passed: results.passed,
      failed: results.failed,
      warnings: results.warnings
    },
    details: results.details,
    recommendations: []
  };
  
  // Add recommendations based on failures
  if (results.failed > 0) {
    report.recommendations.push('Fix all failed checks before deploying to production');
  }
  
  if (results.warnings > 5) {
    report.recommendations.push('Consider addressing warnings for optimal production performance');
  }
  
  if (report.readinessScore >= 90) {
    report.recommendations.push('Platform is ready for production deployment');
    report.deploymentRecommendation = 'PROCEED';
  } else if (report.readinessScore >= 75) {
    report.recommendations.push('Platform is mostly ready - address critical issues first');
    report.deploymentRecommendation = 'CAUTION';
  } else {
    report.recommendations.push('Platform needs significant work before production deployment');
    report.deploymentRecommendation = 'STOP';
  }
  
  // Save report
  fs.writeFileSync('production-readiness-report.json', JSON.stringify(report, null, 2));
  
  // Display summary
  console.log('\\n');
  console.log(`${colors.blue}${colors.bold}📊 Validation Summary${colors.reset}`);
  console.log('====================');
  console.log(`Readiness Score: ${report.readinessScore}%`);
  console.log(`Total Checks: ${report.summary.totalChecks}`);
  console.log(`${colors.green}Passed: ${report.summary.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${report.summary.failed}${colors.reset}`);
  console.log(`${colors.yellow}Warnings: ${report.summary.warnings}${colors.reset}`);
  console.log('\\n');
  
  // Deployment recommendation
  const recColor = report.deploymentRecommendation === 'PROCEED' ? colors.green : 
                   report.deploymentRecommendation === 'CAUTION' ? colors.yellow : colors.red;
  
  console.log(`${recColor}${colors.bold}Deployment Recommendation: ${report.deploymentRecommendation}${colors.reset}`);
  
  report.recommendations.forEach(rec => {
    console.log(`• ${rec}`);
  });
  
  console.log('\\n');
  console.log(`📄 Full report saved to: production-readiness-report.json`);
  
  return report.deploymentRecommendation === 'PROCEED';
}

// Run validation
validateProductionReadiness()
  .then(isReady => {
    if (isReady) {
      console.log(`${colors.green}🎉 Platform is ready for production deployment!${colors.reset}`);
      process.exit(0);
    } else {
      console.log(`${colors.red}🚫 Platform needs work before production deployment${colors.reset}`);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error(`${colors.red}❌ Validation failed: ${error.message}${colors.reset}`);
    process.exit(1);
  });