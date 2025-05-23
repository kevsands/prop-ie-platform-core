#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of files to fix that already have a Promise structure
// These files don't need to be fixed
const filesAlreadyFixed = [
  '/app/api/v1/transactions/[id]/transition/route.ts',
  '/app/api/v1/transactions/[id]/route.ts',
  '/app/api/htb/buyer/claims/[id]/route.ts',
  '/app/api/developments/[id]/route.ts',
  '/app/api/slp/[projectId]/route.ts',
  '/app/api/projects/[id]/sales/route.ts',
  '/app/api/projects/[id]/activity/route.ts',
  '/app/api/projects/[id]/alerts/route.ts',
  '/app/api/projects/[id]/route.ts',
  '/app/api/transactions/[id]/payment-process/route.ts',
  '/app/api/transactions/[id]/payments/route.ts',
  '/app/api/transactions/[id]/route.ts',
];

// Files to fix - only the DELETE method in the last file needs fixing
const filesToFix = [
  { 
    file: '/app/api/transactions/[id]/route.ts',
    methods: ['DELETE']
  }
];

function fixParamsType(content, methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']) {
  let modified = content;
  let hasChanges = false;

  methods.forEach(method => {
    // Match regular parameter pattern in the DELETE function in transactions/[id]/route.ts
    const deletePattern = /export async function DELETE\(\s*request: NextRequest,\s*\{ params \}: \{ params: \{ id: string \} \}\s*\)/;
    
    if (method === 'DELETE' && deletePattern.test(modified)) {
      console.log(`  - Fixing ${method} method parameter structure`);
      modified = modified.replace(
        deletePattern,
        'export async function DELETE(\n  request: NextRequest,\n  context: { params: Promise<{ id: string }> }\n)'
      );
      
      // Add params await immediately after the function signature
      const deleteBodyPattern = /export async function DELETE\(\s*request: NextRequest,\s*context: \{ params: Promise<\{ id: string \}> \}\s*\)\s*{\s*try\s*{/;
      modified = modified.replace(
        deleteBodyPattern,
        'export async function DELETE(\n  request: NextRequest,\n  context: { params: Promise<{ id: string }> }\n) {\n  try {\n    const params = await context.params;'
      );
      
      // Replace params.id with just params.id (if using destructuring)
      modified = modified.replace(/where: \{ id: params\.id \}/g, 'where: { id: params.id }');
      hasChanges = true;
    }
  });

  return { content: modified, hasChanges };
}

async function processFiles() {
  const srcDir = path.join(__dirname, 'src');
  let totalFixed = 0;
  let errors = [];

  for (const fileInfo of filesToFix) {
    const filePath = path.join(srcDir, fileInfo.file);
    
    try {
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${fileInfo.file}`);
        continue;
      }

      console.log(`\nProcessing: ${fileInfo.file}`);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const { content: fixedContent, hasChanges } = fixParamsType(content, fileInfo.methods);
      
      if (hasChanges) {
        fs.writeFileSync(filePath, fixedContent);
        console.log(`✅ Fixed: ${fileInfo.file}`);
        totalFixed++;
      } else {
        console.log(`ℹ️  No changes needed: ${fileInfo.file}`);
      }
    } catch (error) {
      const errorMsg = `Error processing ${fileInfo.file}: ${error.message}`;
      console.error(`❌ ${errorMsg}`);
      errors.push(errorMsg);
    }
  }

  console.log('\n=== Fix Summary ===');
  console.log(`Files already fixed: ${filesAlreadyFixed.length}`);
  console.log(`Files fixed: ${totalFixed}`);
  console.log(`Errors: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log('\nErrors:');
    errors.forEach(error => console.log(`  - ${error}`));
  }
}

// Run the fixes
processFiles().catch(console.error);