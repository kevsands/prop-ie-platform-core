#!/usr/bin/env node

/**
 * Mock Data Elimination Script
 * 
 * Identifies and reports mock service usage across the codebase
 * to complete the transition to production-ready database integration
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Mock service patterns to identify
const mockPatterns = [
  /MockDataService/g,
  /mockDataService/g,
  /htbServiceMock/g,
  /users-mock/g,
  /mock.*Service/g,
  /NEXT_PUBLIC_USE_MOCK_DATA.*=.*'true'/g,
  /useMockData\s*=\s*true/g,
  /localStorage\.getItem/g, // Often indicates mock data persistence
  /\.setItem\(/g, // Mock data storage
];

const mockServiceReplacements = {
  'MockDataService': 'ApiDataService (production database integration)',
  'mockDataService': 'realPropertyDataService or projectDataService',
  'htbServiceMock': 'htbService (production Prisma integration)',
  'users-mock': 'users-production',
  'localStorage.getItem': 'Database queries via services',
  'localStorage.setItem': 'Database updates via services'
};

let findings = [];

function scanDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip certain directories
      if (!['node_modules', '.next', '.git', 'tests', '__tests__'].includes(item)) {
        scanDirectory(fullPath);
      }
    } else if (item.match(/\.(ts|tsx|js|jsx)$/) && !item.includes('.test.') && !item.includes('.spec.')) {
      scanFile(fullPath);
    }
  }
}

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(srcDir, filePath);
    
    for (const pattern of mockPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        findings.push({
          file: relativePath,
          pattern: pattern.source,
          matches: matches.length,
          lines: findLineNumbers(content, pattern)
        });
      }
    }
  } catch (error) {
    console.error(`Error scanning ${filePath}:`, error.message);
  }
}

function findLineNumbers(content, pattern) {
  const lines = content.split('\n');
  const lineNumbers = [];
  
  lines.forEach((line, index) => {
    if (pattern.test(line)) {
      lineNumbers.push(index + 1);
    }
  });
  
  return lineNumbers;
}

function generateReport() {
  console.log('\n🔍 MOCK DATA ELIMINATION REPORT');
  console.log('=====================================\n');
  
  if (findings.length === 0) {
    console.log('✅ No mock service usage found! All services are using production database integration.\n');
    return;
  }
  
  console.log(`📊 Found ${findings.length} files with potential mock service usage:\n`);
  
  const groupedFindings = {};
  findings.forEach(finding => {
    if (!groupedFindings[finding.file]) {
      groupedFindings[finding.file] = [];
    }
    groupedFindings[finding.file].push(finding);
  });
  
  Object.keys(groupedFindings).forEach(file => {
    console.log(`📄 ${file}`);
    groupedFindings[file].forEach(finding => {
      console.log(`   🔸 ${finding.pattern} (${finding.matches} matches) - Lines: ${finding.lines.join(', ')}`);
      
      // Suggest replacement
      for (const [mockService, replacement] of Object.entries(mockServiceReplacements)) {
        if (finding.pattern.includes(mockService)) {
          console.log(`   💡 Replace with: ${replacement}`);
          break;
        }
      }
    });
    console.log('');
  });
  
  console.log('\n🎯 RECOMMENDED ACTIONS:');
  console.log('=======================');
  console.log('1. Replace MockDataService with ApiDataService');
  console.log('2. Ensure NEXT_PUBLIC_USE_MOCK_DATA is not set to "true" in production');
  console.log('3. Replace localStorage usage with database operations');
  console.log('4. Use htbService instead of htbServiceMock');
  console.log('5. Replace users-mock with users-production service');
  console.log('\n🏭 All services should now use production database integration!');
}

// Run the scan
scanDirectory(srcDir);
generateReport();