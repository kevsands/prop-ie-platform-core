#!/usr/bin/env node

/**
 * Test Coverage Report Generator
 * 
 * This script generates enhanced test coverage reports and visualizations.
 * It processes the Jest coverage output to create:
 * 1. Detailed HTML reports with source code highlighting
 * 2. Coverage trend analysis over time
 * 3. Coverage badge generation for documentation
 * 4. Component-level coverage breakdown
 * 5. Module-level coverage breakdown
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Configuration
const CONFIG = {
  coveragePath: path.join(__dirname, '..', 'coverage'),
  reportDir: path.join(__dirname, '..', 'coverage-report'),
  historyFile: path.join(__dirname, '..', 'coverage-history.json'),
  badgesDir: path.join(__dirname, '..', 'coverage-badges'),
  thresholds: {
    green: 80,
    yellow: 60,
    red: 0
  }
};

// Ensure directories exist
function ensureDirectories() {
  [CONFIG.reportDir, CONFIG.badgesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
}

// Run Jest tests with coverage
function runTestsWithCoverage() {
  console.log('Running tests with coverage...');
  
  try {
    execSync('npx jest --coverage', { stdio: 'inherit' });
    console.log('Tests completed successfully.');
    return true;
  } catch (error) {
    console.error('Error running tests:', error.message);
    return false;
  }
}

// Parse coverage summary from coverage-summary.json
function parseCoverageSummary() {
  const summaryPath = path.join(CONFIG.coveragePath, 'coverage-summary.json');
  
  if (!fs.existsSync(summaryPath)) {
    console.error(`Coverage summary not found at ${summaryPath}`);
    console.error('Make sure tests are run with coverage enabled.');
    return null;
  }
  
  try {
    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
    return summary;
  } catch (error) {
    console.error('Error parsing coverage summary:', error.message);
    return null;
  }
}

// Generate HTML summary report
function generateHtmlSummary(summary) {
  if (!summary) return;
  
  const totalCoverage = summary.total;
  const date = new Date().toISOString().split('T')[0];
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Coverage Report - ${date}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3 {
      color: #0066cc;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .metric-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .metric-title {
      font-size: 1.2em;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .metric-value {
      font-size: 2em;
      font-weight: bold;
    }
    .high {
      color: #2ecc71;
    }
    .medium {
      color: #f39c12;
    }
    .low {
      color: #e74c3c;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #f8f9fa;
    }
    tr:nth-child(even) {
      background-color: #f8f8f8;
    }
    .progress-bar {
      height: 10px;
      background-color: #ecf0f1;
      border-radius: 5px;
      overflow: hidden;
      margin-top: 5px;
    }
    .progress-fill {
      height: 100%;
      border-radius: 5px;
    }
    a {
      color: #0066cc;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .date {
      color: #7f8c8d;
      font-size: 0.9em;
      margin-bottom: 20px;
    }
    .badge {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      font-size: 0.8em;
      margin-right: 5px;
    }
  </style>
</head>
<body>
  <h1>Test Coverage Report</h1>
  <div class="date">Generated on ${new Date().toLocaleString()}</div>
  
  <div class="summary">
    <div class="metric-card">
      <div class="metric-title">Statement Coverage</div>
      <div class="metric-value ${getCoverageClass(totalCoverage.statements.pct)}">
        ${totalCoverage.statements.pct}%
      </div>
      <div class="progress-bar">
        <div class="progress-fill" 
             style="width: ${totalCoverage.statements.pct}%; 
                    background-color: ${getCoverageColor(totalCoverage.statements.pct)};">
        </div>
      </div>
      <div>${totalCoverage.statements.covered}/${totalCoverage.statements.total} statements covered</div>
    </div>
    
    <div class="metric-card">
      <div class="metric-title">Branch Coverage</div>
      <div class="metric-value ${getCoverageClass(totalCoverage.branches.pct)}">
        ${totalCoverage.branches.pct}%
      </div>
      <div class="progress-bar">
        <div class="progress-fill" 
             style="width: ${totalCoverage.branches.pct}%; 
                    background-color: ${getCoverageColor(totalCoverage.branches.pct)};">
        </div>
      </div>
      <div>${totalCoverage.branches.covered}/${totalCoverage.branches.total} branches covered</div>
    </div>
    
    <div class="metric-card">
      <div class="metric-title">Function Coverage</div>
      <div class="metric-value ${getCoverageClass(totalCoverage.functions.pct)}">
        ${totalCoverage.functions.pct}%
      </div>
      <div class="progress-bar">
        <div class="progress-fill" 
             style="width: ${totalCoverage.functions.pct}%; 
                    background-color: ${getCoverageColor(totalCoverage.functions.pct)};">
        </div>
      </div>
      <div>${totalCoverage.functions.covered}/${totalCoverage.functions.total} functions covered</div>
    </div>
    
    <div class="metric-card">
      <div class="metric-title">Line Coverage</div>
      <div class="metric-value ${getCoverageClass(totalCoverage.lines.pct)}">
        ${totalCoverage.lines.pct}%
      </div>
      <div class="progress-bar">
        <div class="progress-fill" 
             style="width: ${totalCoverage.lines.pct}%; 
                    background-color: ${getCoverageColor(totalCoverage.lines.pct)};">
        </div>
      </div>
      <div>${totalCoverage.lines.covered}/${totalCoverage.lines.total} lines covered</div>
    </div>
  </div>
  
  <h2>Module Coverage</h2>
  <table>
    <thead>
      <tr>
        <th>Module</th>
        <th>Statements</th>
        <th>Branches</th>
        <th>Functions</th>
        <th>Lines</th>
      </tr>
    </thead>
    <tbody>
      ${generateModuleRows(summary)}
    </tbody>
  </table>
  
  <h2>Coverage Trends</h2>
  <p>View the detailed HTML coverage report <a href="../coverage/lcov-report/index.html">here</a>.</p>
  
  <h2>Test Performance Summary</h2>
  <p>This section will display performance metrics from test runs when available.</p>
</body>
</html>
`;

  const outputPath = path.join(CONFIG.reportDir, 'index.html');
  fs.writeFileSync(outputPath, html);
  console.log(`HTML summary report generated at ${outputPath}`);
}

// Get coverage class (high, medium, low) based on percentage
function getCoverageClass(percentage) {
  if (percentage >= CONFIG.thresholds.green) return 'high';
  if (percentage >= CONFIG.thresholds.yellow) return 'medium';
  return 'low';
}

// Get coverage color based on percentage
function getCoverageColor(percentage) {
  if (percentage >= CONFIG.thresholds.green) return '#2ecc71';
  if (percentage >= CONFIG.thresholds.yellow) return '#f39c12';
  return '#e74c3c';
}

// Generate table rows for module coverage
function generateModuleRows(summary) {
  let rows = '';
  
  for (const [filePath, coverage] of Object.entries(summary)) {
    if (filePath === 'total') continue;
    
    // Skip files with no statements (like .d.ts files)
    if (coverage.statements.total === 0) continue;
    
    // Create a more readable path for display
    const displayPath = filePath.replace(/^\/Users\/.*\/prop-ie-aws-app\//, '');
    
    rows += `
      <tr>
        <td>${displayPath}</td>
        <td>
          <div class="${getCoverageClass(coverage.statements.pct)}">${coverage.statements.pct}%</div>
          <div class="progress-bar">
            <div class="progress-fill" 
                 style="width: ${coverage.statements.pct}%; 
                        background-color: ${getCoverageColor(coverage.statements.pct)};">
            </div>
          </div>
        </td>
        <td>
          <div class="${getCoverageClass(coverage.branches.pct)}">${coverage.branches.pct}%</div>
          <div class="progress-bar">
            <div class="progress-fill" 
                 style="width: ${coverage.branches.pct}%; 
                        background-color: ${getCoverageColor(coverage.branches.pct)};">
            </div>
          </div>
        </td>
        <td>
          <div class="${getCoverageClass(coverage.functions.pct)}">${coverage.functions.pct}%</div>
          <div class="progress-bar">
            <div class="progress-fill" 
                 style="width: ${coverage.functions.pct}%; 
                        background-color: ${getCoverageColor(coverage.functions.pct)};">
            </div>
          </div>
        </td>
        <td>
          <div class="${getCoverageClass(coverage.lines.pct)}">${coverage.lines.pct}%</div>
          <div class="progress-bar">
            <div class="progress-fill" 
                 style="width: ${coverage.lines.pct}%; 
                        background-color: ${getCoverageColor(coverage.lines.pct)};">
            </div>
          </div>
        </td>
      </tr>
    `;
  }
  
  return rows;
}

// Update coverage history
function updateCoverageHistory(summary) {
  if (!summary) return;
  
  // Load existing history or create new
  let history = [];
  if (fs.existsSync(CONFIG.historyFile)) {
    try {
      history = JSON.parse(fs.readFileSync(CONFIG.historyFile, 'utf8'));
    } catch (error) {
      console.error('Error reading coverage history file:', error.message);
    }
  }
  
  // Add new entry with date and coverage metrics
  const newEntry = {
    date: new Date().toISOString(),
    coverage: {
      statements: summary.total.statements.pct,
      branches: summary.total.branches.pct,
      functions: summary.total.functions.pct,
      lines: summary.total.lines.pct
    }
  };
  
  // Limit history to last 30 entries
  history.push(newEntry);
  if (history.length > 30) {
    history = history.slice(history.length - 30);
  }
  
  // Save updated history
  fs.writeFileSync(CONFIG.historyFile, JSON.stringify(history, null, 2));
  console.log('Coverage history updated.');
}

// Generate coverage badges
function generateCoverageBadges(summary) {
  if (!summary) return;
  
  const coverageTypes = {
    statements: summary.total.statements.pct,
    branches: summary.total.branches.pct,
    functions: summary.total.functions.pct,
    lines: summary.total.lines.pct
  };
  
  for (const [type, value] of Object.entries(coverageTypes)) {
    const color = getCoverageColor(value).replace('#', '');
    const badgeUrl = `https://img.shields.io/badge/coverage%3A%20${type}-${value}%25-${color}`;
    
    // Download badge image
    try {
      const outputPath = path.join(CONFIG.badgesDir, `coverage-${type}.svg`);
      execSync(`curl -s "${badgeUrl}" -o "${outputPath}"`);
      console.log(`Coverage badge for ${type} generated at ${outputPath}`);
    } catch (error) {
      console.error(`Error generating badge for ${type}:`, error.message);
    }
  }
}

// Main function
async function main() {
  console.log('Test Coverage Report Generator');
  console.log('==============================');
  
  // Ensure required directories exist
  ensureDirectories();
  
  // Ask user if they want to run tests or use existing coverage
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const useExisting = await new Promise(resolve => {
    if (!fs.existsSync(path.join(CONFIG.coveragePath, 'coverage-summary.json'))) {
      console.log('No existing coverage data found. Running tests...');
      resolve(false);
      return;
    }
    
    rl.question('Use existing coverage data? (y/n) ', answer => {
      resolve(answer.toLowerCase() === 'y');
    });
  });
  
  rl.close();
  
  // Run tests if needed
  if (!useExisting) {
    const success = runTestsWithCoverage();
    if (!success) process.exit(1);
  }
  
  // Parse coverage summary
  const summary = parseCoverageSummary();
  if (!summary) process.exit(1);
  
  // Generate HTML summary report
  generateHtmlSummary(summary);
  
  // Update coverage history
  updateCoverageHistory(summary);
  
  // Generate coverage badges
  generateCoverageBadges(summary);
  
  console.log('Coverage report generation completed successfully.');
  console.log(`Open ${path.join(CONFIG.reportDir, 'index.html')} to view the report.`);
}

// Run the main function
main().catch(error => {
  console.error('Error generating coverage report:', error);
  process.exit(1);
});