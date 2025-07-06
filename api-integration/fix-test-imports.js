/**
 * Script to fix all test files to use the correct import path for jest-extended
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all test files
const testFiles = execSync('find ./src -name "*.test.ts" -o -name "*.test.tsx"', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);

console.log(`Found ${testFiles.length} test files`);

let fixedFiles = 0;

// Fix imports in each test file
for (const filePath of testFiles) {
  const absolutePath = path.resolve(filePath);
  try {
    let content = fs.readFileSync(absolutePath, 'utf8');
    
    // Replace jest-extend with jest-extended
    const originalContent = content;
    content = content.replace(
      /import ['"]@\/types\/jest-extend['"]/g, 
      'import \'@/types/jest-extended\''
    );
    
    // Write back if changed
    if (content !== originalContent) {
      fs.writeFileSync(absolutePath, content, 'utf8');
      console.log(`Fixed imports in ${filePath}`);
      fixedFiles++;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

console.log(`Fixed imports in ${fixedFiles} files`);