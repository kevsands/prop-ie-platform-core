#!/usr/bin/env node

/**
 * Demo Coverage Dashboard Generator
 * 
 * This script creates a sample coverage dashboard with mock data
 * to demonstrate the functionality without needing to run tests.
 */

const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

// Paths
const outputDir = path.join(process.cwd(), 'coverage-dashboard-demo');
const historyDir = path.join(outputDir, 'history');

// Create directories
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
if (!fs.existsSync(historyDir)) {
  fs.mkdirSync(historyDir, { recursive: true });
}

// Generate mock coverage data
function generateMockCoverageData(date, coverageBase = 65) {
  // Add some random variation to make the charts interesting
  const variation = () => Math.random() * 10 - 5;
  
  // Generate module data
  const modules = [
    { 
      name: 'components',
      files: 45,
      coverage: Math.min(95, Math.max(5, coverageBase + 10 + variation())),
      statements: 1245,
      coveredStatements: 920,
      functions: 156,
      coveredFunctions: 120,
      branches: 246,
      coveredBranches: 180
    },
    { 
      name: 'lib',
      files: 28,
      coverage: Math.min(95, Math.max(5, coverageBase - 5 + variation())),
      statements: 820,
      coveredStatements: 520,
      functions: 98,
      coveredFunctions: 66,
      branches: 145,
      coveredBranches: 89
    },
    { 
      name: 'hooks',
      files: 18,
      coverage: Math.min(95, Math.max(5, coverageBase + 15 + variation())),
      statements: 650,
      coveredStatements: 580,
      functions: 45,
      coveredFunctions: 40,
      branches: 79,
      coveredBranches: 70
    },
    { 
      name: 'api',
      files: 22,
      coverage: Math.min(95, Math.max(5, coverageBase - 10 + variation())),
      statements: 920,
      coveredStatements: 460,
      functions: 88,
      coveredFunctions: 44,
      branches: 156,
      coveredBranches: 78
    },
    { 
      name: 'utils',
      files: 15,
      coverage: Math.min(95, Math.max(5, coverageBase + 8 + variation())),
      statements: 520,
      coveredStatements: 420,
      functions: 72,
      coveredFunctions: 58,
      branches: 85,
      coveredBranches: 68
    },
    { 
      name: 'context',
      files: 7,
      coverage: Math.min(95, Math.max(5, coverageBase + 5 + variation())),
      statements: 280,
      coveredStatements: 210,
      functions: 35,
      coveredFunctions: 26,
      branches: 44,
      coveredBranches: 33
    },
    { 
      name: 'services',
      files: 12,
      coverage: Math.min(95, Math.max(5, coverageBase - 15 + variation())),
      statements: 680,
      coveredStatements: 340,
      functions: 75,
      coveredFunctions: 38,
      branches: 120,
      coveredBranches: 60
    }
  ];
  
  // Calculate totals
  const totals = {
    modules: modules.length,
    files: modules.reduce((sum, mod) => sum + mod.files, 0),
    statements: modules.reduce((sum, mod) => sum + mod.statements, 0),
    coveredStatements: modules.reduce((sum, mod) => sum + mod.coveredStatements, 0),
    functions: modules.reduce((sum, mod) => sum + mod.functions, 0),
    coveredFunctions: modules.reduce((sum, mod) => sum + mod.coveredFunctions, 0),
    branches: modules.reduce((sum, mod) => sum + mod.branches, 0),
    coveredBranches: modules.reduce((sum, mod) => sum + mod.coveredBranches, 0)
  };
  
  // Calculate coverage percentages
  totals.statementCoverage = (totals.coveredStatements / totals.statements) * 100;
  totals.functionCoverage = (totals.coveredFunctions / totals.functions) * 100;
  totals.branchCoverage = (totals.coveredBranches / totals.branches) * 100;
  totals.coverage = ((totals.coveredStatements + totals.coveredFunctions + totals.coveredBranches) / 
                   (totals.statements + totals.functions + totals.branches)) * 100;
  
  // Generate 50 files with various coverage levels
  const files = [];
  for (let i = 0; i < 50; i++) {
    const moduleIndex = Math.floor(Math.random() * modules.length);
    const module = modules[moduleIndex];
    const coverage = Math.min(100, Math.max(0, module.coverage + variation() * 2));
    
    files.push({
      path: `src/${module.name}/file-${i+1}.ts`,
      module: module.name,
      coverage,
      statements: Math.floor(Math.random() * 100) + 10,
      coveredStatements: 0,
      functions: Math.floor(Math.random() * 10) + 2,
      coveredFunctions: 0,
      branches: Math.floor(Math.random() * 20) + 5,
      coveredBranches: 0
    });
  }
  
  // Calculate file coverage details
  files.forEach(file => {
    file.statementCoverage = file.coverage + (Math.random() * 10 - 5);
    file.functionCoverage = file.coverage + (Math.random() * 10 - 5);
    file.branchCoverage = file.coverage + (Math.random() * 10 - 5);
    
    // Keep percentages in valid range
    file.statementCoverage = Math.min(100, Math.max(0, file.statementCoverage));
    file.functionCoverage = Math.min(100, Math.max(0, file.functionCoverage));
    file.branchCoverage = Math.min(100, Math.max(0, file.branchCoverage));
    
    // Calculate covered counts based on percentages
    file.coveredStatements = Math.floor(file.statements * (file.statementCoverage / 100));
    file.coveredFunctions = Math.floor(file.functions * (file.functionCoverage / 100));
    file.coveredBranches = Math.floor(file.branches * (file.branchCoverage / 100));
  });
  
  // Sort by coverage ascending
  modules.sort((a, b) => a.coverage - b.coverage);
  files.sort((a, b) => a.coverage - b.coverage);
  
  return {
    timestamp: new Date(date).toISOString(),
    gitInfo: {
      branch: 'feature/test-improvements',
      commit: '1234abc',
      commitDate: date,
      commitMsg: 'Improve test coverage tracking'
    },
    modules,
    files,
    totals
  };
}

