#!/usr/bin/env node

/**
 * Test Coverage Dashboard Generator
 *
 * This script analyzes test coverage data from Jest and generates
 * an interactive dashboard to track coverage metrics over time.
 * 
 * Features:
 * - Parses Jest coverage data from coverage-final.json
 * - Generates module-level and file-level coverage metrics
 * - Creates historical coverage tracking by storing data
 * - Produces interactive HTML dashboard with charts and tables
 * - Identifies coverage trends over time
 * - Highlights priority areas for improvement
 * 
 * Usage: node scripts/coverage-dashboard.js [--save] [--output=path]
 *   --save    Save the current coverage data for historical tracking
 *   --output  Specify output directory (default: ./coverage-dashboard)
 */

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const shouldSave = args.includes('--save');
const outputDirArg = args.find(arg => arg.startsWith('--output='));
const outputDir = outputDirArg 
  ? outputDirArg.split('=')[1]
  : path.join(process.cwd(), 'coverage-dashboard');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// History data storage location
const historyDir = path.join(outputDir, 'history');
if (!fs.existsSync(historyDir)) {
  fs.mkdirSync(historyDir, { recursive: true });
}

// Paths
const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-final.json');
const historyDataPath = path.join(historyDir, 'coverage-history.json');

// Check if coverage data exists
if (!fs.existsSync(coveragePath)) {
  console.error('❌ Coverage data not found. Run tests with coverage first:');
  console.error('   npm test -- --coverage');
  process.exit(1);
}

// Load coverage data
console.log('📊 Loading coverage data...');
const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));

// Load history data if exists
let historyData = [];
if (fs.existsSync(historyDataPath)) {
  historyData = JSON.parse(fs.readFileSync(historyDataPath, 'utf8'));
}

// Get current git branch and commit info
function getGitInfo() {
  try {
    const branch = childProcess.execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    const commit = childProcess.execSync('git rev-parse --short HEAD').toString().trim();
    const commitDate = childProcess.execSync('git log -1 --format=%cd --date=short').toString().trim();
    const commitMsg = childProcess.execSync('git log -1 --pretty=%B').toString().trim().split('\n')[0];
    
    return {
      branch,
      commit,
      commitDate,
      commitMsg: commitMsg.length > 50 ? commitMsg.substring(0, 50) + '...' : commitMsg
    };
  } catch (error) {
    return {
      branch: 'unknown',
      commit: 'unknown',
      commitDate: new Date().toISOString().split('T')[0],
      commitMsg: 'unknown'
    };
  }
}

// Extract modules from file paths
function extractModule(filePath) {
  const parts = filePath.split(path.sep);
  // Look for src/, app/, components/, lib/ etc. and use the next folder
  const srcIndex = parts.findIndex(p => p === 'src' || p === 'app');
  
  if (srcIndex !== -1 && parts.length > srcIndex + 1) {
    return parts[srcIndex + 1];
  }
  return 'unknown';
}

// Calculate coverage metrics for a file
function calculateFileCoverage(fileData) {
  const { statementMap, s, functionMap, f, branchMap, b } = fileData;
  
  // Statement coverage
  const statements = Object.keys(statementMap).length;
  const coveredStatements = Object.values(s).filter(executed => executed > 0).length;
  
  // Function coverage
  const functions = Object.keys(functionMap).length;
  const coveredFunctions = Object.values(f).filter(executed => executed > 0).length;
  
  // Branch coverage
  const branches = Object.values(branchMap).reduce((total, branch) => total + branch.locations.length, 0);
  const coveredBranches = Object.entries(b).reduce((total, [key, counts]) => {
    return total + counts.filter(count => count > 0).length;
  }, 0);
  
  return {
    statements,
    coveredStatements,
    statementCoverage: statements ? (coveredStatements / statements) * 100 : 100,
    
    functions,
    coveredFunctions,
    functionCoverage: functions ? (coveredFunctions / functions) * 100 : 100,
    
    branches,
    coveredBranches,
    branchCoverage: branches ? (coveredBranches / branches) * 100 : 100,
    
    // Overall coverage (weighted average)
    coverage: statements || functions || branches ? 
      ((coveredStatements + coveredFunctions + coveredBranches) / 
       (statements + functions + branches)) * 100 
      : 100
  };
}

