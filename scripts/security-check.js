#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

/**
 * Security Check Script
 * Performs comprehensive checks for signs of compromise
 */

// Configuration
const SUSPICIOUS_PATTERNS = [
  // Crypto mining patterns
  'crypto',
  'miner',
  'mining',
  'hashrate',
  'stratum',
  'pool',
  'coin',
  'wallet',
  'xmr',
  'monero',
  'bitcoin',
  'eth',
  'ethereum',
  
  // Malware patterns
  'backdoor',
  'trojan',
  'rootkit',
  'exploit',
  'payload',
  'shell',
  'reverse',
  'bind',
  'connect',
  
  // Suspicious network patterns
  '0.0.0.0',
  '255.255.255.255',
  'raw socket',
  'packet',
  'sniff',
  'inject',
  
  // Suspicious file operations
  'chmod 777',
  'chmod +x',
  'chmod u+s',
  'chmod g+s',
  'chmod o+s',
  
  // Suspicious process patterns
  'fork bomb',
  'fork()',
  'exec',
  'system',
  'eval',
  'Function(',
  
  // Suspicious network ports
  '6667', // IRC
  '4444', // Metasploit
  '1337', // Common backdoor
  '31337', // Elite
  '65535' // Maximum port
];

const SUSPICIOUS_FILES = [
  '.bash_history',
  '.ssh/authorized_keys',
  '.ssh/known_hosts',
  '.aws/credentials',
  '.npmrc',
  '.env',
  'package.json',
  'package-lock.json',
  'yarn.lock'
];

const SUSPICIOUS_PROCESSES = [
  'cryptominer',
  'miner',
  'stratum',
  'xmr',
  'monero',
  'bitcoin',
  'eth',
  'ethereum'
];

/**
 * Check for suspicious patterns in files
 */
function checkFilePatterns() {
  console.log('\n🔍 Checking files for suspicious patterns...');
  
  const results = [];
  const files = getAllFiles(process.cwd());
  let processedCount = 0;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const suspicious = SUSPICIOUS_PATTERNS.filter(pattern => 
        content.toLowerCase().includes(pattern.toLowerCase())
      );
      
      if (suspicious.length > 0) {
        console.log(`\n⚠️ Suspicious patterns found in ${file}:`);
        suspicious.forEach(pattern => console.log(`  - ${pattern}`));
        results.push({
          file,
          patterns: suspicious
        });
        
        // Take immediate action for critical files
        if (file.includes('package.json') || file.includes('.env')) {
          console.log(`\n🚨 Critical file affected: ${file}`);
          console.log('Taking immediate action...');
          
          // Backup the file
          const backupPath = `${file}.backup-${Date.now()}`;
          fs.copyFileSync(file, backupPath);
          console.log(`Created backup at: ${backupPath}`);
          
          // For package.json, we'll need to audit dependencies
          if (file.includes('package.json')) {
            console.log('\nRunning npm audit...');
            try {
              const auditResult = execSync('npm audit').toString();
              console.log(auditResult);
            } catch (error) {
              console.error('Error running npm audit:', error.message);
            }
          }
        }
      }
      
      processedCount++;
      if (processedCount % 100 === 0) {
        console.log(`Processed ${processedCount} files...`);
      }
    } catch (error) {
      // Skip binary files and permission errors
    }
  }
  
  return results;
}

/**
 * Check for suspicious file modifications
 */
function checkFileModifications() {
  console.log('\n📝 Checking for suspicious file modifications...');
  
  const results = [];
  const files = getAllFiles(process.cwd());
  
  for (const file of files) {
    try {
      const stats = fs.statSync(file);
      const suspicious = SUSPICIOUS_FILES.includes(path.basename(file));
      
      if (suspicious) {
        results.push({
          file,
          lastModified: stats.mtime,
          size: stats.size
        });
      }
    } catch (error) {
      // Skip permission errors
    }
  }
  
  return results;
}

/**
 * Check for suspicious processes
 */
