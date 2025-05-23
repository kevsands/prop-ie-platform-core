#!/usr/bin/env node
// Client-like Authentication Flow Test

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const TEST_USER = {
  email: 'test@example.com',
  password: 'TestPass123!'
};

async function testClientFlow() {
  console.log('🧪 Client Flow Authentication Test\n');
  
  try {
    // Step 1: Get CSRF token
    console.log('📝 Step 1: Getting CSRF token...');
    const csrfResponse = await axios.get(`${BASE_URL}/api/auth/csrf`);
    const csrfToken = csrfResponse.data.csrfToken;
    const csrfCookies = csrfResponse.headers['set-cookie'] || [];
    console.log('CSRF token obtained:', csrfToken.substring(0, 20) + '...');
    
    // Step 2: Call NextAuth callback endpoint (this is what happens when you submit login form)
    console.log('\n🔐 Step 2: Authenticating user...');
    const authData = new URLSearchParams({
      'csrfToken': csrfToken,
      'email': TEST_USER.email,
      'password': TEST_USER.password,
      'callbackUrl': `${BASE_URL}/`,
      'json': 'true'
    });
    
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
    console.log('Auth response data:', authResponse.data);
    
    // Check for session cookies
    const authCookies = authResponse.headers['set-cookie'] || [];
    console.log('Cookies received:', authCookies.length);
    
    if (authCookies.length > 0) {
      // Step 3: Verify session
      console.log('\n🔍 Step 3: Verifying session...');
      const allCookies = [...csrfCookies, ...authCookies];
      
      const sessionResponse = await axios.get(`${BASE_URL}/api/auth/session`, {
        headers: {
          'Cookie': allCookies.join('; ')
        }
      });
      
      console.log('Session data:', JSON.stringify(sessionResponse.data, null, 2));
      
      if (sessionResponse.data.user) {
        console.log('✅ Authentication successful!');
        console.log('User:', sessionResponse.data.user);
      } else {
        console.log('⚠️ No user in session');
      }
    } else {
      console.log('❌ No session cookies received');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testClientFlow();