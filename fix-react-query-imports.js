const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Pattern to detect React Query imports
const IMPORT_PATTERNS = {
  // Standard imports
  QUERY_IMPORT: /from\s+['"]@tanstack\/react-query['"]/g,
  
  // Modular imports that need spacing fixes
  CORE_IMPORT_SPACING: /}from\s+['"]@tanstack\/react-query\/core['"]/g,
  REACT_IMPORT_SPACING: /}from\s+['"]@tanstack\/react-query\/react['"]/g,
};

// Check if we should standardize to use non-modular imports
const USE_STANDARD_IMPORTS = true;

/**
 * Fix imports in a file
 */
async function fixImportsInFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    let updatedContent = content;
    let hasChanges = false;

    // First, fix spacing issues in modular imports
    if (IMPORT_PATTERNS.CORE_IMPORT_SPACING.test(content)) {
      updatedContent = updatedContent.replace(
        IMPORT_PATTERNS.CORE_IMPORT_SPACING, 
        '} from \'@tanstack/react-query/core\''
      );
      hasChanges = true;
    }

    if (IMPORT_PATTERNS.REACT_IMPORT_SPACING.test(content)) {
      updatedContent = updatedContent.replace(
        IMPORT_PATTERNS.REACT_IMPORT_SPACING, 
        '} from \'@tanstack/react-query/react\''
      );
      hasChanges = true;
    }

    // If standardizing to non-modular imports, replace modular imports
    if (USE_STANDARD_IMPORTS) {
      // Replace core imports
      if (updatedContent.includes('from \'@tanstack/react-query/core\'')) {
        updatedContent = updatedContent.replace(
          /from\s+['"]@tanstack\/react-query\/core['"]/g,
          'from \'@tanstack/react-query\''
        );
        hasChanges = true;
      }

      // Replace react imports
      if (updatedContent.includes('from \'@tanstack/react-query/react\'')) {
        updatedContent = updatedContent.replace(
          /from\s+['"]@tanstack\/react-query\/react['"]/g,
          'from \'@tanstack/react-query\''
        );
        hasChanges = true;
      }
    }

    // Write the file only if changes were made
    if (hasChanges) {
      await writeFile(filePath, updatedContent, 'utf-8');
      console.log(`✅ Fixed imports in ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Recursively scan directories for TypeScript files
 */
async function scanDirectory(directory) {
  const files = await readdir(directory);
  let fixedFiles = 0;

  for (const file of files) {
    const filePath = path.join(directory, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      // Skip node_modules and .git
      if (file === 'node_modules' || file === '.git' || file === '.next') {
        continue;
      }
      fixedFiles += await scanDirectory(filePath);
    } else if (
      (file.endsWith('.ts') || file.endsWith('.tsx')) && 
      !file.endsWith('.d.ts')
    ) {
      const wasFixed = await fixImportsInFile(filePath);
      if (wasFixed) {
        fixedFiles++;
      }
    }
  }

  return fixedFiles;
}

/**
 * Main execution function
 */
async function main() {
  const rootDir = process.cwd();
  
  console.log('🔍 Scanning for React Query imports...');
  const fixedFiles = await scanDirectory(rootDir);
  
  console.log(`\n✅ Fixed React Query imports in ${fixedFiles} files`);
  
  if (USE_STANDARD_IMPORTS) {
    console.log('📝 All imports were standardized to use @tanstack/react-query (non-modular)');
  } else {
    console.log('📝 Fixed spacing issues in modular imports');
  }
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});