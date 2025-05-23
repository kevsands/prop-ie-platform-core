const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all page.tsx files in dynamic routes
const pageFiles = glob.sync('src/app/**/page.{tsx,jsx,ts,js}');
const dynamicPages = pageFiles.filter(file => file.includes('['));

console.log('Dynamic Pages Found:');
console.log('===================');

dynamicPages.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    // Check for Props interface/type with direct params
    if (/interface Props {\s*params:\s*{/.test(content)) {
      content = content.replace(
        /interface Props {\s*params:\s*{/g,
        'interface Props {\n  params: Promise<{'
      );
      changed = true;
    }
    
    if (/interface Props {\s*params:\s*Promise<{/.test(content)) {
      const hasAwaitParams = /await params/i.test(content);
      console.log(`\n${file}:`);
      console.log(`  Already has Promise params: ✅`);
      console.log(`  Params awaited: ${hasAwaitParams ? '✅' : '⚠️  NEEDS await'}`);
    } else if (changed) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`\n${file}:`);
      console.log(`  Updated to Promise params: ✅`);
      console.log(`  Remember to await params in the component!`);
    }
    
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});