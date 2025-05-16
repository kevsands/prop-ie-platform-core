#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths to check
const nodeModulesPath = path.resolve(process.cwd(), 'node_modules');
const packageJsonPath = path.resolve(process.cwd(), 'package.json');
const packageLockPath = path.resolve(process.cwd(), 'package-lock.json');

// Suspicious patterns to look for
const suspiciousPatterns = [
  // Scripts that modify DOM or perform redirects
  /location\s*=|location\.href|location\.replace|document\.write|innerHTML\s*=|window\.open/g,
  // URLs (especially non-localhost or non-HTTPS)
  /https?:\/\/(?!localhost|127\.0\.0\.1|0\.0\.0\.0)([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,}/g,
  // Encoded strings that might be obfuscated code
  /eval\(atob\(|eval\(decodeURIComponent\(|String\.fromCharCode\(/g,
  // Base64 encoded content
  /['"](?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?['"]/g,
  // Script execution
  /eval\(|new Function\(|setTimeout\(\s*['"`]/g,
  // Network requests
  /fetch\(|XMLHttpRequest|ajax\(|WebSocket/g,
  // Specifically look for coaufu.com or similar domains
  /coaufu\.com|c0aufu\.com|coaufu\./g
];

// Known legitimate domains to exclude from URL checks
const whitelistedDomains = [
  'googleapis.com',
  'gstatic.com',
  'cloudfront.net',
  'amazonaws.com',
  'github.com',
  'npmjs.com',
  'unpkg.com',
  'jsdelivr.net',
  'cloudflare.com'
];

// Main check function
async function checkForSuspiciousPackages() {
  console.log('🔍 Checking for suspicious packages...');
  
  const suspiciousFindings = [];
  
  // 1. Check for suspicious pre/post install scripts in dependencies
  console.log('Scanning package.json scripts...');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const packageLock = JSON.parse(fs.readFileSync(packageLockPath, 'utf8'));
  
  for (const [key, script] of Object.entries(packageJson.scripts || {})) {
    if (key.startsWith('pre') || key.startsWith('post')) {
      const result = checkStringForSuspiciousPatterns(script, `package.json scripts.${key}`);
      if (result.length > 0) {
        suspiciousFindings.push(...result);
      }
    }
  }
  
  // 2. Check for suspicious packages with hooks
  console.log('Scanning dependencies for suspicious patterns...');
  
  // Directories to skip
  const skipDirs = ['node_modules', '.git', '.next', 'out', 'build', 'dist'];
  
  // Function to scan a specific file
  function scanFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const result = checkStringForSuspiciousPatterns(content, filePath);
      if (result.length > 0) {
        suspiciousFindings.push(...result);
      }
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error.message);
    }
  }
  
  // Critical files to check directly
  scanFile(path.join(process.cwd(), 'package.json'));
  scanFile(path.join(process.cwd(), 'package-lock.json'));
  
  // Check node_modules direct dependencies for install scripts
  if (fs.existsSync(nodeModulesPath)) {
    const topLevelPackages = fs.readdirSync(nodeModulesPath)
      .filter(dir => !dir.startsWith('.') && !dir.startsWith('@'))
      .map(dir => path.join(nodeModulesPath, dir));
      
    const scopedPackagesRoots = fs.readdirSync(nodeModulesPath)
      .filter(dir => dir.startsWith('@'))
      .map(scope => path.join(nodeModulesPath, scope));
      
    let scopedPackages = [];
    for (const scopeDir of scopedPackagesRoots) {
      if (fs.existsSync(scopeDir) && fs.statSync(scopeDir).isDirectory()) {
        scopedPackages = [
          ...scopedPackages,
          ...fs.readdirSync(scopeDir)
            .map(pkg => path.join(scopeDir, pkg))
        ];
      }
    }
    
    const allPackages = [...topLevelPackages, ...scopedPackages];
    
    for (const pkgDir of allPackages) {
      if (!fs.existsSync(pkgDir) || !fs.statSync(pkgDir).isDirectory()) continue;
      
      const pkgJsonPath = path.join(pkgDir, 'package.json');
      if (!fs.existsSync(pkgJsonPath)) continue;
      
      try {
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
        const packageName = pkgJson.name;
        
        // Check package.json scripts
        for (const [key, script] of Object.entries(pkgJson.scripts || {})) {
          if (key.startsWith('pre') || key.startsWith('post')) {
            const result = checkStringForSuspiciousPatterns(script, `${packageName} scripts.${key}`);
            if (result.length > 0) {
              suspiciousFindings.push(...result);
            }
          }
        }
        
        // Check critical files for each package
        const criticalFiles = [
          'index.js',
          'main.js',
          'dist/index.js',
          'dist/main.js',
          'lib/index.js',
          'src/index.js'
        ];
        
        for (const file of criticalFiles) {
          const filePath = path.join(pkgDir, file);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            scanFile(filePath);
          }
        }
      } catch (error) {
        console.error(`Error checking package ${pkgDir}:`, error.message);
      }
    }
  }
  
  // Report findings
  if (suspiciousFindings.length > 0) {
    console.error('\n⚠️ SECURITY ALERT: Suspicious patterns found!\n');
    
    suspiciousFindings.forEach(finding => {
      console.error(`- ${finding.location}: ${finding.pattern} - "${finding.match}"`);
    });
    
    console.error('\nSome of these could be false positives, but please review carefully.');
    console.error('Consider removing suspicious packages or investigating further.');
    process.exitCode = 1;
  } else {
    console.log('✅ No suspicious patterns detected in packages.');
    process.exitCode = 0;
  }
}

function checkStringForSuspiciousPatterns(content, location) {
  if (!content) return [];
  
  const findings = [];
  
  for (const pattern of suspiciousPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      for (const match of matches) {
        // For URL checks, skip whitelisted domains
        if (pattern.toString().includes('https?')) {
          const isWhitelisted = whitelistedDomains.some(domain => match.includes(domain));
          if (isWhitelisted) continue;
        }
        
        findings.push({
          location,
          pattern: pattern.toString(),
          match
        });
      }
    }
  }
  
  return findings;
}

// Run the check
checkForSuspiciousPackages().catch(error => {
  console.error('Error running check:', error);
  process.exitCode = 1;
});