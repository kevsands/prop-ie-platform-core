#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all API route files
const routeFiles = glob.sync('src/app/api/**/route.{ts,tsx,js,jsx}');

console.log(`Found ${routeFiles.length} route files to check...`);

let filesFixed = 0;

routeFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  // Pattern 1: Update route handlers with params
  const routeHandlerRegex = /export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)\s*\(\s*request:\s*NextRequest\s*,\s*\{\s*params\s*\}\s*:\s*\{\s*params:\s*\{[^}]+\}\s*\}\s*\)/g;
  
  if (routeHandlerRegex.test(content)) {
    // Replace with Promise<params> pattern
    content = content.replace(
      /\{\s*params\s*\}\s*:\s*\{\s*params:\s*\{([^}]+)\}\s*\}/g,
      (match, paramContent) => {
        // Extract parameter types
        const paramType = `{ ${paramContent.trim()} }`;
        return `props: { params: Promise<${paramType}> }`;
      }
    );
    
    // Update the function body to await params
    content = content.replace(
      /(export\s+async\s+function\s+(?:GET|POST|PUT|DELETE|PATCH)\s*\([^)]+\)\s*\{)/g,
      (match) => {
        const hasParams = match.includes('props:');
        if (hasParams) {
          return match + '\n  const params = await props.params;';
        }
        return match;
      }
    );
    
    modified = true;
  }
  
  // Pattern 2: Add Props type for routes with params
  if (content.includes('params') && !content.includes('type Props')) {
    const paramsMatch = content.match(/params:\s*Promise<\{([^}]+)\}>/);
    if (paramsMatch) {
      const propsType = `type Props = {\n  params: Promise<{${paramsMatch[1]}}>\n}\n\n`;
      content = propsType + content;
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(file, content);
    filesFixed++;
    console.log(`Fixed route handler in: ${file}`);
  }
});

console.log(`\nFixed ${filesFixed} route files`);

// Now fix pages with params too
const pageFiles = glob.sync('src/app/**/page.{ts,tsx,js,jsx}');
console.log(`\nChecking ${pageFiles.length} page files...`);

let pagesFixed = 0;

pageFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  // Check if it's a dynamic route (has params)
  if (file.includes('[') && file.includes(']')) {
    // Pattern for pages with params
    const pageComponentRegex = /export\s+default\s+(?:async\s+)?function\s+\w+\s*\(\s*\{\s*params\s*\}\s*:\s*\{\s*params:\s*\{[^}]+\}\s*\}\s*\)/;
    
    if (pageComponentRegex.test(content)) {
      // Update to Promise<params> pattern
      content = content.replace(
        /\{\s*params\s*\}\s*:\s*\{\s*params:\s*\{([^}]+)\}\s*\}/g,
        (match, paramContent) => {
          const paramType = `{ ${paramContent.trim()} }`;
          return `props: { params: Promise<${paramType}> }`;
        }
      );
      
      // Update function body to await params
      content = content.replace(
        /(export\s+default\s+(?:async\s+)?function\s+\w+\s*\([^)]+\)\s*\{)/g,
        (match) => {
          const hasParams = match.includes('props:');
          if (hasParams) {
            return match + '\n  const params = await props.params;';
          }
          return match;
        }
      );
      
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(file, content);
    pagesFixed++;
    console.log(`Fixed page component in: ${file}`);
  }
});

console.log(`\nFixed ${pagesFixed} page files`);