// Process coverage data
function processCoverageData(coverageData) {
  const modules = {};
  const files = [];
  
  // Process each file
  Object.entries(coverageData).forEach(([filePath, fileData]) => {
    // Skip node_modules and test files
    if (filePath.includes('node_modules') || 
        filePath.includes('__tests__') || 
        filePath.includes('.test.') || 
        filePath.includes('.spec.')) {
      return;
    }
    
    // Calculate coverage metrics
    const metrics = calculateFileCoverage(fileData);
    
    // Determine module
    const module = extractModule(filePath);
    
    // Add to modules aggregate
    if (!modules[module]) {
      modules[module] = {
        name: module,
        files: 0,
        statements: 0,
        coveredStatements: 0,
        functions: 0,
        coveredFunctions: 0,
        branches: 0,
        coveredBranches: 0
      };
    }
    
    // Update module metrics
    modules[module].files++;
    modules[module].statements += metrics.statements;
    modules[module].coveredStatements += metrics.coveredStatements;
    modules[module].functions += metrics.functions;
    modules[module].coveredFunctions += metrics.coveredFunctions;
    modules[module].branches += metrics.branches;
    modules[module].coveredBranches += metrics.coveredBranches;
    
    // Add to files array
    files.push({
      path: filePath,
      module,
      ...metrics
    });
  });
  
  // Calculate module coverage percentages
  Object.values(modules).forEach(module => {
    module.statementCoverage = module.statements ? 
      (module.coveredStatements / module.statements) * 100 : 100;
    
    module.functionCoverage = module.functions ? 
      (module.coveredFunctions / module.functions) * 100 : 100;
    
    module.branchCoverage = module.branches ? 
      (module.coveredBranches / module.branches) * 100 : 100;
    
    module.coverage = module.statements || module.functions || module.branches ? 
      ((module.coveredStatements + module.coveredFunctions + module.coveredBranches) / 
       (module.statements + module.functions + module.branches)) * 100 
      : 100;
  });
  
  // Sort arrays
  const sortedModules = Object.values(modules).sort((a, b) => a.coverage - b.coverage);
  const sortedFiles = files.sort((a, b) => a.coverage - b.coverage);
  
  // Overall stats
  const totals = {
    modules: sortedModules.length,
    files: sortedFiles.length,
    statements: sortedModules.reduce((sum, mod) => sum + mod.statements, 0),
    coveredStatements: sortedModules.reduce((sum, mod) => sum + mod.coveredStatements, 0),
    functions: sortedModules.reduce((sum, mod) => sum + mod.functions, 0),
    coveredFunctions: sortedModules.reduce((sum, mod) => sum + mod.coveredFunctions, 0),
    branches: sortedModules.reduce((sum, mod) => sum + mod.branches, 0),
    coveredBranches: sortedModules.reduce((sum, mod) => sum + mod.coveredBranches, 0)
  };
  
  totals.statementCoverage = totals.statements ? 
    (totals.coveredStatements / totals.statements) * 100 : 100;
  
  totals.functionCoverage = totals.functions ? 
    (totals.coveredFunctions / totals.functions) * 100 : 100;
  
  totals.branchCoverage = totals.branches ? 
    (totals.coveredBranches / totals.branches) * 100 : 100;
  
  totals.coverage = totals.statements || totals.functions || totals.branches ? 
    ((totals.coveredStatements + totals.coveredFunctions + totals.coveredBranches) / 
     (totals.statements + totals.functions + totals.branches)) * 100 
    : 100;
  
  return {
    timestamp: new Date().toISOString(),
    gitInfo: getGitInfo(),
    modules: sortedModules,
    files: sortedFiles,
    totals
  };
}

// Format number with given precision
function formatNumber(num, precision = 2) {
  return num.toFixed(precision);
}

// Get coverage color based on percentage
function getCoverageColor(percentage) {
  if (percentage >= 80) return 'success';
  if (percentage >= 60) return 'warning';
  return 'danger';
}

