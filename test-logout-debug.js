#!/usr/bin/env node
// Debug Logout Test

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testLogout() {
  console.log('🧪 Debug Logout Test\n');
  
  try {
    // Create and login a user
    const user = {
      email: `logout${Date.now()}@example.com`,
      password: 'TestPass123!',
      name: 'Logout Test',
      userType: 'BUYER'
    };
    
    // Register
    console.log('📝 Step 1: Registering user...');
    await axios.post(`${BASE_URL}/api/auth/register`, user);
    console.log('User registered');
    
    // Login
    console.log('\n🔐 Step 2: Logging in...');
    const csrfResponse = await axios.get(`${BASE_URL}/api/auth/csrf`);
    const csrfToken = csrfResponse.data.csrfToken;
    const csrfCookies = csrfResponse.headers['set-cookie'] || [];
    
    const authData = new URLSearchParams({
      'csrfToken': csrfToken,
      'email': user.email,
      'password': user.password,
      'callbackUrl': BASE_URL,
      'json': 'true'
    });
    
    const signInResponse = await axios.post(
      `${BASE_URL}/api/auth/callback/credentials`,
      authData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie': csrfCookies.join('; ')
        }
      }
    );
    
    const authCookies = signInResponse.headers['set-cookie'] || [];
    const allCookies = [...csrfCookies, ...authCookies];
    console.log('Login successful');
    
    // Verify session before logout
    console.log('\n🔍 Step 3: Verifying session before logout...');
    const sessionBefore = await axios.get(`${BASE_URL}/api/auth/session`, {
      headers: { 'Cookie': allCookies.join('; ') }
    });
    console.log('Session before logout:', JSON.stringify(sessionBefore.data, null, 2));
    
    // Attempt logout with the correct format
    console.log('\n🚪 Step 4: Attempting logout...');
    
    // Try different signout endpoints
    const signoutEndpoints = [
      '/api/auth/signout',
      '/api/auth/signout?callbackUrl=' + encodeURIComponent(BASE_URL),
    ];
    
    for (const endpoint of signoutEndpoints) {
      console.log(`\nTrying endpoint: ${endpoint}`);
      
      try {
        const signOutResponse = await axios.post(
          `${BASE_URL}${endpoint}`,
          { csrfToken },
          {
            headers: {
              'Content-Type': 'application/json',
              'Cookie': allCookies.join('; ')
            },
            maxRedirects: 0,
            validateStatus: (status) => status < 500
          }
        );
        
        console.log('Response status:', signOutResponse.status);
        console.log('Response headers:', signOutResponse.headers);
        
        // Check if we got new cookies that clear the session
        const logoutCookies = signOutResponse.headers['set-cookie'] || [];
        console.log('Logout cookies:', logoutCookies);
        
        // Test session after logout
        const finalCookies = [...allCookies, ...logoutCookies];
        const sessionAfter = await axios.get(`${BASE_URL}/api/auth/session`, {
          headers: { 'Cookie': finalCookies.join('; ') }
        });
        
        console.log('Session after logout:', JSON.stringify(sessionAfter.data, null, 2));
        
        if (!sessionAfter.data.user) {
          console.log('✅ Logout successful - session cleared');
          break;
        } else {
          console.log('⚠️ Session still active after logout attempt');
        }
        
      } catch (error) {
        console.error('Error with endpoint:', error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run the test
testLogout();