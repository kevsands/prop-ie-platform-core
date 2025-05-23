const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all route.ts files
const routeFiles = glob.sync('src/app/**/route.{ts,js}');

// Filter for dynamic routes (those with [param] in path)
const dynamicRoutes = routeFiles.filter(file => file.includes('['));

console.log('Dynamic Routes Found:');
console.log('====================');

dynamicRoutes.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Check if it has the old params structure
  const hasOldStructure = /{ params }: { params:/.test(content);
  
  // Check if it has the new Promise structure
  const hasNewStructure = /{ params }: { params: Promise</.test(content) || 
                         /context: { params: Promise</.test(content);
  
  // Check if params are awaited
  const hasAwait = /await .*params/.test(content);
  
  console.log(`\n${file}:`);
  console.log(`  Old structure: ${hasOldStructure}`);
  console.log(`  New structure: ${hasNewStructure}`);
  console.log(`  Params awaited: ${hasAwait}`);
  
  if (hasOldStructure && !hasNewStructure) {
    console.log(`  ⚠️  NEEDS UPDATE`);
  } else if (hasNewStructure && !hasAwait) {
    console.log(`  ⚠️  NEEDS await params`);
  } else if (hasNewStructure && hasAwait) {
    console.log(`  ✅ Correctly configured`);
  }
});