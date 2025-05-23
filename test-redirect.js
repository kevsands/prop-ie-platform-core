const http = require('http');

// Test connection to port 3000
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/solutions/developers/analytics',
  method: 'GET',
};

const req = http.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('BODY LENGTH:', data.length);
    console.log('RESPONSE RECEIVED');
  });
});

req.on('error', (e) => {
  console.error(`PROBLEM WITH REQUEST: ${e.message}`);
});

req.end();