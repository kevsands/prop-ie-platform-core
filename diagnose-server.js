const http = require('http');
const { spawn } = require('child_process');

console.log('Starting diagnostic...');

// First, test if we can create a basic server on port 3000
const testServer = http.createServer((req, res) => {
  res.end('Test OK');
});

testServer.on('error', (err) => {
  console.error('Cannot create server on port 3000:', err.message);
  process.exit(1);
});

testServer.listen(3000, () => {
  console.log('Port 3000 is available');
  testServer.close(() => {
    console.log('Starting Next.js server...');
    
    // Start Next.js
    const nextServer = spawn('npx', ['next', 'dev'], {
      stdio: 'inherit',
      env: { ...process.env, PORT: '3000' }
    });
    
    // Test connection after a delay
    setTimeout(() => {
      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/',
        method: 'GET',
      };
      
      const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        if (res.statusCode === 200) {
          console.log('Server is responding correctly!');
        } else {
          console.log('Server responded with unexpected status');
        }
      });
      
      req.on('error', (e) => {
        console.error(`Connection error: ${e.message}`);
      });
      
      req.end();
    }, 5000);
  });
});