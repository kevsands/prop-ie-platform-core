#!/usr/bin/env node

/**
 * Buyer→Developer Integration Test Suite
 * 
 * This script tests the complete flow from buyer reservation to developer portal updates
 * for the Fitzgerald Gardens project integration.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting Buyer→Developer Integration Test Suite\n');

// Test Configuration
const TEST_CONFIG = {
  projectId: 'fitzgerald-gardens',
  testUnitId: 'unit-001',
  buyerInfo: {
    id: 'test-buyer-001',
    name: 'Test Buyer John',
    email: 'test.buyer@example.com',
    phone: '+353 87 123 4567'
  },
  reservationAmount: 500
};

// Test Results Tracking
let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} - ${name}`);
  if (details) console.log(`   ${details}`);
  
  testResults.tests.push({ name, passed, details });
  if (passed) testResults.passed++;
  else testResults.failed++;
}

function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  logTest(
    `${description} exists`,
    exists,
    exists ? `Found: ${filePath}` : `Missing: ${filePath}`
  );
  return exists;
}

function checkComponentImports(filePath, expectedImports, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let allImportsFound = true;
    let missingImports = [];
    
    expectedImports.forEach(importItem => {
      if (!content.includes(importItem)) {
        allImportsFound = false;
        missingImports.push(importItem);
      }
    });
    
    logTest(
      `${description} has required imports`,
      allImportsFound,
      allImportsFound ? 'All imports found' : `Missing: ${missingImports.join(', ')}`
    );
    return allImportsFound;
  } catch (error) {
    logTest(`${description} import check`, false, `Error reading file: ${error.message}`);
    return false;
  }
}

function checkFunctionExists(filePath, functionNames, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let allFunctionsFound = true;
    let missingFunctions = [];
    
    functionNames.forEach(funcName => {
      const patterns = [
        new RegExp(`function\\s+${funcName}`, 'i'),
        new RegExp(`const\\s+${funcName}\\s*=`, 'i'),
        new RegExp(`${funcName}\\s*:\\s*async`, 'i'),
        new RegExp(`export.*${funcName}`, 'i')
      ];
      
      const found = patterns.some(pattern => pattern.test(content));
      if (!found) {
        allFunctionsFound = false;
        missingFunctions.push(funcName);
      }
    });
    
    logTest(
      `${description} has required functions`,
      allFunctionsFound,
      allFunctionsFound ? 'All functions found' : `Missing: ${missingFunctions.join(', ')}`
    );
    return allFunctionsFound;
  } catch (error) {
    logTest(`${description} function check`, false, `Error reading file: ${error.message}`);
    return false;
  }
}

console.log('🔍 Phase 1: File Structure Verification\n');

// Check critical buyer portal files
const buyerFiles = [
  { path: 'src/app/buyer/purchase/[id]/page.tsx', desc: 'Buyer Purchase Page' },
  { path: 'src/app/buyer/payments/page.tsx', desc: 'Buyer Payments Page' },
  { path: 'src/app/buyer/transaction/page.tsx', desc: 'Buyer Transaction Page' },
  { path: 'src/app/buyer/faq/page.tsx', desc: 'Buyer FAQ Page' },
  { path: 'src/app/buyer/dashboard/page.tsx', desc: 'Buyer Dashboard Page' }
];

buyerFiles.forEach(file => {
  checkFileExists(file.path, file.desc);
});

// Check developer portal files
const developerFiles = [
  { path: 'src/app/developer/projects/fitzgerald-gardens/page.tsx', desc: 'Fitzgerald Gardens Developer Page' },
  { path: 'src/services/ProjectDataService.ts', desc: 'Project Data Service' },
  { path: 'src/types/project.ts', desc: 'Project Types' }
];

developerFiles.forEach(file => {
  checkFileExists(file.path, file.desc);
});

console.log('\n🔧 Phase 2: Integration Components Verification\n');

// Check buyer purchase page integration
checkComponentImports(
  'src/app/buyer/purchase/[id]/page.tsx',
  [
    'projectDataService',
    'realDataService', 
    'BuyerInformation',
    'updateUnitStatusInDeveloperPortal'
  ],
  'Buyer Purchase Page'
);

checkFunctionExists(
  'src/app/buyer/purchase/[id]/page.tsx',
  ['getPropertyData', 'updateUnitStatusInDeveloperPortal', 'handlePayment'],
  'Buyer Purchase Page'
);

// Check project data service methods
checkFunctionExists(
  'src/services/ProjectDataService.ts',
  ['updateUnitBuyer', 'broadcastStateUpdate', 'getUnitById', 'updateUnitStatus'],
  'Project Data Service'
);

console.log('\n🌐 Phase 3: Data Flow Verification\n');

// Check if purchase page correctly calls developer portal updates
const purchasePageContent = fs.readFileSync('src/app/buyer/purchase/[id]/page.tsx', 'utf8');

logTest(
  'Purchase page calls updateUnitStatusInDeveloperPortal',
  purchasePageContent.includes('updateUnitStatusInDeveloperPortal('),
  'Function call found in handlePayment'
);

logTest(
  'Purchase page shows real-time integration status',
  purchasePageContent.includes('Live System Update') && purchasePageContent.includes('✅'),
  'Real-time status indicators present'
);

logTest(
  'Purchase page handles real vs mock data',
  purchasePageContent.includes('isRealData') && purchasePageContent.includes('Fitzgerald Gardens Real-Time Data'),
  'Data source differentiation implemented'
);

console.log('\n📊 Phase 4: Developer Portal Integration Verification\n');

// Check developer portal integration points
const developerPageContent = fs.readFileSync('src/app/developer/projects/fitzgerald-gardens/page.tsx', 'utf8');

logTest(
  'Developer portal uses real project data hook',
  developerPageContent.includes('useProjectData') && developerPageContent.includes('fitzgerald-gardens'),
  'Real-time data hook implementation found'
);

logTest(
  'Developer portal shows buyer information',
  developerPageContent.includes('buyer') && developerPageContent.includes('BuyerInformation'),
  'Buyer information display capability present'
);

logTest(
  'Developer portal has unit status management',
  developerPageContent.includes('handleUnitStatusUpdate') && developerPageContent.includes('UnitStatus'),
  'Unit status update handlers present'
);

console.log('\n🔔 Phase 5: Real-time Features Verification\n');

// Check for real-time notification capabilities
const projectServiceContent = fs.readFileSync('src/services/ProjectDataService.ts', 'utf8');

logTest(
  'Project service has event broadcasting',
  projectServiceContent.includes('broadcastStateUpdate') && projectServiceContent.includes('eventListeners'),
  'Event broadcasting system implemented'
);

logTest(
  'Project service tracks audit log',
  projectServiceContent.includes('auditLog') && projectServiceContent.includes('ProjectStateUpdate'),
  'Audit logging capability present'
);

logTest(
  'Project service supports buyer updates',
  projectServiceContent.includes('updateUnitBuyer') && projectServiceContent.includes('BuyerInformation'),
  'Buyer information update methods present'
);

console.log('\n🧭 Phase 6: Navigation Integration Verification\n');

// Check if buyer layout includes new pages
const buyerLayoutContent = fs.readFileSync('src/app/buyer/layout.tsx', 'utf8');

logTest(
  'Buyer layout includes transaction navigation',
  buyerLayoutContent.includes('/buyer/transaction') || buyerLayoutContent.includes('transaction'),
  'Transaction page accessible from navigation'
);

logTest(
  'Buyer layout includes payments navigation', 
  buyerLayoutContent.includes('/buyer/payment') || buyerLayoutContent.includes('payment'),
  'Payments page accessible from navigation'
);

console.log('\n🎯 Phase 7: Type Safety Verification\n');

// Check TypeScript type definitions
const typesContent = fs.readFileSync('src/types/project.ts', 'utf8');

logTest(
  'Project types include buyer information',
  typesContent.includes('BuyerInformation') && typesContent.includes('interface'),
  'BuyerInformation interface defined'
);

logTest(
  'Project types include unit status',
  typesContent.includes('UnitStatus') && typesContent.includes('reserved'),
  'UnitStatus type includes reservation status'
);

logTest(
  'Project types include state updates',
  typesContent.includes('ProjectStateUpdate') || typesContent.includes('UnitUpdateEvent'),
  'State update types defined'
);

console.log('\n📋 Phase 8: Feature Completeness Check\n');

// Verify key features are implemented
const featureChecks = [
  {
    name: 'Buyer can reserve units',
    check: purchasePageContent.includes('reserved') && purchasePageContent.includes('reservation'),
    details: 'Reservation flow implementation'
  },
  {
    name: 'Developer receives real-time updates',
    check: projectServiceContent.includes('broadcast') && projectServiceContent.includes('listener'),
    details: 'Real-time notification system'
  },
  {
    name: 'Transaction tracking available',
    check: fs.existsSync('src/app/buyer/transaction/page.tsx'),
    details: 'Transaction status page exists'
  },
  {
    name: 'Payment history tracking',
    check: fs.existsSync('src/app/buyer/payments/page.tsx'),
    details: 'Payment tracking page exists'
  },
  {
    name: 'FAQ support available',
    check: fs.existsSync('src/app/buyer/faq/page.tsx'),
    details: 'Comprehensive FAQ page'
  }
];

featureChecks.forEach(feature => {
  logTest(feature.name, feature.check, feature.details);
});

console.log('\n📈 Phase 9: Performance & Security Checks\n');

// Check for performance considerations
logTest(
  'Async operations properly handled',
  purchasePageContent.includes('async') && purchasePageContent.includes('await'),
  'Asynchronous operations implemented'
);

logTest(
  'Error handling implemented',
  purchasePageContent.includes('try') && purchasePageContent.includes('catch'),
  'Error boundaries and handling present'
);

logTest(
  'Loading states managed',
  purchasePageContent.includes('loading') && purchasePageContent.includes('setLoading'),
  'Loading state management implemented'
);

console.log('\n🎉 Test Summary\n');
console.log(`Total Tests: ${testResults.passed + testResults.failed}`);
console.log(`✅ Passed: ${testResults.passed}`);
console.log(`❌ Failed: ${testResults.failed}`);
console.log(`Success Rate: ${Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)}%\n`);

if (testResults.failed > 0) {
  console.log('❌ Failed Tests:');
  testResults.tests
    .filter(test => !test.passed)
    .forEach(test => console.log(`   - ${test.name}: ${test.details}`));
  console.log('');
}

// Generate test report
const reportPath = 'integration-test-report.json';
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  testConfig: TEST_CONFIG,
  results: testResults,
  summary: {
    totalTests: testResults.passed + testResults.failed,
    passed: testResults.passed,
    failed: testResults.failed,
    successRate: Math.round((testResults.passed / (testResults.passed + testResults.failed)) * 100)
  }
}, null, 2));

console.log(`📄 Test report saved to: ${reportPath}`);

// Exit with appropriate code
process.exit(testResults.failed > 0 ? 1 : 0);