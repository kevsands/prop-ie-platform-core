#!/usr/bin/env node
// Direct Session Test

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testSession() {
  console.log('🧪 Direct Session Test\n');
  
  try {
    // First, make a direct request to see the response
    console.log('📝 Testing NextAuth endpoints...');
    
    // Test 1: Check providers
    const providersResponse = await axios.get(`${BASE_URL}/api/auth/providers`);
    console.log('Providers:', providersResponse.data);
    
    // Test 2: Check CSRF token
    const csrfResponse = await axios.get(`${BASE_URL}/api/auth/csrf`);
    console.log('CSRF:', csrfResponse.data);
    
    // Test 3: Try signin with credentials provider
    const signInData = {
      csrfToken: csrfResponse.data.csrfToken,
      email: 'test@example.com',
      password: 'TestPass123!',
      json: 'true'
    };
    
    console.log('\n🔐 Attempting signin...');
    const signInResponse = await axios.post(
      `${BASE_URL}/api/auth/signin/credentials`,
      new URLSearchParams(signInData).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': csrfResponse.headers['set-cookie'].join('; ')
        },
        maxRedirects: 0,
        validateStatus: (status) => status < 500
      }
    );
    
    console.log('SignIn status:', signInResponse.status);
    console.log('SignIn headers:', signInResponse.headers);
    
    if (signInResponse.headers['set-cookie']) {
      const cookies = [...csrfResponse.headers['set-cookie'], ...signInResponse.headers['set-cookie']];
      
      // Test session with the cookies
      console.log('\n🔍 Testing session with cookies...');
      const sessionResponse = await axios.get(`${BASE_URL}/api/auth/session`, {
        headers: {
          'Cookie': cookies.join('; ')
        }
      });
      
      console.log('Session data:', JSON.stringify(sessionResponse.data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testSession();