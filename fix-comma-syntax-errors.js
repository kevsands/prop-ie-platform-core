#!/usr/bin/env node

/**
 * Automated fix for comma syntax errors in TypeScript files
 * Fixes patterns like "strin, g" -> "string", "numbe, r" -> "number", etc.
 */

const fs = require('fs');
const path = require('path');

// Files identified with comma syntax errors
const filesToFix = [
  'src/features/security/DataEncryptionService.tsx',
  'src/app/register/professional/page.tsx',
  'src/features/compliance/ComplianceDashboard.tsx',
  'src/services/development-service.ts',
  'src/lib/graphql/resolvers/development.ts',
  'src/features/security/RuntimeSecurityMonitor.tsx',
  'src/services/realtime/RealtimeEngine.ts',
  'src/lib/developer-platform/index.ts',
  'src/lib/transaction-engine/snagging-system.ts',
  'src/lib/supplierApi.ts',
  'src/features/security/AccessControlManagement.tsx',
  'src/lib/transaction-engine/handover-system.ts',
  'src/lib/collaboration/collaboration-engine.ts'
];

// Patterns to fix
const patterns = [
  { find: /strin,\s*g/g, replace: 'string' },
  { find: /numbe,\s*r/g, replace: 'number' },
  { find: /boolea,\s*n/g, replace: 'boolean' },
  { find: /objec,\s*t/g, replace: 'object' },
  { find: /symbo,\s*l/g, replace: 'symbol' },
  { find: /undefine,\s*d/g, replace: 'undefined' },
  { find: /nul,\s*l/g, replace: 'null' },
  { find: /voi,\s*d/g, replace: 'void' },
  { find: /an,\s*y/g, replace: 'any' },
  { find: /neve,\s*r/g, replace: 'never' },
  { find: /unknow,\s*n/g, replace: 'unknown' },
  { find: /bigint,\s*t/g, replace: 'bigint' },
  // Common type names that might be affected
  { find: /Arra,\s*y/g, replace: 'Array' },
  { find: /Promis,\s*e/g, replace: 'Promise' },
  { find: /Dat,\s*e/g, replace: 'Date' },
  { find: /Erro,\s*r/g, replace: 'Error' },
  { find: /Functio,\s*n/g, replace: 'Function' },
  { find: /RegEx,\s*p/g, replace: 'RegExp' },
  { find: /Ma,\s*p/g, replace: 'Map' },
  { find: /Se,\s*t/g, replace: 'Set' },
];

let totalFixesApplied = 0;
let filesFixed = 0;

console.log('🔧 TypeScript Comma Syntax Error Fixer\n');
console.log(`Found ${filesToFix.length} files to process\n`);

// Create backup directory
const backupDir = path.join(__dirname, 'comma-syntax-backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Process each file
filesToFix.forEach((filePath) => {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  try {
    // Read file content
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    let fixCount = 0;

    // Apply all pattern fixes
    patterns.forEach(({ find, replace }) => {
      const matches = content.match(find);
      if (matches) {
        fixCount += matches.length;
        content = content.replace(find, replace);
      }
    });

    if (fixCount > 0) {
      // Create backup
      const backupPath = path.join(backupDir, path.basename(filePath) + '.bak');
      fs.writeFileSync(backupPath, originalContent);

      // Write fixed content
      fs.writeFileSync(fullPath, content);
      
      console.log(`✅ Fixed ${filePath} (${fixCount} replacements)`);
      totalFixesApplied += fixCount;
      filesFixed++;
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Error processing ${filePath}: ${error.message}`);
  }
});

console.log('\n📊 Summary:');
console.log(`- Files processed: ${filesToFix.length}`);
console.log(`- Files fixed: ${filesFixed}`);
console.log(`- Total replacements: ${totalFixesApplied}`);
console.log(`- Backups saved to: ${backupDir}`);

if (totalFixesApplied > 0) {
  console.log('\n✨ Success! Run "npm run type-check" to see the remaining TypeScript errors.');
  console.log('💡 Tip: You may need to restart your TypeScript server in VS Code.');
} else {
  console.log('\n🤔 No comma syntax errors found. The issues may have already been fixed.');
}