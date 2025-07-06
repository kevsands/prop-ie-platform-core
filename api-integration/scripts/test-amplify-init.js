#!/usr/bin/env node

/**
 * Test script for Amplify initialization
 * 
 * This script tests the Amplify initialization flow, particularly the 
 * 'initializeAsync' function from '@/lib/amplify' to verify that it works correctly.
 */

const path = require('path');
const { fileURLToPath } = require('url');

// Set up Node.js env to support TypeScript path aliases
require('module-alias').addAlias('@', path.join(process.cwd(), 'src'));

// Import the initializeAsync function
async function runTest() {
  try {
    console.log('Testing Amplify initialization...');
    
    // Dynamic import to handle ESM modules
    const amplifyModule = await import('../src/lib/amplify.js');
    
    if (!amplifyModule.initializeAsync) {
      console.error('❌ FAILED: initializeAsync is not exported from @/lib/amplify');
      process.exit(1);
    }
    
    console.log('✓ Successfully imported initializeAsync');
    
    // Attempt to initialize Amplify
    console.log('Attempting to initialize Amplify...');
    const result = await amplifyModule.initializeAsync();
    
    if (result !== true) {
      console.error(`❌ FAILED: initializeAsync returned ${result} instead of true`);
      process.exit(1);
    }
    
    console.log('✓ Successfully initialized Amplify');
    console.log('✓ initializeAsync returned true as expected');
    
    // Test direct import from the Amplify index file
    console.log('Testing direct import from @/lib/amplify/index...');
    
    const amplifyIndexModule = await import('../src/lib/amplify/index.js');
    
    if (!amplifyIndexModule.initializeAsync) {
      console.error('❌ FAILED: initializeAsync is not exported from @/lib/amplify/index');
      process.exit(1);
    }
    
    console.log('✓ Successfully imported initializeAsync from @/lib/amplify/index');
    
    // All tests passed
    console.log('\n✅ ALL TESTS PASSED: Amplify initialization is working correctly');
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR during test:', error);
    process.exit(1);
  }
}

runTest();