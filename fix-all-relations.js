#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all API route files
const files = glob.sync('src/app/api/**/*.{ts,tsx,js,jsx}');

console.log(`Found ${files.length} API files to check...`);

let filesFixed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  // Fix common patterns
  const fixes = [
    // Unit relations
    { pattern: /sales: {\s*orderBy: { createdAt: 'desc' }/g, replacement: "sales: {\n          orderBy: { createdAt: 'desc' }" },
    { pattern: /viewings: {\s*orderBy: { createdAt: 'desc' }/g, replacement: "viewings: {\n          orderBy: { date: 'desc' }" },
    
    // Check if body needs typing
    { pattern: /const body = await request\.json\(\);/g, replacement: 'const body: any = await request.json();' },
    
    // Fix Prisma include patterns
    { pattern: /unitTypes:/g, replacement: 'UnitType:' },
    { pattern: /amenities:/g, replacement: 'Amenity:' },
    { pattern: /media:/g, replacement: 'DevelopmentMedia:' },
    { pattern: /documents:/g, replacement: 'DevelopmentDocument:' },
    { pattern: /Viewing:/g, replacement: 'viewings:' }
  ];
  
  fixes.forEach(fix => {
    if (fix.pattern.test(content)) {
      content = content.replace(fix.pattern, fix.replacement);
      modified = true;
    }
  });
  
  // Fix Unit relations specifically
  if (content.includes('prisma.unit')) {
    content = content.replace(/Viewing:/g, 'viewings:');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(file, content);
    filesFixed++;
    console.log(`Fixed: ${file}`);
  }
});

console.log(`\nFixed ${filesFixed} files`);