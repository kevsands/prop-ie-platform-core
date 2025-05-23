#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all page files
const pageFiles = glob.sync('src/app/**/*.{tsx,jsx}');

console.log(`Found ${pageFiles.length} page files to check...`);

let filesFixed = 0;

pageFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  // Fix common patterns
  const patterns = [
    // Fix fetch().json() type issues
    {
      pattern: /const data = await response\.json\(\);/g,
      replacement: 'const data: any = await response.json();'
    },
    {
      pattern: /const result = await response\.json\(\);/g,
      replacement: 'const result: any = await response.json();'
    },
    // Fix API response typing
    {
      pattern: /const response = await fetch\((.*?)\);\s*\n\s*const data = await response\.json\(\);/g,
      replacement: 'const response = await fetch($1);\n      const data: any = await response.json();'
    },
    // Fix body typing
    {
      pattern: /const body = await req\.json\(\);/g,
      replacement: 'const body: any = await req.json();'
    },
    {
      pattern: /const body = await request\.json\(\);/g,
      replacement: 'const body: any = await request.json();'
    }
  ];
  
  patterns.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });
  
  // Fix specific data access patterns
  const dataAccessPatterns = [
    {
      pattern: /setTransactions\(data\.transactions/g,
      check: content => !content.includes('const data: any')
    },
    {
      pattern: /setDevelopments\(data\.developments/g,
      check: content => !content.includes('const data: any')
    },
    {
      pattern: /setProperties\(data\.properties/g,
      check: content => !content.includes('const data: any')
    },
    {
      pattern: /data\.\w+\s*\|\|/g,
      check: content => !content.includes('const data: any')
    }
  ];
  
  dataAccessPatterns.forEach(({ pattern, check }) => {
    if (pattern.test(content) && check(content)) {
      content = content.replace(
        /const data = await response\.json\(\);/g,
        'const data: any = await response.json();'
      );
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(file, content);
    filesFixed++;
    console.log(`Fixed: ${file}`);
  }
});

console.log(`\nFixed ${filesFixed} files`);