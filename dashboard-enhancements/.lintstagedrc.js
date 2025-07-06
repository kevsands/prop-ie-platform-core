module.exports = {
  // Run type-check on changes to TypeScript files
  '**/*.ts?(x)': () => 'npm run type-check',
  
  // Run ESLint on all JavaScript and TypeScript files
  '**/*.(ts|js|tsx|jsx)': (filenames) => [
    `npx eslint ${filenames.join(' ')} --fix --config .eslintrc.security.json`,
    // Run security checks on modified files
    `npx njsscan ${filenames.join(' ')} || true`, // Don't fail build on findings
    // Check for suspicious patterns in modified files (don't fail build)
    `node scripts/security-scan.js ${filenames.join(' ')} || true`,
  ],
  
  // Check package.json for security patterns
  'package.json': () => [
    'npm audit --audit-level=moderate',
    // Check for suspicious package.json scripts
    "grep -q -E '(pre|post)(install|publish).*curl|wget|fetch' package.json && echo '⚠️ WARNING: Suspicious network commands found in npm scripts' || true",
  ],
  
  // Format non-code files
  '**/*.+(json|css|md)': (filenames) => 
    `npx prettier --write ${filenames.join(' ')}`,
    
  // Check HTML files for security issues
  '**/*.html': (filenames) => [
    // Look for inline scripts, dangerous attributes, etc.
    `grep -q -E '<script>|javascript:|eval\\(|document\\.write\\(' ${filenames.join(' ')} && echo '⚠️ WARNING: Potential XSS vulnerability in HTML' || true`,
  ],
};