// Generate HTML dashboard
function generateDashboard(processedData, historyData) {
  console.log('🔨 Generating dashboard...');
  
  const { modules, files, totals, gitInfo } = processedData;
  
  // Prepare history data for charts
  const historyDates = historyData.map(entry => entry.gitInfo.commitDate);
  const historyCoverage = historyData.map(entry => formatNumber(entry.totals.coverage));
  const historyStatements = historyData.map(entry => formatNumber(entry.totals.statementCoverage));
  const historyFunctions = historyData.map(entry => formatNumber(entry.totals.functionCoverage));
  const historyBranches = historyData.map(entry => formatNumber(entry.totals.branchCoverage));
  
  // Module history data
  const moduleNames = [...new Set(
    historyData.flatMap(entry => entry.modules.map(m => m.name))
  )];
  
  const moduleHistoryData = moduleNames.map(moduleName => {
    const coverageHistory = historyData.map(entry => {
      const moduleData = entry.modules.find(m => m.name === moduleName);
      return moduleData ? formatNumber(moduleData.coverage) : 0;
    });
    
    return {
      name: moduleName,
      data: coverageHistory
    };
  });
  
  // Format HTML
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Coverage Dashboard</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>
  <style>
    .bg-success-light { background-color: rgba(40, 167, 69, 0.1); }
    .bg-warning-light { background-color: rgba(255, 193, 7, 0.1); }
    .bg-danger-light { background-color: rgba(220, 53, 69, 0.1); }
    .progress { height: 20px; }
    .progress-bar { transition: width 0.5s; }
    .chart-container { height: 300px; margin-bottom: 20px; }
    .table-responsive { max-height: 600px; overflow-y: auto; }
    #moduleTable th, #fileTable th { position: sticky; top: 0; background: white; z-index: 10; }
    .badge { font-size: 0.875em; }
    .coverage-card { transition: transform 0.2s; }
    .coverage-card:hover { transform: translateY(-5px); }
  </style>
</head>
<body>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h1 class="mb-3">Test Coverage Dashboard</h1>
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h5 class="card-title mb-0">Project Overview</h5>
              <span class="badge bg-secondary">
                ${gitInfo.branch} (${gitInfo.commit}) - ${gitInfo.commitDate}
              </span>
            </div>
            <p class="text-muted mb-1">Latest commit: ${gitInfo.commitMsg}</p>
            <div class="row mt-3">
              <div class="col-md-3 col-sm-6 mb-3">
                <div class="card coverage-card border-0 bg-${getCoverageColor(totals.coverage)}-light">
                  <div class="card-body text-center">
                    <h6 class="text-muted">Overall Coverage</h6>
                    <h2 class="text-${getCoverageColor(totals.coverage)}">${formatNumber(totals.coverage)}%</h2>
                    <div class="progress">
                      <div class="progress-bar bg-${getCoverageColor(totals.coverage)}" 
                           style="width: ${formatNumber(totals.coverage)}%"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3 col-sm-6 mb-3">
                <div class="card coverage-card border-0 bg-${getCoverageColor(totals.statementCoverage)}-light">
                  <div class="card-body text-center">
                    <h6 class="text-muted">Statement Coverage</h6>
                    <h2 class="text-${getCoverageColor(totals.statementCoverage)}">${formatNumber(totals.statementCoverage)}%</h2>
                    <div class="progress">
                      <div class="progress-bar bg-${getCoverageColor(totals.statementCoverage)}" 
                           style="width: ${formatNumber(totals.statementCoverage)}%"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3 col-sm-6 mb-3">
                <div class="card coverage-card border-0 bg-${getCoverageColor(totals.functionCoverage)}-light">
                  <div class="card-body text-center">
                    <h6 class="text-muted">Function Coverage</h6>
                    <h2 class="text-${getCoverageColor(totals.functionCoverage)}">${formatNumber(totals.functionCoverage)}%</h2>
                    <div class="progress">
                      <div class="progress-bar bg-${getCoverageColor(totals.functionCoverage)}" 
                           style="width: ${formatNumber(totals.functionCoverage)}%"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3 col-sm-6 mb-3">
                <div class="card coverage-card border-0 bg-${getCoverageColor(totals.branchCoverage)}-light">
                  <div class="card-body text-center">
                    <h6 class="text-muted">Branch Coverage</h6>
                    <h2 class="text-${getCoverageColor(totals.branchCoverage)}">${formatNumber(totals.branchCoverage)}%</h2>
                    <div class="progress">
                      <div class="progress-bar bg-${getCoverageColor(totals.branchCoverage)}" 
                           style="width: ${formatNumber(totals.branchCoverage)}%"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Historical Charts Section -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Coverage Trends</h5>
            <div class="chart-container">
              <canvas id="historyChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Module Trends -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Module Coverage Trends</h5>
            <div class="chart-container">
              <canvas id="moduleHistoryChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modules Table -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Coverage by Module</h5>
            <div class="table-responsive">
              <table class="table table-striped table-hover" id="moduleTable">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Files</th>
                    <th>Overall</th>
                    <th>Statements</th>
                    <th>Functions</th>
                    <th>Branches</th>
                  </tr>
                </thead>
                <tbody>
                  ${modules.map(module => `
                    <tr>
                      <td>${module.name}</td>
                      <td>${module.files}</td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="progress flex-grow-1 me-2">
                            <div class="progress-bar bg-${getCoverageColor(module.coverage)}" 
                                style="width: ${formatNumber(module.coverage)}%"></div>
                          </div>
                          <span>${formatNumber(module.coverage)}%</span>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="progress flex-grow-1 me-2">
                            <div class="progress-bar bg-${getCoverageColor(module.statementCoverage)}" 
                                style="width: ${formatNumber(module.statementCoverage)}%"></div>
                          </div>
                          <span>${formatNumber(module.statementCoverage)}%</span>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="progress flex-grow-1 me-2">
                            <div class="progress-bar bg-${getCoverageColor(module.functionCoverage)}" 
                                style="width: ${formatNumber(module.functionCoverage)}%"></div>
                          </div>
                          <span>${formatNumber(module.functionCoverage)}%</span>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="progress flex-grow-1 me-2">
                            <div class="progress-bar bg-${getCoverageColor(module.branchCoverage)}" 
                                style="width: ${formatNumber(module.branchCoverage)}%"></div>
                          </div>
                          <span>${formatNumber(module.branchCoverage)}%</span>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Low Coverage Files -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Files Needing Attention (Bottom 20)</h5>
            <div class="table-responsive">
              <table class="table table-striped table-hover" id="fileTable">
                <thead>
                  <tr>
                    <th>File</th>
                    <th>Module</th>
                    <th>Overall</th>
                    <th>Statements</th>
                    <th>Functions</th>
                    <th>Branches</th>
                  </tr>
                </thead>
                <tbody>
                  ${files.slice(0, 20).map(file => `
                    <tr>
                      <td>${file.path.split('/').slice(-3).join('/')}</td>
                      <td>${file.module}</td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="progress flex-grow-1 me-2">
                            <div class="progress-bar bg-${getCoverageColor(file.coverage)}" 
                                style="width: ${formatNumber(file.coverage)}%"></div>
                          </div>
                          <span>${formatNumber(file.coverage)}%</span>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="progress flex-grow-1 me-2">
                            <div class="progress-bar bg-${getCoverageColor(file.statementCoverage)}" 
                                style="width: ${formatNumber(file.statementCoverage)}%"></div>
                          </div>
                          <span>${formatNumber(file.statementCoverage)}%</span>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="progress flex-grow-1 me-2">
                            <div class="progress-bar bg-${getCoverageColor(file.functionCoverage)}" 
                                style="width: ${formatNumber(file.functionCoverage)}%"></div>
                          </div>
                          <span>${formatNumber(file.functionCoverage)}%</span>
                        </div>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="progress flex-grow-1 me-2">
                            <div class="progress-bar bg-${getCoverageColor(file.branchCoverage)}" 
                                style="width: ${formatNumber(file.branchCoverage)}%"></div>
                          </div>
                          <span>${formatNumber(file.branchCoverage)}%</span>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="my-4 text-center text-muted">
      <small>Coverage Dashboard - Generated ${new Date().toLocaleString()}</small>
    </footer>
  </div>

  <script>
    // Historical coverage chart
    const historyCtx = document.getElementById('historyChart').getContext('2d');
    new Chart(historyCtx, {
      type: 'line',
      data: {
        labels: ${JSON.stringify(historyDates)},
        datasets: [
          {
            label: 'Overall',
            data: ${JSON.stringify(historyCoverage)},
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Statements',
            data: ${JSON.stringify(historyStatements)},
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'transparent',
            tension: 0.4,
            borderDash: [5, 5]
          },
          {
            label: 'Functions',
            data: ${JSON.stringify(historyFunctions)},
            borderColor: 'rgba(255, 159, 64, 1)',
            backgroundColor: 'transparent',
            tension: 0.4,
            borderDash: [10, 5]
          },
          {
            label: 'Branches',
            data: ${JSON.stringify(historyBranches)},
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'transparent',
            tension: 0.4,
            borderDash: [3, 3]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.parsed.y + '%';
              }
            }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });

    // Module history chart
    const moduleHistoryCtx = document.getElementById('moduleHistoryChart').getContext('2d');
    new Chart(moduleHistoryCtx, {
      type: 'line',
      data: {
        labels: ${JSON.stringify(historyDates)},
        datasets: ${JSON.stringify(moduleHistoryData.map((mod, i) => {
          // Generate unique colors
          const hue = (i * 137) % 360;
          return {
            label: mod.name,
            data: mod.data,
            borderColor: `hsl(${hue}, 70%, 60%)`,
            backgroundColor: 'transparent',
            tension: 0.4
          };
        }))}
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.dataset.label + ': ' + context.parsed.y + '%';
              }
            }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });
  </script>
</body>
</html>`;

  // Write HTML file
  fs.writeFileSync(path.join(outputDir, 'index.html'), html);
  
  // Generate JSON data for API consumption
  fs.writeFileSync(
    path.join(outputDir, 'coverage-data.json'), 
    JSON.stringify(processedData, null, 2)
  );
  
  return {
    htmlPath: path.join(outputDir, 'index.html'),
    jsonPath: path.join(outputDir, 'coverage-data.json')
  };
}

// Main execution
try {
  // Process coverage data
  const processedData = processCoverageData(coverageData);
  
  // Add to history if save flag is set
  if (shouldSave) {
    const currentDate = processedData.gitInfo.commitDate;
    
    // Check if we already have an entry for today
    const existingEntryIndex = historyData.findIndex(
      entry => entry.gitInfo.commitDate === currentDate
    );
    
    if (existingEntryIndex !== -1) {
      // Replace existing entry for today
      historyData[existingEntryIndex] = processedData;
    } else {
      // Add new entry
      historyData.push(processedData);
    }
    
    // Keep only last 30 entries to prevent file from growing too large
    if (historyData.length > 30) {
      historyData = historyData.slice(historyData.length - 30);
    }
    
    // Save history data
    fs.writeFileSync(historyDataPath, JSON.stringify(historyData, null, 2));
    console.log(`✅ Saved coverage data to history (${historyData.length} entries)`);
  }
  
  // Generate dashboard
  const { htmlPath, jsonPath } = generateDashboard(processedData, historyData);
  
  console.log(`✅ Dashboard generated successfully!`);
  console.log(`📊 HTML Dashboard: ${htmlPath}`);
  console.log(`🔢 JSON Data: ${jsonPath}`);
  
  // Print summary
  console.log('\n📋 Coverage Summary:');
  console.log(`   Overall: ${formatNumber(processedData.totals.coverage)}%`);
  console.log(`   Statements: ${formatNumber(processedData.totals.statementCoverage)}%`);
  console.log(`   Functions: ${formatNumber(processedData.totals.functionCoverage)}%`);
  console.log(`   Branches: ${formatNumber(processedData.totals.branchCoverage)}%`);
  
  // Modules needing most attention
  console.log('\n⚠️ Modules Needing Attention:');
  processedData.modules.slice(0, 3).forEach(module => {
    console.log(`   ${module.name}: ${formatNumber(module.coverage)}%`);
  });
  
} catch (error) {
  console.error('❌ Error generating coverage dashboard:');
  console.error(error);
  process.exit(1);
}