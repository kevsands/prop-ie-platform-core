/**
 * Fix Common TypeScript Error Patterns
 * 
 * This script focuses on fixing the most common TypeScript errors
 * while preserving code quality. It targets specific patterns that
 * are safe to automatically fix.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const BACKUP_DIR = path.join(__dirname, '..', 'error-fix-backups');
const DRY_RUN = process.argv.includes('--dry-run');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Utility to create a backup of a file before modifying it
function backupFile(filePath) {
  const fileName = path.basename(filePath);
  const backupPath = path.join(BACKUP_DIR, `${fileName}.bak-patterns-${Date.now()}`);
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

// Get files with the most TypeScript errors
function getTopErrorFiles(limit = 10) {
  try {
    // Run TypeScript check and capture output
    const typescriptOutput = execSync('npx tsc --noEmit', { encoding: 'utf-8', stdio: 'pipe' });
    return []; // No errors
  } catch (error) {
    // Extract files and error counts
    const errorByFile = {};
    const lines = error.stdout.split('\n');
    
    lines.forEach(line => {
      const fileMatch = line.match(/([^(]+)\(\d+,\d+\):/);
      if (fileMatch && fileMatch[1]) {
        const filePath = fileMatch[1].trim();
        errorByFile[filePath] = (errorByFile[filePath] || 0) + 1;
      }
    });
    
    // Sort files by error count and take top 'limit'
    return Object.entries(errorByFile)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([file, count]) => ({ file, count }));
  }
}

// Fix common patterns in a file
function fixCommonPatterns(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }
  
  console.log(`\nProcessing: ${filePath}`);
  
  // Read file content
  const content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content;
  let modified = false;
  
  // Pattern 1: Fix React Query v3 imports
  if (content.includes('from "react-query"') || content.includes("from 'react-query'")) {
    newContent = newContent
      .replace(/from ['"]react-query['"]/g, 'from "@tanstack/react-query"')
      .replace(/import\s+\{\s*(.+?)\s*\}\s+from\s+['"]react-query['"]/g, 'import { $1 } from "@tanstack/react-query"');
    
    if (newContent !== content) {
      modified = true;
      console.log(`  📦 Fixed React Query imports`);
    }
  }
  
  // Pattern 2: Add Three.js type extensions import
  if ((content.includes('from "three"') || content.includes("from 'three'")) && 
      !content.includes("@/types/three-extensions")) {
    
    // Find position after imports
    const importMatches = content.match(/import .+from ['"].+['"];?(\r?\n|$)/g) || [];
    
    if (importMatches.length > 0) {
      const lastImport = importMatches[importMatches.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport) + lastImport.length;
      
      newContent = content.slice(0, lastImportIndex) + 
                  "\nimport '@/types/three-extensions';\n" + 
                  content.slice(lastImportIndex);
    } else {
      newContent = "import '@/types/three-extensions';\n\n" + content;
    }
    
    if (newContent !== content) {
      modified = true;
      console.log(`  📝 Added Three.js type extensions import`);
    }
  }
  
  // Pattern 3: Fix missing commas in type/interface declarations
  const interfacePattern = /interface\s+\w+\s*(?:extends\s+[\w\s,]+)?\s*\{([^}]+)\}/g;
  let match;
  
  while ((match = interfacePattern.exec(newContent)) !== null) {
    const interfaceContent = match[1];
    const fixedContent = interfaceContent.replace(/(\w+\s*:\s*(?:string|number|boolean|any|\w+(?:\[\])?|[\w<>|&[\]{}]+))\s*(?=\w+\s*:)/g, '$1,\n  ');
    
    if (fixedContent !== interfaceContent) {
      newContent = newContent.replace(interfaceContent, fixedContent);
      modified = true;
    }
  }
  
  if (modified) {
    // Back up the file
    const backupPath = backupFile(filePath);
    
    // Write the modified content
    if (!DRY_RUN) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
    }
    
    console.log(`  ✅ Applied fixes to ${filePath}`);
    return true;
  }
  
  console.log(`  ⚠️ No fixes applied`);
  return false;
}

// Fix specific files based on file extension patterns
function fixFilesByPattern(pattern, fileLimit = 10) {
  try {
    // Find files matching the pattern
    const cmd = `find src -type f -name "${pattern}" | sort | head -n ${fileLimit}`;
    const output = execSync(cmd, { encoding: 'utf-8' });
    
    const files = output.split('\n').filter(Boolean);
    console.log(`Found ${files.length} files matching pattern ${pattern}`);
    
    let fixedCount = 0;
    
    files.forEach(file => {
      const fixed = fixCommonPatterns(file);
      if (fixed) fixedCount++;
    });
    
    return fixedCount;
  } catch (error) {
    console.error(`Error finding files matching pattern ${pattern}:`, error);
    return 0;
  }
}

// Main execution
console.log(`
=================================================
🔧 Fix Common TypeScript Error Patterns
=================================================
Running in ${DRY_RUN ? 'DRY RUN' : 'LIVE'} mode
`);

// Get files with most errors and fix them
console.log('Finding files with the most TypeScript errors...');
const topErrorFiles = getTopErrorFiles(15);
console.log(`Found ${topErrorFiles.length} files with the most errors`);

let fixedFiles = 0;

topErrorFiles.forEach(({ file, count }) => {
  console.log(`File: ${file} (${count} errors)`);
  const fixed = fixCommonPatterns(file);
  if (fixed) fixedFiles++;
});

// Also fix specific file types
console.log('\nFixing TypeScript type definition files...');
const fixedTypeFiles = fixFilesByPattern('*.d.ts', 10);

console.log('\nFixing React component files with JSX...');
const fixedComponentFiles = fixFilesByPattern('*.tsx', 20);

console.log('\nFixing utility files...');
const fixedUtilFiles = fixFilesByPattern('util*.ts', 10);

console.log(`
=================================================
✅ TypeScript Pattern Fixes Complete
=================================================
Fixed ${fixedFiles} files with top errors
Fixed ${fixedTypeFiles} type definition files
Fixed ${fixedComponentFiles} React component files
Fixed ${fixedUtilFiles} utility files
${DRY_RUN ? 'DRY RUN - No files were actually modified' : 'Backups saved to: ' + BACKUP_DIR}

Next steps:
1. Run 'npm run type-check' to verify fixes
2. Run 'node scripts/error-track-progress.js' to update error metrics
`);