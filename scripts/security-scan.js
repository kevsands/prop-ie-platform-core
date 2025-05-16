#!/usr/bin/env node

/**
 * Security scan script to detect suspicious patterns in code
 * Run with: node scripts/security-scan.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  // Directories to scan
  directories: ['src', 'pages', 'components'],
  
  // Files to ignore
  ignoreFiles: [
    'node_modules',
    '.next',
    'coverage',
    'out',
    'dist',
    '.git',
    // Add other directories to ignore
  ],
  
  // File extensions to scan
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.html'],
  
  // Suspicious patterns to check for
  patterns: [
    // Dangerous JavaScript functions
    { pattern: 'eval\\(', description: 'Potential eval() usage', severity: 'HIGH' },
    { pattern: 'new\\s+Function\\(', description: 'Dynamic Function creation', severity: 'HIGH' },
    { pattern: 'document\\.write\\(', description: 'document.write usage', severity: 'MEDIUM' },
    { pattern: '\\.innerHTML\\s*=', description: 'Direct innerHTML assignment', severity: 'MEDIUM' },
    
    // Data encoding/decoding (potential obfuscation)
    { pattern: 'atob\\(', description: 'Base64 decoding', severity: 'LOW' },
    { pattern: 'btoa\\(', description: 'Base64 encoding', severity: 'LOW' },
    
    // Suspicious URLs and redirects
    { pattern: 'coaufu\\.com', description: 'Known malicious domain', severity: 'CRITICAL' },
    { pattern: 'window\\.location\\s*=', description: 'Direct window.location assignment', severity: 'MEDIUM' },
    { pattern: 'location\\.href\\s*=', description: 'Direct location.href assignment', severity: 'MEDIUM' },
    { pattern: 'location\\.replace\\(', description: 'Location replace call', severity: 'MEDIUM' },
    
    // Suspicious DOM manipulation
    { pattern: 'createElement\\([\'"]script[\'"]\\)', description: 'Dynamic script creation', severity: 'HIGH' },
    { pattern: 'appendChild\\([^)]*script', description: 'Script element insertion', severity: 'HIGH' },
    { pattern: 'createElement\\([\'"]iframe[\'"]\\)', description: 'Dynamic iframe creation', severity: 'HIGH' },
    
    // Suspicious network requests
    { pattern: 'fetch\\([\'"]https?://(?!localhost|prop\\.ie|amazonaws\\.com)[^\'"]+[\'"]', description: 'Fetch to external domain', severity: 'MEDIUM' },
    { pattern: 'new\\s+WebSocket\\([\'"]wss?://(?!localhost|prop\\.ie|amazonaws\\.com)[^\'"]+[\'"]', description: 'WebSocket to external domain', severity: 'MEDIUM' },
    
    // Event listeners that might be used maliciously
    { pattern: 'addEventListener\\([\'"]beforeunload[\'"]', description: 'beforeunload event listener', severity: 'LOW' },
    
    // Local storage access (potential for data exfiltration)
    { pattern: 'localStorage\\.setItem\\(', description: 'localStorage write access', severity: 'LOW' },
    
    // Suspicious package.json scripts
    { pattern: '"(pre|post)(install|publish)":\\s*"[^"]*curl', description: 'Suspicious network request in npm script', severity: 'HIGH' },
    { pattern: '"(pre|post)(install|publish)":\\s*"[^"]*wget', description: 'Suspicious network request in npm script', severity: 'HIGH' },
    { pattern: '"(pre|post)(install|publish)":\\s*"[^"]*fetch', description: 'Suspicious network request in npm script', severity: 'HIGH' },
  ]
};

// Terminal colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  // Severity colors
  CRITICAL: '\x1b[41m\x1b[37m', // White on red background
  HIGH: '\x1b[31m', // Red
  MEDIUM: '\x1b[33m', // Yellow
  LOW: '\x1b[36m', // Cyan
};

// Statistics
const stats = {
  filesScanned: 0,
  issuesFound: 0,
  bySeverity: {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  }
};

// Helper functions
function shouldIgnoreFile(filePath) {
  return config.ignoreFiles.some(ignorePath => filePath.includes(ignorePath));
}

function hasValidExtension(filePath) {
  const ext = path.extname(filePath);
  return config.extensions.includes(ext);
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let fileHasIssues = false;
    
    config.patterns.forEach(({ pattern, description, severity }) => {
      const regex = new RegExp(pattern, 'g');
      let match;
      let lineNumber = 1;
      const lines = content.split('\n');
      let lastMatchedLine = null;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (regex.test(line)) {
          stats.issuesFound++;
          stats.bySeverity[severity]++;
          
          if (!fileHasIssues) {
            console.log(`\n${colors.white}File: ${colors.cyan}${filePath}${colors.reset}`);
            fileHasIssues = true;
          }
          
          // Don't display the same line multiple times for the same pattern
          if (lastMatchedLine !== i) {
            console.log(`  ${colors.white}Line ${i+1}: ${colors[severity]}[${severity}]${colors.reset} ${description}`);
            console.log(`    ${colors.yellow}${line.trim()}${colors.reset}`);
            lastMatchedLine = i;
          }
        }
      }
    });
    
    stats.filesScanned++;
    return fileHasIssues;
  } catch (error) {
    console.error(`Error scanning file ${filePath}: ${error.message}`);
    return false;
  }
}

function walkDirectory(dir) {
  let foundIssues = false;
  
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      
      if (shouldIgnoreFile(filePath)) {
        return;
      }
      
      const isDirectory = fs.statSync(filePath).isDirectory();
      
      if (isDirectory) {
        // Recursively scan subdirectories
        const hasIssues = walkDirectory(filePath);
        if (hasIssues) foundIssues = true;
      } else if (hasValidExtension(filePath)) {
        // Scan individual file
        const hasIssues = scanFile(filePath);
        if (hasIssues) foundIssues = true;
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dir}: ${error.message}`);
  }
  
  return foundIssues;
}

function scanNpmPackages() {
  console.log(`\n${colors.white}Scanning npm dependencies with ${colors.cyan}npm audit${colors.reset}`);
  
  try {
    const output = execSync('npm audit --json', { encoding: 'utf8' });
    const auditData = JSON.parse(output);
    
    if (auditData.vulnerabilities && Object.keys(auditData.vulnerabilities).length > 0) {
      const vulnCount = auditData.metadata.vulnerabilities;
      const total = vulnCount.critical + vulnCount.high + vulnCount.moderate + vulnCount.low;
      
      console.log(`\n${colors.white}Vulnerabilities found: ${colors.reset}`);
      console.log(`  ${colors.CRITICAL} CRITICAL: ${vulnCount.critical} ${colors.reset}`);
      console.log(`  ${colors.HIGH} HIGH: ${vulnCount.high} ${colors.reset}`);
      console.log(`  ${colors.yellow} MODERATE: ${vulnCount.moderate} ${colors.reset}`);
      console.log(`  ${colors.LOW} LOW: ${vulnCount.low} ${colors.reset}`);
      
      // Add to stats
      stats.issuesFound += total;
      stats.bySeverity.CRITICAL += vulnCount.critical;
      stats.bySeverity.HIGH += vulnCount.high;
      stats.bySeverity.MEDIUM += vulnCount.moderate;
      stats.bySeverity.LOW += vulnCount.low;
      
      return true;
    } else {
      console.log(`  ${colors.green}No vulnerabilities found${colors.reset}`);
      return false;
    }
  } catch (error) {
    console.error(`  ${colors.red}Error running npm audit: ${error.message}${colors.reset}`);
    return false;
  }
}

// Main execution
console.log(`${colors.cyan}=== Security Scanner ===\n${colors.reset}`);
console.log(`${colors.white}Scanning directories: ${config.directories.join(', ')}${colors.reset}`);

let hasIssues = false;

// Scan each configured directory
config.directories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    const dirHasIssues = walkDirectory(fullPath);
    if (dirHasIssues) hasIssues = true;
  } else {
    console.log(`${colors.yellow}Warning: Directory ${dir} does not exist${colors.reset}`);
  }
});

// Scan package.json
const pkgPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(pkgPath)) {
  console.log(`\n${colors.white}Scanning ${colors.cyan}package.json${colors.reset}`);
  const pkgHasIssues = scanFile(pkgPath);
  if (pkgHasIssues) hasIssues = true;
}

// Scan dependencies with npm audit
const depsHaveIssues = scanNpmPackages();
if (depsHaveIssues) hasIssues = true;

// Print summary
console.log(`\n${colors.cyan}=== Scan Summary ===\n${colors.reset}`);
console.log(`${colors.white}Files scanned: ${colors.cyan}${stats.filesScanned}${colors.reset}`);
console.log(`${colors.white}Issues found: ${stats.issuesFound > 0 ? colors.red : colors.green}${stats.issuesFound}${colors.reset}`);
console.log(`${colors.white}Issues by severity: ${colors.reset}`);
console.log(`  ${colors.CRITICAL} CRITICAL: ${stats.bySeverity.CRITICAL} ${colors.reset}`);
console.log(`  ${colors.HIGH} HIGH: ${stats.bySeverity.HIGH} ${colors.reset}`);
console.log(`  ${colors.MEDIUM} MEDIUM: ${stats.bySeverity.MEDIUM} ${colors.reset}`);
console.log(`  ${colors.LOW} LOW: ${stats.bySeverity.LOW} ${colors.reset}`);

// Exit with proper status code
if (hasIssues) {
  console.log(`\n${colors.red}Security issues were found. Review the output above.${colors.reset}`);
  process.exit(1);
} else {
  console.log(`\n${colors.green}No security issues found!${colors.reset}`);
  process.exit(0);
}