#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing TypeScript Errors in Detail...\n');

// Run TypeScript compiler and capture all errors
let allErrors;
try {
  execSync('npx tsc --noEmit', { encoding: 'utf8' });
  console.log('✅ No TypeScript errors found!');
  process.exit(0);
} catch (error) {
  allErrors = error.stdout || error.stderr || '';
}

// Parse errors
const errorLines = allErrors.split('\n').filter(line => line.includes('error TS'));
const errors = [];

errorLines.forEach(line => {
  const match = line.match(/^(.+?)\((\d+),(\d+)\): error (TS\d+): (.+)$/);
  if (match) {
    errors.push({
      file: match[1],
      line: parseInt(match[2]),
      column: parseInt(match[3]),
      code: match[4],
      message: match[5]
    });
  }
});

// Analyze error patterns
const analysis = {
  totalErrors: errors.length,
  errorsByCode: {},
  errorsByFile: {},
  syntaxErrors: [],
  jsxErrors: [],
  typeErrors: [],
  commaErrors: []
};

// Categorize errors
errors.forEach(error => {
  // Count by error code
  analysis.errorsByCode[error.code] = (analysis.errorsByCode[error.code] || 0) + 1;
  
  // Count by file
  analysis.errorsByFile[error.file] = (analysis.errorsByFile[error.file] || 0) + 1;
  
  // Identify specific error types
  if (error.code === 'TS1005' || error.code === 'TS1003') {
    analysis.syntaxErrors.push(error);
  }
  
  if (error.code === 'TS17002' || error.code === 'TS17008') {
    analysis.jsxErrors.push(error);
  }
  
  if (error.message.includes(', g') || error.message.includes(', r') || error.message.includes(', n')) {
    analysis.commaErrors.push(error);
  }
});

// Search for comma syntax errors in source files
console.log('🔍 Searching for comma syntax errors...\n');
const commaPatterns = [
  'strin, g',
  'numbe, r',
  'boolea, n',
  'objec, t',
  'functio, n',
  'arra, y',
  'voi, d',
  'nul, l',
  'undefine, d'
];

const filesWithCommaErrors = new Set();
try {
  const grepPattern = commaPatterns.join('\\|');
  const grepResult = execSync(`grep -r "${grepPattern}" --include="*.ts" --include="*.tsx" src/ 2>/dev/null || true`, { encoding: 'utf8' });
  
  if (grepResult) {
    const lines = grepResult.split('\n').filter(Boolean);
    lines.forEach(line => {
      const [file] = line.split(':');
      if (file) filesWithCommaErrors.add(file);
    });
  }
} catch (e) {
  // Ignore grep errors
}

