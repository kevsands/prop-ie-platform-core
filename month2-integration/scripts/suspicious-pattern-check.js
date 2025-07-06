#!/usr/bin/env node

/**
 * Script to check for suspicious patterns in files
 * 
 * This tool scans files for potentially malicious patterns like:
 * - Obfuscated code
 * - Known malicious domains
 * - Suspicious network requests
 * - Eval-like code
 * - Suspicious browser APIs
 * - Data exfiltration attempts
 * - Base64 encoded payloads
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

// Files to scan (from command line arguments)
const filesToScan = process.argv.slice(2);

// Known malicious or suspicious domains
const SUSPICIOUS_DOMAINS = [
  'coaufu.com',              // The known malicious domain from previous incident
  'evil.com',
  'malware.org',
  'pastebin.com',            // Often used for data exfiltration
  'gist.githubusercontent.com', // Could be used for data exfiltration
  /\.tk$/, /\.ml$/, /\.ga$/, /\.cf$/, // Common free domains used for malware
  /ngrok\.io$/,              // Tunneling service that can be abused
  /000webhostapp\.com$/,     // Free hosting often abused
];

// Patterns that indicate potential security issues
const SUSPICIOUS_PATTERNS = [
  // Obfuscated code patterns
  /eval\s*\(/i,
  /Function\s*\(/i,
  /fromCharCode/i,
  /atob\s*\(/i,
  /btoa\s*\(/i,
  /String\.fromCharCode/i,
  /decodeURIComponent/i,
  /unescape/i,
  /\\x[0-9a-f]{2}/i,            // Hex escape sequences
  /\\u[0-9a-f]{4}/i,            // Unicode escape sequences
  /\)\s*\(["'][^"']+["']\)/i,   // Self-executing functions with string args
  /new\s+Function\s*\(/i,
  
  // Suspicious network requests
  /fetch\s*\(\s*['"]http/i,
  /XMLHttpRequest/i,
  /\.open\s*\(\s*['"]GET/i,
  /\.open\s*\(\s*['"]POST/i,
  /\.send\s*\(/i,
  /navigator\.sendBeacon/i,
  /WebSocket\s*\(/i,
  
  // DOM-based XSS vectors
  /document\.write/i,
  /innerHTML\s*=/i,
  /outerHTML\s*=/i,
  /document\.location\s*=/i,
  /location\.href\s*=/i,
  /window\.location\s*=/i,
  /location\.replace/i,
  /location\.assign/i,
  
  // Suspicious browser storage
  /localStorage\.setItem/i,
  /sessionStorage\.setItem/i,
  /document\.cookie\s*=/i,
  
  // Shell command execution
  /exec\s*\(/i,
  /spawn\s*\(/i,
  /execSync/i,
  /spawnSync/i,
  /child_process/i,
  
  // Security bypasses
  /dangerouslySetInnerHTML/i,
  /allowDangerouslySetInnerHTML/i,
  
  // Base64 encoded chunks that may indicate obfuscation
  /['"](?:[A-Za-z0-9+/]{4}){20,}(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?['"]/g,
  
  // iframe abuse
  /iframe.+?src\s*=\s*["'][^"']*["']/i,
];

// Node-specific security issues
const NODE_SUSPICIOUS_PATTERNS = [
  // Arbitrary code execution
  /require\s*\(\s*['"`].*?['"`]\s*\+/i,  // Dynamic require with concatenation
  /import\s*\(\s*['"`].*?['"`]\s*\+/i,   // Dynamic import with concatenation
  
  // Command injection
  /exec\s*\(\s*.*?(?:\+|`)/i,
  /execSync\s*\(\s*.*?(?:\+|`)/i,
  /spawn\s*\(\s*.*?(?:\+|`)/i,
  /spawnSync\s*\(\s*.*?(?:\+|`)/i,
  
  // Dangerous Node.js APIs
  /(?:fs|child_process|http|https|net|dgram|crypto)\s*\.\s*(?:createServer|listen|createConnection|createSecureContext)/i,
  
  // Path traversal
  /(?:fs|require)(?:\.promises)?\s*\.\s*(?:readFile|readFileSync|writeFile|writeFileSync|appendFile|appendFileSync|createReadStream|createWriteStream)\s*\(\s*(?:.*?\.\.\/|.*?\.\.\\\|\.\.\))/i,
  
  // Shell commands
  /(?:sh|bash|cmd|powershell)(?:.exe)?\s+(?:-c|-command|-exec)/i,
];

// Critical patterns that should always be flagged (higher severity)
const CRITICAL_PATTERNS = [
  // Domain-specific malicious pattern (from our previous incident)
  /coaufu\.com/i,
  
  // Obvious backdoors
  /backdoor/i,
  /trojan/i,
  
  // Direct eval with external input
  /eval\s*\(\s*.*(?:fetch|get|post|request)\s*\(/i,
];

// Ignore certain files and directories
const IGNORED_PATHS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'coverage',
  '__snapshots__',
  'suspicious-pattern-check.js', // Ignore this file itself
];

// Check if a file should be ignored
function shouldIgnore(filePath) {
  return IGNORED_PATHS.some(ignorePath => filePath.includes(ignorePath));
}

// Check a single file for suspicious patterns
async function checkFile(filePath) {
  if (shouldIgnore(filePath)) {
    return [];
  }
  
  try {
    const content = await readFileAsync(filePath, 'utf-8');
    const findings = [];
    
    // Add additional patterns for specific file types
    let patternsToCheck = [...SUSPICIOUS_PATTERNS, ...CRITICAL_PATTERNS];
    
    // For JS/TS files, add Node.js specific patterns
    if (/\.(js|jsx|ts|tsx|mjs)$/i.test(filePath)) {
      patternsToCheck = [...patternsToCheck, ...NODE_SUSPICIOUS_PATTERNS];
    }
    
    // Check for each pattern
    for (const pattern of patternsToCheck) {
      const matches = content.match(pattern);
      if (matches) {
        // Is this a critical pattern?
        const isCritical = CRITICAL_PATTERNS.some(critPattern => 
          critPattern.toString() === pattern.toString());
        
        findings.push({
          file: filePath,
          pattern: pattern.toString(),
          matches: matches.length,
          severity: isCritical ? 'CRITICAL' : 'WARNING',
          line: getLineNumber(content, matches[0])
        });
      }
    }
    
    // Specific check for suspicious domains
    for (const domain of SUSPICIOUS_DOMAINS) {
      const domainPattern = domain instanceof RegExp ? domain : new RegExp(domain, 'i');
      const matches = content.match(domainPattern);
      if (matches) {
        findings.push({
          file: filePath,
          pattern: `Suspicious domain: ${domain.toString()}`,
          matches: matches.length,
          severity: 'CRITICAL',
          line: getLineNumber(content, matches[0])
        });
      }
    }
    
    return findings;
  } catch (error) {
    console.error(`Error scanning ${filePath}: ${error.message}`);
    return [];
  }
}

// Helper to get line number of a match
function getLineNumber(content, match) {
  if (!match) return -1;
  
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(match)) {
      return i + 1;
    }
  }
  return -1;
}

// Main function
async function main() {
  let allFindings = [];
  
  console.log(`Scanning ${filesToScan.length} files for suspicious patterns...`);
  
  // Scan all files in parallel
  const scanPromises = filesToScan.map(file => checkFile(file));
  const results = await Promise.all(scanPromises);
  
  // Combine all findings
  allFindings = results.flat();
  
  // Report findings
  if (allFindings.length === 0) {
    console.log('✅ No suspicious patterns found');
    process.exit(0);
  } else {
    console.log(`⚠️ Found ${allFindings.length} suspicious patterns:`);
    
    // Group findings by severity
    const criticalFindings = allFindings.filter(f => f.severity === 'CRITICAL');
    const warningFindings = allFindings.filter(f => f.severity === 'WARNING');
    
    // Report critical findings first
    if (criticalFindings.length > 0) {
      console.log(`\n🚨 CRITICAL FINDINGS (${criticalFindings.length}):`);
      criticalFindings.forEach(finding => {
        console.log(`  ${finding.file}:${finding.line} - ${finding.pattern} (${finding.matches} matches)`);
      });
    }
    
    // Then report warnings
    if (warningFindings.length > 0) {
      console.log(`\n⚠️ WARNINGS (${warningFindings.length}):`);
      warningFindings.forEach(finding => {
        console.log(`  ${finding.file}:${finding.line} - ${finding.pattern} (${finding.matches} matches)`);
      });
    }
    
    // Exit with non-zero code only for critical findings
    if (criticalFindings.length > 0) {
      process.exit(1);
    } else {
      // Just warnings - log but don't fail
      console.log('\n⚠️ Suspicious patterns found, but none were critical. Review recommended.');
      process.exit(0);
    }
  }
}

// Run the scanner
main().catch(error => {
  console.error('Error running suspicious pattern check:', error);
  process.exit(1);
});