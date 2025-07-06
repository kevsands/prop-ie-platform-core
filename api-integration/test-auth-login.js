// Test script to verify authentication with different user roles
// Run with: node test-auth-login.js

// Simulating login attempts with different user roles
const testLogins = [
  { username: 'buyer@example.com', expectedRole: 'buyer' },
  { username: 'developer@example.com', expectedRole: 'developer' },
  { username: 'agent@example.com', expectedRole: 'agent' },
  { username: 'solicitor@example.com', expectedRole: 'solicitor' },
  { username: 'admin@example.com', expectedRole: 'admin' },
  { username: 'user@example.com', expectedRole: 'user' }
];

console.log('Testing authentication with different user roles:');
console.log('==============================================');

testLogins.forEach(test => {
  console.log(`\nUsername: ${test.username}`);
  console.log(`Expected Role: ${test.expectedRole}`);
  console.log('URL for login: http://localhost:3000/login');
  console.log('After login, navigate to: http://localhost:3000/buyer');
  console.log('Should grant access: ' + (test.expectedRole === 'buyer' || test.expectedRole === 'admin'));
});

console.log('\nHow to test:');
console.log('1. Start your Next.js server: npm run dev');
console.log('2. Go to http://localhost:3000/login');
console.log('3. Login with each username above (any password will work in dev mode)');
console.log('4. Try to access http://localhost:3000/buyer');
console.log('5. Verify that only buyer and admin users can access the buyer dashboard');