/**
 * Fix JSX Syntax Errors
 * 
 * This script identifies and fixes common JSX syntax errors that occur when
 * type annotations are added to React components. It fixes issues like mismatched
 * brackets, missing commas, and unclosed JSX tags.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const ERROR_REPORTS_DIR = path.join(__dirname, '..', 'error-reports');
const BACKUP_DIR = path.join(__dirname, '..', 'error-fix-backups');
const DRY_RUN = process.argv.includes('--dry-run');

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

// Get files with the most syntax errors
function getErrorFiles() {
  const summaryPath = path.join(ERROR_REPORTS_DIR, 'summary.md');
  if (!fs.existsSync(summaryPath)) {
    console.error('Error summary not found. Run error-audit.js first.');
    process.exit(1);
  }

  try {
    const summary = fs.readFileSync(summaryPath, 'utf-8');
    
    // Extract files with most errors section
    const filesSection = summary.match(/## Files with Most Errors[\s\S]*?(##|$)/m);
    if (!filesSection) return [];
    
    // Parse file paths from this section
    const fileMatches = filesSection[0].match(/- (src\/.*?):/g);
    if (!fileMatches) return [];
    
    return fileMatches.map(match => match.replace(/- (.*):/, '$1').trim());
  } catch (error) {
    console.error('Failed to parse error summary:', error);
    return [];
  }
}

// Fix common JSX syntax errors
function fixJsxSyntaxErrors(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return false;
  }
  
  // Process TypeScript files too for type definition errors
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.jsx') && !filePath.endsWith('.ts')) {
    return false;
  }
  
  console.log(`\nProcessing: ${filePath}`);
  
  // Create backup
  const backupPath = backupFile(filePath);
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  let fixes = 0;
  
  // Fix 1: Fix HTML entities in JSX
  const htmlEntityFixes = [
    { pattern: /&lbrace;/g, replacement: '{', name: 'left brace' },
    { pattern: /&rbrace;/g, replacement: '}', name: 'right brace' },
    { pattern: /&lt;/g, replacement: '<', name: 'less than' },
    { pattern: /&gt;/g, replacement: '>', name: 'greater than' },
    { pattern: /&amp;/g, replacement: '&', name: 'ampersand' },
    { pattern: /&quot;/g, replacement: '"', name: 'quote' },
    { pattern: /&apos;/g, replacement: "'", name: 'apostrophe' },
    { pattern: /&#39;/g, replacement: "'", name: 'apostrophe' },
    { pattern: /&#x27;/g, replacement: "'", name: 'apostrophe' }
  ];
  
  htmlEntityFixes.forEach(({ pattern, replacement, name }) => {
    const matches = content.match(pattern);
    if (matches) {
      fixes += matches.length;
      console.log(`  Fixing ${matches.length} ${name} entities`);
      content = content.replace(pattern, replacement);
    }
  });
  
  // Fix 2: Fix comma errors in type definitions (strin, g; → string;)
  const typeCommaSplitFixes = [
    { pattern: /strin,\s*g([;)\]}])/g, replacement: 'string$1' },
    { pattern: /numbe,\s*r([;)\]}])/g, replacement: 'number$1' },
    { pattern: /boolea,\s*n([;)\]}])/g, replacement: 'boolean$1' },
    { pattern: /objec,\s*t([;)\]}])/g, replacement: 'object$1' },
    { pattern: /arra,\s*y([;)\]}])/g, replacement: 'array$1' },
    { pattern: /voi,\s*d([;)\]}])/g, replacement: 'void$1' },
    { pattern: /an,\s*y([;)\]}])/g, replacement: 'any$1' },
    { pattern: /nul,\s*l([;)\]}])/g, replacement: 'null$1' },
    { pattern: /undefine,\s*d([;)\]}])/g, replacement: 'undefined$1' },
    { pattern: /Reac,\s*t([;)\]}])/g, replacement: 'React$1' },
    { pattern: /HTMLElemen,\s*t([;)\]}])/g, replacement: 'HTMLElement$1' },
    { pattern: /Promis,\s*e([;)\]}])/g, replacement: 'Promise$1' }
  ];
  
  typeCommaSplitFixes.forEach(({ pattern, replacement }) => {
    const matches = content.match(pattern);
    if (matches) {
      fixes += matches.length;
      content = content.replace(pattern, replacement);
    }
  });
  
  // Fix 3: Fix trailing commas in type definitions and objects
  content = content.replace(/,\s*([}\]])/g, '$1');
  
  // Fix 4: Fix double commas
  content = content.replace(/,\s*,/g, ',');
  
  // Fix 5: Fix empty expressions with commas
  content = content.replace(/\{\s*,\s*\}/g, '{}');
  content = content.replace(/\[\s*,\s*\]/g, '[]');
  
  // Fix 6: Fix malformed JSX expressions
  // Fix {'}'}
  content = content.replace(/\{['"]?\}['"]?\}/g, '}');
  // Fix {'{'}
  content = content.replace(/\{['"]?\{['"]?\}/g, '{');
  // Fix {'<'}
  content = content.replace(/\{['"]?<['"]?\}/g, '<');
  // Fix {'>'}
  content = content.replace(/\{['"]?>['"]?\}/g, '>');
  
  // Fix 7: Fix JSX closing tags
  const openTags = content.match(/<([A-Z]\w+)[^>]*>/g) || [];
  const closeTags = content.match(/<\/([A-Z]\w+)>/g) || [];
  
  const openTagsMap = {};
  openTags.forEach(tag => {
    const match = tag.match(/<([A-Z]\w+)/);
    if (match) {
      const tagName = match[1];
      openTagsMap[tagName] = (openTagsMap[tagName] || 0) + 1;
    }
  });
  
  const closeTagsMap = {};
  closeTags.forEach(tag => {
    const match = tag.match(/<\/([A-Z]\w+)>/);
    if (match) {
      const tagName = match[1];
      closeTagsMap[tagName] = (closeTagsMap[tagName] || 0) + 1;
    }
  });
  
  // Find mismatched tags
  Object.keys(openTagsMap).forEach(tag => {
    const openCount = openTagsMap[tag] || 0;
    const closeCount = closeTagsMap[tag] || 0;
    
    // Missing close tags
    if (openCount > closeCount) {
      const diff = openCount - closeCount;
      console.log(`  Missing ${diff} closing tag(s) for <${tag}>`);
      
      // Attempt to fix by adding closing tags at the end of the component
      const componentEndMatch = content.match(/export\s+(?:default\s+)?(?:const|function)\s+\w+/g);
      if (componentEndMatch && componentEndMatch.length > 0) {
        const lastMatchIndex = content.lastIndexOf(componentEndMatch[componentEndMatch.length - 1]);
        
        // Add closing tags just before the export statement
        let insertPos = content.lastIndexOf('}', lastMatchIndex);
        if (insertPos > 0) {
          let closingTags = '';
          for (let i = 0; i < diff; i++) {
            closingTags += `</${tag}>`;
          }
          content = content.slice(0, insertPos) + closingTags + content.slice(insertPos);
          fixes += diff;
        }
      }
    }
  });
  
  // Fix 6: Fix parameter type annotations in arrow functions
  content = content.replace(/(\(\w+):([\w.<>|&[\]]+)(?=\)\s*=>)/g, '$1: $2');
  
  // Fix 7: Add JSX closing tags for self-closing components wrongly formatted
  content = content.replace(/<([A-Z]\w+)([^>]*?)(?<!\/)>(?!\s*<\/\1>)/g, (match, tag, attrs) => {
    // Only if this looks like it should be self-closing
    if (!match.includes('/>') && !content.includes(`</${tag}>`, content.indexOf(match) + match.length)) {
      return `<${tag}${attrs} />`;
    }
    return match;
  });
  
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

// Run TSC to get specific error locations
function getDetailedErrors(filePath) {
  try {
    execSync(`npx tsc --noEmit ${filePath}`, { encoding: 'utf-8' });
    return []; // No errors
  } catch (error) {
    // Extract error lines from tsc output
    const lines = error.stdout.split('\n');
    const errors = [];
    
    for (const line of lines) {
      const match = line.match(/\((\d+),(\d+)\):\s*error\s*(TS\d+):\s*(.*)/);
      if (match) {
        errors.push({
          line: parseInt(match[1]),
          column: parseInt(match[2]),
          code: match[3],
          message: match[4].trim()
        });
      }
    }
    
    return errors;
  }
}

// Apply more targeted fixes based on specific error locations
function applyTargetedFixes(filePath, errors) {
  if (!fs.existsSync(filePath)) return false;
  
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
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
  Object.keys(errorsByLine).forEach(lineNum => {
    const lineErrors = errorsByLine[lineNum];
    const i = parseInt(lineNum) - 1;
    
    if (i < 0 || i >= lines.length) return;
    
    let line = lines[i];
    let fixedLine = line;
    
    // Apply fixes based on error codes
    for (const error of lineErrors) {
      switch (error.code) {
        case 'TS1005': // ',' expected
          if (error.message === "',' expected.") {
            // Check if this is a parameter or prop without a comma
            const commaPos = error.column - 1;
            if (commaPos < fixedLine.length) {
              fixedLine = fixedLine.slice(0, commaPos) + ',' + fixedLine.slice(commaPos);
              modified = true;
            }
          }
          break;
          
        case 'TS1381': // Unexpected token. Did you mean `{'}'}` or `&rbrace;`?
          // Replace curly brace chars in JSX
          fixedLine = fixedLine.replace(/[{]\s*[']\}[']}/g, '}');
          fixedLine = fixedLine.replace(/[{]\s*['][{][']}/g, '{');
          modified = fixedLine !== line;
          break;
          
        case 'TS1382': // Unexpected token. Did you mean `{'>'}` or `&gt;`?
          // Replace angle bracket chars in JSX
          fixedLine = fixedLine.replace(/[{]\s*[']\<[']}/g, '<');
          fixedLine = fixedLine.replace(/[{]\s*[']\>[']}/g, '>');
          modified = fixedLine !== line;
          break;
      }
    }
    
    lines[i] = fixedLine;
  });
  
  // Save changes if modified
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
🔍 JSX Syntax Error Fixer
=================================================
Running in ${DRY_RUN ? 'DRY RUN' : 'LIVE'} mode
`);

// Get files with the most errors
const errorFiles = getErrorFiles();
console.log(`Found ${errorFiles.length} files with potential JSX syntax errors`);

// Process each file
let fixedFiles = 0;
let totalFixes = 0;

errorFiles.forEach(filePath => {
  // Apply general JSX syntax fixes
  const fixed = fixJsxSyntaxErrors(filePath);
  
  // Get detailed error information
  const detailedErrors = getDetailedErrors(filePath);
  if (detailedErrors.length > 0) {
    console.log(`  📊 Found ${detailedErrors.length} specific errors`);
    
    // Apply more targeted fixes based on specific errors
    const targetFixed = applyTargetedFixes(filePath, detailedErrors);
    
    if (fixed || targetFixed) {
      fixedFiles++;
      totalFixes += detailedErrors.length;
    }
  }
});

console.log(`
=================================================
✅ JSX Syntax Fixes complete!
=================================================
Fixed ${fixedFiles} of ${errorFiles.length} files
Estimated ${totalFixes} issues addressed
${DRY_RUN ? 'DRY RUN - No files were actually modified' : 'Backups saved to: ' + BACKUP_DIR}

Next steps:
1. Run 'npm run type-check' to verify fixes
2. Run 'node scripts/error-track-progress.js' to update error metrics
3. Repeat the process for remaining files
`);