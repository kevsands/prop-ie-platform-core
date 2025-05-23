/**
 * Fix TS1005 Comma Errors
 * 
 * This script targets the most common TypeScript error - TS1005 ',' expected.
 * It adds missing commas in object literals, function parameters, type declarations, etc.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const BACKUP_DIR = path.join(__dirname, '..', 'error-fix-backups');
const DRY_RUN = process.argv.includes('--dry-run');

// Files with the most comma errors from TS1005
const TARGET_FILES = [
  'src/lib/contractor-management/index.ts',
  'src/lib/developer-platform/index.ts',
  'src/lib/graphql/resolvers/development.ts',
  'src/lib/supplierApi.ts',
  'src/lib/transaction-engine/snagging-system.ts',
  'src/lib/transaction-engine/handover-system.ts',
  'src/services/realtime/RealtimeEngine.ts',
  'src/services/realtime/collaboration-engine.ts',
  'src/services/development-service.ts',
  'src/app/api/v1/developer/projects/route.ts'
];

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Utility to create a backup of a file before modifying it
function backupFile(filePath) {
  const fileName = path.basename(filePath);
  const backupPath = path.join(BACKUP_DIR, `${fileName}.bak-comma-${Date.now()}`);
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

// Get specific comma error locations from TypeScript compiler
function getCommaErrorLocations(filePath) {
  try {
    execSync(`npx tsc --noEmit "${filePath}"`, { encoding: 'utf-8' });
    return []; // No errors
  } catch (error) {
    const output = error.stdout || '';
    const errors = [];
    
    // Find all TS1005 comma errors
    const lines = output.split('\n');
    for (const line of lines) {
      const match = line.match(/\((\d+),(\d+)\):\s*error\s*(TS1005):\s*['"],(.*)/);
      if (match) {
        errors.push({
          line: parseInt(match[1]),
          column: parseInt(match[2])
        });
      }
    }
    
    return errors;
  }
}

// Fix comma errors in a file
function fixCommaErrors(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return false;
  }
  
  console.log(`\nProcessing: ${filePath}`);
  
  // Get comma error locations
  const commaErrors = getCommaErrorLocations(filePath);
  if (commaErrors.length === 0) {
    console.log('  ✓ No comma errors found');
    return false;
  }
  
  console.log(`  Found ${commaErrors.length} comma errors`);
  
  // Create backup
  const backupPath = backupFile(filePath);
  
  // Read file content
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // Sort errors by line number in descending order to prevent position shifts
  commaErrors.sort((a, b) => b.line - a.line || b.column - a.column);
  
  // Apply fixes
  let fixCount = 0;
  
  for (const error of commaErrors) {
    const lineIndex = error.line - 1;
    if (lineIndex < 0 || lineIndex >= lines.length) continue;
    
    const line = lines[lineIndex];
    const column = error.column - 1;
    
    if (column < 0 || column >= line.length) continue;
    
    // Insert comma at the error location
    const newLine = line.slice(0, column) + ',' + line.slice(column);
    lines[lineIndex] = newLine;
    fixCount++;
  }
  
  // Apply additional regex-based fixes
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Fix 1: Fix missing commas in object literal property declarations
    let newLine = line.replace(/(\w+)\s*:\s*(string|number|boolean|any|[\w.<>|&[\]]+)\s*(\w+)\s*:/g, '$1: $2, $3:');
    
    // Fix 2: Fix missing commas in function parameter lists
    newLine = newLine.replace(/(\w+)\s*:\s*(string|number|boolean|any|[\w.<>|&[\]]+)\s*(\w+)\s*[)]/g, '$1: $2, $3)');
    
    // Fix 3: Fix missing commas in array declarations
    newLine = newLine.replace(/(\w+|\d+|true|false|null|undefined)\s*(\w+|\d+|true|false|null|undefined)/g, (match, p1, p2) => {
      // Only if it looks like an array element
      if (line.includes('[') && !line.includes('=')) {
        return `${p1}, ${p2}`;
      }
      return match;
    });
    
    if (newLine !== line) {
      lines[i] = newLine;
      fixCount++;
    }
  }
  
  // Write updated content if changes were made
  if (fixCount > 0) {
    if (!DRY_RUN) {
      fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
    }
    console.log(`  ✅ Fixed ${fixCount} comma errors`);
    return true;
  }
  
  console.log('  ⚠️ No fixes applied');
  return false;
}

// Apply more targeted fixes for TS1005 errors
function applyTargetedFixes(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  // Read file content
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Common patterns that often need commas
  const patterns = [
    // Type annotations in interfaces and type declarations
    { regex: /(\w+):\s*(string|number|boolean|any|[\w.<>|&[\]{}]+)(?=\s*\n\s*\w+\s*:)/g, replacement: '$1: $2,' },
    
    // Function parameters
    { regex: /(\w+):\s*(string|number|boolean|any|[\w.<>|&[\]{}]+)(?=\s*\n\s*\w+\s*:)/g, replacement: '$1: $2,' },
    
    // Object literals
    { regex: /(\w+):\s*([\w.]+)(?=\s*\n\s*\w+\s*:)/g, replacement: '$1: $2,' },
    
    // Array elements
    { regex: /(\[\s*[\w"']+)(?=\s*\n\s*[\w"']+)/g, replacement: '$1,' },
  ];
  
  let modified = false;
  let newContent = content;
  
  // Apply regex patterns
  for (const { regex, replacement } of patterns) {
    const updatedContent = newContent.replace(regex, replacement);
    if (updatedContent !== newContent) {
      modified = true;
      newContent = updatedContent;
    }
  }
  
  // Save changes if content was modified
  if (modified) {
    if (!DRY_RUN) {
      const backupPath = backupFile(filePath);
      fs.writeFileSync(filePath, newContent, 'utf-8');
    }
    console.log('  🔧 Applied additional targeted fixes');
    return true;
  }
  
  return false;
}

// Main execution
console.log(`
=================================================
🔧 TS1005 Comma Error Fixer
=================================================
Running in ${DRY_RUN ? 'DRY RUN' : 'LIVE'} mode
`);

// Process each target file
let fixedCount = 0;

TARGET_FILES.forEach(filePath => {
  const fixed1 = fixCommaErrors(filePath);
  const fixed2 = applyTargetedFixes(filePath);
  
  if (fixed1 || fixed2) {
    fixedCount++;
  }
});

console.log(`
=================================================
✅ Comma Error Fixes complete!
=================================================
Fixed ${fixedCount} of ${TARGET_FILES.length} files
${DRY_RUN ? 'DRY RUN - No files were actually modified' : 'Backups saved to: ' + BACKUP_DIR}

Next steps:
1. Run 'npm run type-check' to verify fixes
2. Run 'node scripts/error-track-progress.js' to update error metrics
3. Consider running this script again for remaining errors
`);