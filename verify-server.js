const http = require('http');

console.log('🔍 Verifying server status...\n');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    console.log('✅ Server is RUNNING!');
    console.log('🌐 URL: http://localhost:3000');
    console.log('📊 Status Code:', res.statusCode);
    console.log('\n🎉 Your app is ready to use!');
    console.log('\nOpen http://localhost:3000 in your browser');
  } else {
    console.log('⚠️  Server is responding but with status:', res.statusCode);
  }
});

req.on('error', (error) => {
  console.error('❌ Server is NOT running');
  console.error('Error:', error.message);
  console.log('\nPlease start the server with: npm run dev');
});

req.on('timeout', () => {
  console.error('❌ Server connection timed out');
  req.destroy();
});

req.end();