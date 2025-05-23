/**
 * Core TypeScript Error Fix
 * 
 * This script focuses on fixing TypeScript errors in core files
 * while maintaining high code quality and ensuring semantics are preserved.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const BACKUP_DIR = path.join(__dirname, '..', 'error-fix-backups');
const DRY_RUN = process.argv.includes('--dry-run');

// Core files to fix
const CORE_FILES = [
  // Types
  'src/types/models.ts',
  'src/types/three-extensions.d.ts',
  'src/types/next-api.d.ts',
  'src/types/development.ts',
  'src/types/auth-types.ts',
  'src/types/document.ts',
  'src/types/enums.ts',
  
  // Core utilities
  'src/utils/queryClient.ts',
  'src/utils/format.ts',
  'src/utils/paramValidator.ts',
  
  // Core libraries
  'src/lib/auth.ts',
  'src/lib/environment.ts',
  'src/lib/api-client.ts',
  
  // Core contexts
  'src/context/AuthContext.tsx',
  
  // Core components
  'src/components/ClientProviders.tsx',
  'src/components/AuthProvider.tsx',
  'src/components/ErrorBoundary.tsx',
  
  // Core layouts and pages
  'src/app/layout.tsx',
  'src/app/page.tsx'
];

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Utility to create a backup of a file before modifying it
function backupFile(filePath) {
  const fileName = path.basename(filePath);
  const backupPath = path.join(BACKUP_DIR, `${fileName}.bak-core-${Date.now()}`);
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

// Get TypeScript errors for a file
function getFileErrors(filePath) {
  try {
    execSync(`npx tsc --noEmit "${filePath}"`, { encoding: 'utf-8' });
    return []; // No errors
  } catch (error) {
    if (!error.stdout) return [];
    
    const lines = error.stdout.split('\n');
    const errors = [];
    
    lines.forEach(line => {
      // Extract error location and message
      const match = line.match(/\((\d+),(\d+)\):\s*error\s*(TS\d+):\s*(.*)/);
      if (match && match[1] && match[2] && match[3] && match[4]) {
        errors.push({
          line: parseInt(match[1], 10),
          column: parseInt(match[2], 10),
          code: match[3],
          message: match[4].trim()
        });
      }
    });
    
    return errors;
  }
}

// Fix missing commas and syntax issues
function fixSyntaxErrors(filePath, errors) {
  if (!fs.existsSync(filePath)) return false;
  
  // Read file content
  const content = fs.readFileSync(filePath, 'utf-8');
  let lines = content.split('\n');
  let modified = false;
  
  // Group errors by line
  const errorsByLine = {};
  errors.forEach(error => {
    if (!errorsByLine[error.line]) {
      errorsByLine[error.line] = [];
    }
    errorsByLine[error.line].push(error);
  });
  
  // Process each line with errors
  Object.keys(errorsByLine).sort((a, b) => b - a).forEach(lineNum => {
    const lineErrors = errorsByLine[lineNum];
    const lineIndex = parseInt(lineNum) - 1;
    
    if (lineIndex < 0 || lineIndex >= lines.length) return;
    
    const line = lines[lineIndex];
    let newLine = line;
    
    // Apply fixes for specific error codes
    lineErrors.forEach(error => {
      switch (error.code) {
        // Missing comma
        case 'TS1005':
          if (error.message === "',' expected.") {
            // Add comma at the error position
            const pos = error.column - 1;
            if (pos >= 0 && pos <= newLine.length) {
              newLine = newLine.slice(0, pos) + ',' + newLine.slice(pos);
              modified = true;
            }
          }
          break;
      }
    });
    
    if (newLine !== line) {
      lines[lineIndex] = newLine;
    }
  });
  
  // Write changes if modified
  if (modified) {
    if (!DRY_RUN) {
      backupFile(filePath);
      fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
    }
    console.log(`  ✅ Fixed syntax errors in ${filePath}`);
    return true;
  }
  
  return false;
}

// Fix incorrect imports for React Query v4
function fixReactQueryImports(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  // Skip non-TypeScript/React files
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return false;
  }
  
  // Read file content
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check for v3 imports
  if (!content.includes('from "react-query"') && 
      !content.includes("from 'react-query'")) {
    return false;
  }
  
  // Replace v3 imports with v4
  let newContent = content
    .replace(/from ['"]react-query['"]/g, 'from "@tanstack/react-query"')
    .replace(/import\s+\{\s*(.+?)\s*\}\s+from\s+['"]react-query['"]/g, 'import { $1 } from "@tanstack/react-query"');
  
  // Write changes if modified
  if (newContent !== content) {
    if (!DRY_RUN) {
      backupFile(filePath);
      fs.writeFileSync(filePath, newContent, 'utf-8');
    }
    console.log(`  📦 Fixed React Query imports in ${filePath}`);
    return true;
  }
  
  return false;
}

// Add missing type imports
function addMissingTypeImports(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  // Skip non-TypeScript/React files
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return false;
  }
  
  // Read file content
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Common type imports to add
  const missingImports = [];
  
  // Check for React FC usage without import
  if ((content.includes('React.FC') || content.includes(': FC<')) && 
      !content.includes('FC') && !content.includes('React.Component')) {
    missingImports.push("import React, { FC } from 'react';");
  }
  
  // Check for Next.js types
  if ((content.includes('NextApiRequest') || content.includes('NextApiResponse')) && 
      !content.includes('import { NextApiRequest') && !content.includes('NextApiResponse')) {
    missingImports.push("import { NextApiRequest, NextApiResponse } from 'next';");
  }
  
  // Check for Three.js imports
  if (content.includes('from "three"') || content.includes("from 'three'")) {
    if (!content.includes('@/types/three-extensions') && !content.includes('three-extensions')) {
      missingImports.push("import '@/types/three-extensions';");
    }
  }
  
  // If no missing imports, return
  if (missingImports.length === 0) {
    return false;
  }
  
  // Add imports at the top of the file
  const importSection = content.match(/import .+from ['"'].+['"'];?(\r?\n|$)/g) || [];
  let newContent = content;
  
  if (importSection.length > 0) {
    // Add after the last import
    const lastImport = importSection[importSection.length - 1];
    const lastImportIndex = content.lastIndexOf(lastImport) + lastImport.length;
    
    newContent = content.slice(0, lastImportIndex) + 
                '\n' + missingImports.join('\n') + '\n' + 
                content.slice(lastImportIndex);
  } else {
    // Add at the top
    newContent = missingImports.join('\n') + '\n\n' + content;
  }
  
  // Write changes if modified
  if (newContent !== content) {
    if (!DRY_RUN) {
      backupFile(filePath);
      fs.writeFileSync(filePath, newContent, 'utf-8');
    }
    console.log(`  📝 Added missing imports in ${filePath}`);
    return true;
  }
  
  return false;
}

// Main execution
console.log(`
=================================================
🔍 Core TypeScript Error Fix
=================================================
Running in ${DRY_RUN ? 'DRY RUN' : 'LIVE'} mode
`);

// Process each core file
let fixedCount = 0;

CORE_FILES.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }
  
  console.log(`\nProcessing: ${filePath}`);
  
  // Get TypeScript errors
  const errors = getFileErrors(filePath);
  console.log(`  Found ${errors.length} TypeScript errors`);
  
  // Apply fixes
  const importFixed = fixReactQueryImports(filePath);
  const typeImportsFixed = addMissingTypeImports(filePath);
  const syntaxFixed = fixSyntaxErrors(filePath, errors);
  
  if (importFixed || typeImportsFixed || syntaxFixed) {
    fixedCount++;
  }
});

console.log(`
=================================================
✅ Core TypeScript Error Fixes Complete
=================================================
Fixed ${fixedCount} of ${CORE_FILES.length} files
${DRY_RUN ? 'DRY RUN - No files were actually modified' : 'Backups saved to: ' + BACKUP_DIR}

Next steps:
1. Run 'npm run type-check' to verify fixes
2. Run 'node scripts/error-track-progress.js' to update error metrics
`);