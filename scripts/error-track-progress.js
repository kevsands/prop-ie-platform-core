/**
 * TypeScript Error Tracking Progress Tool
 * 
 * This script tracks progress in resolving TypeScript errors over time.
 * It runs regular error audits, stores historical data, and generates
 * visualizations of error reduction progress.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const HISTORY_DIR = path.join(__dirname, '..', 'error-history');
const REPORTS_DIR = path.join(__dirname, '..', 'error-reports');
const PROGRESS_FILE = path.join(HISTORY_DIR, 'progress-history.json');
const SUMMARY_FILE = path.join(HISTORY_DIR, 'progress-summary.md');

// Ensure directories exist
if (!fs.existsSync(HISTORY_DIR)) {
  fs.mkdirSync(HISTORY_DIR, { recursive: true });
}
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// Run an error audit and return current error counts
function runErrorAudit() {
  console.log('Running TypeScript check to count errors...');
  try {
    execSync('node scripts/error-audit.js', { stdio: 'inherit' });
    
    // Load the summary from the audit
    const summaryPath = path.join(REPORTS_DIR, 'summary.json');
    if (fs.existsSync(summaryPath)) {
      return JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));
    } else {
      throw new Error('Summary file not found after running audit');
    }
  } catch (error) {
    console.error('Error running audit:', error);
    process.exit(1);
  }
}

// Load error history from file
function loadErrorHistory() {
  if (!fs.existsSync(PROGRESS_FILE)) {
    return [];
  }
  
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  } catch (error) {
    console.error('Error loading error history:', error);
    return [];
  }
}

// Update error history with new data
function updateErrorHistory(history, summary) {
  const now = new Date();
  const entry = {
    timestamp: now.toISOString(),
    totalErrors: summary.totalErrors,
    fileCount: summary.fileCount,
    categoryCounts: summary.categoryCounts,
    topErrorCodes: summary.topErrorCodes
  };
  
  history.push(entry);
  
  try {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(history, null, 2));
    console.log(`Error history updated (${history.length} entries)`);
  } catch (error) {
    console.error('Error updating history file:', error);
  }
  
  return history;
}

// Generate a progress report
function generateProgressReport(history) {
  if (history.length < 2) {
    console.log('Not enough history to generate a progress report.');
    return;
  }
  
  // Get initial and current counts
  const initial = history[0];
  const current = history[history.length - 1];
  
  // Calculate percentage reduction
  const totalReduction = initial.totalErrors - current.totalErrors;
  const totalReductionPercent = (totalReduction / initial.totalErrors * 100).toFixed(1);
  
  const fileReduction = initial.fileCount - current.fileCount;
  const fileReductionPercent = (fileReduction / initial.fileCount * 100).toFixed(1);
  
  // Generate markdown report
  const report = `# TypeScript Error Reduction Progress
  
## Summary

- **Starting Date**: ${new Date(initial.timestamp).toLocaleDateString()}
- **Latest Check**: ${new Date(current.timestamp).toLocaleDateString()}
- **Time Period**: ${getTimePeriod(initial.timestamp, current.timestamp)}
- **Total Sessions**: ${history.length}

## Error Reduction

- **Initial Error Count**: ${initial.totalErrors.toLocaleString()}
- **Current Error Count**: ${current.totalErrors.toLocaleString()}
- **Errors Fixed**: ${totalReduction.toLocaleString()} (${totalReductionPercent}%)
- **Files with Errors**: ${fileReduction.toLocaleString()} fewer files (${fileReductionPercent}%)

## Error Categories

| Category | Initial | Current | Fixed | Reduction |
|----------|---------|---------|-------|-----------|
${Object.keys(initial.categoryCounts)
  .map(category => {
    const initialCount = initial.categoryCounts[category] || 0;
    const currentCount = current.categoryCounts[category] || 0;
    const fixedCount = initialCount - currentCount;
    const percent = initialCount > 0 
      ? (fixedCount / initialCount * 100).toFixed(1) 
      : '0.0';
    
    return `| ${category} | ${initialCount.toLocaleString()} | ${currentCount.toLocaleString()} | ${fixedCount.toLocaleString()} | ${percent}% |`;
  })
  .join('\n')}

## Progress Chart

\`\`\`
${generateAsciiChart(history)}
\`\`\`

## Next Steps

${generateNextSteps(current)}
`;

  try {
    fs.writeFileSync(SUMMARY_FILE, report);
    console.log(`Progress report written to ${SUMMARY_FILE}`);
  } catch (error) {
    console.error('Error writing progress report:', error);
  }
}

// Generate an ASCII chart showing error count over time
function generateAsciiChart(history) {
  const MAX_WIDTH = 60;
  const MAX_HEIGHT = 15;
  
  const errorCounts = history.map(entry => entry.totalErrors);
  const timestamps = history.map(entry => new Date(entry.timestamp).toLocaleDateString());
  
  // Calculate scale
  const maxErrors = Math.max(...errorCounts);
  const minErrors = Math.min(...errorCounts, maxErrors * 0.8); // Ensure some range even if not much progress
  
  const valueToHeight = (value) => {
    return Math.floor((value - minErrors) / (maxErrors - minErrors) * MAX_HEIGHT);
  };
  
  // Build chart
  let chart = '';
  
  // Add top axis
  chart += `Errors\n`;
  chart += `${maxErrors.toLocaleString()} ┌${'─'.repeat(MAX_WIDTH - 2)}┐\n`;
  
  // Add chart rows
  for (let y = MAX_HEIGHT; y >= 0; y--) {
    const isValueRow = y === 0 || y === MAX_HEIGHT || y === Math.floor(MAX_HEIGHT / 2);
    const valueLabel = isValueRow 
      ? Math.round(minErrors + (y / MAX_HEIGHT) * (maxErrors - minErrors)).toLocaleString()
      : '';
    
    // Pad the label to align right
    const paddedLabel = valueLabel.padStart(7, ' ');
    
    chart += `${paddedLabel} │`;
    
    // Add data points
    for (let x = 0; x < errorCounts.length; x++) {
      const pointHeight = valueToHeight(errorCounts[x]);
      const xPos = Math.floor(x * (MAX_WIDTH - 2) / (errorCounts.length - 1 || 1));
      
      if (xPos === (x * (MAX_WIDTH - 2) / (errorCounts.length - 1 || 1))) {
        chart += pointHeight >= y ? '█' : ' ';
      }
    }
    
    chart += '│\n';
  }
  
  // Add bottom axis
  chart += `${minErrors.toLocaleString()} └${'─'.repeat(MAX_WIDTH - 2)}┘\n`;
  chart += `      ${timestamps[0].padEnd(Math.floor(MAX_WIDTH / 2) - 3, ' ')}`;
  chart += `${timestamps[timestamps.length - 1].padStart(Math.floor(MAX_WIDTH / 2) - 3, ' ')}\n`;
  chart += `      ${'Time'.padEnd(MAX_WIDTH - 2, ' ')}\n`;
  
  return chart;
}

// Generate suggestions for next steps
function generateNextSteps(current) {
  if (!current.categoryCounts) return 'No category data available.';
  
  // Sort categories by count
  const sortedCategories = Object.entries(current.categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));
  
  if (sortedCategories.length === 0) return 'No errors remaining!';
  
  // Generate recommendations
  let recommendations = '### Recommended Focus Areas\n\n';
  
  // Top 3 categories by error count
  recommendations += '1. **High Impact Categories**\n';
  sortedCategories.slice(0, 3).forEach(({ category, count }) => {
    recommendations += `   - Fix ${category} errors (${count.toLocaleString()} remaining)\n`;
  });
  
  // Suggest file focused approach
  recommendations += '\n2. **File-by-File Approach**\n';
  recommendations += '   - Continue fixing errors in files with the highest error density\n';
  recommendations += '   - See current "Files with Most Errors" in the latest error report\n';
  
  // Automated fixes
  recommendations += '\n3. **Automated Fixes**\n';
  recommendations += '   - Run the error-fix scripts for categories with automated fixes\n';
  recommendations += '   - Create additional specialized fixers for common patterns\n';
  
  return recommendations;
}

// Calculate human-friendly time period
function getTimePeriod(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const diffMs = end - start;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Less than a day";
  if (diffDays === 1) return "1 day";
  if (diffDays < 7) return `${diffDays} days`;
  
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return "1 week";
  if (diffWeeks < 4) return `${diffWeeks} weeks`;
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 month";
  
  return `${diffMonths} months`;
}

// Main execution
console.log('Starting TypeScript error progress tracking...');

// Run current audit
const summary = runErrorAudit();

// Load history and update
let history = loadErrorHistory();
history = updateErrorHistory(history, summary);

// Generate progress report if we have enough history
generateProgressReport(history);

console.log(`
=================================================
✅ Error tracking complete!
=================================================
Latest error count: ${summary.totalErrors.toLocaleString()}
Files with errors: ${summary.fileCount.toLocaleString()}
History entries: ${history.length}

Error history saved to: ${PROGRESS_FILE}
Progress report: ${SUMMARY_FILE}
`);