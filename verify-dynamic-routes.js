#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of all dynamic route files to check
const filesToCheck = [
  '/app/api/v1/transactions/[id]/transition/route.ts',
  '/app/api/v1/transactions/[id]/route.ts',
  '/app/api/htb/buyer/claims/[id]/route.ts',
  '/app/api/developments/[id]/route.ts',
  '/app/api/slp/[projectId]/route.ts',
  '/app/api/projects/[id]/sales/route.ts',
  '/app/api/projects/[id]/activity/route.ts',
  '/app/api/projects/[id]/alerts/route.ts',
  '/app/api/projects/[id]/route.ts',
  '/app/api/transactions/[id]/payment-process/route.ts',
  '/app/api/transactions/[id]/payments/route.ts',
  '/app/api/transactions/[id]/route.ts',
];

function checkFileStructure(content) {
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  const issues = [];
  
  methods.forEach(method => {
    // Pattern for incorrect parameter structure
    const incorrectPattern = new RegExp(
      `export\\s+async\\s+function\\s+${method}\\s*\\([^)]*\\{\\s*params\\s*\\}\\s*:\\s*\\{\\s*params:\\s*\\{[^}]+\\}\\s*\\}\\s*\\)`,
      'g'
    );
    
    // Pattern for correct Promise-based structure
    const correctPattern = new RegExp(
      `export\\s+async\\s+function\\s+${method}\\s*\\([^)]*\\{\\s*params\\s*\\}\\s*:\\s*\\{\\s*params:\\s*Promise<\\{[^}]+\\}>\\s*\\}\\s*\\)`,
      'g'
    );
    
    // Alternative patterns with 'context' parameter
    const incorrectContextPattern = new RegExp(
      `export\\s+async\\s+function\\s+${method}\\s*\\([^)]*context\\s*:\\s*\\{\\s*params:\\s*\\{[^}]+\\}\\s*\\}\\s*\\)`,
      'g'
    );
    
    const correctContextPattern = new RegExp(
      `export\\s+async\\s+function\\s+${method}\\s*\\([^)]*context\\s*:\\s*\\{\\s*params:\\s*Promise<\\{[^}]+\\}>\\s*\\}\\s*\\)`,
      'g'
    );
    
    // Check if method exists
    const methodExists = content.includes(`export async function ${method}`);
    if (!methodExists) return;
    
    // Check for incorrect patterns
    if (incorrectPattern.test(content) || incorrectContextPattern.test(content)) {
      issues.push(`${method} method has incorrect parameter structure (missing Promise)`);
    }
    
    // Check if params are awaited when using Promise
    if (correctPattern.test(content) || correctContextPattern.test(content)) {
      // Check if params are awaited
      const awaitPattern = /const\s+(?:\{[^}]*\}|\w+)\s*=\s*await\s+(?:context\.)?params/;
      if (!awaitPattern.test(content)) {
        issues.push(`${method} method uses Promise params but doesn't await them`);
      }
    }
  });
  
  return issues;
}

async function checkAllFiles() {
  const srcDir = path.join(__dirname, 'src');
  console.log('=== Dynamic Route Parameter Structure Check ===\n');
  
  let totalIssues = 0;
  let filesWithIssues = 0;
  
  for (const file of filesToCheck) {
    const filePath = path.join(srcDir, file);
    
    try {
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${file}`);
        continue;
      }
      
      const content = fs.readFileSync(filePath, 'utf8');
      const issues = checkFileStructure(content);
      
      if (issues.length > 0) {
        console.log(`❌ ${file}`);
        issues.forEach(issue => console.log(`   - ${issue}`));
        totalIssues += issues.length;
        filesWithIssues++;
      } else {
        console.log(`✅ ${file}`);
      }
    } catch (error) {
      console.error(`❌ Error checking ${file}: ${error.message}`);
    }
  }
  
  console.log('\n=== Summary ===');
  console.log(`Total files checked: ${filesToCheck.length}`);
  console.log(`Files with issues: ${filesWithIssues}`);
  console.log(`Total issues found: ${totalIssues}`);
}

// Run the check
checkAllFiles().catch(console.error);