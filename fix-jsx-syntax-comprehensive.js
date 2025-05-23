#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Comprehensive JSX Syntax Fixer');
console.log('==================================\n');

// Files to fix based on error report
const priorityFiles = [
  'src/features/security/DataEncryptionService.tsx',
  'src/app/register/professional/page.tsx',
  'src/services/development-service.ts',
  'src/features/compliance/ComplianceDashboard.tsx',
  'src/components/dashboard/ProjectOverview.tsx',
  'src/features/security/RuntimeSecurityMonitor.tsx',
  'src/components/navigation/NextGenNavigation.tsx',
  'src/features/security/AccessControlManagement.tsx',
  'src/app/developer/page.tsx',
  'src/components/navigation/UltraModernNavigation.tsx'
];

// Common patterns to fix
const fixes = [
  // Fix HTML entities in JSX
  { pattern: /&rbrace;/g, replacement: '}' },
  { pattern: /&lbrace;/g, replacement: '{' },
  { pattern: /&lt;/g, replacement: '<' },
  { pattern: /&gt;/g, replacement: '>' },
  { pattern: /&amp;/g, replacement: '&' },
  { pattern: /&quot;/g, replacement: '"' },
  { pattern: /&apos;/g, replacement: "'" },
  
  // Fix comma errors in type definitions
  { pattern: /: strin, g;/g, replacement: ': string;' },
  { pattern: /: numbe, r;/g, replacement: ': number;' },
  { pattern: /: boolea, n;/g, replacement: ': boolean;' },
  { pattern: /: objec, t;/g, replacement: ': object;' },
  { pattern: /: an, y;/g, replacement: ': any;' },
  { pattern: /: voi, d;/g, replacement: ': void;' },
  
  // Fix common typos with comma insertions
  { pattern: /(\w+), (\w+);/g, replacement: '$1$2;' },
  { pattern: /(\w+), (\w+)\)/g, replacement: '$1$2)' },
  { pattern: /(\w+), (\w+)\]/g, replacement: '$1$2]' },
  { pattern: /(\w+), (\w+)\}/g, replacement: '$1$2}' },
  
  // Fix JSX expression issues
  { pattern: /\{, /g, replacement: '{' },
  { pattern: /, \}/g, replacement: '}' },
  
  // Fix spacing issues around JSX
  { pattern: /< (\w+)/g, replacement: '<$1' },
  { pattern: /(\w+) >/g, replacement: '$1>' },
  
  // Fix className issues
  { pattern: /className=\{"/g, replacement: 'className="' },
  { pattern: /"\}/g, replacement: '"', context: 'className' }
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fixCount = 0;
    
    // Apply all fixes
    fixes.forEach(fix => {
      const before = content;
      content = content.replace(fix.pattern, fix.replacement);
      if (before !== content) {
        fixCount += (before.match(fix.pattern) || []).length;
      }
    });
    
    // Additional complex fixes
    // Fix JSX closing tags
    content = content.replace(/<(\w+)([^>]*)>\s*<\/\s*>/g, '<$1$2 />');
    
    // Fix self-closing tags with spaces
    content = content.replace(/<(\w+)([^>]*)\s+\/\s*>/g, '<$1$2 />');
    
    // Fix double closing brackets
    content = content.replace(/}}/g, '}');
    content = content.replace(/{{/g, '{');
    
    // Fix return statements with JSX
    content = content.replace(/return\s*\n\s*</g, 'return (\\n    <');
    content = content.replace(/>\s*;\s*$/gm, '>\\n  );');
    
    if (content !== originalContent) {
      // Create backup
      const backupDir = path.join(process.cwd(), 'error-fix-backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      const backupPath = path.join(backupDir, path.basename(filePath) + '.bak-jsx-comprehensive-' + Date.now());
      fs.writeFileSync(backupPath, originalContent);
      
      // Write fixed content
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed ${fixCount} issues in ${filePath}`);
      return fixCount;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}: ${error.message}`);
    return 0;
  }
}

// Process priority files first
console.log('📌 Processing priority files with most errors...\n');
let totalFixes = 0;

priorityFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    totalFixes += fixFile(fullPath);
  }
});

// Then process all TypeScript/TSX files
console.log('\n📂 Processing all TypeScript files...\n');

const allFiles = glob.sync('src/**/*.{ts,tsx}', {
  ignore: ['**/node_modules/**', '**/build/**', '**/dist/**']
});

allFiles.forEach(file => {
  if (!priorityFiles.includes(file)) {
    totalFixes += fixFile(file);
  }
});

console.log(`\n✨ Total fixes applied: ${totalFixes}`);
console.log('\n🎯 Next steps:');
console.log('1. Run: npm run type-check');
console.log('2. If errors persist, run: node scripts/error-audit.js');
console.log('3. Review backups in error-fix-backups/ if needed');