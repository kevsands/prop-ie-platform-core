#!/usr/bin/env node

const http = require('http');

// Test endpoints
const endpoints = [
  { path: '/', name: 'Homepage' },
  { path: '/api/health', name: 'Health Check' },
  { path: '/api/users', name: 'Users API' },
  { path: '/api/properties', name: 'Properties API' }
];

console.log('🔍 Verifying PropIE Development Server...\n');

endpoints.forEach(endpoint => {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: endpoint.path,
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    console.log(`✅ ${endpoint.name}: ${res.statusCode} ${res.statusMessage}`);
  });

  req.on('error', (error) => {
    console.log(`❌ ${endpoint.name}: ${error.message}`);
  });

  req.on('timeout', () => {
    console.log(`⏱️  ${endpoint.name}: Request timed out`);
    req.abort();
  });

  req.end();
});

console.log('\nDevelopment server is accessible at: http://localhost:3001');
console.log('Check your browser and developer tools for detailed information.\n');