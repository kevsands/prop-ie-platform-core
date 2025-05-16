const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('Starting duplicate JavaScript file cleanup...');

// Find all TypeScript files
const tsFiles = glob.sync('src/**/*.ts?(x)');
console.log(`Found ${tsFiles.length} TypeScript files`);

let removedCount = 0;
let errorCount = 0;

// Remove JavaScript duplicates
tsFiles.forEach(tsFile => {
  const jsFile = tsFile.replace(/\.tsx?$/, '.js');
  const jsxFile = tsFile.replace(/\.tsx?$/, '.jsx');
  
  // Check if there's a JavaScript equivalent
  if (fs.existsSync(jsFile)) {
    try {
      fs.unlinkSync(jsFile);
      console.log(`Removed: ${jsFile}`);
      removedCount++;
    } catch (error) {
      console.error(`Error removing ${jsFile}:`, error.message);
      errorCount++;
    }
  }
  
  // Check if there's a JSX equivalent (for .tsx files)
  if (tsFile.endsWith('.tsx') && fs.existsSync(jsxFile)) {
    try {
      fs.unlinkSync(jsxFile);
      console.log(`Removed: ${jsxFile}`);
      removedCount++;
    } catch (error) {
      console.error(`Error removing ${jsxFile}:`, error.message);
      errorCount++;
    }
  }
});

console.log('\nCleanup Summary:');
console.log(`- TypeScript files found: ${tsFiles.length}`);
console.log(`- JavaScript duplicates removed: ${removedCount}`);
console.log(`- Errors encountered: ${errorCount}`);
console.log('\nCleanup complete!');