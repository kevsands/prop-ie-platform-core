#!/usr/bin/env node

/**
 * Fix escaped newlines in TypeScript files
 * Fixes patterns like "Maybe<JSON>\n  );" which should be "Maybe<JSON>);"
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Files with high error counts that likely have this issue
const filesToCheck = [
  'src/types/graphql.ts',
  'src/utils/performance/monitor.tsx',
  'src/app/buyer/booking/page.tsx',
  'src/types/core/analytics.ts',
  'src/lib/data-service.ts',
  'src/hooks/useBuyerAPI.ts',
  'src/graphql/client.ts',
  'src/app/solutions/professional-investors/page.tsx',
  'src/components/finance/ROICalculator.tsx',
  'src/components/finance/ScenarioComparison.tsx',
  'src/lib/amplify/api.ts',
  'src/hooks/UserRegistration.tsx',
  'src/components/auth/UserRegistration.tsx'
];

let totalFixed = 0;
let filesProcessed = 0;

console.log('🔧 Fixing escaped newlines in TypeScript files\n');

// Create backup directory
const backupDir = path.join(__dirname, 'newline-fix-backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Also search for all .ts and .tsx files with the pattern
const allTsFiles = glob.sync('src/**/*.{ts,tsx}', {
  ignore: ['**/node_modules/**', '**/.next/**', '**/dist/**']
});

// Combine specific files and search results
const allFiles = [...new Set([...filesToCheck, ...allTsFiles])];

allFiles.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    return;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    let fixCount = 0;

    // Fix patterns with escaped newlines
    // Pattern 1: Type definitions with \n before closing
    content = content.replace(/(\w+>?)\\n\s*\)/g, (match, p1) => {
      fixCount++;
      return p1 + ')';
    });

    // Pattern 2: Property definitions with \n
    content = content.replace(/(<[^>]+>)\\n\s*;/g, (match, p1) => {
      fixCount++;
      return p1 + ';';
    });

    // Pattern 3: Array types with \n
    content = content.replace(/Array<([^>]+)>\\n\s*\)/g, (match, p1) => {
      fixCount++;
      return `Array<${p1}>)`;
    });

    // Pattern 4: General escaped newlines in type positions
    content = content.replace(/\\n\s*([);,}])/g, (match, p1) => {
      fixCount++;
      return p1;
    });

    // Pattern 5: Double escaped (\\n)
    content = content.replace(/\\\\n/g, () => {
      fixCount++;
      return '';
    });

    if (fixCount > 0) {
      // Create backup
      const backupPath = path.join(backupDir, path.basename(filePath) + '.bak');
      fs.writeFileSync(backupPath, originalContent);

      // Write fixed content
      fs.writeFileSync(fullPath, content);
      
      console.log(`✅ Fixed ${filePath} (${fixCount} escaped newlines removed)`);
      totalFixed += fixCount;
      filesProcessed++;
    }
  } catch (error) {
    console.log(`❌ Error processing ${filePath}: ${error.message}`);
  }
});

console.log('\n📊 Summary:');
console.log(`- Files checked: ${allFiles.length}`);
console.log(`- Files fixed: ${filesProcessed}`);
console.log(`- Total fixes: ${totalFixed}`);
console.log(`- Backups saved to: ${backupDir}`);

if (totalFixed > 0) {
  console.log('\n✨ Success! The escaped newline issues have been fixed.');
  console.log('🔄 Run "npm run type-check" to see the updated error count.');
}