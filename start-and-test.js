const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

console.log('🚀 Starting Prop.ie development server...\n');

// Start the server
const server = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname),
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    PORT: '3000'
  }
});

// Function to check if server is ready
const checkServer = (retries = 30) => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log('\n✅ Server is running successfully!');
    console.log(`🌐 URL: http://localhost:3000`);
    console.log(`📊 Status: ${res.statusCode}`);
    console.log('\n🎉 Your app is ready!');
    console.log('\nYou can now:');
    console.log('  • Open http://localhost:3000 in your browser');
    console.log('  • Start developing with hot reloading');
    console.log('  • Check the console for any runtime errors\n');
  });

  req.on('error', () => {
    if (retries > 0) {
      setTimeout(() => checkServer(retries - 1), 1000);
    } else {
      console.error('❌ Server failed to start after 30 seconds');
      server.kill();
      process.exit(1);
    }
  });

  req.end();
};

// Wait for server to initialize, then check
setTimeout(() => checkServer(), 5000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n✋ Shutting down...');
  server.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.kill();
  process.exit(0);
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});