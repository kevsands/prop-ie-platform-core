#!/usr/bin/env node

/**
 * Test Conformance Checker
 * 
 * This script analyzes test files to ensure they follow the project's
 * established testing patterns and best practices. It is intended to run
 * as part of CI to enforce consistent testing standards.
 * 
 * Usage:
 *   node scripts/test-conformance-checker.js [options]
 * 
 * Options:
 *   --fix       Try to automatically fix common issues
 *   --strict    Exit with error code for any violations
 *   --path      Specific path to check (defaults to all test files)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  fix: args.includes('--fix'),
  strict: args.includes('--strict'),
  path: args.find(arg => arg.startsWith('--path='))?.split('=')[1] || null,
};

// Configuration for the checker
const config = {
  testFiles: options.path 
    ? [options.path]
    : [
        '**/__tests__/**/*.{js,jsx,ts,tsx}',
        '**/*.{spec,test}.{js,jsx,ts,tsx}',
      ],
  exclude: [
    '**/node_modules/**',
    '**/.next/**',
  ],
  rules: {
    // Must include required imports
    requiredImports: [
      '@testing-library/jest-dom',
      'jest-extended',
    ],
    // Must use standardized test utilities
    useStandardUtilities: true,
    // Tests should have at least one assertion
    hasAssertions: true,
    // Tests should use proper describe/it structure
    properTestStructure: true,
    // Should use proper render wrappers
    useProperRenders: true,
    // Should not use act() directly when avoidable
    noDirectAct: true,
    // Should use proper user interaction methods
    userEventsOverFireEvents: true,
    // Should include a reasonable number of tests
    minTestsPerFile: 2,
    // Should have clean setup and teardown
    cleanupAfterTests: true,
    // No disabled tests in production (allow in development)
    noDisabledTests: !options.strict,
  },
  utilities: {
    render: [
      'render',
      'customRender',
      'renderWithQueryClient',
      'renderWithAuth',
      'setupUser',
    ],
    fireEvent: [
      'fireEvent.click',
      'fireEvent.change',
      'fireEvent.submit',
    ],
    userEvent: [
      'userEvent.click',
      'userEvent.type',
      'userEvent.tab',
      'userEvent.keyboard',
      'userEvent.upload',
      'user.click',
      'user.type',
      'user.tab',
      'user.keyboard',
      'user.upload',
    ],
  },
};

// Helper functions
function findTestFiles() {
  let files = [];
  
  for (const pattern of config.testFiles) {
    try {
      const result = execSync(`find . -path "./${pattern}" ${config.exclude.map(e => `-not -path "${e}"`).join(' ')}`, 
        { encoding: 'utf8' });
      files = [...files, ...result.trim().split('\n').filter(Boolean)];
    } catch (error) {
      console.error(`Error finding test files for pattern ${pattern}:`, error);
    }
  }
  
  return [...new Set(files)]; // Remove duplicates
}

function analyzeTestFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileExtension = path.extname(filePath);
  const isTypeScript = fileExtension === '.ts' || fileExtension === '.tsx';
  
  // Simple parsing for common patterns
  const issues = [];
  
  // Check for required imports
  for (const importName of config.rules.requiredImports) {
    const importRegex = new RegExp(`import.*['"]${importName}['"]`, 'g');
    if (!importRegex.test(content)) {
      issues.push({
        rule: 'requiredImports',
        message: `Missing required import: ${importName}`,
        fixable: true,
        fix: () => {
          // Add import at the top of the file
          const importStatement = isTypeScript
            ? `import '${importName}';\n`
            : `import '${importName}';\n`;
          return content.replace(/^(import .+;\n)*/, match => match + importStatement);
        },
      });
    }
  }
  
  // Check for test structure (describe/it)
  if (config.rules.properTestStructure) {
    const hasDescribe = /describe\s*\(/.test(content);
    const hasIt = /it\s*\(/.test(content) || /test\s*\(/.test(content);
    
    if (!hasDescribe) {
      issues.push({
        rule: 'properTestStructure',
        message: 'Tests should be organized within describe blocks',
        fixable: false,
      });
    }
    
    if (!hasIt) {
      issues.push({
        rule: 'properTestStructure',
        message: 'No test cases found (it or test blocks)',
        fixable: false,
      });
    }
  }
  
  // Check for assertions
  if (config.rules.hasAssertions) {
    const hasExpect = /expect\s*\(/.test(content);
    
    if (!hasExpect) {
      issues.push({
        rule: 'hasAssertions',
        message: 'Test file has no assertions (expect statements)',
        fixable: false,
      });
    }
  }
  
  // Check for proper render utilities
  if (config.rules.useProperRenders) {
    const hasRender = /render\s*\(/.test(content);
    const hasCustomRender = config.utilities.render.some(util => 
      new RegExp(`${util}\\s*\\(`).test(content)
    );
    
    if (hasRender && !hasCustomRender) {
      issues.push({
        rule: 'useProperRenders',
        message: 'Use standardized render utilities (customRender, renderWithQueryClient, etc.) instead of plain render',
        fixable: options.fix && isSimpleRenderCase(content),
        fix: () => {
          // This is a simple replacement and might need manual review
          return content.replace(/import\s*{\s*render\s*}\s*from\s*['"]@testing-library\/react['"]/, 
            `import { customRender } from '../../src/test-utils'`)
            .replace(/render\s*\(/g, 'customRender(');
        },
      });
    }
  }
  
  // Check for direct act() usage
  if (config.rules.noDirectAct) {
    const hasDirectAct = /import.*act.*from\s*['"]react-dom\/test-utils['"]/.test(content) || 
                        /import.*act.*from\s*['"]@testing-library\/react['"]/.test(content);
    
    if (hasDirectAct) {
      issues.push({
        rule: 'noDirectAct',
        message: 'Avoid direct usage of act(). Use higher-level utilities like userEvent or waitFor instead',
        fixable: false,
      });
    }
  }
  
  // Check for fireEvent vs userEvent
  if (config.rules.userEventsOverFireEvents) {
    const hasFireEvent = config.utilities.fireEvent.some(evt => content.includes(evt));
    const hasUserEvent = config.utilities.userEvent.some(evt => content.includes(evt));
    
    if (hasFireEvent && !hasUserEvent) {
      issues.push({
        rule: 'userEventsOverFireEvents',
        message: 'Prefer userEvent over fireEvent for simulating user interactions',
        fixable: false,
      });
    }
  }
  
  // Check for disabled tests
  if (config.rules.noDisabledTests) {
    const hasDisabledTests = /it\.skip\s*\(/.test(content) || 
                            /test\.skip\s*\(/.test(content) || 
                            /describe\.skip\s*\(/.test(content) ||
                            /it\s*\(\s*['"].*['"],\s*\(\)/.test(content) && content.includes('// TODO') ||
                            /xit\s*\(/.test(content) ||
                            /xtest\s*\(/.test(content) ||
                            /xdescribe\s*\(/.test(content);
    
    if (hasDisabledTests) {
      issues.push({
        rule: 'noDisabledTests',
        message: 'Test file contains disabled or skipped tests',
        fixable: false,
      });
    }
  }
  
  // Check for cleanup
  if (config.rules.cleanupAfterTests) {
    const hasAfterEach = /afterEach\s*\(/.test(content);
    const hasAfterAll = /afterAll\s*\(/.test(content);
    const needsCleanup = content.includes('mockFetch') || 
                         content.includes('mockLocalStorage') || 
                         content.includes('mockConsole') ||
                         content.includes('mockWindow') ||
                         content.includes('jest.mock(');
    
    if (needsCleanup && !hasAfterEach && !hasAfterAll) {
      issues.push({
        rule: 'cleanupAfterTests',
        message: 'Tests use mocks but have no cleanup in afterEach or afterAll',
        fixable: false,
      });
    }
  }
  
  // Check for minimum number of tests
  if (config.rules.minTestsPerFile) {
    const itMatches = content.match(/it\s*\(/g) || [];
    const testMatches = content.match(/test\s*\(/g) || [];
    const testCount = itMatches.length + testMatches.length;
    
    if (testCount < config.rules.minTestsPerFile) {
      issues.push({
        rule: 'minTestsPerFile',
        message: `Test file has only ${testCount} tests, minimum is ${config.rules.minTestsPerFile}`,
        fixable: false,
      });
    }
  }
  
  return { 
    path: filePath, 
    issues, 
    fixableIssues: issues.filter(i => i.fixable),
    testCount: (content.match(/it\s*\(/g) || []).length + (content.match(/test\s*\(/g) || []).length,
  };
}

function isSimpleRenderCase(content) {
  // Check if this is a simple case that can be automatically fixed
  // This is a heuristic and might need adjustment
  const hasPlainRender = /import\s*{\s*render\s*}\s*from\s*['"]@testing-library\/react['"]/.test(content);
  const hasComplexProviders = content.includes('<Provider') || 
                             content.includes('<Router') || 
                             content.includes('ThemeProvider');
  
  return hasPlainRender && !hasComplexProviders;
}

function fixIssues(fileAnalysis) {
  let updatedContent = fs.readFileSync(fileAnalysis.path, 'utf8');
  
  for (const issue of fileAnalysis.fixableIssues) {
    console.log(chalk.yellow(`  - Fixing: ${issue.message}`));
    updatedContent = issue.fix(updatedContent);
  }
  
  if (updatedContent !== fs.readFileSync(fileAnalysis.path, 'utf8')) {
    fs.writeFileSync(fileAnalysis.path, updatedContent);
    return true;
  }
  
  return false;
}

// Main execution
console.log(chalk.blue('Running Test Conformance Checker'));
console.log(`Mode: ${options.fix ? 'Fix' : 'Check'}, Strictness: ${options.strict ? 'Strict' : 'Normal'}`);

const testFiles = findTestFiles();
console.log(`Found ${testFiles.length} test files to analyze`);

let totalIssues = 0;
let totalFixableIssues = 0;
let totalFixed = 0;
const fileResults = [];

for (const filePath of testFiles) {
  const relativeFilePath = filePath.replace(/^\.\//, '');
  process.stdout.write(`Analyzing ${relativeFilePath}... `);
  
  try {
    const analysis = analyzeTestFile(filePath);
    fileResults.push(analysis);
    
    totalIssues += analysis.issues.length;
    totalFixableIssues += analysis.fixableIssues.length;
    
    if (analysis.issues.length === 0) {
      console.log(chalk.green('✓ No issues'));
    } else {
      console.log(chalk.yellow(`✘ ${analysis.issues.length} issues found (${analysis.fixableIssues.length} fixable)`));
      
      // Print issues
      for (const issue of analysis.issues) {
        console.log(`  - ${issue.fixable ? '[FIXABLE] ' : ''}${issue.message}`);
      }
      
      // Fix issues if requested
      if (options.fix && analysis.fixableIssues.length > 0) {
        const fixed = fixIssues(analysis);
        if (fixed) {
          totalFixed += analysis.fixableIssues.length;
          console.log(chalk.green(`  ✓ Fixed ${analysis.fixableIssues.length} issues`));
        }
      }
    }
  } catch (error) {
    console.log(chalk.red(`Error analyzing ${relativeFilePath}: ${error.message}`));
  }
}

// Print summary
console.log('\n--- Test Conformance Summary ---');
console.log(`Total test files: ${testFiles.length}`);
console.log(`Total issues found: ${totalIssues}`);
console.log(`Fixable issues: ${totalFixableIssues}`);

if (options.fix) {
  console.log(`Issues fixed: ${totalFixed}`);
}

// Generate reports
const report = {
  timestamp: new Date().toISOString(),
  totalFiles: testFiles.length,
  totalIssues,
  fixableIssues: totalFixableIssues,
  fixedIssues: totalFixed,
  fileResults: fileResults.map(result => ({
    path: result.path,
    issueCount: result.issues.length,
    fixableCount: result.fixableIssues.length,
    issues: result.issues.map(issue => ({
      rule: issue.rule,
      message: issue.message,
      fixable: issue.fixable
    }))
  }))
};

const outputDir = './test-reports';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'test-conformance.json'),
  JSON.stringify(report, null, 2)
);

console.log(`\nDetailed report saved to ${path.join(outputDir, 'test-conformance.json')}`);

// Exit with error code if in strict mode and issues found
if (options.strict && totalIssues > 0) {
  console.log(chalk.red('Exiting with error due to conformance issues'));
  process.exit(1);
} else {
  console.log(chalk.green('Test conformance check completed'));
}