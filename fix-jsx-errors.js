#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Color output helpers
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  file: (msg) => console.log(`${colors.bright}[FILE]${colors.reset} ${msg}`)
};

// Backup directory
const BACKUP_DIR = path.join(__dirname, 'error-fix-backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Priority files based on earlier grep results
const priorityFiles = [
  'src/features/security/RuntimeSecurityMonitor.tsx',
  'src/features/security/DataEncryptionService.tsx',
  'src/features/compliance/ComplianceDashboard.tsx',
  'src/features/security/AccessControlManagement.tsx',
  'src/app/buyer/profile/page.tsx',
  'src/services/realtime/RealtimeEngine.ts',
  'src/services/development-service.ts',
  'src/lib/transaction-engine/snagging-system.ts',
  'src/lib/supplierApi.ts',
  'src/lib/transaction-engine/handover-system.ts',
  'src/lib/collaboration/collaboration-engine.ts',
  'src/components/navigation/NextGenNavigation.tsx',
  'src/app/developer/analytics/page.tsx',
  'src/app/platform/dashboard/page.tsx',
  'src/app/developer/project/[id]/overview/page.tsx',
  'src/components/dashboard/ProjectOverview.tsx'
];

// Fix patterns
const fixPatterns = [
  // HTML entities
  { pattern: /&lbrace;/g, replacement: '{' },
  { pattern: /&rbrace;/g, replacement: '}' },
  { pattern: /&lt;/g, replacement: '<' },
  { pattern: /&gt;/g, replacement: '>' },
  { pattern: /&amp;/g, replacement: '&' },
  { pattern: /&quot;/g, replacement: '"' },
  { pattern: /&apos;/g, replacement: "'" },
  { pattern: /&#39;/g, replacement: "'" },
  { pattern: /&#x27;/g, replacement: "'" },
  
  // Type definition comma errors
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
  { pattern: /Promis,\s*e([;)\]}])/g, replacement: 'Promise$1' },
  
  // Common JSX expression fixes
  { pattern: /\{\s*,\s*\}/g, replacement: '{}' }, // Fix {,}
  { pattern: /\[\s*,\s*\]/g, replacement: '[]' }, // Fix [,]
  
  // Fix double commas in arrays/objects
  { pattern: /,\s*,/g, replacement: ',' },
  
  // Fix trailing commas before closing braces/brackets
  { pattern: /,\s*([}\]])/g, replacement: '$1' }
];

