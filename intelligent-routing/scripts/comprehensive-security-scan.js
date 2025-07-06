#!/usr/bin/env node

/**
 * Comprehensive security scanning script
 * Runs multiple security checks on the codebase, dependencies, and configuration
 * 
 * Usage: node scripts/comprehensive-security-scan.js [--ci] [--report=<format>]
 * 
 * Options:
 *   --ci             Run in CI mode (exit with error code on issues)
 *   --report=json    Output format (json, html, markdown)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

// Parse command line arguments
const args = process.argv.slice(2);
const ciMode = args.includes('--ci');
const reportFormat = args.find(arg => arg.startsWith('--report='))?.split('=')[1] || 'text';

// Configuration
const config = {
  // Directories to scan
  directories: ['src', 'pages', 'components', 'infrastructure', 'scripts'],
  
  // Files to ignore
  ignoreFiles: [
    'node_modules',
    '.next',
    'coverage',
    'out',
    'dist',
    '.git',
  ],
  
  // File extensions to scan
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.yml', '.yaml', '.tf'],
  
  // Security patterns to check for
  patterns: [
    // Critical Security Issues
    { pattern: 'eval\\(', description: 'Potential eval() usage', severity: 'CRITICAL' },
    { pattern: 'new\\s+Function\\(', description: 'Dynamic Function creation', severity: 'CRITICAL' },
    { pattern: 'dangerouslySetInnerHTML', description: 'React dangerouslySetInnerHTML usage', severity: 'HIGH' },
    { pattern: 'innerHTML\\s*=', description: 'Direct innerHTML assignment', severity: 'HIGH' },
    { pattern: 'document\\.write\\(', description: 'document.write usage', severity: 'HIGH' },
    
    // Authentication & Authorization
    { pattern: 'jwt\\.sign\\(.*,\\s*[\'"`].*[\'"`]', description: 'Hardcoded JWT secret', severity: 'CRITICAL' },
    { pattern: 'createHash\\(.*\\)\\.update\\(.*\\)\\.digest\\(', description: 'Potential weak hashing algorithm', severity: 'MEDIUM' },
    { pattern: 'crypto\\.createHash\\([\'"`]md5[\'"`]\\)', description: 'MD5 is cryptographically broken', severity: 'HIGH' },
    { pattern: 'crypto\\.createHash\\([\'"`]sha1[\'"`]\\)', description: 'SHA1 is cryptographically weak', severity: 'MEDIUM' },
    
    // Injection vulnerabilities
    { pattern: 'executeQuery\\(.*\\+', description: 'Potential SQL injection vulnerability', severity: 'CRITICAL' },
    { pattern: '\\.\\$where\\(.*\\)', description: 'MongoDB injection vulnerability', severity: 'CRITICAL' },
    { pattern: '\\.exec\\([\'"`].*\\$\\{', description: 'Command injection vulnerability', severity: 'CRITICAL' },
    
    // Secure configuration
    { pattern: '[\'"`]Access-Control-Allow-Origin[\'"`]\\s*:\\s*[\'"`]\\*[\'"`]', description: 'CORS allows all origins', severity: 'MEDIUM' },
    { pattern: 'Security TokenType', description: 'AWS security token exposure', severity: 'CRITICAL' },
    { pattern: 'allowScriptAccess[\'"`]\\s*:\\s*[\'"`]always[\'"`]', description: 'Unsafe script access', severity: 'HIGH' },
    
    // Sensitive information
    { pattern: '(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])', description: 'Potential AWS access key', severity: 'CRITICAL' },
    { pattern: '(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{32}(?![A-Za-z0-9/+=])', description: 'Potential API key', severity: 'CRITICAL' },
    { pattern: 'password\\s*=\\s*[\'"`][^\'"]*[\'"`]', description: 'Hardcoded password', severity: 'CRITICAL' },
    { pattern: '[\'"`]username[\'"`]\\s*:\\s*[\'"`][^\'"`]*[\'"`]', description: 'Hardcoded username', severity: 'HIGH' },
    
    // DOM-based XSS
    { pattern: 'location\\.href\\s*=', description: 'Unvalidated redirect', severity: 'MEDIUM' },
    { pattern: 'location\\.replace\\(', description: 'Unvalidated redirect', severity: 'MEDIUM' },
    { pattern: 'document\\.cookie\\s*=', description: 'Cookie manipulation', severity: 'MEDIUM' },
    
    // Cloud security
    { pattern: '"Effect"\\s*:\\s*"Allow",\\s*"Action"\\s*:\\s*"\\*"', description: 'Overly permissive IAM policy', severity: 'HIGH' },
    { pattern: '"Effect"\\s*:\\s*"Allow",\\s*"Resource"\\s*:\\s*"\\*"', description: 'IAM policy with unrestricted resources', severity: 'HIGH' },
    { pattern: '"PublicRead"', description: 'AWS S3 bucket with public read access', severity: 'HIGH' },
    { pattern: '"PublicReadWrite"', description: 'AWS S3 bucket with public write access', severity: 'CRITICAL' },
    
    // Package.json security
    { pattern: '"(pre|post)(install|publish)":\\s*"[^"]*curl', description: 'Suspicious network request in npm script', severity: 'HIGH' },
    { pattern: '"(pre|post)(install|publish)":\\s*"[^"]*wget', description: 'Suspicious network request in npm script', severity: 'HIGH' },
    { pattern: '"(pre|post)(install|publish)":\\s*"[^"]*http', description: 'Suspicious network request in npm script', severity: 'HIGH' },
  ],
  
  // Security checks to run
  checks: [
    { name: 'npm-audit', command: 'npm audit --json', parser: parseNpmAudit },
    { name: 'eslint-security', command: 'npx eslint --config .eslintrc.security.js --format json src/', parser: parseEslintOutput, optional: true },
    { name: 'osv-scanner', command: 'npx osv-scanner .', parser: parseOsvOutput, optional: true },
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
  },
  byCheck: {},
  issues: []
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
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (regex.test(line)) {
          stats.issuesFound++;
          stats.bySeverity[severity]++;
          
          // Add to issues list
          stats.issues.push({
            file: filePath,
            line: i + 1,
            description,
            severity,
            content: line.trim(),
            type: 'pattern'
          });
          
          if (!fileHasIssues) {
            console.log(`\n${colors.white}File: ${colors.cyan}${filePath}${colors.reset}`);
            fileHasIssues = true;
          }
          
          console.log(`  ${colors.white}Line ${i+1}: ${colors[severity]}[${severity}]${colors.reset} ${description}`);
          console.log(`    ${colors.yellow}${line.trim()}${colors.reset}`);
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

function runSecurityChecks() {
  let foundIssues = false;
  
  config.checks.forEach(({ name, command, parser, optional }) => {
    console.log(`\n${colors.white}Running ${colors.cyan}${name}${colors.reset}`);
    
    try {
      const output = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      const results = parser(output);
      
      // Add to statistics
      stats.byCheck[name] = results.count;
      stats.issuesFound += results.count;
      stats.bySeverity.CRITICAL += results.bySeverity.CRITICAL || 0;
      stats.bySeverity.HIGH += results.bySeverity.HIGH || 0;
      stats.bySeverity.MEDIUM += results.bySeverity.MEDIUM || 0;
      stats.bySeverity.LOW += results.bySeverity.LOW || 0;
      
      // Add to issues list
      stats.issues = stats.issues.concat(results.issues);
      
      if (results.count > 0) {
        foundIssues = true;
        console.log(`  Found ${results.count} issues`);
      } else {
        console.log(`  ${colors.green}No issues found${colors.reset}`);
      }
    } catch (error) {
      if (optional) {
        console.log(`  ${colors.yellow}Check skipped: ${error.message}${colors.reset}`);
      } else {
        console.error(`  ${colors.red}Error running check: ${error.message}${colors.reset}`);
        foundIssues = true;
      }
    }
  });
  
  return foundIssues;
}

// Parse security check outputs
function parseNpmAudit(output) {
  try {
    const data = JSON.parse(output);
    const result = {
      count: 0,
      bySeverity: {
        CRITICAL: 0,
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0
      },
      issues: []
    };
    
    if (data.vulnerabilities) {
      const vulnEntries = Object.entries(data.vulnerabilities);
      result.count = vulnEntries.length;
      
      vulnEntries.forEach(([pkg, vuln]) => {
        // Map npm severity to our severity levels
        const severityMap = {
          critical: 'CRITICAL',
          high: 'HIGH',
          moderate: 'MEDIUM',
          low: 'LOW'
        };
        
        const severity = severityMap[vuln.severity] || 'MEDIUM';
        result.bySeverity[severity]++;
        
        result.issues.push({
          file: 'package.json',
          description: `Vulnerable dependency: ${pkg} (${vuln.name})`,
          severity,
          content: `${vuln.name}@${vuln.version}: ${vuln.title}`,
          type: 'dependency',
          metadata: {
            package: pkg,
            version: vuln.version,
            fixAvailable: vuln.fixAvailable,
            advisory: vuln.via[0]?.url || null
          }
        });
      });
    }
    
    return result;
  } catch (error) {
    console.error(`Error parsing npm audit output: ${error.message}`);
    return { count: 0, bySeverity: {}, issues: [] };
  }
}

function parseEslintOutput(output) {
  try {
    const data = JSON.parse(output);
    const result = {
      count: 0,
      bySeverity: {
        CRITICAL: 0,
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0
      },
      issues: []
    };
    
    data.forEach(file => {
      file.messages.forEach(msg => {
        result.count++;
        
        // Map eslint severity to our severity levels
        const severity = msg.severity === 2 ? 'HIGH' : 'MEDIUM';
        result.bySeverity[severity]++;
        
        result.issues.push({
          file: file.filePath,
          line: msg.line,
          description: msg.message,
          severity,
          content: msg.source || '',
          type: 'eslint',
          metadata: {
            ruleId: msg.ruleId,
            column: msg.column
          }
        });
      });
    });
    
    return result;
  } catch (error) {
    console.error(`Error parsing ESLint output: ${error.message}`);
    return { count: 0, bySeverity: {}, issues: [] };
  }
}

function parseOsvOutput(output) {
  // Simple parser for OSV output (may need adjustment based on actual output)
  const result = {
    count: 0,
    bySeverity: {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0
    },
    issues: []
  };
  
  // Count the vulnerabilities - simple approach for now
  const vulnMatches = output.match(/Found \d+ vulnerabilities/);
  if (vulnMatches) {
    const count = parseInt(vulnMatches[0].match(/\d+/)[0], 10);
    result.count = count;
    
    // Since OSV doesn't clearly specify severity, we'll assume HIGH
    result.bySeverity.HIGH = count;
    
    // Extract vulnerability details (simplified)
    const vulnRegex = /Package:\s+(.+?)\s+Vulnerability:\s+(.+?)(?:\n|$)/g;
    let match;
    while ((match = vulnRegex.exec(output)) !== null) {
      result.issues.push({
        file: 'package.json',
        description: `OSV vulnerability: ${match[2]}`,
        severity: 'HIGH',
        content: `Package: ${match[1]}`,
        type: 'osv',
        metadata: {
          package: match[1],
          advisory: match[2]
        }
      });
    }
  }
  
  return result;
}

function generateReport() {
  switch (reportFormat) {
    case 'json':
      return JSON.stringify({
        summary: {
          filesScanned: stats.filesScanned,
          issuesFound: stats.issuesFound,
          bySeverity: stats.bySeverity,
          byCheck: stats.byCheck
        },
        issues: stats.issues
      }, null, 2);
      
    case 'html':
      return `<!DOCTYPE html>
<html>
<head>
  <title>Security Scan Report</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; color: #333; }
    h1, h2, h3 { margin-top: 0; }
    .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    .issues { margin-bottom: 30px; }
    .issue { border-left: 4px solid #ddd; padding: 10px; margin-bottom: 10px; }
    .CRITICAL { border-color: #d9534f; }
    .HIGH { border-color: #f0ad4e; }
    .MEDIUM { border-color: #5bc0de; }
    .LOW { border-color: #5cb85c; }
    .issue-header { display: flex; justify-content: space-between; }
    .issue-severity { font-weight: bold; }
    .CRITICAL .issue-severity { color: #d9534f; }
    .HIGH .issue-severity { color: #f0ad4e; }
    .MEDIUM .issue-severity { color: #5bc0de; }
    .LOW .issue-severity { color: #5cb85c; }
    .issue-file { color: #666; }
    .issue-content { background: #f9f9f9; padding: 8px; margin-top: 8px; font-family: monospace; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>Security Scan Report</h1>
  <div class="summary">
    <h2>Summary</h2>
    <p>Files scanned: ${stats.filesScanned}</p>
    <p>Issues found: ${stats.issuesFound}</p>
    <h3>By Severity</h3>
    <ul>
      <li>CRITICAL: ${stats.bySeverity.CRITICAL}</li>
      <li>HIGH: ${stats.bySeverity.HIGH}</li>
      <li>MEDIUM: ${stats.bySeverity.MEDIUM}</li>
      <li>LOW: ${stats.bySeverity.LOW}</li>
    </ul>
  </div>
  
  <div class="issues">
    <h2>Issues</h2>
    ${stats.issues.map(issue => `
      <div class="issue ${issue.severity}">
        <div class="issue-header">
          <span class="issue-severity">${issue.severity}</span>
          <span class="issue-file">${issue.file}${issue.line ? `:${issue.line}` : ''}</span>
        </div>
        <div class="issue-description">${issue.description}</div>
        <div class="issue-content">${issue.content}</div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;
      
    case 'markdown':
      return `# Security Scan Report

## Summary
- Files scanned: ${stats.filesScanned}
- Issues found: ${stats.issuesFound}

### By Severity
- CRITICAL: ${stats.bySeverity.CRITICAL}
- HIGH: ${stats.bySeverity.HIGH}
- MEDIUM: ${stats.bySeverity.MEDIUM}
- LOW: ${stats.bySeverity.LOW}

## Issues

${stats.issues.map(issue => `
### ${issue.severity}: ${issue.description}
- **File**: ${issue.file}${issue.line ? `:${issue.line}` : ''}
- **Type**: ${issue.type}

\`\`\`
${issue.content}
\`\`\`
`).join('\n')}
`;
      
    default: // text
      return `Security Scan Report
===================

Summary:
- Files scanned: ${stats.filesScanned}
- Issues found: ${stats.issuesFound}

By Severity:
- CRITICAL: ${stats.bySeverity.CRITICAL}
- HIGH: ${stats.bySeverity.HIGH}
- MEDIUM: ${stats.bySeverity.MEDIUM}
- LOW: ${stats.bySeverity.LOW}

Issues:
${stats.issues.map(issue => `
[${issue.severity}] ${issue.description}
  File: ${issue.file}${issue.line ? `:${issue.line}` : ''}
  ${issue.content}
`).join('\n')}
`;
  }
}

// Main execution
console.log(`${colors.cyan}=== Comprehensive Security Scanner ===\n${colors.reset}`);
console.log(`${colors.white}Scanning directories: ${config.directories.join(', ')}${colors.reset}`);

// Generate a unique report ID for this scan
const reportId = crypto.randomBytes(4).toString('hex');
const reportPath = path.join(process.cwd(), `security-report-${reportId}.${reportFormat === 'html' ? 'html' : 'txt'}`);

let hasIssues = false;

// Scan files for security patterns
config.directories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    const dirHasIssues = walkDirectory(fullPath);
    if (dirHasIssues) hasIssues = true;
  } else {
    console.log(`${colors.yellow}Warning: Directory ${dir} does not exist${colors.reset}`);
  }
});

// Run security checks
const checksHaveIssues = runSecurityChecks();
if (checksHaveIssues) hasIssues = true;

// Print summary
console.log(`\n${colors.cyan}=== Scan Summary ===\n${colors.reset}`);
console.log(`${colors.white}Files scanned: ${colors.cyan}${stats.filesScanned}${colors.reset}`);
console.log(`${colors.white}Issues found: ${stats.issuesFound > 0 ? colors.red : colors.green}${stats.issuesFound}${colors.reset}`);
console.log(`${colors.white}Issues by severity: ${colors.reset}`);
console.log(`  ${colors.CRITICAL} CRITICAL: ${stats.bySeverity.CRITICAL} ${colors.reset}`);
console.log(`  ${colors.HIGH} HIGH: ${stats.bySeverity.HIGH} ${colors.reset}`);
console.log(`  ${colors.MEDIUM} MEDIUM: ${stats.bySeverity.MEDIUM} ${colors.reset}`);
console.log(`  ${colors.LOW} LOW: ${stats.bySeverity.LOW} ${colors.reset}`);

// Generate report
const report = generateReport();
fs.writeFileSync(reportPath, report);
console.log(`\n${colors.white}Report saved to: ${colors.cyan}${reportPath}${colors.reset}`);

// Exit with proper status code
if (hasIssues && ciMode) {
  console.log(`\n${colors.red}Security issues were found. Review the report for details.${colors.reset}`);
  process.exit(1);
} else if (hasIssues) {
  console.log(`\n${colors.yellow}Security issues were found. Please review the report.${colors.reset}`);
  process.exit(0);
} else {
  console.log(`\n${colors.green}No security issues found!${colors.reset}`);
  process.exit(0);
}