function checkProcesses() {
  console.log('\n⚙️ Checking for suspicious processes...');
  
  try {
    const processes = execSync('ps aux').toString();
    const results = [];
    
    for (const process of SUSPICIOUS_PROCESSES) {
      if (processes.toLowerCase().includes(process.toLowerCase())) {
        console.log(`\n⚠️ Suspicious process found: ${process}`);
        results.push(process);
        
        // Take immediate action for suspicious processes
        console.log('Attempting to terminate suspicious process...');
        try {
          execSync(`pkill -f "${process}"`);
          console.log('Process terminated successfully');
        } catch (error) {
          console.error('Error terminating process:', error.message);
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error checking processes:', error);
    return [];
  }
}

/**
 * Check for suspicious network connections
 */
function checkNetworkConnections() {
  console.log('\n🌐 Checking network connections...');
  
  try {
    const connections = execSync('netstat -tuln').toString();
    const results = [];
    
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (connections.toLowerCase().includes(pattern.toLowerCase())) {
        console.log(`\n⚠️ Suspicious network connection found: ${pattern}`);
        results.push(pattern);
        
        // Take immediate action for suspicious connections
        console.log('Attempting to block suspicious connection...');
        try {
          // This is a basic example - in production, you'd want to use proper firewall rules
          execSync(`sudo lsof -i | grep "${pattern}"`);
          console.log('Connection details logged');
        } catch (error) {
          console.error('Error blocking connection:', error.message);
        }
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error checking network connections:', error);
    return [];
  }
}

/**
 * Check for suspicious npm packages
 */
function checkNpmPackages() {
  console.log('\n📦 Checking npm packages...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const results = [];
    
    // Check dependencies
    for (const [name, version] of Object.entries(packageJson.dependencies || {})) {
      if (SUSPICIOUS_PATTERNS.some(pattern => name.toLowerCase().includes(pattern))) {
        results.push({ name, version, type: 'dependency' });
      }
    }
    
    // Check devDependencies
    for (const [name, version] of Object.entries(packageJson.devDependencies || {})) {
      if (SUSPICIOUS_PATTERNS.some(pattern => name.toLowerCase().includes(pattern))) {
        results.push({ name, version, type: 'devDependency' });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error checking npm packages:', error);
    return [];
  }
}

/**
 * Get all files in a directory recursively
 */
function getAllFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      
      try {
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip node_modules and .git
          if (item !== 'node_modules' && item !== '.git') {
            traverse(fullPath);
          }
        } else {
          files.push(fullPath);
        }
      } catch (error) {
        // Skip permission errors
      }
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * Main function
 */
async function main() {
  console.log('🔒 Starting security check...');
  
  // Run all checks
  const filePatterns = checkFilePatterns();
  const fileModifications = checkFileModifications();
  const processes = checkProcesses();
  const networkConnections = checkNetworkConnections();
  const npmPackages = checkNpmPackages();
  
  // Print results
  console.log('\n📊 Security Check Results:');
  
  if (filePatterns.length > 0) {
    console.log('\n⚠️ Suspicious patterns found in files:');
    filePatterns.forEach(({ file, patterns }) => {
      console.log(`  ${file}:`);
      patterns.forEach(pattern => console.log(`    - ${pattern}`));
    });
  }
  
  if (fileModifications.length > 0) {
    console.log('\n⚠️ Suspicious file modifications:');
    fileModifications.forEach(({ file, lastModified, size }) => {
      console.log(`  ${file}:`);
      console.log(`    - Last modified: ${lastModified}`);
      console.log(`    - Size: ${size} bytes`);
    });
  }
  
  if (processes.length > 0) {
    console.log('\n⚠️ Suspicious processes found:');
    processes.forEach(process => console.log(`  - ${process}`));
  }
  
  if (networkConnections.length > 0) {
    console.log('\n⚠️ Suspicious network connections:');
    networkConnections.forEach(connection => console.log(`  - ${connection}`));
  }
  
  if (npmPackages.length > 0) {
    console.log('\n⚠️ Suspicious npm packages:');
    npmPackages.forEach(({ name, version, type }) => {
      console.log(`  - ${name}@${version} (${type})`);
    });
  }
  
  if (
    filePatterns.length === 0 &&
    fileModifications.length === 0 &&
    processes.length === 0 &&
    networkConnections.length === 0 &&
    npmPackages.length === 0
  ) {
    console.log('\n✅ No suspicious activity detected.');
  } else {
    console.log('\n❌ Potential security issues detected!');
    console.log('Please review the results above and take appropriate action.');
  }
}

// Run the script
main().catch(console.error); 