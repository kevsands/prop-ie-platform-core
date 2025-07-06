#!/usr/bin/env node

/**
 * Test Health Dashboard Generator
 * 
 * This script analyzes the test files in the project and generates a dashboard
 * showing the health status of tests across different modules. It includes:
 * 
 * - Pass/fail rates by module
 * - Coverage statistics
 * - Missing test files for components
 * - Last run timestamps
 * 
 * Run with: node scripts/test-health-dashboard.js
 * 
 * Options:
 *   --html     Generate HTML report (default)
 *   --json     Generate JSON report
 *   --csv      Generate CSV report
 *   --ci       CI mode (exit with error code on low health score)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

// Configuration
const config = {
  outputDir: './test-reports',
  moduleGroups: [
    { name: 'Core', pattern: 'src/lib/**/*.{ts,tsx}' },
    { name: 'Components', pattern: 'src/components/**/*.{ts,tsx}' },
    { name: 'Hooks', pattern: 'src/hooks/**/*.{ts,tsx}' },
    { name: 'Context', pattern: 'src/context/**/*.{ts,tsx}' },
    { name: 'Utils', pattern: 'src/utils/**/*.{ts,tsx}' },
    { name: 'API', pattern: 'src/api/**/*.{ts,tsx}' },
  ],
  thresholds: {
    critical: { testRatio: 0.3, passRate: 0.5, coverage: 10 },
    warning: { testRatio: 0.5, passRate: 0.7, coverage: 30 },
    healthy: { testRatio: 0.7, passRate: 0.9, coverage: 50 },
  }
};

// Parse arguments
const args = process.argv.slice(2);
const outputFormats = {
  html: args.includes('--html') || (!args.includes('--json') && !args.includes('--csv')),
  json: args.includes('--json'),
  csv: args.includes('--csv'),
};
const ciMode = args.includes('--ci');

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Data structures
const moduleStats = {};
const summaryStats = {
  totalFiles: 0,
  testedFiles: 0,
  passingTests: 0,
  failingTests: 0,
  testRatio: 0,
  passRate: 0,
  overallHealth: 'unknown',
  timestamp: new Date().toISOString(),
};

// Helper functions
function getFileCount(pattern) {
  try {
    const result = execSync(`find . -path "./${pattern}" | wc -l`, { encoding: 'utf8' });
    return parseInt(result.trim(), 10);
  } catch (error) {
    console.error(`Error counting files for pattern ${pattern}:`, error);
    return 0;
  }
}

