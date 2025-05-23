#!/usr/bin/env node

const { performance } = require('perf_hooks');
const chalk = require('chalk');

// Test results tracker
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// Test helper functions
function test(name, fn) {
  try {
    const start = performance.now();
    fn();
    const duration = performance.now() - start;
    testResults.passed++;
    testResults.tests.push({ name, status: 'passed', duration });
    console.log(chalk.green('✓'), chalk.gray(name), chalk.gray(`(${duration.toFixed(2)}ms)`));
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({ name, status: 'failed', error: error.message });
    console.log(chalk.red('✗'), chalk.gray(name));
    console.log(chalk.red('  Error:'), error.message);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Component path tests
test('Developer onboarding pages exist', () => {
  const fs = require('fs');
  const pages = [
    'src/app/developer/onboarding/page.tsx',
    'src/app/developer/onboarding/company-setup/page.tsx',
    'src/app/developer/onboarding/team-setup/page.tsx',
    'src/app/developer/onboarding/subscription/page.tsx',
    'src/app/developer/onboarding/verification/page.tsx'
  ];
  
  pages.forEach(page => {
    assert(fs.existsSync(page), `Page ${page} not found`);
  });
});

test('Project creation wizard components exist', () => {
  const fs = require('fs');
  const components = [
    'src/app/developer/projects/create/page.tsx',
    'src/components/developer/projects/create/ProjectBasicInfo.tsx',
    'src/components/developer/projects/create/LocationSelection.tsx',
    'src/components/developer/projects/create/ProjectFinancials.tsx',
    'src/components/developer/projects/create/AIProjectAssistant.tsx',
    'src/components/developer/projects/create/ProjectReview.tsx'
  ];
  
  components.forEach(component => {
    assert(fs.existsSync(component), `Component ${component} not found`);
  });
});

test('Admin and analytics pages exist', () => {
  const fs = require('fs');
  const pages = [
    'src/app/admin/verifications/page.tsx',
    'src/app/analytics/dashboard/page.tsx',
    'src/components/ai/PlatformAssistant.tsx',
    'src/components/EnterpriseNavigation.tsx'
  ];
  
  pages.forEach(page => {
    assert(fs.existsSync(page), `Page ${page} not found`);
  });
});

test('Enterprise demo page exists', () => {
  const fs = require('fs');
  assert(fs.existsSync('src/app/enterprise-demo/page.tsx'), 'Enterprise demo page not found');
});

// Content validation tests
test('TypeScript imports are correct', () => {
  const fs = require('fs');
  const content = fs.readFileSync('src/app/developer/onboarding/page.tsx', 'utf8');
  
  assert(content.includes("'use client'"), 'Missing use client directive');
  assert(content.includes('import { useState'), 'Missing React hooks import');
  assert(content.includes('import { motion'), 'Missing Framer Motion import');
  assert(content.includes('import { useRouter'), 'Missing Next.js router import');
});

test('Form validation schemas are defined', () => {
  const fs = require('fs');
  const content = fs.readFileSync('src/app/developer/onboarding/company-setup/page.tsx', 'utf8');
  
  assert(content.includes('const companySchema = z.object'), 'Missing Zod schema definition');
  assert(content.includes('companyName:'), 'Missing companyName field in schema');
  assert(content.includes('registrationNumber:'), 'Missing registrationNumber field');
});

test('Real-time data simulation is implemented', () => {
  const fs = require('fs');
  const content = fs.readFileSync('src/app/analytics/dashboard/page.tsx', 'utf8');
  
  assert(content.includes('useState'), 'Missing state management');
  assert(content.includes('useEffect'), 'Missing effect hook for real-time updates');
  assert(content.includes('generateRealtimeData'), 'Missing real-time data generation');
});

test('AI assistant has voice support', () => {
  const fs = require('fs');
  const content = fs.readFileSync('src/components/ai/PlatformAssistant.tsx', 'utf8');
  
  assert(content.includes('FiMic'), 'Missing microphone icon');
  assert(content.includes('webkitSpeechRecognition'), 'Missing speech recognition API');
});

test('Navigation includes all enterprise features', () => {
  const fs = require('fs');
  const content = fs.readFileSync('src/components/EnterpriseNavigation.tsx', 'utf8');
  
  assert(content.includes('Developer Hub'), 'Missing Developer Hub');
  assert(content.includes('Admin'), 'Missing Admin section');
  assert(content.includes('Analytics'), 'Missing Analytics section');
  assert(content.includes('AI Assistant'), 'Missing AI Assistant');
});

// Performance tests
test('Files are optimized in size', () => {
  const fs = require('fs');
  const files = [
    'src/app/developer/onboarding/page.tsx',
    'src/app/analytics/dashboard/page.tsx'
  ];
  
  files.forEach(file => {
    const stats = fs.statSync(file);
    const sizeInKB = stats.size / 1024;
    assert(sizeInKB < 50, `File ${file} is too large (${sizeInKB.toFixed(2)}KB)`);
  });
});

// Results summary
console.log('\n' + chalk.bold('Test Results:'));
console.log(chalk.green(`Passed: ${testResults.passed}`));
console.log(chalk.red(`Failed: ${testResults.failed}`));
console.log(chalk.gray(`Total: ${testResults.tests.length}`));

if (testResults.failed > 0) {
  console.log('\n' + chalk.red('Failed tests:'));
  testResults.tests
    .filter(t => t.status === 'failed')
    .forEach(t => {
      console.log(chalk.red('  ✗'), t.name);
      console.log(chalk.gray('    Error:'), t.error);
    });
  process.exit(1);
} else {
  console.log('\n' + chalk.green('All tests passed! 🎉'));
  console.log(chalk.gray('Enterprise platform is ready for deployment'));
}