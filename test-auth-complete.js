#!/usr/bin/env node
// Complete Authentication Test Suite

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const TEST_USER = {
  email: `test${Date.now()}@example.com`,
  password: 'TestPass123!',
  name: 'Test User',
  userType: 'BUYER'
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testAuthentication() {
  console.log('🧪 Enterprise Authentication Test Suite\n');
  
  try {
    // Test 1: Register new user
    console.log('📝 Test 1: User Registration');
    console.log('Sending:', TEST_USER);
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, TEST_USER);
    console.log('✅ Registration successful');
    console.log('Response:', registerResponse.data);
    
    // Wait a moment
    await delay(1000);
    
    // Test 2: Get CSRF token first
    console.log('\n🔑 Test 2: Getting CSRF token...');
    const csrfResponse = await axios.get(`${BASE_URL}/api/auth/csrf`);
    const csrfToken = csrfResponse.data.csrfToken;
    const csrfCookies = csrfResponse.headers['set-cookie'] || [];
    console.log('CSRF token obtained');
    
    // Test 3: Login
    console.log('\n🔐 Test 3: User Login');
    
    const authData = new URLSearchParams({
      'csrfToken': csrfToken,
      'email': TEST_USER.email,
      'password': TEST_USER.password,
      'callbackUrl': BASE_URL,
      'json': 'true'
    });
    
    console.log('Attempting login with:', TEST_USER.email);
    
    const signInResponse = await axios.post(
      `${BASE_URL}/api/auth/callback/credentials`,
      authData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': csrfCookies.join('; ')
        },
        maxRedirects: 0,
        validateStatus: (status) => status < 500
      }
    );
    
    console.log('Login response status:', signInResponse.status);
    console.log('Headers:', signInResponse.headers);
    
    // Extract cookies
    const authCookies = signInResponse.headers['set-cookie'] || [];
    const allCookies = [...csrfCookies, ...authCookies];
    
    if (authCookies.length > 0) {
      console.log('✅ Session cookies received:', authCookies.length);
      
      // Check for session token
      const sessionToken = authCookies.find(c => c.includes('next-auth.session-token'));
      if (sessionToken) {
        console.log('✅ Session token found');
      }
      
      // Test 4: Verify session
      console.log('\n🔍 Test 4: Session Verification');
      const sessionResponse = await axios.get(`${BASE_URL}/api/auth/session`, {
        headers: {
          'Cookie': allCookies.join('; ')
        }
      });
      
      console.log('Session data:', sessionResponse.data);
      
      if (sessionResponse.data.user) {
        console.log('✅ Session is valid!');
        console.log('User:', sessionResponse.data.user);
      } else {
        console.log('⚠️ No user in session');
      }
      
      // Test 5: Access protected route
      console.log('\n🛡️ Test 5: Protected Route Access');
      const protectedResponse = await axios.get(`${BASE_URL}/buyer`, {
        headers: {
          'Cookie': allCookies.join('; ')
        },
        maxRedirects: 0,
        validateStatus: (status) => status < 500
      });
      
      console.log('Protected route status:', protectedResponse.status);
      if (protectedResponse.status === 200) {
        console.log('✅ Can access protected route');
      } else if (protectedResponse.status === 307) {
        console.log('🔄 Redirected (expected for unauthenticated)');
      }
      
    } else {
      console.log('❌ No session cookies received');
    }
    
    console.log('\n🎉 Authentication tests completed');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('Error details:', error);
    }
  }
}

// Check if axios is installed
const { execSync } = require('child_process');
try {
  require.resolve('axios');
} catch(e) {
  console.log('Installing axios...');
  execSync('npm install axios', { stdio: 'inherit' });
}

// Run the test
testAuthentication();