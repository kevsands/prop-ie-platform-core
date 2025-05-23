/**
 * Fix JSX Syntax Errors in Top Error Files
 * 
 * This script targets the files with the most TypeScript errors
 * to apply focused fixes for common JSX syntax issues.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const BACKUP_DIR = path.join(__dirname, '..', 'error-fix-backups');
const DRY_RUN = process.argv.includes('--dry-run');

// Top error files identified from error reports
const TOP_ERROR_FILES = [
  'src/features/security/AccessControlManagement.tsx',
  'src/app/register/professional/page.tsx',
  'src/features/security/DataEncryptionService.tsx',
  'src/app/transaction-dashboard/page.tsx',
  'src/features/compliance/ComplianceDashboard.tsx',
  'src/features/security/RuntimeSecurityMonitor.tsx',
  'src/app/developer/tenders/page.tsx',
  'src/app/developments/[id]/page.tsx',
  'src/components/dashboard/ProjectOverview.tsx',
  'src/components/navigation/NextGenNavigation.tsx'
];

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Utility to create a backup of a file before modifying it
function backupFile(filePath) {
  const fileName = path.basename(filePath);
  const backupPath = path.join(BACKUP_DIR, `${fileName}.bak-jsx-${Date.now()}`);
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

// Fix common JSX syntax errors
function fixJsxSyntaxErrors(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return false;
  }
  
  console.log(`\nProcessing: ${filePath}`);
  
  // Create backup
  const backupPath = backupFile(filePath);
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  let fixes = 0;
  
  // Fix 1: Add commas after type annotations in function parameters
  content = content.replace(/(\w+)\s*:\s*(string|number|boolean|any|React\.\w+|[\w.<>|&[\]]+)\s*(\w+)/g, 
    (match, param1, type, param2) => {
      return `${param1}: ${type}, ${param2}`;
    }
  );
  
  // Fix 2: Fix missing commas in object literals
  content = content.replace(/(\w+)\s*:\s*(string|number|boolean|any|React\.\w+|[\w.]+)\s*(?=\w+\s*:)/g, '$1: $2, ');
  
  // Fix 3: Fix missing closing brackets and parentheses
  const bracketCounts = {
    '(': 0,
    ')': 0,
    '{': 0,
    '}': 0,
    '<': 0,
    '>': 0
  };
  
  // Count all brackets
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (bracketCounts.hasOwnProperty(char)) {
      bracketCounts[char]++;
    }
  }
  
  // Add missing closing brackets at the end of the file
  let appendText = '';
  if (bracketCounts['{'] > bracketCounts['}']) {
    const diff = bracketCounts['{'] - bracketCounts['}'];
    console.log(`  Missing ${diff} closing curly braces`);
    appendText += '}'.repeat(diff);
    fixes += diff;
  }
  
  if (bracketCounts['('] > bracketCounts[')']) {
    const diff = bracketCounts['('] - bracketCounts[')'];
    console.log(`  Missing ${diff} closing parentheses`);
    appendText += ')'.repeat(diff);
    fixes += diff;
  }
  
  if (appendText) {
    content += `\n\n/* Auto-fixed missing brackets */\n${appendText}`;
  }
  
  // Fix 4: Fix JSX closing tags by examining opening and closing tag counts
  const jsxTagRegex = /<([A-Z]\w+)([^>]*)>/g;
  const closingTagRegex = /<\/([A-Z]\w+)>/g;
  
  const openTags = {};
  let match;
  
  // Count opening tags
  while ((match = jsxTagRegex.exec(content)) !== null) {
    const tagName = match[1];
    const tagContent = match[2];
    
    // Skip self-closing tags
    if (tagContent.endsWith('/')) continue;
    
    openTags[tagName] = (openTags[tagName] || 0) + 1;
  }
  
  // Count closing tags
  while ((match = closingTagRegex.exec(content)) !== null) {
    const tagName = match[1];
    if (openTags[tagName]) {
      openTags[tagName]--;
    }
  }
  
  // Add missing closing tags
  let closingJsxTags = '';
  for (const [tag, count] of Object.entries(openTags)) {
    if (count > 0) {
      console.log(`  Missing ${count} closing tag(s) for <${tag}>`);
      closingJsxTags += `</${tag}>`.repeat(count);
      fixes += count;
    }
  }
  
  if (closingJsxTags) {
    content += `\n\n/* Auto-fixed missing JSX tags */\n${closingJsxTags}`;
  }
  
  // Fix 5: Fix common type annotation syntax errors
  content = content.replace(/(\w+)\s*:\s*{\s*([^}]+?)\s*}\s*(?=[,)])/g, '$1: { $2 }');
  
  // Save changes if content was modified
  if (content !== originalContent) {
    if (!DRY_RUN) {
      fs.writeFileSync(filePath, content, 'utf-8');
    }
    console.log(`  ✅ Applied ${fixes > 0 ? fixes : 'multiple'} fixes`);
    return true;
  }
  
  console.log('  ⚠️ No fixes applied');
  return false;
}

// Apply more targeted fixes to specific error locations
function applyTargetedFixes(filePath) {
  // Skip non-existent files
  if (!fs.existsSync(filePath)) return false;
  
  // Get error locations by running TypeScript compiler
  let errors = [];
  try {
    execSync(`npx tsc --noEmit "${filePath}"`, { encoding: 'utf-8' });
    return false; // No errors to fix
  } catch (error) {
    const output = error.stdout || '';
    const lines = output.split('\n');
    
    // Extract errors with line and column information
    for (const line of lines) {
      const match = line.match(/\((\d+),(\d+)\):\s*error\s*(TS\d+):\s*(.*)/);
      if (match) {
        errors.push({
          line: parseInt(match[1]),
          column: parseInt(match[2]),
          code: match[3],
          message: match[4]
        });
      }
    }
  }
  
  // If no errors found, return
  if (errors.length === 0) return false;
  console.log(`  Found ${errors.length} TypeScript errors`);
  
  // Group errors by line
  const errorsByLine = {};
  errors.forEach(error => {
    if (!errorsByLine[error.line]) {
      errorsByLine[error.line] = [];
    }
    errorsByLine[error.line].push(error);
  });
  
  // Read file content and split into lines
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let modified = false;
  
  // Process each line with errors
  Object.keys(errorsByLine).sort((a, b) => b - a).forEach(lineNumber => {
    const lineErrors = errorsByLine[lineNumber];
    const lineIndex = parseInt(lineNumber) - 1;
    
    if (lineIndex < 0 || lineIndex >= lines.length) return;
    
    let line = lines[lineIndex];
    let fixedLine = line;
    
    // Apply fixes based on error types
    for (const error of lineErrors) {
      switch (error.code) {
        case 'TS1005': // ',' expected
          if (error.message === "',' expected.") {
            const pos = error.column - 1;
            fixedLine = fixedLine.slice(0, pos) + ',' + fixedLine.slice(pos);
            modified = true;
          } else if (error.message === "'}' expected.") {
            fixedLine += ' }';
            modified = true;
          } else if (error.message === "')' expected.") {
            fixedLine += ' )';
            modified = true;
          }
          break;
          
        case 'TS17002': // Expected corresponding JSX closing tag
          const tagMatch = error.message.match(/Expected corresponding JSX closing tag for ['"]([^'"]+)['"]/);
          if (tagMatch) {
            const tag = tagMatch[1];
            fixedLine += `</${tag}>`;
            modified = true;
          }
          break;
      }
    }
    
    lines[lineIndex] = fixedLine;
  });
  
  // Write modified content back to file
  if (modified) {
    if (!DRY_RUN) {
      const backupPath = backupFile(filePath);
      fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
    }
    console.log(`  🔧 Applied targeted fixes`);
    return true;
  }
  
  return false;
}

// Main execution
console.log(`
=================================================
🔍 JSX Syntax Error Fixer (Top Errors)
=================================================
Running in ${DRY_RUN ? 'DRY RUN' : 'LIVE'} mode
`);

// Process each file
let fixedCount = 0;

TOP_ERROR_FILES.forEach(filePath => {
  const fixed1 = fixJsxSyntaxErrors(filePath);
  const fixed2 = applyTargetedFixes(filePath);
  
  if (fixed1 || fixed2) {
    fixedCount++;
  }
});

console.log(`
=================================================
✅ JSX Syntax Fixes complete!
=================================================
Fixed ${fixedCount} of ${TOP_ERROR_FILES.length} files
${DRY_RUN ? 'DRY RUN - No files were actually modified' : 'Backups saved to: ' + BACKUP_DIR}

Next steps:
1. Run 'npm run type-check' to verify fixes
2. Run 'node scripts/error-track-progress.js' to update error metrics
3. Consider running this script again for remaining errors
`);