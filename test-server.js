const http = require('http');

const checkServer = () => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  };

  console.log('🔍 Checking if server is running...\n');

  const req = http.request(options, (res) => {
    console.log(`✅ Server is running! Status: ${res.statusCode}`);
    console.log(`🌐 URL: http://localhost:3000`);
    console.log('\n🎉 Your app is ready!');
    console.log('\nYou can now:');
    console.log('  • Open http://localhost:3000 in your browser');
    console.log('  • Start developing with hot reloading');
    console.log('  • Check the console for any runtime errors');
    process.exit(0);
  });

  req.on('error', (error) => {
    console.error(`❌ Server not responding: ${error.message}`);
    console.log('\nPlease check if the server is running on port 3000');
    process.exit(1);
  });

  req.end();
};

checkServer();