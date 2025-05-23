const { execSync } = require('child_process');

console.log('Starting build test...');

try {
  // First, run type check
  console.log('\n1. Running TypeScript type check...');
  execSync('npx tsc --noEmit', { 
    stdio: 'inherit',
    cwd: __dirname
  });
  console.log('✅ TypeScript check passed');
} catch (error) {
  console.error('❌ TypeScript check failed');
  process.exit(1);
}

try {
  // Then run Next.js build
  console.log('\n2. Running Next.js build...');
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: __dirname,
    timeout: 120000
  });
  console.log('✅ Build succeeded');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}