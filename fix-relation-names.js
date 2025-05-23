#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Map of incorrect relation names to correct ones
const relationMappings = {
  'unitTypes': 'UnitType',
  'amenities': 'Amenity',
  'media': 'DevelopmentMedia',
  'documents': 'DevelopmentDocument',
  'viewings': 'Viewing'
};

// Find all TypeScript/JavaScript files
const files = glob.sync('{src,pages,app}/**/*.{ts,tsx,js,jsx}', {
  ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
});

console.log(`Found ${files.length} files to check...`);

let filesFixed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  // Check if file contains prisma operations
  if (content.includes('prisma.development') || content.includes('development.')) {
    // Replace incorrect relation names
    Object.entries(relationMappings).forEach(([wrong, correct]) => {
      const patterns = [
        new RegExp(`\\.${wrong}(?![a-zA-Z])`, 'g'),  // .unitTypes
        new RegExp(`${wrong}:`, 'g'),                // unitTypes:
        new RegExp(`include: {[^}]*${wrong}:`, 'g')  // inside include blocks
      ];
      
      patterns.forEach(pattern => {
        if (pattern.test(content)) {
          if (wrong === 'unitTypes') {
            content = content.replace(/\.unitTypes/g, '.UnitType');
            content = content.replace(/unitTypes:/g, 'UnitType:');
          } else if (wrong === 'amenities') {
            content = content.replace(/\.amenities/g, '.Amenity');
            content = content.replace(/amenities:/g, 'Amenity:');
          } else if (wrong === 'media') {
            // Be careful not to replace all 'media' - only in development context
            content = content.replace(/development\.media/g, 'development.DevelopmentMedia');
            content = content.replace(/include: {([^}]*)media:/g, 'include: {$1DevelopmentMedia:');
          } else if (wrong === 'documents') {
            content = content.replace(/development\.documents/g, 'development.DevelopmentDocument');
            content = content.replace(/include: {([^}]*)documents:/g, 'include: {$1DevelopmentDocument:');
          } else if (wrong === 'viewings') {
            content = content.replace(/\.viewings/g, '.Viewing');
            content = content.replace(/viewings:/g, 'Viewing:');
          }
          modified = true;
        }
      });
    });
  }
  
  if (modified) {
    fs.writeFileSync(file, content);
    filesFixed++;
    console.log(`Fixed relations in: ${file}`);
  }
});

console.log(`\nFixed ${filesFixed} files`);