#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all files that import from 'three'
const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', {
  ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
});

console.log(`Found ${files.length} files to check for Three.js imports...`);

let filesFixed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  // Fix named imports from three
  // Change from: import { BoxGeometry } from 'three';
  // To: import * as THREE from 'three'; and use THREE.BoxGeometry
  
  if (content.includes('from \'three\'') || content.includes('from "three"')) {
    // Replace specific imports with * import
    content = content.replace(
      /import\s*{\s*([^}]+)\s*}\s*from\s*['"]three['"]/g,
      'import * as THREE from \'three\''
    );
    
    // Now update the usage in the file
    const threeClasses = [
      'BoxGeometry', 'MeshBasicMaterial', 'Mesh', 'Group', 'Scene', 
      'Camera', 'Renderer', 'Light', 'Material', 'Geometry',
      'Vector3', 'Vector2', 'Color', 'Texture', 'Loader'
    ];
    
    threeClasses.forEach(className => {
      // Replace standalone usage (not already prefixed with THREE.)
      const regex = new RegExp(`(?<!THREE\\.)\\b${className}\\b`, 'g');
      content = content.replace(regex, `THREE.${className}`);
    });
    
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(file, content);
    filesFixed++;
    console.log(`Fixed Three.js imports in: ${file}`);
  }
});

console.log(`\nFixed Three.js imports in ${filesFixed} files`);

// Also fix the test file
const testFiles = ['test-three-imports.ts', 'temp.ts'];
testFiles.forEach(testFile => {
  const fullPath = path.join(process.cwd(), testFile);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Fix the imports
    content = content.replace(
      /import\s*{\s*([^}]+)\s*}\s*from\s*['"]three['"]/g,
      'import * as THREE from \'three\''
    );
    
    // Fix the usage
    const threeClasses = ['BoxGeometry', 'MeshBasicMaterial', 'Mesh', 'Group'];
    threeClasses.forEach(className => {
      const regex = new RegExp(`(?<!THREE\\.)\\b${className}\\b`, 'g');
      content = content.replace(regex, `THREE.${className}`);
    });
    
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed Three.js imports in: ${testFile}`);
  }
});