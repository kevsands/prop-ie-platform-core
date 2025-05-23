#!/usr/bin/env node
// Fix final build issues

const fs = require('fs');
const path = require('path');

console.log('Fixing final build issues...\n');

// 1. Fix icons.tsx
const iconsPath = path.join('src', 'components', 'ui', 'icons.tsx');
let iconsContent = fs.readFileSync(iconsPath, 'utf8');

// Remove duplicate imports
const imports = iconsContent.match(/import \{([^}]+)\} from/)[1];
const importArray = imports.split(',').map(i => i.trim());
const uniqueImports = [...new Set(importArray)];
const cleanedImports = uniqueImports.join(', ');

iconsContent = iconsContent.replace(/import \{[^}]+\} from/, `import { ${cleanedImports} } from`);
fs.writeFileSync(iconsPath, iconsContent);
console.log('✅ Fixed duplicate imports in icons.tsx');

// 2. Fix next.config.js - remove swcMinify
const nextConfigPath = 'next.config.js';
let nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
nextConfig = nextConfig.replace(/swcMinify: true,?\n?/g, '');
fs.writeFileSync(nextConfigPath, nextConfig);
console.log('✅ Removed swcMinify from next.config.js');

// 3. Fix virtual-list.tsx - add missing import
const virtualListPath = path.join('src', 'components', 'ui', 'virtual-list.tsx');
if (fs.existsSync(virtualListPath)) {
  let virtualListContent = fs.readFileSync(virtualListPath, 'utf8');
  if (!virtualListContent.includes("import { useRef } from 'react'")) {
    virtualListContent = "import { useRef } from 'react';\n" + virtualListContent;
    fs.writeFileSync(virtualListPath, virtualListContent);
    console.log('✅ Fixed imports in virtual-list.tsx');
  }
}

console.log('\nFinal build fixes complete!');
console.log('Run "npm run build" to test the build.');