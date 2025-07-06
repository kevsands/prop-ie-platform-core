const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('Starting codebase organization...');

// Create directory structure if it doesn't exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    console.log(`Creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Main directory structure
const directories = [
  'src/hooks',
  'src/utils',
  'src/components/investor',
  'src/components/property',
  'src/components/admin',
  'src/components/common',
  'src/components/auth',
  'src/services',
  'src/types'
];

// Create the directory structure
directories.forEach(dir => {
  const fullPath = path.resolve(process.cwd(), dir);
  ensureDirectoryExists(fullPath);
});

// Move hook files to hooks directory
console.log('\nMoving hook files to src/hooks directory...');
const hookFiles = glob.sync('src/**/use*.ts?(x)');
hookFiles.forEach(hookFile => {
  // Skip if already in hooks directory
  if (hookFile.includes('/hooks/')) {
    return;
  }
  
  const fileName = path.basename(hookFile);
  const destPath = path.resolve(process.cwd(), 'src/hooks', fileName);
  
  try {
    // Create a copy instead of moving to avoid breaking imports
    console.log(`Copying ${hookFile} to ${destPath}`);
    fs.copyFileSync(hookFile, destPath);
    console.log(`Created: ${destPath}`);
  } catch (error) {
    console.error(`Error copying ${hookFile}:`, error.message);
  }
});

// Move utility functions to utils directory
console.log('\nMoving utility files to src/utils directory...');
const utilFiles = glob.sync('src/**/*util*.ts?(x)');
utilFiles.forEach(utilFile => {
  // Skip if already in utils directory
  if (utilFile.includes('/utils/')) {
    return;
  }
  
  const fileName = path.basename(utilFile);
  const destPath = path.resolve(process.cwd(), 'src/utils', fileName);
  
  try {
    // Create a copy instead of moving to avoid breaking imports
    console.log(`Copying ${utilFile} to ${destPath}`);
    fs.copyFileSync(utilFile, destPath);
    console.log(`Created: ${destPath}`);
  } catch (error) {
    console.error(`Error copying ${utilFile}:`, error.message);
  }
});

console.log('\nOrganization complete!');
console.log('\nNOTE: Files have been copied rather than moved to prevent breaking imports.');
console.log('Once you update your imports, you can safely delete the original files.');