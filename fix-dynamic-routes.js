const fs = require('fs');
const path = require('path');

const routeFiles = [
  'src/app/api/v1/transactions/[id]/transition/route.ts',
  'src/app/api/v1/transactions/[id]/route.ts',
  'src/app/api/htb/buyer/claims/[id]/route.ts',
  'src/app/api/developments/[id]/route.ts',
  'src/app/api/slp/[projectId]/route.ts',
  'src/app/api/projects/[id]/sales/route.ts',
  'src/app/api/projects/[id]/activity/route.ts',
  'src/app/api/projects/[id]/alerts/route.ts',
  'src/app/api/projects/[id]/route.ts',
  'src/app/api/properties/[slug]/route.ts'
];

routeFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip files that already have the fix
    if (content.includes('Promise<{')) {
      console.log(`Skipping ${filePath} - already fixed`);
      return;
    }
    
    // Find the parameter name from the path
    const paramMatch = filePath.match(/\[([^\]]+)\]/);
    const paramName = paramMatch ? paramMatch[1] : 'id';
    
    // Update GET function
    content = content.replace(
      /export async function GET\s*\(\s*request:\s*NextRequest,?\s*\{\s*params\s*\}\s*:\s*\{\s*params:\s*\{\s*[^}]+\s*\}\s*\}\s*\)/g,
      `type GetParams = {\n  params: Promise<{ ${paramName}: string }>\n}\n\nexport async function GET(\n  request: NextRequest,\n  context: GetParams\n)`
    );
    
    // Update POST function
    content = content.replace(
      /export async function POST\s*\(\s*request:\s*NextRequest,?\s*\{\s*params\s*\}\s*:\s*\{\s*params:\s*\{\s*[^}]+\s*\}\s*\}\s*\)/g,
      `type PostParams = {\n  params: Promise<{ ${paramName}: string }>\n}\n\nexport async function POST(\n  request: NextRequest,\n  context: PostParams\n)`
    );
    
    // Update PUT function
    content = content.replace(
      /export async function PUT\s*\(\s*request:\s*NextRequest,?\s*\{\s*params\s*\}\s*:\s*\{\s*params:\s*\{\s*[^}]+\s*\}\s*\}\s*\)/g,
      `type PutParams = {\n  params: Promise<{ ${paramName}: string }>\n}\n\nexport async function PUT(\n  request: NextRequest,\n  context: PutParams\n)`
    );
    
    // Update PATCH function
    content = content.replace(
      /export async function PATCH\s*\(\s*request:\s*NextRequest,?\s*\{\s*params\s*\}\s*:\s*\{\s*params:\s*\{\s*[^}]+\s*\}\s*\}\s*\)/g,
      `type PatchParams = {\n  params: Promise<{ ${paramName}: string }>\n}\n\nexport async function PATCH(\n  request: NextRequest,\n  context: PatchParams\n)`
    );
    
    // Update DELETE function
    content = content.replace(
      /export async function DELETE\s*\(\s*request:\s*NextRequest,?\s*\{\s*params\s*\}\s*:\s*\{\s*params:\s*\{\s*[^}]+\s*\}\s*\}\s*\)/g,
      `type DeleteParams = {\n  params: Promise<{ ${paramName}: string }>\n}\n\nexport async function DELETE(\n  request: NextRequest,\n  context: DeleteParams\n)`
    );
    
    // Add await for params access after the function starts
    const functionMatches = content.match(/export async function (GET|POST|PUT|PATCH|DELETE)\([^{]+\{/g);
    
    if (functionMatches) {
      functionMatches.forEach(match => {
        const funcName = match.match(/(GET|POST|PUT|PATCH|DELETE)/)[1];
        
        // Add the await params line after the function starts
        content = content.replace(
          new RegExp(`(export async function ${funcName}\\([^{]+\\{)`, 'g'),
          `$1\n  const params = await context.params;`
        );
      });
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log('All route files updated!');