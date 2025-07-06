const { execSync } = require('child_process');
const fs = require('fs');

try {
  // Run tsc and capture its output
  const output = execSync('npx tsc --noEmit src/app/login/page.tsx', { encoding: 'utf8', stdio: 'pipe' });
  console.log("TypeScript check succeeded!");
} catch (error) {
  // Filter the error output
  const errorOutput = error.stdout || '';
  const lines = errorOutput.split('\n');
  const filteredLines = lines.filter(line => {
    // Exclude JSX errors and module import errors
    return line.includes('/app/login/') && 
           !line.includes('Cannot use JSX unless') && 
           !line.includes('can only be default-imported') &&
           !line.includes('has no default export') &&
           line.includes('error TS');
  });

  if (filteredLines.length === 0) {
    console.log('Success! No TypeScript errors other than JSX/module import errors.');
    process.exit(0);
  } else {
    console.error('TypeScript errors found:');
    filteredLines.forEach(line => console.error(line));
    process.exit(1);
  }
}