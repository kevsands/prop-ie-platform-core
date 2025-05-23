#!/usr/bin/env node
// Complete Flow Test - Register then Login

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

async function testCompleteFlow() {
  console.log('🧪 Complete Authentication Flow Test\n');
  
  try {
    // Step 1: Register user
    console.log('📝 Step 1: Registering user...');
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, TEST_USER);
    console.log('Registration successful:', registerResponse.data);
    
    // Wait a moment for the database
    await delay(1000);
    
    // Step 2: Get CSRF token
    console.log('\n🔑 Step 2: Getting CSRF token...');
    const csrfResponse = await axios.get(`${BASE_URL}/api/auth/csrf`);
    const csrfToken = csrfResponse.data.csrfToken;
    const csrfCookies = csrfResponse.headers['set-cookie'] || [];
    console.log('CSRF token obtained');
    
    // Step 3: Authenticate
    console.log('\n🔐 Step 3: Authenticating user...');
    const authData = new URLSearchParams({
      'csrfToken': csrfToken,
      'email': TEST_USER.email,
      'password': TEST_USER.password,
      'callbackUrl': BASE_URL,
      'json': 'true'
    });
    
    console.log('Sending auth request to:', `${BASE_URL}/api/auth/callback/credentials`);
    console.log('Auth data:', TEST_USER.email, '***');
    
    const authResponse = await axios.post(
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
    
    console.log('Auth response status:', authResponse.status);
    console.log('Auth response data:', JSON.stringify(authResponse.data, null, 2));
    
    // Check for cookies
    const authCookies = authResponse.headers['set-cookie'] || [];
    console.log('Auth cookies received:', authCookies.length);
    
    // Look for session token
    const sessionTokenCookie = authCookies.find(cookie => 
      cookie.includes('next-auth.session-token')
    );
    
    if (sessionTokenCookie) {
      console.log('✅ Session token found!');
      
      // Step 4: Verify session
      console.log('\n🔍 Step 4: Verifying session...');
      const allCookies = [...csrfCookies, ...authCookies];
      
      const sessionResponse = await axios.get(`${BASE_URL}/api/auth/session`, {
        headers: {
          'Cookie': allCookies.join('; ')
        }
      });
      
      console.log('Session response:', JSON.stringify(sessionResponse.data, null, 2));
      
      if (sessionResponse.data.user) {
        console.log('\n✅ Authentication successful!');
        console.log('User:', sessionResponse.data.user);
      } else {
        console.log('\n⚠️ No user in session');
      }
    } else {
      console.log('❌ No session token in cookies');
      console.log('Cookies received:', authCookies);
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error('Error:', error);
    }
  }
}

// Run the test
testCompleteFlow();