const fs = require('fs');
const path = require('path');
const ts = require('typescript');

// PropertyStatus enum values for reference
const PROPERTY_STATUS_VALUES = [
  'Available',
  'Reserved',
  'Sold',
  'UnderConstruction',
  'ComingSoon',
  'OffMarket'
];

// Find all TypeScript files in the given directory recursively
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules')) {
      // Recursively search directories, excluding node_modules
      findTsFiles(filePath, fileList);
    } else if (/\.(ts|tsx)$/.test(file)) {
      // Only include TypeScript files
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Get normalized status string based on a string literal
function getNormalizedStatus(stringLiteral) {
  const value = stringLiteral.toLowerCase();
  
  // Map common variations to the enum values
  const statusMap = {
    'available': 'Available',
    'reserved': 'Reserved',
    'sold': 'Sold',
    'under construction': 'UnderConstruction',
    'underconstruction': 'UnderConstruction',
    'coming soon': 'ComingSoon',
    'comingsoon': 'ComingSoon',
    'off market': 'OffMarket',
    'offmarket': 'OffMarket'
  };
  
  return statusMap[value] || null;
}

// Process a file to replace string literals in status comparisons
function processFile(filePath) {
  console.log(`Processing: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Create a TypeScript source file from the content
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );
  
  let modifiedContent = content;
  let replacements = [];
  
  // Find string literal comparisons by traversing the AST
  function visit(node) {
    // Look for binary expressions (like ===, ==, !==, !=)
    if (ts.isBinaryExpression(node) && 
        (node.operatorToken.kind === ts.SyntaxKind.EqualsEqualsToken || 
         node.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken ||
         node.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsToken ||
         node.operatorToken.kind === ts.SyntaxKind.ExclamationEqualsEqualsToken)) {
      
      // Check if one side is a string literal and might be a status comparison
      if (ts.isStringLiteral(node.left) || ts.isStringLiteral(node.right)) {
        const stringLiteral = ts.isStringLiteral(node.left) ? node.left : node.right;
        const otherSide = ts.isStringLiteral(node.left) ? node.right : node.left;
        
        // Get the string value
        const stringValue = stringLiteral.text;
        
        // Check if this string might be a property status
        const normalizedStatus = getNormalizedStatus(stringValue);
        
        if (normalizedStatus && PROPERTY_STATUS_VALUES.includes(normalizedStatus)) {
          // Look for variable names that might indicate status comparisons
          const otherSideText = content.substring(otherSide.getStart(sourceFile), otherSide.getEnd());
          if (otherSideText.toLowerCase().includes('status')) {
            // This is likely a status comparison
            const start = stringLiteral.getStart(sourceFile);
            const end = stringLiteral.getEnd();
            const original = content.substring(start, end);
            
            // Replace with PropertyStatus enum
            const replacement = `PropertyStatus.${normalizedStatus}`;
            
            replacements.push({
              start,
              end,
              original,
              replacement
            });
          }
        }
      }
    }
    
    // Visit all children of this node
    ts.forEachChild(node, visit);
  }
  
  // Start visiting from the root node
  visit(sourceFile);
  
  // Apply the replacements in reverse order to avoid position shifting
  if (replacements.length > 0) {
    replacements.sort((a, b) => b.start - a.start);
    
    for (const { start, end, original, replacement } of replacements) {
      modifiedContent = modifiedContent.substring(0, start) + replacement + modifiedContent.substring(end);
      console.log(`  Replaced: ${original} → ${replacement}`);
    }
    
    // Check if imports need to be added
    if (replacements.length > 0 && !modifiedContent.includes('import { PropertyStatus }')) {
      // Add import at the top of the file
      const importStatement = 'import { PropertyStatus } from "../types/enums";\n';
      
      // Find a good place to insert the import (after other imports)
      const importEnd = findImportEnd(sourceFile, content);
      if (importEnd !== -1) {
        modifiedContent = modifiedContent.substring(0, importEnd) + importStatement + modifiedContent.substring(importEnd);
        console.log('  Added PropertyStatus import');
      }
    }
    
    // Write the modified content back to the file
    fs.writeFileSync(filePath, modifiedContent);
    console.log(`  Updated file with ${replacements.length} replacement(s)`);
    
    return true;
  }
  
  return false;
}

// Find the end of the import section to add our import
function findImportEnd(sourceFile, content) {
  let lastImportEnd = 0;
  
  function visit(node) {
    if (ts.isImportDeclaration(node)) {
      const end = node.getEnd();
      if (end > lastImportEnd) {
        lastImportEnd = end;
      }
    }
    
    ts.forEachChild(node, visit);
  }
  
  visit(sourceFile);
  
  if (lastImportEnd > 0) {
    // Find the next line after the last import
    const nextLine = content.indexOf('\n', lastImportEnd);
    return nextLine !== -1 ? nextLine + 1 : lastImportEnd;
  }
  
  return 0;
}

// Main function to run the script
function main() {
  try {
    const srcDir = path.join(process.cwd(), 'src');
    console.log(`Searching for TypeScript files in: ${srcDir}`);
    
    const files = findTsFiles(srcDir);
    console.log(`Found ${files.length} TypeScript files`);
    
    let totalUpdated = 0;
    
    for (const file of files) {
      const updated = processFile(file);
      if (updated) {
        totalUpdated++;
      }
    }
    
    console.log(`\nScript completed. Updated ${totalUpdated} file(s).`);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();