// Additional context-aware fixes
function applyContextAwareFixes(content) {
  // Fix JSX expressions with malformed braces
  content = content.replace(/\{([^{}]*?)&rbrace;/g, '{$1}');
  content = content.replace(/&lbrace;([^{}]*?)\}/g, '{$1}');
  
  // Fix type definitions with comma errors in specific contexts
  content = content.replace(/:\s*\{\s*([^}]*?)\s*,\s*\}/g, ': { $1 }');
  content = content.replace(/=\s*\{\s*([^}]*?)\s*,\s*\}/g, '= { $1 }');
  
  // Fix JSX children with HTML entities
  content = content.replace(/>([^<]*?)&([lr])brace;([^<]*?)</g, (match, before, side, after) => {
    const brace = side === 'l' ? '{' : '}';
    return `>${before}${brace}${after}<`;
  });
  
  // Fix malformed JSX tags
  content = content.replace(/<\/\s+>/g, '</>'); // Fix </ >
  content = content.replace(/<\s+\/>/g, '</>'); // Fix < />
  
  // Fix unescaped < and > in JSX text content
  // This pattern looks for < or > inside JSX text content (between > and <)
  content = content.replace(/>([^<]*?)<([^/>][^<]*?)</g, (match, before, after) => {
    // Only replace if it's not a valid tag
    if (!/^[A-Za-z]/.test(after.trim())) {
      return `>${before}&lt;${after}<`;
    }
    return match;
  });
  
  // Fix specific pattern like "Poor (<650)"
  content = content.replace(/\((<\d+)\)/g, '({\'<$1\'})');
  content = content.replace(/\((>\d+)\)/g, '({\'>$1\'})');
  
  // Fix malformed JSX expressions with quotes
  content = content.replace(/\{['"]}\s*['"]\}/g, '}');
  content = content.replace(/\{['"]\{\s*['"]\}/g, '{');
  
  return content;
}

// Function to create backup
function createBackup(filePath) {
  const fileName = path.basename(filePath);
  const timestamp = Date.now();
  const backupPath = path.join(BACKUP_DIR, `${fileName}.bak-jsx-${timestamp}`);
  
  try {
    fs.copyFileSync(filePath, backupPath);
    return backupPath;
  } catch (error) {
    log.error(`Failed to create backup for ${filePath}: ${error.message}`);
    return null;
  }
}

// Function to fix a single file
function fixFile(filePath, dryRun = false) {
  const fullPath = path.resolve(filePath);
  
  if (!fs.existsSync(fullPath)) {
    log.warning(`File not found: ${filePath}`);
    return { fixed: false, changes: 0 };
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    let changeCount = 0;
    const changeDetails = [];
    
    // Apply all fix patterns
    for (const { pattern, replacement } of fixPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        changeCount += matches.length;
        changeDetails.push(`  - Fixed ${matches.length} instances of ${pattern.source}`);
        content = content.replace(pattern, replacement);
      }
    }
    
    // Apply context-aware fixes
    const beforeContext = content;
    content = applyContextAwareFixes(content);
    if (content !== beforeContext) {
      changeDetails.push('  - Applied context-aware fixes');
      changeCount++;
    }
    
    if (content !== originalContent) {
      if (!dryRun) {
        // Create backup
        const backupPath = createBackup(fullPath);
        if (backupPath) {
          log.info(`Backup created: ${path.basename(backupPath)}`);
        }
        
        // Write fixed content
        fs.writeFileSync(fullPath, content, 'utf8');
        log.success(`Fixed ${changeCount} issues in ${filePath}`);
        changeDetails.forEach(detail => console.log(detail));
      } else {
        log.info(`[DRY RUN] Would fix ${changeCount} issues in ${filePath}`);
        changeDetails.forEach(detail => console.log(detail));
      }
      
      return { fixed: true, changes: changeCount };
    } else {
      return { fixed: false, changes: 0 };
    }
  } catch (error) {
    log.error(`Error processing ${filePath}: ${error.message}`);
    return { fixed: false, changes: 0, error: error.message };
  }
}

// Function to find all affected files
function findAffectedFiles() {
  const patterns = [
    'src/**/*.tsx',
    'src/**/*.ts',
    'src/**/*.jsx',
    'src/**/*.js'
  ];
  
  const excludePatterns = [
    'node_modules/**',
    'dist/**',
    'build/**',
    '.next/**',
    'coverage/**',
    'error-fix-backups/**',
    '*.test.*',
    '*.spec.*',
    '__tests__/**'
  ];
  
  let allFiles = [];
  
  for (const pattern of patterns) {
    const files = glob.sync(pattern, { 
      ignore: excludePatterns,
      nodir: true 
    });
    allFiles = allFiles.concat(files);
  }
  
  // Filter files that likely have issues
  const affectedFiles = allFiles.filter(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      return (
        content.includes('&lbrace;') ||
        content.includes('&rbrace;') ||
        content.includes('&lt;') ||
        content.includes('&gt;') ||
        content.includes('&amp;') ||
        /strin,\s*g[;)\]}]/.test(content) ||
        /numbe,\s*r[;)\]}]/.test(content) ||
        /boolea,\s*n[;)\]}]/.test(content) ||
        /objec,\s*t[;)\]}]/.test(content) ||
        /,\s*[}\]]/.test(content) ||
        /\{\s*,\s*\}/.test(content)
      );
    } catch {
      return false;
    }
  });
  
  return affectedFiles;
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const findAll = args.includes('--find-all');
  const specific = args.filter(arg => !arg.startsWith('--'));
  
  log.info('Starting JSX syntax fix process...');
  if (dryRun) {
    log.warning('Running in DRY RUN mode - no files will be modified');
  }
  
  let filesToFix = [];
  
  if (specific.length > 0) {
    filesToFix = specific;
  } else if (findAll) {
    log.info('Searching for all affected files...');
    filesToFix = findAffectedFiles();
    log.info(`Found ${filesToFix.length} files with potential issues`);
  } else {
    // Use priority files first
    filesToFix = priorityFiles.filter(file => fs.existsSync(file));
    log.info(`Processing ${filesToFix.length} priority files`);
  }
  
  let totalFixed = 0;
  let totalChanges = 0;
  const errors = [];
  
  for (const file of filesToFix) {
    log.file(`Processing: ${file}`);
    const result = fixFile(file, dryRun);
    
    if (result.fixed) {
      totalFixed++;
      totalChanges += result.changes;
    } else if (result.changes === 0) {
      log.info(`No JSX syntax issues found in ${file}`);
    }
    
    if (result.error) {
      errors.push({ file, error: result.error });
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  log.success(`Process complete!`);
  log.info(`Files processed: ${filesToFix.length}`);
  log.info(`Files fixed: ${totalFixed}`);
  log.info(`Total changes: ${totalChanges}`);
  
  if (errors.length > 0) {
    log.error(`Errors encountered: ${errors.length}`);
    errors.forEach(({ file, error }) => {
      log.error(`  ${file}: ${error}`);
    });
  }
  
  if (!dryRun && totalFixed > 0) {
    console.log('\n' + colors.yellow + 'Next steps:' + colors.reset);
    console.log('1. Run TypeScript check: npm run type-check');
    console.log('2. Run tests: npm test');
    console.log('3. Check for build errors: npm run build');
    console.log('4. To find and fix all files: node fix-jsx-errors.js --find-all');
    console.log('\nBackups created in:', BACKUP_DIR);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { fixFile, findAffectedFiles };