// Generate historical data
function generateHistoricalData() {
  const today = new Date();
  const data = [];
  
  // Generate 30 days of data
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (30 - i));
    const dateStr = date.toISOString().split('T')[0];
    
    // Start with low coverage and gradually improve
    const baseCoverage = 40 + (i / 30) * 30;
    
    data.push(generateMockCoverageData(dateStr, baseCoverage));
  }
  
  return data;
}

// Format number with 2 decimal places
function formatNumber(num) {
  return num.toFixed(2);
}

// Get coverage color based on percentage
function getCoverageColor(percentage) {
  if (percentage >= 80) return 'success';
  if (percentage >= 60) return 'warning';
  return 'danger';
}

// Generate HTML dashboard
function generateDashboard(processedData, historyData) {
  console.log('Generating mock dashboard...');
  
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
  <title>Coverage Dashboard Demo</title>
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
    .demo-badge {
      position: fixed;
      top: 10px;
      right: 10px;
      padding: 5px 10px;
      background-color: #ff6b6b;
      color: white;
      font-weight: bold;
      z-index: 1000;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="demo-badge">DEMO DATA</div>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col-12">
        <h1 class="mb-3">Test Coverage Dashboard <small class="text-muted">(Demo)</small></h1>
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
                            <div class="progress-bar bg-${getCoverageColor(module.coverage)}" 
                                style="width: ${formatNumber(module.coverage)}%"></div>
                          </div>
                          <span>${formatNumber(module.coverage)}%</span>
                        </div>
                      </td>
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
                            <div class="progress-bar bg-${getCoverageColor(module.coverage)}" 
                                style="width: ${formatNumber(module.coverage)}%"></div>
                          </div>
                          <span>${formatNumber(module.coverage)}%</span>
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
                      <td>${file.path}</td>
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
      <small>Coverage Dashboard Demo - Generated ${new Date().toLocaleString()}</small>
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

// Function to open a file in the default browser
function openBrowser(filePath) {
  const platform = process.platform;
  const fullPath = path.resolve(filePath);
  
  let command;
  let args = [];
  
  switch (platform) {
    case 'darwin': // macOS
      command = 'open';
      args = [fullPath];
      break;
    case 'win32': // Windows
      command = 'explorer';
      args = [fullPath];
      break;
    default: // Linux and others
      command = 'xdg-open';
      args = [fullPath];
      break;
  }
  
  return childProcess.spawn(command, args, {
    stdio: 'ignore',
    detached: true
  }).unref();
}

// Main execution
try {
  console.log('Generating sample coverage data...');
  const historyData = generateHistoricalData();
  
  // Use the latest data as "current"
  const currentData = historyData[historyData.length - 1];
  
  // Save sample history data
  fs.writeFileSync(
    path.join(historyDir, 'coverage-history.json'),
    JSON.stringify(historyData, null, 2)
  );
  
  // Generate dashboard
  const { htmlPath, jsonPath } = generateDashboard(currentData, historyData);
  
  console.log(`Sample dashboard generated successfully!`);
  console.log(`HTML Dashboard: ${htmlPath}`);
  console.log(`JSON Data: ${jsonPath}`);
  
  // Try to open in browser
  console.log('Opening dashboard in browser...');
  openBrowser(htmlPath);
  
} catch (error) {
  console.error('Error generating sample coverage dashboard:');
  console.error(error);
  process.exit(1);
}