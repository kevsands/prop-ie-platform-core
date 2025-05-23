/**
 * Fix Common TypeScript Errors
 * 
 * This script implements automated fixes for the most common TypeScript errors
 * found in the codebase. It targets high-impact fixes that can be reliably 
 * automated without breaking functionality.
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
  const backupPath = path.join(BACKUP_DIR, `${fileName}.bak-${Date.now()}`);
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

// Read error reports
function loadErrorReports() {
  if (!fs.existsSync(ERROR_REPORTS_DIR)) {
    console.error(`Error reports directory not found: ${ERROR_REPORTS_DIR}`);
    console.error('Run scripts/error-audit.js first to generate error reports.');
    process.exit(1);
  }

  try {
    const allErrorsPath = path.join(ERROR_REPORTS_DIR, 'all-errors.json');
    return JSON.parse(fs.readFileSync(allErrorsPath, 'utf-8'));
  } catch (error) {
    console.error('Failed to load error reports:', error);
    process.exit(1);
  }
}

// Fix React Query v3 to v4 imports - IMPROVED WITH SAFER REGEX
function fixReactQueryImports() {
  console.log('\n🔄 Fixing React Query imports (v3 to v4)...');
  
  // Find files using ripgrep to avoid shell escape issues
  const command1 = `find src -type f \\( -name "*.ts" -o -name "*.tsx" \\) -exec grep -l "from ['\\\"]react-query['\\\"]" {} \\;`;
  const command2 = `find src -type f \\( -name "*.ts" -o -name "*.tsx" \\) -exec grep -l "import.*from ['\\\"]react-query['\\\"]" {} \\;`;
  
  let files = [];
  try {
    const output1 = execSync(command1, { encoding: 'utf-8' });
    const output2 = execSync(command2, { encoding: 'utf-8' });
    
    files = [...new Set([...output1.split('\n'), ...output2.split('\n')])].filter(Boolean);
  } catch (error) {
    // grep returns error code 1 when no matches found
    if (error.status !== 1) {
      console.error('Error searching for React Query imports:', error);
    }
  }
  
  let fixCount = 0;
  
  files.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    const content = fs.readFileSync(file, 'utf-8');
    
    // Skip if file already uses @tanstack/react-query
    if (content.includes('@tanstack/react-query')) {
      return;
    }
    
    // Create backup
    const backupPath = backupFile(file);
    
    // Replace imports
    let newContent = content
      .replace(/from ['"]react-query['"]/g, 'from "@tanstack/react-query"')
      .replace(/import\s+(.+)\s+from\s+["']react-query["']/g, 'import $1 from "@tanstack/react-query"');
    
    if (content !== newContent) {
      if (!DRY_RUN) {
        fs.writeFileSync(file, newContent, 'utf-8');
      }
      console.log(`  Fixed: ${file}`);
      fixCount++;
    }
  });
  
  console.log(`✅ Fixed React Query imports in ${fixCount} files`);
  return fixCount;
}

// Fix property access errors (role -> roles, etc.)
function fixCommonPropertyAccessErrors() {
  console.log('\n🔄 Fixing common property access errors...');
  
  const commonMappings = [
    { pattern: /\.role\b(?!\s*=)/, replacement: '.roles' },
    { pattern: /\.development\b(?!\s*=)/, replacement: '.developments' },
    { pattern: /\.transaction\b(?!\s*=)/, replacement: '.transactions' },
  ];
  
  let totalFixCount = 0;
  
  commonMappings.forEach(({ pattern, replacement }) => {
    // Using find + grep is more reliable than direct regex through exec
    const patternStr = pattern.toString().replace(/^\/|\/g?$/g, '');
    const command = `find src -type f \\( -name "*.ts" -o -name "*.tsx" \\) -exec grep -l "${patternStr}" {} \\;`;
    
    let files = [];
    try {
      const output = execSync(command, { encoding: 'utf-8' });
      files = output.split('\n').filter(Boolean);
    } catch (error) {
      // grep returns error code 1 when no matches found
      if (error.status !== 1) {
        console.error(`Error searching for pattern ${pattern}:`, error);
      }
    }
    
    let fixCount = 0;
    
    files.forEach(file => {
      if (!fs.existsSync(file)) return;
      
      const content = fs.readFileSync(file, 'utf-8');
      const backupPath = backupFile(file);
      
      const newContent = content.replace(pattern, replacement);
      
      if (content !== newContent) {
        if (!DRY_RUN) {
          fs.writeFileSync(file, newContent, 'utf-8');
        }
        console.log(`  Fixed: ${file} (${pattern} -> ${replacement})`);
        fixCount++;
      }
    });
    
    console.log(`  ✓ Fixed ${fixCount} instances of ${pattern}`);
    totalFixCount += fixCount;
  });
  
  console.log(`✅ Fixed ${totalFixCount} property access errors`);
  return totalFixCount;
}

// Add optional chaining to common property accesses
function addOptionalChaining() {
  console.log('\n🔄 Adding optional chaining to risky property accesses...');
  
  const riskyPatterns = [
    { pattern: '(\\w+)\\.user\\.', replacement: '$1?.user.' },
    { pattern: '(\\w+)\\.data\\.', replacement: '$1?.data.' },
    { pattern: '(\\w+)\\.response\\.', replacement: '$1?.response.' },
    { pattern: '(\\w+)\\.result\\.', replacement: '$1?.result.' },
    { pattern: '(\\w+)\\.props\\.', replacement: '$1?.props.' }
  ];
  
  let totalFixCount = 0;
  
  riskyPatterns.forEach(({ pattern, replacement }) => {
    // Use find + grep for reliable file search
    const command = `find src -type f \\( -name "*.ts" -o -name "*.tsx" \\) -exec grep -l "${pattern}" {} \\;`;
    
    let files = [];
    try {
      const output = execSync(command, { encoding: 'utf-8' });
      files = output.split('\n').filter(Boolean);
    } catch (error) {
      // grep returns error code 1 when no matches found
      if (error.status !== 1) {
        console.error(`Error searching for pattern ${pattern}:`, error);
      }
    }
    
    let fixCount = 0;
    
    files.forEach(file => {
      if (!fs.existsSync(file)) return;
      
      const content = fs.readFileSync(file, 'utf-8');
      const backupPath = backupFile(file);
      
      // Don't add optional chaining if it already exists
      let newContent = content.replace(new RegExp(pattern, 'g'), (match) => {
        if (match.includes('?.')) {
          return match;
        }
        return match.replace(/\./, '?.');
      });
      
      if (content !== newContent) {
        if (!DRY_RUN) {
          fs.writeFileSync(file, newContent, 'utf-8');
        }
        console.log(`  Fixed: ${file}`);
        fixCount++;
      }
    });
    
    console.log(`  ✓ Added optional chaining for ${pattern} in ${fixCount} files`);
    totalFixCount += fixCount;
  });
  
  console.log(`✅ Added optional chaining in ${totalFixCount} files`);
  return totalFixCount;
}

// Fix missing type annotations on function parameters - FIXED TO ENSURE CORRECT SYNTAX
function fixImplicitAnyParameters() {
  console.log('\n🔄 Fixing implicit any parameters...');
  
  // Load errors for this category
  let implicitAnyErrors = [];
  try {
    const errorsPath = path.join(ERROR_REPORTS_DIR, 'category-IMPLICIT_ANY.json');
    if (fs.existsSync(errorsPath)) {
      implicitAnyErrors = JSON.parse(fs.readFileSync(errorsPath, 'utf-8'));
    }
  } catch (error) {
    console.error('Failed to load implicit any errors:', error);
  }
  
  // Common parameter patterns and their type annotations
  const commonParamTypes = {
    'id': 'string',
    'userId': 'string',
    'email': 'string',
    'name': 'string',
    'password': 'string',
    'data': 'any',
    'props': 'any',
    'values': 'any',
    'options': 'any',
    'params': 'any',
    'args': 'any',
    'event': 'React.ChangeEvent<HTMLInputElement>',
    'e': 'React.MouseEvent',
    'req': 'NextApiRequest',
    'res': 'NextApiResponse',
  };
  
  let fixCount = 0;
  
  // Group errors by file for efficiency
  const errorsByFile = {};
  implicitAnyErrors.forEach(error => {
    if (!errorsByFile[error.filePath]) {
      errorsByFile[error.filePath] = [];
    }
    errorsByFile[error.filePath].push(error);
  });
  
  for (const [filePath, errors] of Object.entries(errorsByFile)) {
    if (!fs.existsSync(filePath)) continue;
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const backupPath = backupFile(filePath);
    
    let fileModified = false;
    let newContent = content;

    // Instead of modifying line by line, use regex replacement for the whole file
    errors.forEach(error => {
      const paramMatch = error.errorMessage.match(/Parameter ['"](\w+)['"]/);
      
      if (paramMatch) {
        const paramName = paramMatch[1];
        let paramType = commonParamTypes[paramName] || 'any';
        
        // Check if this is in a React component (rough heuristic)
        if (filePath.includes('.tsx') && 
            (content.includes('function') || content.includes('=>')) && 
            paramName === 'props') {
          paramType = 'React.ComponentProps<any>';
        }
        
        // Create safer regex pattern that won't break code
        // Look for the parameter followed by either comma, close paren, equals, destructuring, or start of arrow function
        const paramRegex = new RegExp(`(\\b${paramName}\\b)(?!\\s*:)(?=\\s*[,)=}{]|\\s*=>)`, 'g');
        
        newContent = newContent.replace(paramRegex, `${paramName}: ${paramType}`);
      }
    });
    
    if (newContent !== content) {
      if (!DRY_RUN) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
      }
      console.log(`  Fixed: ${filePath}`);
      fixCount++;
    }
  }
  
  console.log(`✅ Added type annotations in ${fixCount} files`);
  return fixCount;
}

// Fix Three.js type issues - IMPROVED WITH SAFER FILE SEARCH
function fixThreeJsTypes() {
  console.log('\n🔄 Fixing Three.js type issues...');
  
  // Find files that use Three.js
  const command = `find src -type f \\( -name "*.ts" -o -name "*.tsx" \\) -exec grep -l -E "(from ['\\\"]three['\\\"]|THREE\\.|\\bScene\\b|\\bMesh\\b|\\bGeometry\\b)" {} \\;`;
  
  let threeJsFiles = [];
  try {
    const output = execSync(command, { encoding: 'utf-8' });
    threeJsFiles = output.split('\n').filter(Boolean);
  } catch (error) {
    // grep returns error code 1 when no matches found
    if (error.status !== 1) {
      console.error('Error searching for Three.js files:', error);
    }
  }
  
  let fixCount = 0;
  
  threeJsFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    
    const content = fs.readFileSync(file, 'utf-8');
    const backupPath = backupFile(file);
    
    // Check if file already imports Three.js types
    if (content.includes('three-extensions') || 
        content.includes('three-fiber') ||
        content.includes('jsx-three-fiber')) {
      return;
    }
    
    // Add imports at the top of the file after other imports
    const importMatch = content.match(/import .+from ["'].+["'];?\n/g);
    const lastImportIndex = importMatch 
      ? content.lastIndexOf(importMatch[importMatch.length - 1]) + importMatch[importMatch.length - 1].length 
      : 0;
    
    const threeTypesImport = `\n// Add Three.js type support\nimport '@/types/three-extensions';\n`;
    
    const newContent = content.slice(0, lastImportIndex) + 
                      threeTypesImport + 
                      content.slice(lastImportIndex);
    
    if (content !== newContent) {
      if (!DRY_RUN) {
        fs.writeFileSync(file, newContent, 'utf-8');
      }
      console.log(`  Fixed: ${file}`);
      fixCount++;
    }
  });
  
  console.log(`✅ Fixed Three.js types in ${fixCount} files`);
  return fixCount;
}

// Main execution
console.log(`
=================================================
📋 TypeScript Error Fixer
=================================================
Running in ${DRY_RUN ? 'DRY RUN' : 'LIVE'} mode
`);

// Load errors
const errors = loadErrorReports();
console.log(`Found ${errors.length} errors to process`);

// Run fixes
const fixes = [
  fixReactQueryImports,
  fixCommonPropertyAccessErrors,
  addOptionalChaining,
  fixImplicitAnyParameters,
  fixThreeJsTypes
];

let totalFixes = 0;
fixes.forEach(fix => {
  totalFixes += fix();
});

console.log(`
=================================================
✅ Fix complete!
=================================================
Total fixes applied: ${totalFixes}
${DRY_RUN ? 'DRY RUN - No files were actually modified' : 'Backups saved to: ' + BACKUP_DIR}

To apply fixes for real, run without --dry-run flag
`);