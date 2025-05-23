/**
 * Backup Files Manager
 * 
 * This script automatically processes files in the backup-files directory to prevent TypeScript errors.
 * It renames any .tsx, .jsx, .ts, .js files to have a .txt extension to indicate they are for reference only.
 */
const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'backup-files');
const FILE_EXTENSIONS = ['.tsx', '.jsx', '.ts', '.js', '.bak'];

// Ensure the backup-files directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  console.log(`The directory ${BACKUP_DIR} does not exist. Exiting.`);
  process.exit(0);
}

// Get all files in the backup-files directory
const files = fs.readdirSync(BACKUP_DIR);

let processedCount = 0;

files.forEach(file => {
  // Skip files that already have a .txt extension and the README.md file
  if (file.endsWith('.txt') || file === 'README.md') {
    return;
  }
  
  const filePath = path.join(BACKUP_DIR, file);
  
  // Skip directories
  if (fs.statSync(filePath).isDirectory()) {
    return;
  }
  
  // Check if file has one of the target extensions
  const needsProcessing = FILE_EXTENSIONS.some(ext => file.endsWith(ext));
  
  if (needsProcessing) {
    const newFilePath = `${filePath}.txt`;
    fs.renameSync(filePath, newFilePath);
    console.log(`Renamed: ${file} -> ${file}.txt`);
    processedCount++;
  }
});

console.log(`\nBackup Files Manager completed: ${processedCount} files processed.`);
console.log('Backup files have been renamed with .txt extension to prevent TypeScript errors.');