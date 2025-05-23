#!/usr/bin/env node

/**
 * Generate comprehensive test coverage dashboard
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Coverage thresholds
const COVERAGE_THRESHOLDS = {
  statements: 80,
  branches: 75,
  functions: 80,
  lines: 80,
};

// Critical paths that need higher coverage
const CRITICAL_PATHS = {
  'src/app/api/auth': 90,
  'src/app/api/transactions': 85,
  'src/components/auth': 85,
  'src/features/transactions': 85,
  'src/lib/security': 90,
};

// Generate coverage data
function generateCoverageData() {
  console.log('🧪 Running tests with coverage...');
  
  try {
    execSync('npm test -- --coverage --coverageReporters=json-summary --coverageReporters=lcov', {
      stdio: 'inherit',
    });
  } catch (error) {
    console.log('Some tests failed, but continuing with coverage report...');
  }
  
  // Read coverage summary
  const coverageSummary = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../coverage/coverage-summary.json'), 'utf8')
  );
  
  return coverageSummary;
}

// Analyze coverage by module
function analyzeCoverage(coverageData) {
  const analysis = {
    overall: coverageData.total,
    byModule: {},
    criticalPaths: {},
    uncoveredFiles: [],
    suggestions: [],
  };
  
  // Analyze each file
  Object.entries(coverageData).forEach(([filePath, coverage]) => {
    if (filePath === 'total') return;
    
    // Group by module
    const module = getModuleName(filePath);
    if (!analysis.byModule[module]) {
      analysis.byModule[module] = {
        files: 0,
        statements: { total: 0, covered: 0 },
        branches: { total: 0, covered: 0 },
        functions: { total: 0, covered: 0 },
        lines: { total: 0, covered: 0 },
      };
    }
    
    const moduleData = analysis.byModule[module];
    moduleData.files++;
    
    ['statements', 'branches', 'functions', 'lines'].forEach(metric => {
      moduleData[metric].total += coverage[metric].total;
      moduleData[metric].covered += coverage[metric].covered;
    });
    
    // Check critical paths
    Object.entries(CRITICAL_PATHS).forEach(([criticalPath, threshold]) => {
      if (filePath.includes(criticalPath)) {
        const coveragePercent = coverage.lines.pct;
        analysis.criticalPaths[filePath] = {
          coverage: coveragePercent,
          threshold,
          passed: coveragePercent >= threshold,
        };
      }
    });
    
    // Find uncovered files
    if (coverage.lines.pct < 50) {
      analysis.uncoveredFiles.push({
        path: filePath,
        coverage: coverage.lines.pct,
        uncoveredLines: coverage.lines.total - coverage.lines.covered,
      });
    }
  });
  
  // Calculate module percentages
  Object.values(analysis.byModule).forEach(module => {
    ['statements', 'branches', 'functions', 'lines'].forEach(metric => {
      module[metric].pct = module[metric].total > 0
        ? (module[metric].covered / module[metric].total) * 100
        : 100;
    });
  });
  
  // Generate suggestions
  analysis.suggestions = generateSuggestions(analysis);
  
  return analysis;
}

// Get module name from file path
function getModuleName(filePath) {
  const parts = filePath.split('/');
  
  if (filePath.includes('/app/api/')) return 'API Routes';
  if (filePath.includes('/components/')) return 'Components';
  if (filePath.includes('/features/')) return 'Features';
  if (filePath.includes('/hooks/')) return 'Hooks';
  if (filePath.includes('/lib/')) return 'Libraries';
  if (filePath.includes('/services/')) return 'Services';
  if (filePath.includes('/utils/')) return 'Utilities';
  
  return 'Other';
}

// Generate improvement suggestions
function generateSuggestions(analysis) {
  const suggestions = [];
  
  // Overall coverage suggestions
  ['statements', 'branches', 'functions', 'lines'].forEach(metric => {
    const coverage = analysis.overall[metric].pct;
    const threshold = COVERAGE_THRESHOLDS[metric];
    
    if (coverage < threshold) {
      suggestions.push({
        type: 'overall',
        metric,
        current: coverage,
        target: threshold,
        priority: 'high',
        message: `Increase ${metric} coverage from ${coverage.toFixed(1)}% to ${threshold}%`,
      });
    }
  });
  
  // Critical path suggestions
  Object.entries(analysis.criticalPaths).forEach(([path, data]) => {
    if (!data.passed) {
      suggestions.push({
        type: 'critical',
        path,
        current: data.coverage,
        target: data.threshold,
        priority: 'critical',
        message: `Critical path ${path} needs ${data.threshold - data.coverage}% more coverage`,
      });
    }
  });
  
  // Module suggestions
  Object.entries(analysis.byModule).forEach(([module, data]) => {
    if (data.lines.pct < 70) {
      suggestions.push({
        type: 'module',
        module,
        current: data.lines.pct,
        target: 80,
        priority: 'medium',
        message: `Module "${module}" has low coverage (${data.lines.pct.toFixed(1)}%)`,
      });
    }
  });
  
  // Uncovered file suggestions
  analysis.uncoveredFiles
    .sort((a, b) => a.coverage - b.coverage)
    .slice(0, 10)
    .forEach(file => {
      suggestions.push({
        type: 'file',
        path: file.path,
        current: file.coverage,
        uncoveredLines: file.uncoveredLines,
        priority: 'medium',
        message: `File ${file.path} has only ${file.coverage.toFixed(1)}% coverage`,
      });
    });
  
  return suggestions.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

// Generate HTML dashboard
function generateHTMLDashboard(analysis) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Coverage Dashboard - Prop.ie AWS App</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-gray-100">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Test Coverage Dashboard</h1>
    
    <!-- Overall Coverage -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Overall Coverage</h2>
      <div class="grid grid-cols-4 gap-4">
        ${['statements', 'branches', 'functions', 'lines'].map(metric => `
          <div class="text-center">
            <div class="relative inline-flex">
              <svg class="w-20 h-20">
                <circle cx="40" cy="40" r="35" stroke="#e5e7eb" stroke-width="3" fill="none" />
                <circle cx="40" cy="40" r="35" 
                  stroke="${getCoverageColor(analysis.overall[metric].pct)}"
                  stroke-width="3" fill="none"
                  stroke-dasharray="${2 * Math.PI * 35}"
                  stroke-dashoffset="${2 * Math.PI * 35 * (1 - analysis.overall[metric].pct / 100)}"
                  transform="rotate(-90 40 40)" />
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-lg font-semibold">
                ${analysis.overall[metric].pct.toFixed(0)}%
              </span>
            </div>
            <p class="mt-2 text-sm text-gray-600 capitalize">${metric}</p>
            <p class="text-xs text-gray-500">
              ${analysis.overall[metric].covered}/${analysis.overall[metric].total}
            </p>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- Module Coverage -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Coverage by Module</h2>
      <div class="space-y-4">
        ${Object.entries(analysis.byModule).map(([module, data]) => `
          <div class="border-b pb-4">
            <h3 class="font-medium mb-2">${module} (${data.files} files)</h3>
            <div class="grid grid-cols-4 gap-2">
              ${['statements', 'branches', 'functions', 'lines'].map(metric => `
                <div class="flex items-center">
                  <span class="text-xs text-gray-600 w-20">${metric}:</span>
                  <div class="flex-1 bg-gray-200 rounded-full h-2 relative">
                    <div class="absolute top-0 left-0 h-full rounded-full ${
                      data[metric].pct >= COVERAGE_THRESHOLDS[metric] ? 'bg-green-500' : 'bg-red-500'
                    }" style="width: ${data[metric].pct}%"></div>
                  </div>
                  <span class="text-xs ml-2 w-12 text-right">${data[metric].pct.toFixed(0)}%</span>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- Critical Paths -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 class="text-xl font-semibold mb-4">Critical Path Coverage</h2>
      <div class="space-y-2">
        ${Object.entries(analysis.criticalPaths).map(([path, data]) => `
          <div class="flex items-center justify-between p-3 rounded ${
            data.passed ? 'bg-green-50' : 'bg-red-50'
          }">
            <span class="text-sm">${path}</span>
            <div class="flex items-center">
              <span class="text-sm font-medium mr-2">${data.coverage.toFixed(1)}%</span>
              <span class="text-xs text-gray-600">(target: ${data.threshold}%)</span>
              ${data.passed 
                ? '<svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>'
                : '<svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>'
              }
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <!-- Improvement Suggestions -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Improvement Suggestions</h2>
      <div class="space-y-3">
        ${analysis.suggestions.slice(0, 10).map(suggestion => `
          <div class="p-3 rounded ${getPriorityColor(suggestion.priority)}">
            <div class="flex items-center justify-between">
              <span class="text-sm">${suggestion.message}</span>
              <span class="text-xs px-2 py-1 rounded ${getPriorityBadgeColor(suggestion.priority)}">
                ${suggestion.priority}
              </span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>
  
  <script>
    // Add interactive charts here if needed
  </script>
</body>
</html>
  `;
  
  return html;
}

// Get color based on coverage percentage
function getCoverageColor(percentage) {
  if (percentage >= 80) return '#10b981'; // green
  if (percentage >= 60) return '#f59e0b'; // yellow
  return '#ef4444'; // red
}

// Get priority color
function getPriorityColor(priority) {
  const colors = {
    critical: 'bg-red-100',
    high: 'bg-orange-100',
    medium: 'bg-yellow-100',
    low: 'bg-gray-100',
  };
  return colors[priority] || 'bg-gray-100';
}

// Get priority badge color
function getPriorityBadgeColor(priority) {
  const colors = {
    critical: 'bg-red-600 text-white',
    high: 'bg-orange-600 text-white',
    medium: 'bg-yellow-600 text-white',
    low: 'bg-gray-600 text-white',
  };
  return colors[priority] || 'bg-gray-600 text-white';
}

// Main execution
async function main() {
  try {
    console.log('📊 Generating test coverage dashboard...\n');
    
    // Generate coverage data
    const coverageData = generateCoverageData();
    
    // Analyze coverage
    const analysis = analyzeCoverage(coverageData);
    
    // Generate HTML dashboard
    const html = generateHTMLDashboard(analysis);
    
    // Save dashboard
    const dashboardPath = path.join(__dirname, '../coverage/dashboard.html');
    fs.writeFileSync(dashboardPath, html);
    
    // Save JSON report
    const jsonPath = path.join(__dirname, '../coverage/coverage-analysis.json');
    fs.writeFileSync(jsonPath, JSON.stringify(analysis, null, 2));
    
    // Print summary
    console.log('\n📈 Coverage Summary:');
    console.log(`   Statements: ${analysis.overall.statements.pct.toFixed(1)}%`);
    console.log(`   Branches:   ${analysis.overall.branches.pct.toFixed(1)}%`);
    console.log(`   Functions:  ${analysis.overall.functions.pct.toFixed(1)}%`);
    console.log(`   Lines:      ${analysis.overall.lines.pct.toFixed(1)}%`);
    
    console.log('\n🎯 Top Priority Improvements:');
    analysis.suggestions.slice(0, 5).forEach(suggestion => {
      console.log(`   [${suggestion.priority}] ${suggestion.message}`);
    });
    
    console.log(`\n✅ Dashboard generated: ${dashboardPath}`);
    console.log(`📄 JSON report saved: ${jsonPath}`);
    
    // Exit with error if coverage is below thresholds
    const failedThresholds = Object.entries(COVERAGE_THRESHOLDS).filter(
      ([metric, threshold]) => analysis.overall[metric].pct < threshold
    );
    
    if (failedThresholds.length > 0) {
      console.log('\n❌ Coverage thresholds not met:');
      failedThresholds.forEach(([metric, threshold]) => {
        console.log(`   ${metric}: ${analysis.overall[metric].pct.toFixed(1)}% < ${threshold}%`);
      });
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Error generating coverage dashboard:', error);
    process.exit(1);
  }
}

main();