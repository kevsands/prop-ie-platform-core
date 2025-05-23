const { execSync } = require('child_process');
const http = require('http');

console.log('Starting Prop.ie Platform (Core Functionality Only)...');
console.log('==============================================');

// Check if database is running
console.log('\n1. Checking database...');
try {
  execSync('pg_isready', { stdio: 'pipe' });
  console.log('✅ PostgreSQL is running');
} catch (error) {
  console.log('⚠️  PostgreSQL not detected - database features may be limited');
}

// Start the development server
console.log('\n2. Starting Next.js server...');
const server = require('child_process').spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

// Check server health after a delay
setTimeout(() => {
  http.get('http://localhost:3000/api/health', (res) => {
    if (res.statusCode === 200) {
      console.log('\n✅ Server is running at http://localhost:3000');
      console.log('\nAvailable pages:');
      console.log('- Home: http://localhost:3000');
      console.log('- Properties: http://localhost:3000/properties/search');
      console.log('- Developer Dashboard: http://localhost:3000/developer/dashboard');
      console.log('- About: http://localhost:3000/about');
      console.log('- Contact: http://localhost:3000/contact');
    }
  }).on('error', () => {
    console.log('\n✅ Server is starting up...');
    console.log('Please wait a moment and then visit http://localhost:3000');
  });
}, 5000);

// Handle shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.kill();
  process.exit(0);
});