// Generate report
const report = `# TypeScript Error Analysis Report

Generated: ${new Date().toISOString()}

## 📊 Summary

- **Total Errors**: ${analysis.totalErrors}
- **Files with Errors**: ${Object.keys(analysis.errorsByFile).length}
- **Files with Comma Syntax Errors**: ${filesWithCommaErrors.size}

## 🔴 Critical Issues

### 1. Comma Syntax Errors (${filesWithCommaErrors.size} files)
These files contain malformed type annotations with commas inside type names (e.g., "strin, g" instead of "string"):

${Array.from(filesWithCommaErrors).map(file => `- ${file}`).join('\n')}

### 2. Top Error Types
${Object.entries(analysis.errorsByCode)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([code, count]) => {
    let description = '';
    switch(code) {
      case 'TS1005': description = 'Missing token (e.g., }, ), ;)'; break;
      case 'TS1381': description = 'Unexpected token (usually JSX syntax)'; break;
      case 'TS1109': description = 'Expression expected'; break;
      case 'TS1128': description = 'Declaration or statement expected'; break;
      case 'TS17002': description = 'Expected corresponding JSX closing tag'; break;
      case 'TS1382': description = 'Unexpected token (HTML entities in JSX)'; break;
      case 'TS1011': description = 'Element access expression missing argument'; break;
      case 'TS1136': description = 'Property assignment expected'; break;
      case 'TS1003': description = 'Identifier expected'; break;
      case 'TS1135': description = 'Argument expression expected'; break;
    }
    return `- **${code}**: ${count} errors - ${description}`;
  }).join('\n')}

### 3. Most Problematic Files (Top 20)
${Object.entries(analysis.errorsByFile)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)
  .map(([file, count]) => `- ${file}: **${count} errors**`)
  .join('\n')}

## 🔧 Fix Priority

### Priority 1: Comma Syntax Errors (Automated Fix Available)
These can be fixed automatically by replacing "type, name" patterns with "typename":
- Run: \`node scripts/fix-comma-errors.js\`

### Priority 2: JSX Syntax Errors
${analysis.jsxErrors.length} JSX-related errors that need manual review:
- Missing closing tags
- Malformed JSX expressions
- Incorrect HTML entity escaping

### Priority 3: General Syntax Errors
${analysis.syntaxErrors.length} general syntax errors requiring manual fixes:
- Missing brackets, parentheses, or semicolons
- Incorrect token placement

## 📈 Error Distribution

### By Error Type
\`\`\`
${Object.entries(analysis.errorsByCode)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15)
  .map(([code, count]) => {
    const percentage = ((count / analysis.totalErrors) * 100).toFixed(1);
    const bar = '█'.repeat(Math.floor(percentage / 2));
    return `${code}: ${bar} ${count} (${percentage}%)`;
  }).join('\n')}
\`\`\`

## 🎯 Recommended Actions

1. **Immediate**: Fix comma syntax errors (automated script available)
2. **High Priority**: Fix JSX syntax errors in top problematic files
3. **Medium Priority**: Address missing tokens and expression errors
4. **Low Priority**: Clean up remaining syntax issues

## 💡 Root Causes

Based on the error patterns, the main issues appear to be:

1. **Systematic typo**: Type names have been corrupted with commas (e.g., "strin, g")
2. **JSX syntax issues**: Malformed JSX, especially in complex components
3. **Incomplete refactoring**: Many files have unmatched brackets/tags
4. **Copy-paste errors**: Similar error patterns across multiple files

## 🚀 Next Steps

1. Run the comma error fix script
2. Focus on files with 100+ errors first
3. Use ESLint with auto-fix for basic syntax issues
4. Consider using TypeScript's --incremental flag for faster checks
`;

// Write report
fs.writeFileSync('typescript-error-analysis.md', report);
console.log('📄 Report written to: typescript-error-analysis.md');

// Create fix script for comma errors
const fixScript = `#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔧 Fixing comma syntax errors in TypeScript files...\\n');

const patterns = [
  { search: /strin,\\s*g/g, replace: 'string' },
  { search: /numbe,\\s*r/g, replace: 'number' },
  { search: /boolea,\\s*n/g, replace: 'boolean' },
  { search: /objec,\\s*t/g, replace: 'object' },
  { search: /functio,\\s*n/g, replace: 'function' },
  { search: /arra,\\s*y/g, replace: 'array' },
  { search: /voi,\\s*d/g, replace: 'void' },
  { search: /nul,\\s*l/g, replace: 'null' },
  { search: /undefine,\\s*d/g, replace: 'undefined' }
];

const files = glob.sync('src/**/*.{ts,tsx}');
let totalFixes = 0;
let filesFixed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  let fixes = 0;
  
  patterns.forEach(pattern => {
    const matches = content.match(pattern.search);
    if (matches) {
      fixes += matches.length;
      content = content.replace(pattern.search, pattern.replace);
    }
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(\`✅ Fixed \${fixes} errors in \${file}\`);
    totalFixes += fixes;
    filesFixed++;
  }
});

console.log(\`\\n✨ Fixed \${totalFixes} comma syntax errors in \${filesFixed} files!\`);
`;

fs.writeFileSync('fix-comma-syntax-errors.js', fixScript);
fs.chmodSync('fix-comma-syntax-errors.js', '755');
console.log('🔧 Fix script created: fix-comma-syntax-errors.js');

// Show summary
console.log('\n📊 Quick Summary:');
console.log(`- Total Errors: ${analysis.totalErrors}`);
console.log(`- Files with Errors: ${Object.keys(analysis.errorsByFile).length}`);
console.log(`- Files with Comma Errors: ${filesWithCommaErrors.size}`);
console.log(`- Most Common Error: ${Object.entries(analysis.errorsByCode).sort((a, b) => b[1] - a[1])[0].join(': ')} occurrences`);