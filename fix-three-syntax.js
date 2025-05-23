#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all files with Three.js issues
const files = [
  'src/components/3d/RoomVisualizer.old.tsx',
  'src/lib/three-setup.ts',
  'src/lib/three-types.ts',
  'src/utils/modelLoaderUtils.tsx'
];

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Fix double THREE. prefix issues
    content = content.replace(/THREE\.THREE\./g, 'THREE.');
    
    // Fix syntax issues with type declarations
    // Fix patterns like: position: THREE.Vector3, should be position: THREE.Vector3;
    content = content.replace(/:\s*THREE\.(\w+),$/gm, ': THREE.$1;');
    
    // Fix object type declarations
    content = content.replace(/:\s*THREE\.(\w+)\s*{/g, ': THREE.$1 {');
    
    // Fix type imports
    if (file.includes('three-types')) {
      // For type declaration files, we need to import types differently
      content = content.replace(
        'import * as THREE from \'three\'',
        'import type * as THREE from \'three\''
      );
    }
    
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed Three.js syntax in: ${file}`);
  }
});