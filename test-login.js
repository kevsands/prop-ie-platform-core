// Simple test to check if login is working
const url = 'http://localhost:3000/login';

async function testLogin() {
  try {
    console.log('Testing login page...');
    const response = await fetch(url);
    console.log('Status:', response.status);
    
    if (response.status === 200) {
      console.log('✅ Login page is accessible');
    } else {
      console.log('❌ Login page returned error:', response.status);
    }
  } catch (error) {
    console.error('Error testing login:', error);
  }
}

testLogin();