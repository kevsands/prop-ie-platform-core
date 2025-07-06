#!/usr/bin/env node

/**
 * TypeScript error checking script for CI/CD pipeline
 * 
 * This script runs the TypeScript compiler in noEmit mode
 * and provides formatted output for CI/CD environments.
 * 
 * It has two modes:
 * 1. Strict mode: Fails on any TypeScript errors (for main branches)
 * 2. Warning mode: Reports errors but doesn't fail the build (for feature branches)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const STRICT_MODE = process.env.TS_STRICT_MODE === 'true';
const ERROR_OUTPUT_FILE = process.env.TS_ERROR_FILE || 'typescript-errors.log';
const BRANCH = process.env.BRANCH || execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const IS_MAIN_BRANCH = BRANCH === 'main' || BRANCH === 'master';

// ANSI color codes for console output
const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

console.log(`${COLORS.cyan}TypeScript Error Checker${COLORS.reset}`);
console.log(`${COLORS.blue}Branch: ${BRANCH}${COLORS.reset}`);
console.log(`${COLORS.blue}Mode: ${STRICT_MODE || IS_MAIN_BRANCH ? 'Strict' : 'Warning'}${COLORS.reset}`);
console.log('------------------------------');

try {
  // Run TypeScript compiler
  console.log(`${COLORS.cyan}Running TypeScript check...${COLORS.reset}`);

  try {
    execSync('npx tsc --noEmit', { stdio: 'ignore' });
    console.log(`${COLORS.green}TypeScript check passed!${COLORS.reset}`);
    process.exit(0);
  } catch (error) {
    // TypeScript check failed, capture error output
    const tsErrors = execSync('npx tsc --noEmit').toString();
    
    // Count errors
    const errorCount = (tsErrors.match(/error TS\d+/g) || []).length;
    
    console.log(`${COLORS.red}TypeScript check failed with ${errorCount} errors.${COLORS.reset}`);
    
    // Write errors to file for artifact collection
    fs.writeFileSync(ERROR_OUTPUT_FILE, tsErrors);
    console.log(`${COLORS.yellow}Full error log written to ${ERROR_OUTPUT_FILE}${COLORS.reset}`);
    
    // Format a summary of errors
    const errorSummary = formatErrorSummary(tsErrors);
    console.log(`${COLORS.red}Error Summary:${COLORS.reset}`);
    console.log(errorSummary);
    
    // Determine exit code based on mode
    if (STRICT_MODE || IS_MAIN_BRANCH) {
      console.log(`${COLORS.red}Build failed due to TypeScript errors in strict mode.${COLORS.reset}`);
      process.exit(1);
    } else {
      console.log(`${COLORS.yellow}TypeScript errors found, but continuing build in warning mode.${COLORS.reset}`);
      process.exit(0);
    }
  }
} catch (error) {
  console.error(`${COLORS.red}Script error: ${error.message}${COLORS.reset}`);
  process.exit(1);
}

/**
 * Format error summary for console output
 */
function formatErrorSummary(errorOutput) {
  const lines = errorOutput.split('\n');
  const errors = [];
  let currentError = null;
  
  for (const line of lines) {
    if (line.match(/\.tsx?\(\d+,\d+\):/)) {
      if (currentError) {
        errors.push(currentError);
      }
      currentError = line;
    } else if (currentError && line.trim() !== '') {
      currentError += '\n  ' + line.trim();
    }
  }
  
  if (currentError) {
    errors.push(currentError);
  }
  
  // Limit to 10 errors for summary
  const limitedErrors = errors.slice(0, 10);
  let summary = limitedErrors.join('\n\n');
  
  if (errors.length > 10) {
    summary += `\n\n...and ${errors.length - 10} more errors. See ${ERROR_OUTPUT_FILE} for complete list.`;
  }
  
  return summary;
}