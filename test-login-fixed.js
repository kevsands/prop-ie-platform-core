// Test script to verify login functionality after fixes
console.log('Testing login functionality...\n');

async function testLoginAPI() {
  const testCredentials = [
    { email: 'buyer@example.com', password: 'test123', expectedRole: 'buyer' },
    { email: 'developer@example.com', password: 'test123', expectedRole: 'developer' },
    { email: 'kevin@prop.ie', password: 'admin123', expectedRole: 'developer' }
  ];

  for (const creds of testCredentials) {
    console.log(`\n=== Testing ${creds.email} ===`);
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: creds.email,
          password: creds.password
        })
      });

      console.log('Status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Login successful');
        console.log('User:', data.user?.email);
        console.log('Role:', data.user?.role);
        console.log('Token received:', !!data.token);
      } else {
        const error = await response.json();
        console.log('❌ Login failed:', error.error || 'Unknown error');
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }
  }
}

// Check if server is running
fetch('http://localhost:3000/api/auth/login', { method: 'GET' })
  .then(() => {
    console.log('✅ Server is running, testing login...');
    testLoginAPI();
  })
  .catch(() => {
    console.log('❌ Server is not running. Please start it with: npm run dev');
    console.log('\nOnce server is running, the fixed login should work with:');
    console.log('- buyer@example.com (any password in dev mode)');
    console.log('- developer@example.com (any password in dev mode)');
    console.log('- kevin@prop.ie (password: admin123)');
  });