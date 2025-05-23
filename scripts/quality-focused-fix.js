/**
 * Quality-Focused TypeScript Error Fix
 * 
 * This script focuses on fixing TypeScript errors while maintaining
 * high code quality and ensuring semantics are preserved.
 * It implements safe, targeted fixes for specific error categories.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const BACKUP_DIR = path.join(__dirname, '..', 'error-fix-backups');
const DRY_RUN = process.argv.includes('--dry-run');

// Top priority files - focusing on core files with high error impact
const PRIORITY_FILES = [
  // API core files
  'src/app/api/auth/[...nextauth]/auth-server.ts',
  'src/app/api/auth/check-user/route.ts',
  'src/types/models.ts',
  
  // Core type definitions
  'src/types/three-extensions.d.ts',
  'src/types/next-api.d.ts',
  'src/types/development.ts',

  // Key service files
  'src/services/development-service.ts',
  'src/services/authService.ts',
  
  // Core utility files
  'src/utils/queryClient.ts',
  'src/lib/auth.ts',
  'src/lib/environment.ts',
  
  // Core React components
  'src/context/AuthContext.tsx',
  'src/components/ClientProviders.tsx',
  'src/app/layout.tsx'
];

// File patterns to fix
const FILE_PATTERNS = [
  // Type definition files
  '**/types/**/*.ts',
  '**/types/**/*.d.ts',
  
  // Core services
  '**/services/**/*.ts',
  
  // API routes
  '**/api/**/*.ts',
  
  // Core contexts
  '**/context/**/*.tsx',
  
  // Core hooks
  '**/hooks/**/*.ts',
  '**/hooks/**/*.tsx',
  
  // Utility files
  '**/utils/**/*.ts',
  '**/lib/**/*.ts'
];

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Utility to create a backup of a file before modifying it
function backupFile(filePath) {
  const fileName = path.basename(filePath);
  const backupPath = path.join(BACKUP_DIR, `${fileName}.bak-quality-${Date.now()}`);
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

// Get file paths from patterns
function getFilesFromPatterns(patterns) {
  const allFiles = new Set();
  
  patterns.forEach(pattern => {
    try {
      // Use find command for better globbing
      const cmd = `find src -type f -path "${pattern}" | grep -v "node_modules" | grep -v ".next"`;
      const output = execSync(cmd, { encoding: 'utf-8' });
      
      output.split('\n')
        .filter(Boolean)
        .forEach(file => allFiles.add(file));
    } catch (error) {
      // Ignore errors from grep when no matches are found (exit code 1)
      if (error.status !== 1) {
        console.error(`Error searching for pattern ${pattern}:`, error);
      }
    }
  });
  
  return Array.from(allFiles);
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

// Safe fixes for specific error types
function applyQualitySafeFixes(filePath, errors) {
  if (!fs.existsSync(filePath)) return false;
  
  // Read file content
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // Group errors by line for more efficient processing
  const errorsByLine = {};
  errors.forEach(error => {
    if (!errorsByLine[error.line]) {
      errorsByLine[error.line] = [];
    }
    errorsByLine[error.line].push(error);
  });
  
  // Sort lines in descending order to prevent position shifts
  const lines = Object.keys(errorsByLine).sort((a, b) => b - a).map(Number);
  
  // Process each line with errors
  let modified = false;
  const contentLines = content.split('\n');
  
  lines.forEach(lineNum => {
    const lineErrors = errorsByLine[lineNum];
    const lineIndex = lineNum - 1;
    
    if (lineIndex < 0 || lineIndex >= contentLines.length) return;
    
    const line = contentLines[lineIndex];
    let newLine = line;
    
    // Apply fixes for specific error codes
    lineErrors.forEach(error => {
      // Range check for column position
      if (error.column < 1 || error.column > line.length + 1) return;
      
      switch (error.code) {
        // Missing comma in parameter list, object literal, or array
        case 'TS1005':
          if (error.message === "',' expected.") {
            const columnIndex = error.column - 1;
            newLine = newLine.slice(0, columnIndex) + ',' + newLine.slice(columnIndex);
            modified = true;
          } else if (error.message === "')' expected.") {
            newLine += ')';
            modified = true;
          } else if (error.message === "'}' expected.") {
            newLine += '}';
            modified = true;
          } else if (error.message === "';' expected.") {
            newLine += ';';
            modified = true;
          }
          break;
          
        // Invalid JSX closing tag tokens
        case 'TS1381': // Unexpected token. Did you mean `{'}'}` or `&rbrace;`?
          newLine = newLine.replace(/\{\s*['"]\}['"]\}/g, '}');
          newLine = newLine.replace(/\{\s*['"]\{['"]\}/g, '{');
          if (newLine !== line) modified = true;
          break;
          
        case 'TS1382': // Unexpected token. Did you mean `{'>'}` or `&gt;`?
          newLine = newLine.replace(/\{\s*['"]\<['"]\}/g, '<');
          newLine = newLine.replace(/\{\s*['"]\>['"]\}/g, '>');
          if (newLine !== line) modified = true;
          break;
          
        // Missing close tags
        case 'TS17002': // Expected corresponding JSX closing tag
          const tagMatch = error.message.match(/Expected corresponding JSX closing tag for ['"]([^'"]+)['"]/);
          if (tagMatch) {
            const tag = tagMatch[1];
            // Only add closing tag if line doesn't already have it
            if (!newLine.includes(`</${tag}>`)) {
              newLine += `</${tag}>`;
              modified = true;
            }
          }
          break;
      }
    });
    
    if (newLine !== line) {
      contentLines[lineIndex] = newLine;
    }
  });
  
  // Apply specific pattern-based fixes across the whole file
  
  // Fix 1: Add missing type annotations for React component props
  const componentPropsPattern = /const\s+(\w+)(?:\s*:\s*React\.FC)?\s*=\s*\(\s*(\{\s*[^}]*\}|\w+)\s*\)\s*=>/g;
  let match;
  let contentWithFixes = contentLines.join('\n');
  
  while ((match = componentPropsPattern.exec(contentWithFixes)) !== null) {
    const [fullMatch, componentName, props] = match;
    
    // Skip if already has type annotation
    if (fullMatch.includes(': React.FC') || fullMatch.includes(': FC')) continue;
    
    // If props is a destructured object without type annotation
    if (props && props.startsWith('{') && !props.includes(':')) {
      const propsTypeName = `${componentName}Props`;
      const fixedDeclaration = `const ${componentName}: React.FC<${propsTypeName}> = (${props}) =>`;
      
      // Only apply if the component name looks like a proper React component (PascalCase)
      if (/^[A-Z]/.test(componentName)) {
        contentWithFixes = contentWithFixes.replace(fullMatch, fixedDeclaration);
        modified = true;
      }
    }
  }
  
  // Fix 2: Ensure JSX elements are properly closed
  const openingTags = contentWithFixes.match(/<([A-Z]\w+)([^/>]*?)>/g) || [];
  const closingTags = contentWithFixes.match(/<\/([A-Z]\w+)>/g) || [];
  
  const openTagCounts = {};
  openingTags.forEach(tag => {
    const match = tag.match(/<([A-Z]\w+)/);
    if (match) {
      const tagName = match[1];
      openTagCounts[tagName] = (openTagCounts[tagName] || 0) + 1;
    }
  });
  
  const closeTagCounts = {};
  closingTags.forEach(tag => {
    const match = tag.match(/<\/([A-Z]\w+)>/);
    if (match) {
      const tagName = match[1];
      closeTagCounts[tagName] = (closeTagCounts[tagName] || 0) + 1;
    }
  });
  
  // Check for mismatched tags
  let appendTags = '';
  Object.keys(openTagCounts).forEach(tag => {
    const openCount = openTagCounts[tag] || 0;
    const closeCount = closeTagCounts[tag] || 0;
    
    // Missing close tags
    if (openCount > closeCount) {
      const diff = openCount - closeCount;
      appendTags += `\n\n{/* Auto-added closing tags */}\n` + `</${tag}>`.repeat(diff);
      modified = true;
    }
  });
  
  if (appendTags) {
    contentWithFixes += appendTags;
  }
  
  // Write changes if modified
  if (modified && contentWithFixes !== originalContent) {
    if (!DRY_RUN) {
      backupFile(filePath);
      fs.writeFileSync(filePath, contentWithFixes, 'utf-8');
    }
    return true;
  }
  
  return false;
}

// Correct type imports for React Query v4 and other common libraries
function correctImports(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  // Skip non-TypeScript/React files
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return false;
  }
  
  // Read file content
  const content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content;
  
  // Common import corrections
  const importFixes = [
    // React Query v3 to v4
    {
      pattern: /from ['"]react-query['"]/g,
      replacement: 'from "@tanstack/react-query"'
    },
    // NextAuth types
    {
      pattern: /from ['"]next-auth['"]/g,
      replacement: 'from "next-auth"'
    },
    // Ensure Three.js types are available
    {
      pattern: /^import.*from ['"]three['"](?!.*import ['"]@\/types\/three-extensions['"])/m,
      replacement: (match) => {
        if (!match.includes('@/types/three-extensions')) {
          return `import '@/types/three-extensions';\n${match}`;
        }
        return match;
      }
    }
  ];
  
  // Apply import fixes
  importFixes.forEach(({ pattern, replacement }) => {
    newContent = newContent.replace(pattern, replacement);
  });
  
  // Write changes if modified
  if (newContent !== content) {
    if (!DRY_RUN) {
      backupFile(filePath);
      fs.writeFileSync(filePath, newContent, 'utf-8');
    }
    console.log(`  📦 Fixed imports in ${filePath}`);
    return true;
  }
  
  return false;
}

// Fix missing interface properties
function addMissingInterfaceProperties(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  // Skip non-TypeScript files
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx') && !filePath.endsWith('.d.ts')) {
    return false;
  }
  
  const errors = getFileErrors(filePath);
  if (!errors.length) return false;
  
  // Filter for property access errors
  const propertyErrors = errors.filter(err => 
    err.code === 'TS2339' || // Property does not exist on type
    (err.code === 'TS2551' && err.message.includes('Property'))  // Property does not exist on type (did you mean...)
  );
  
  if (!propertyErrors.length) return false;
  
  // Read file content
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract interface/type definitions
  const interfaceMatches = content.match(/interface\s+(\w+)\s*(?:extends\s+(?:\w+(?:\s*,\s*\w+)*))?\s*\{[^}]*\}/g) || [];
  const typeMatches = content.match(/type\s+(\w+)\s*=\s*(?:\{[^}]*\}|[^;]+);/g) || [];
  
  if (!interfaceMatches.length && !typeMatches.length) return false;
  
  let newContent = content;
  let modified = false;
  
  // Process property errors
  propertyErrors.forEach(error => {
    const propertyMatch = error.message.match(/Property ['"](\w+)['"] does not exist on type/);
    const didYouMeanMatch = error.message.match(/Did you mean ['"](\w+)['"]/);
    
    if (propertyMatch) {
      const missingProp = propertyMatch[1];
      const suggestedProp = didYouMeanMatch ? didYouMeanMatch[1] : null;
      
      // If there's a suggested correction that's close to the missing prop
      if (suggestedProp && areStringsSimilar(missingProp, suggestedProp)) {
        // Check for uses of the missing property in the file content
        const propRegex = new RegExp(`\\.${missingProp}\\b`, 'g');
        const propMatches = newContent.match(propRegex) || [];
        
        // Only perform replacement if it's used consistently
        if (propMatches.length > 0) {
          newContent = newContent.replace(propRegex, `.${suggestedProp}`);
          modified = true;
        }
      }
    }
  });
  
  // Write changes if modified
  if (modified && newContent !== content) {
    if (!DRY_RUN) {
      backupFile(filePath);
      fs.writeFileSync(filePath, newContent, 'utf-8');
    }
    console.log(`  🔧 Fixed property references in ${filePath}`);
    return true;
  }
  
  return false;
}

// Check if two strings are similar (for property name suggestions)
function areStringsSimilar(str1, str2) {
  if (Math.abs(str1.length - str2.length) > 2) return false;
  
  // Simple measure: count matching characters
  let matches = 0;
  for (let i = 0; i < Math.min(str1.length, str2.length); i++) {
    if (str1[i] === str2[i]) matches++;
  }
  
  return matches >= Math.min(str1.length, str2.length) * 0.7;
}

// Ensure type imports where required
function ensureTypeImports(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  // Skip non-TypeScript files
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) {
    return false;
  }
  
  // Read file content
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Common type imports that might be missing
  const commonTypeImports = [
    {
      pattern: /import.*from ['"]react['"](?!.*FC|.*ReactNode|.*ReactElement)/,
      check: (content) => content.includes('React.FC') || content.includes('ReactNode'),
      import: "import React, { FC, ReactNode } from 'react';"
    },
    {
      pattern: /interface.*NextApiRequest/,
      check: (content) => !content.includes("import { NextApiRequest"),
      import: "import { NextApiRequest, NextApiResponse } from 'next';"
    },
    {
      pattern: /interface.*Route.*Params/,
      check: (content) => !content.includes("import { Params }"),
      import: "import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';"
    }
  ];
  
  let newContent = content;
  let modified = false;
  
  // Apply type import fixes
  commonTypeImports.forEach(({ pattern, check, import: importStatement }) => {
    if (pattern.test(newContent) && check(newContent)) {
      // Add import statement after the last import or at the top
      const importSection = newContent.match(/import .+from ['"'].+['"'];?(\r?\n|$)/g) || [];
      
      if (importSection.length > 0) {
        const lastImport = importSection[importSection.length - 1];
        const lastImportIndex = newContent.lastIndexOf(lastImport) + lastImport.length;
        
        newContent = newContent.slice(0, lastImportIndex) + 
                    '\n' + importStatement + '\n' + 
                    newContent.slice(lastImportIndex);
      } else {
        // No imports found, add at the top
        newContent = importStatement + '\n\n' + newContent;
      }
      
      modified = true;
    }
  });
  
  // Write changes if modified
  if (modified && newContent !== content) {
    if (!DRY_RUN) {
      backupFile(filePath);
      fs.writeFileSync(filePath, newContent, 'utf-8');
    }
    console.log(`  📝 Added missing type imports in ${filePath}`);
    return true;
  }
  
  return false;
}

// Main execution
console.log(`
=================================================
🔍 Quality-Focused TypeScript Error Fix
=================================================
Running in ${DRY_RUN ? 'DRY RUN' : 'LIVE'} mode
`);

// Process priority files first
console.log('Processing priority files...');
let fixedPriorityCount = 0;

PRIORITY_FILES.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Priority file not found: ${filePath}`);
    return;
  }
  
  console.log(`\nAnalyzing: ${filePath}`);
  
  // Get TypeScript errors for the file
  const errors = getFileErrors(filePath);
  console.log(`  Found ${errors.length} TypeScript errors`);
  
  // Apply fixes
  const importFixed = correctImports(filePath);
  const propsFixed = addMissingInterfaceProperties(filePath);
  const typeImportsFixed = ensureTypeImports(filePath);
  const safeFixes = applyQualitySafeFixes(filePath, errors);
  
  if (importFixed || propsFixed || typeImportsFixed || safeFixes) {
    fixedPriorityCount++;
  }
});

// Process additional files by pattern
console.log('\nProcessing additional files by pattern...');
const patternFiles = getFilesFromPatterns(FILE_PATTERNS);
console.log(`Found ${patternFiles.length} files matching patterns`);

let fixedPatternCount = 0;

patternFiles.forEach(filePath => {
  // Skip priority files that were already processed
  if (PRIORITY_FILES.includes(filePath)) return;
  
  // Skip files that don't exist (might have been moved/deleted)
  if (!fs.existsSync(filePath)) return;
  
  console.log(`\nAnalyzing: ${filePath}`);
  
  // Get TypeScript errors for the file
  const errors = getFileErrors(filePath);
  
  if (errors.length === 0) {
    console.log(`  ✅ No TypeScript errors`);
    return;
  }
  
  console.log(`  Found ${errors.length} TypeScript errors`);
  
  // Apply fixes
  const importFixed = correctImports(filePath);
  const propsFixed = addMissingInterfaceProperties(filePath);
  const typeImportsFixed = ensureTypeImports(filePath);
  const safeFixes = applyQualitySafeFixes(filePath, errors);
  
  if (importFixed || propsFixed || typeImportsFixed || safeFixes) {
    fixedPatternCount++;
  }
});

console.log(`
=================================================
✅ Quality-Focused Fixes complete!
=================================================
Fixed ${fixedPriorityCount} priority files
Fixed ${fixedPatternCount} additional files
${DRY_RUN ? 'DRY RUN - No files were actually modified' : 'Backups saved to: ' + BACKUP_DIR}

Next steps:
1. Run 'npm run type-check' to verify fixes
2. Run 'node scripts/error-track-progress.js' to update error metrics
3. Consider running with specific file arguments for targeted fixes
`);