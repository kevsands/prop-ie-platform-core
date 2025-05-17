const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Prop.ie development server...\n');

// Set up environment
process.env.NODE_ENV = 'development';

// Start Next.js dev server
const nextProcess = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname),
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    PORT: '3000'
  }
});

nextProcess.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n✋ Shutting down...');
  nextProcess.kill();
  process.exit(0);
});

console.log('✅ Server starting at http://localhost:3000');
console.log('📝 Note: Some prerendering errors may occur, but the app should run fine');
console.log('🔨 Development mode active - hot reloading enabled\n');