function getTestFileCount(modulePattern) {
  // Modify the pattern to find test files for the module
  const pattern = modulePattern
    .replace(/\{ts,tsx\}$/, '{test,spec}.{ts,tsx}')
    .replace(/\/\*\*\//, '/**/__tests__/**/');
  return getFileCount(pattern);
}

function findImplementationFiles(modulePattern) {
  try {
    const result = execSync(`find . -path "./${modulePattern}" -not -path "**/__tests__/**" -not -path "**/node_modules/**" -not -path "**/*.test.*" -not -path "**/*.spec.*"`, 
      { encoding: 'utf8' });
    return result.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error(`Error finding implementation files for pattern ${modulePattern}:`, error);
    return [];
  }
}

function getPassingTestsRatio(modulePattern) {
  try {
    // Adapt the pattern for test files
    const testPattern = modulePattern
      .replace(/\{ts,tsx\}$/, '{test,spec}.{ts,tsx}')
      .replace(/\/\*\*\//, '/**/__tests__/**/');
    
    // Run tests for the module pattern with --json flag to get results in JSON format
    // We run with --bail 0 to not stop on first failure
    const jestCommand = `npx jest --testPathPattern="${testPattern}" --json --bail 0 --silent`;
    
    // This is a simplified approach - in a real environment you'd want to cache these results
    // as running tests for each module can be time-consuming
    console.log(`Running tests for ${modulePattern}...`);
    const result = execSync(jestCommand, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    
    const testResults = JSON.parse(result).testResults;
    const numPassingTests = testResults.reduce((sum, file) => {
      return sum + file.numPassingTests;
    }, 0);
    const numFailingTests = testResults.reduce((sum, file) => {
      return sum + file.numFailingTests;
    }, 0);
    
    return {
      passingTests: numPassingTests,
      failingTests: numFailingTests,
      passRate: numPassingTests / (numPassingTests + numFailingTests || 1)
    };
  } catch (error) {
    // If tests fail to run, we consider them failing
    return {
      passingTests: 0,
      failingTests: 1, 
      passRate: 0
    };
  }
}

function getModuleCoverage(modulePattern) {
  try {
    // This would ideally use a coverage report, but for simplicity,
    // we'll just estimate based on statements coverage if available
    // In a real setup, you'd parse the coverage.json file
    return {
      statements: Math.floor(Math.random() * 100), // Placeholder
      branches: Math.floor(Math.random() * 100),   // Placeholder
      functions: Math.floor(Math.random() * 100),  // Placeholder
      lines: Math.floor(Math.random() * 100),      // Placeholder
    };
  } catch (error) {
    return {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    };
  }
}

function determineHealthStatus(stats) {
  const { testRatio, passRate, coverage } = stats;
  
  if (
    testRatio >= config.thresholds.healthy.testRatio &&
    passRate >= config.thresholds.healthy.passRate &&
    coverage.statements >= config.thresholds.healthy.coverage
  ) {
    return 'healthy';
  } else if (
    testRatio >= config.thresholds.warning.testRatio &&
    passRate >= config.thresholds.warning.passRate &&
    coverage.statements >= config.thresholds.warning.coverage
  ) {
    return 'warning';
  } else if (
    testRatio >= config.thresholds.critical.testRatio &&
    passRate >= config.thresholds.critical.passRate &&
    coverage.statements >= config.thresholds.critical.coverage
  ) {
    return 'critical';
  } else {
    return 'failing';
  }
}

function findMissingTests(moduleGroup) {
  const implementationFiles = findImplementationFiles(moduleGroup.pattern);
  const missingTests = [];
  
  for (const file of implementationFiles) {
    // Check if there's a corresponding test file
    const baseName = path.basename(file, path.extname(file));
    const dirName = path.dirname(file);
    
    // Check for test files in __tests__ directory with same name
    const testPath1 = path.join(dirName, '__tests__', baseName + '.test' + path.extname(file));
    const testPath2 = path.join(dirName, '__tests__', baseName + '.spec' + path.extname(file));
    
    // Check for test files next to the implementation
    const testPath3 = path.join(dirName, baseName + '.test' + path.extname(file));
    const testPath4 = path.join(dirName, baseName + '.spec' + path.extname(file));
    
    // Also check in project root __tests__ directory
    const relativePath = path.relative('./src', dirName);
    const testPath5 = path.join('./__tests__', relativePath, baseName + '.test' + path.extname(file));
    
    if (
      !fs.existsSync(testPath1) && 
      !fs.existsSync(testPath2) && 
      !fs.existsSync(testPath3) && 
      !fs.existsSync(testPath4) &&
      !fs.existsSync(testPath5)
    ) {
      missingTests.push(file);
    }
  }
  
  return missingTests;
}

// Generate stats for each module group
for (const moduleGroup of config.moduleGroups) {
  console.log(chalk.blue(`Processing ${moduleGroup.name}...`));
  
  const fileCount = getFileCount(moduleGroup.pattern.replace(/\{ts,tsx\}$/, '{ts,tsx}'));
  const testFileCount = getTestFileCount(moduleGroup.pattern);
  const testResults = getPassingTestsRatio(moduleGroup.pattern);
  const coverageStats = getModuleCoverage(moduleGroup.pattern);
  const missingTests = findMissingTests(moduleGroup);
  
  const testRatio = testFileCount / (fileCount || 1);
  
  const moduleHealth = determineHealthStatus({
    testRatio,
    passRate: testResults.passRate,
    coverage: coverageStats
  });
  
  moduleStats[moduleGroup.name] = {
    fileCount,
    testFileCount,
    testRatio,
    passingTests: testResults.passingTests,
    failingTests: testResults.failingTests,
    passRate: testResults.passRate,
    coverage: coverageStats,
    health: moduleHealth,
    missingTests,
  };
  
  // Update summary stats
  summaryStats.totalFiles += fileCount;
  summaryStats.testedFiles += testFileCount;
  summaryStats.passingTests += testResults.passingTests;
  summaryStats.failingTests += testResults.failingTests;
}

// Calculate summary ratios
summaryStats.testRatio = summaryStats.testedFiles / (summaryStats.totalFiles || 1);
summaryStats.passRate = summaryStats.passingTests / 
  (summaryStats.passingTests + summaryStats.failingTests || 1);

// Determine overall health
summaryStats.overallHealth = determineHealthStatus({
  testRatio: summaryStats.testRatio,
  passRate: summaryStats.passRate,
  coverage: { statements: 20 } // Placeholder
});

// Generate reports
function generateJsonReport() {
  const report = {
    summary: summaryStats,
    modules: moduleStats,
  };
  
  fs.writeFileSync(
    path.join(config.outputDir, 'test-health.json'),
    JSON.stringify(report, null, 2)
  );
  console.log(chalk.green('JSON report generated.'));
}

function generateCsvReport() {
  let csv = 'Module,Files,Test Files,Test Ratio,Passing Tests,Failing Tests,Pass Rate,Coverage,Health\n';
  
  // Add row for each module
  Object.entries(moduleStats).forEach(([name, stats]) => {
    csv += `${name},${stats.fileCount},${stats.testFileCount},${stats.testRatio.toFixed(2)},` +
      `${stats.passingTests},${stats.failingTests},${stats.passRate.toFixed(2)},` +
      `${stats.coverage.statements}%,${stats.health}\n`;
  });
  
  // Add summary row
  csv += `OVERALL,${summaryStats.totalFiles},${summaryStats.testedFiles},` +
    `${summaryStats.testRatio.toFixed(2)},${summaryStats.passingTests},` +
    `${summaryStats.failingTests},${summaryStats.passRate.toFixed(2)},` +
    `20%,${summaryStats.overallHealth}\n`;
  
  fs.writeFileSync(
    path.join(config.outputDir, 'test-health.csv'),
    csv
  );
  console.log(chalk.green('CSV report generated.'));
}

function generateHtmlReport() {
  // Create a simple HTML dashboard with basic styling
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Health Dashboard</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
      line-height: 1.5;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }
    h1, h2, h3 {
      margin-top: 2rem;
    }
    .summary {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .summary-card {
      background-color: #f5f5f5;
      padding: 1rem;
      border-radius: 0.5rem;
      min-width: 200px;
      flex: 1;
    }
    .summary-card h3 {
      margin-top: 0;
    }
    .health-indicator {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      margin-right: 0.5rem;
    }
    .health-healthy {
      background-color: #4caf50;
    }
    .health-warning {
      background-color: #ff9800;
    }
    .health-critical {
      background-color: #f44336;
    }
    .health-failing {
      background-color: #9e9e9e;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 2rem;
    }
    th, td {
      padding: 0.75rem;
      border-bottom: 1px solid #ddd;
      text-align: left;
    }
    th {
      background-color: #f5f5f5;
    }
    tr:hover {
      background-color: #f9f9f9;
    }
    .missing-tests {
      margin-top: 2rem;
    }
    .missing-test {
      padding: 0.5rem;
      background-color: #ffebee;
      margin-bottom: 0.5rem;
      border-radius: 0.25rem;
      font-family: monospace;
    }
    .progress-bar {
      height: 8px;
      background-color: #e0e0e0;
      border-radius: 4px;
      margin-top: 0.25rem;
    }
    .progress-value {
      height: 100%;
      border-radius: 4px;
    }
    .timestamp {
      color: #757575;
      font-size: 0.875rem;
      margin-top: 3rem;
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>Test Health Dashboard</h1>

  <div class="summary">
    <div class="summary-card">
      <h3>Overall Health</h3>
      <div>
        <span class="health-indicator health-${summaryStats.overallHealth}"></span>
        ${summaryStats.overallHealth.toUpperCase()}
      </div>
    </div>
    <div class="summary-card">
      <h3>Test Coverage</h3>
      <div>${summaryStats.testedFiles} / ${summaryStats.totalFiles} files (${(summaryStats.testRatio * 100).toFixed(1)}%)</div>
      <div class="progress-bar">
        <div class="progress-value" style="width: ${(summaryStats.testRatio * 100).toFixed(1)}%; background-color: ${
          summaryStats.testRatio >= 0.7 ? '#4caf50' : 
          summaryStats.testRatio >= 0.5 ? '#ff9800' : '#f44336'
        };"></div>
      </div>
    </div>
    <div class="summary-card">
      <h3>Pass Rate</h3>
      <div>${summaryStats.passingTests} / ${summaryStats.passingTests + summaryStats.failingTests} tests (${(summaryStats.passRate * 100).toFixed(1)}%)</div>
      <div class="progress-bar">
        <div class="progress-value" style="width: ${(summaryStats.passRate * 100).toFixed(1)}%; background-color: ${
          summaryStats.passRate >= 0.9 ? '#4caf50' : 
          summaryStats.passRate >= 0.7 ? '#ff9800' : '#f44336'
        };"></div>
      </div>
    </div>
  </div>

  <h2>Module Health</h2>
  <table>
    <thead>
      <tr>
        <th>Module</th>
        <th>Health</th>
        <th>Files</th>
        <th>Test Files</th>
        <th>Test Ratio</th>
        <th>Passing</th>
        <th>Failing</th>
        <th>Pass Rate</th>
        <th>Coverage</th>
      </tr>
    </thead>
    <tbody>
`;

  // Add row for each module
  Object.entries(moduleStats).forEach(([name, stats]) => {
    html += `
      <tr>
        <td>${name}</td>
        <td><span class="health-indicator health-${stats.health}"></span>${stats.health.toUpperCase()}</td>
        <td>${stats.fileCount}</td>
        <td>${stats.testFileCount}</td>
        <td>${(stats.testRatio * 100).toFixed(1)}%</td>
        <td>${stats.passingTests}</td>
        <td>${stats.failingTests}</td>
        <td>${(stats.passRate * 100).toFixed(1)}%</td>
        <td>${stats.coverage.statements}%</td>
      </tr>
    `;
  });

  html += `
    </tbody>
  </table>

  <h2>Missing Tests</h2>
`;

  // Add missing tests for each module
  Object.entries(moduleStats).forEach(([name, stats]) => {
    if (stats.missingTests.length > 0) {
      html += `
        <h3>${name} (${stats.missingTests.length} missing)</h3>
        <div class="missing-tests">
      `;
      
      stats.missingTests.slice(0, 10).forEach(file => {
        html += `<div class="missing-test">${file}</div>`;
      });
      
      if (stats.missingTests.length > 10) {
        html += `<div>...and ${stats.missingTests.length - 10} more</div>`;
      }
      
      html += `</div>`;
    }
  });

  html += `
  <div class="timestamp">
    Generated on ${new Date(summaryStats.timestamp).toLocaleString()}
  </div>
</body>
</html>
  `;

  fs.writeFileSync(
    path.join(config.outputDir, 'test-health.html'),
    html
  );
  console.log(chalk.green('HTML report generated.'));
}

// Generate requested reports
if (outputFormats.json) {
  generateJsonReport();
}

if (outputFormats.csv) {
  generateCsvReport();
}

if (outputFormats.html) {
  generateHtmlReport();
}

// Print summary to console
console.log('\n' + chalk.bold('Test Health Summary:'));
console.log(`Overall health: ${chalk.keyword(
  summaryStats.overallHealth === 'healthy' ? 'green' :
  summaryStats.overallHealth === 'warning' ? 'yellow' :
  summaryStats.overallHealth === 'critical' ? 'red' : 'grey'
)(summaryStats.overallHealth.toUpperCase())}`);

console.log(`Files with tests: ${summaryStats.testedFiles}/${summaryStats.totalFiles} (${(summaryStats.testRatio * 100).toFixed(1)}%)`);
console.log(`Passing tests: ${summaryStats.passingTests}/${summaryStats.passingTests + summaryStats.failingTests} (${(summaryStats.passRate * 100).toFixed(1)}%)`);

console.log('\nModule breakdown:');
Object.entries(moduleStats).forEach(([name, stats]) => {
  console.log(`${name}: ${chalk.keyword(
    stats.health === 'healthy' ? 'green' :
    stats.health === 'warning' ? 'yellow' :
    stats.health === 'critical' ? 'red' : 'grey'
  )(stats.health.toUpperCase())} - ${stats.testFileCount}/${stats.fileCount} files tested, ${stats.passingTests}/${stats.passingTests + stats.failingTests} tests passing`);
});

console.log(`\nReports available in: ${path.resolve(config.outputDir)}`);

// Exit with error code in CI mode if health is critical or failing
if (ciMode && ['critical', 'failing'].includes(summaryStats.overallHealth)) {
  console.error(chalk.red('Test health below acceptable threshold for CI.'));
  process.exit(1);
}