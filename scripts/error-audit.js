/**
 * TypeScript Error Audit Tool for prop-ie-aws-app
 * 
 * This script analyzes TypeScript errors across the codebase,
 * categorizes them, and outputs a detailed report to help
 * prioritize and address issues systematically.
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_DIR = path.join(__dirname, '..', 'error-reports');
const ERROR_CATEGORIES = {
  PROPERTY_ACCESS: /TS2339|Property '.*?' does not exist/,
  TYPE_MISMATCH: /TS2322|Type '.*?' is not assignable/,
  IMPLICIT_ANY: /TS7006|Parameter '.*?' implicitly has an 'any'/,
  MODULE_IMPORT: /TS2305|Module '.*?' has no exported member/,
  UNKNOWN_TYPE: /TS18046|Type 'unknown' is not/,
  MISSING_TYPES: /TS7031|cannot use 'import\.meta'/,
  REACT_QUERY: /useQuery|useMutation|QueryClient/,
  NEXTJS_ROUTES: /Layout|Page|not a valid React Component/,
  AMPLIFY_AUTH: /Amplify|Cognito|Auth|getUser/,
  THREE_JS: /three|THREE|GLTFLoader/,
  OTHER: /./
};

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Run TypeScript check and capture output
function runTypeCheck() {
  console.log('Running TypeScript check...');
  try {
    const output = execSync('npx tsc --noEmit', { encoding: 'utf-8' });
    return output;
  } catch (error) {
    return error.stdout; // TypeScript usually exits with error code when there are type errors
  }
}

// Parse errors from TypeScript output
function parseErrors(output) {
  const lines = output.split('\n');
  const errors = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('.tsx(') || line.includes('.ts(')) {
      // Parse file path, line, and column
      const fileMatch = line.match(/(.+?\.tsx?)\((\d+),(\d+)\)/);
      if (!fileMatch) continue;
      
      const [_, filePath, lineNum, colNum] = fileMatch;
      const errorMessage = line.substring(line.indexOf('):') + 2).trim();
      const errorCode = errorMessage.match(/TS\d+/) ? errorMessage.match(/TS\d+/)[0] : 'UNKNOWN';
      
      // Find the category
      let category = 'OTHER';
      for (const [cat, pattern] of Object.entries(ERROR_CATEGORIES)) {
        if (pattern.test(errorMessage) || pattern.test(filePath)) {
          category = cat;
          break;
        }
      }
      
      errors.push({
        filePath,
        lineNum: parseInt(lineNum),
        colNum: parseInt(colNum),
        errorMessage,
        errorCode,
        category
      });
    }
  }
  
  return errors;
}

// Group errors by file and category
function groupErrors(errors) {
  const byFile = {};
  const byCategory = {};
  const byCode = {};
  
  errors.forEach(error => {
    // Group by file
    if (!byFile[error.filePath]) {
      byFile[error.filePath] = [];
    }
    byFile[error.filePath].push(error);
    
    // Group by category
    if (!byCategory[error.category]) {
      byCategory[error.category] = [];
    }
    byCategory[error.category].push(error);
    
    // Group by error code
    if (!byCode[error.errorCode]) {
      byCode[error.errorCode] = [];
    }
    byCode[error.errorCode].push(error);
  });
  
  return { byFile, byCategory, byCode };
}

// Generate summary report
function generateSummary(errors, groupedErrors) {
  const { byFile, byCategory, byCode } = groupedErrors;
  
  const summary = {
    totalErrors: errors.length,
    fileCount: Object.keys(byFile).length,
    categoryCounts: {},
    topErrorCodes: [],
    fileRanking: []
  };
  
  // Count errors by category
  for (const category in byCategory) {
    summary.categoryCounts[category] = byCategory[category].length;
  }
  
  // Get top error codes
  summary.topErrorCodes = Object.entries(byCode)
    .map(([code, errors]) => ({ code, count: errors.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Rank files by error count
  summary.fileRanking = Object.entries(byFile)
    .map(([file, errors]) => ({ file, count: errors.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  
  return summary;
}

// Write reports to files
function writeReports(errors, groupedErrors, summary) {
  // Write full error list
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'all-errors.json'),
    JSON.stringify(errors, null, 2)
  );
  
  // Write summary report
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'summary.json'),
    JSON.stringify(summary, null, 2)
  );
  
  // Write pretty summary report
  const prettyReport = `# TypeScript Error Summary
  
## Overview
- Total Errors: ${summary.totalErrors}
- Files with Errors: ${summary.fileCount}

## Error Categories
${Object.entries(summary.categoryCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([category, count]) => `- ${category}: ${count} (${(count / summary.totalErrors * 100).toFixed(1)}%)`)
  .join('\n')}

## Top Error Codes
${summary.topErrorCodes
  .map(({ code, count }) => `- ${code}: ${count}`)
  .join('\n')}

## Files with Most Errors
${summary.fileRanking
  .map(({ file, count }) => `- ${file}: ${count}`)
  .join('\n')}
`;

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'summary.md'),
    prettyReport
  );
  
  // Write category-specific reports
  for (const [category, categoryErrors] of Object.entries(groupedErrors.byCategory)) {
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `category-${category}.json`),
      JSON.stringify(categoryErrors, null, 2)
    );
  }
  
  console.log(`Reports written to ${OUTPUT_DIR}`);
}

// Generate fix plans (templates for addressing each category of error)
function generateFixPlans(groupedErrors, summary) {
  const plans = {};
  
  // Create plans for each category
  for (const category in groupedErrors.byCategory) {
    let plan = '';
    
    switch (category) {
      case 'PROPERTY_ACCESS':
        plan = `# Fix Plan for Property Access Errors
        
## Issue
Properties being accessed that don't exist on objects.

## Fix Approach
1. Check if property name is misspelled (e.g., 'role' vs 'roles')
2. Update interfaces/types to include the missing properties
3. Add optional chaining where appropriate: obj?.property
4. Add type guards: if ('property' in obj) { ... }

## Related Files
${groupedErrors.byCategory[category]
  .map(e => e.filePath)
  .filter((v, i, a) => a.indexOf(v) === i)
  .slice(0, 10)
  .map(file => `- ${file}`)
  .join('\n')}
`;
        break;
        
      case 'TYPE_MISMATCH':
        plan = `# Fix Plan for Type Mismatch Errors
        
## Issue
Types being assigned that are incompatible with declared types.

## Fix Approach
1. Update type declarations to match actual data shapes
2. Use type assertions where necessary: as Type
3. Add proper generic types to functions
4. Update interface inheritance to match implementation

## Related Files
${groupedErrors.byCategory[category]
  .map(e => e.filePath)
  .filter((v, i, a) => a.indexOf(v) === i)
  .slice(0, 10)
  .map(file => `- ${file}`)
  .join('\n')}
`;
        break;

      case 'IMPLICIT_ANY':
        plan = `# Fix Plan for Implicit Any Errors
        
## Issue
Parameters and variables without explicit type annotations.

## Fix Approach
1. Add explicit type annotations to function parameters
2. Create interfaces for complex object parameters
3. Use 'unknown' instead of 'any' where type is truly unknown
4. Add generics to functions that handle multiple types

## Related Files
${groupedErrors.byCategory[category]
  .map(e => e.filePath)
  .filter((v, i, a) => a.indexOf(v) === i)
  .slice(0, 10)
  .map(file => `- ${file}`)
  .join('\n')}
`;
        break;

      case 'MODULE_IMPORT':
        plan = `# Fix Plan for Module Import Errors
        
## Issue
Importing non-existent exports from modules.

## Fix Approach
1. Check for renamed exports in updated packages (esp. React Query v4)
2. Add missing type declarations for external modules
3. Create module declaration files (.d.ts) for untyped libraries
4. Update imports to match current export names

## Related Files
${groupedErrors.byCategory[category]
  .map(e => e.filePath)
  .filter((v, i, a) => a.indexOf(v) === i)
  .slice(0, 10)
  .map(file => `- ${file}`)
  .join('\n')}
`;
        break;

      case 'REACT_QUERY':
        plan = `# Fix Plan for React Query Errors
        
## Issue
Migration issues from React Query v3 to v4.

## Fix Approach
1. Update import paths (from 'react-query' to '@tanstack/react-query')
2. Update hook parameter formats (options object structure changed)
3. Update QueryClient configuration
4. Add proper generic types to hooks

## Related Files
${groupedErrors.byCategory[category]
  .map(e => e.filePath)
  .filter((v, i, a) => a.indexOf(v) === i)
  .slice(0, 10)
  .map(file => `- ${file}`)
  .join('\n')}
`;
        break;

      case 'THREE_JS':
        plan = `# Fix Plan for Three.js Errors
        
## Issue
Type issues with Three.js integration.

## Fix Approach
1. Update Three.js type definitions
2. Add JSX namespace extensions for Three.js components
3. Create proper interfaces for Three.js props
4. Add explicit typing for Three.js event handlers

## Related Files
${groupedErrors.byCategory[category]
  .map(e => e.filePath)
  .filter((v, i, a) => a.indexOf(v) === i)
  .slice(0, 10)
  .map(file => `- ${file}`)
  .join('\n')}
`;
        break;
        
      default:
        plan = `# Fix Plan for ${category} Errors
        
## Issue
${category} type errors.

## Fix Approach
1. Review error messages to identify common patterns
2. Create or update type definitions
3. Implement type guards where appropriate
4. Consider using utility types (Partial, Pick, etc.)

## Related Files
${groupedErrors.byCategory[category]
  ?.map(e => e.filePath)
  .filter((v, i, a) => a.indexOf(v) === i)
  .slice(0, 10)
  .map(file => `- ${file}`)
  .join('\n') || 'None identified'}
`;
    }
    
    plans[category] = plan;
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `fix-plan-${category}.md`),
      plan
    );
  }
  
  return plans;
}

// Main execution
console.log('Starting TypeScript error audit...');
const typeCheckOutput = runTypeCheck();
const errors = parseErrors(typeCheckOutput);
const groupedErrors = groupErrors(errors);
const summary = generateSummary(errors, groupedErrors);
writeReports(errors, groupedErrors, summary);
const fixPlans = generateFixPlans(groupedErrors, summary);

console.log(`
Audit complete!
Found ${errors.length} errors across ${Object.keys(groupedErrors.byFile).length} files.
Reports and fix plans have been written to ${OUTPUT_DIR}.
`);