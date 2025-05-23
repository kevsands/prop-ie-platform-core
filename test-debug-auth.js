#!/usr/bin/env node
// Debug Authentication Test

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const TEST_USER = {
  email: 'test@example.com',
  password: 'TestPass123!',
  name: 'Test User',
  userType: 'BUYER'
};

async function debugAuth() {
  console.log('🧪 Debug Authentication Test\n');
  
  try {
    // First try to register user (might already exist)
    console.log('📝 Attempting to register user...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, TEST_USER);
      console.log('User registered:', registerResponse.data);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('User already exists, continuing...');
      } else {
        throw error;
      }
    }
    
    // Get CSRF token first
    console.log('\n🔑 Getting CSRF token...');
    const csrfResponse = await axios.get(`${BASE_URL}/api/auth/csrf`);
    const csrfToken = csrfResponse.data.csrfToken;
    const cookies = csrfResponse.headers['set-cookie'] || [];
    
    // Try the exact same request format
    console.log('\n🔐 Attempting authentication...');
    const authData = new URLSearchParams({
      'csrfToken': csrfToken,
      'email': TEST_USER.email,
      'password': TEST_USER.password,
      'callbackUrl': BASE_URL,
      'json': 'true'
    });
    
    const authResponse = await axios.post(
      `${BASE_URL}/api/auth/callback/credentials`,
      authData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': cookies.join('; ')
        },
        maxRedirects: 0,
        validateStatus: (status) => status < 500
      }
    );
    
    console.log('Auth response status:', authResponse.status);
    console.log('Auth response data:', authResponse.data);
    
    // Print all cookies
    const authCookies = authResponse.headers['set-cookie'] || [];
    console.log('\nAll cookies received:');
    authCookies.forEach((cookie, i) => {
      console.log(`Cookie ${i + 1}:`, cookie);
    });
    
    // Check for session token
    const sessionToken = authCookies.find(c => c.includes('next-auth.session-token'));
    if (sessionToken) {
      console.log('\n✅ Session token found');
      
      // Test session
      const allCookies = [...cookies, ...authCookies];
      const sessionResponse = await axios.get(`${BASE_URL}/api/auth/session`, {
        headers: {
          'Cookie': allCookies.join('; ')
        }
      });
      
      console.log('\nSession data:', JSON.stringify(sessionResponse.data, null, 2));
    } else {
      console.log('\n❌ No session token found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
debugAuth();