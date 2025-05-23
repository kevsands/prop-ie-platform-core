#!/usr/bin/env node
// Page Flow Authentication Test

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const TEST_USER = {
  email: `test${Date.now()}@example.com`,
  password: 'TestPass123!',
  name: 'Test User',
  userType: 'BUYER'
};

async function testPageFlow() {
  console.log('🧪 Page Flow Authentication Test\n');
  
  try {
    // Step 1: Visit the login page
    console.log('📝 Step 1: Visiting login page...');
    const loginPageResponse = await axios.get(`${BASE_URL}/login`);
    console.log('Login page status:', loginPageResponse.status);
    
    // Step 2: Register a new user
    console.log('\n📝 Step 2: Registering new user...');
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, TEST_USER);
    console.log('Registration successful:', registerResponse.data);
    
    // Step 3: Test API signin (like what happens when submitting login form)
    console.log('\n🔐 Step 3: Testing API signin...');
    
    // Get CSRF token first
    const csrfResponse = await axios.get(`${BASE_URL}/api/auth/csrf`);
    const csrfToken = csrfResponse.data.csrfToken;
    const csrfCookies = csrfResponse.headers['set-cookie'] || [];
    
    // Sign in
    const authData = new URLSearchParams({
      'csrfToken': csrfToken,
      'email': TEST_USER.email,
      'password': TEST_USER.password,
      'callbackUrl': `${BASE_URL}/buyer`,
      'json': 'true'
    });
    
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
    
    console.log('Sign in response:', signInResponse.status);
    const authCookies = signInResponse.headers['set-cookie'] || [];
    
    if (authCookies.length > 0) {
      console.log('✅ Authentication successful');
      
      // Step 4: Access protected buyer page
      console.log('\n🛡️ Step 4: Accessing protected buyer page...');
      const allCookies = [...csrfCookies, ...authCookies];
      
      const buyerPageResponse = await axios.get(`${BASE_URL}/buyer`, {
        headers: {
          'Cookie': allCookies.join('; ')
        }
      });
      
      console.log('Buyer page status:', buyerPageResponse.status);
      if (buyerPageResponse.status === 200) {
        console.log('✅ Successfully accessed protected buyer page');
        
        // Check if we're on the correct page
        const pageTitle = buyerPageResponse.data.match(/<title>(.*?)<\/title>/);
        if (pageTitle) {
          console.log('Page title:', pageTitle[1]);
        }
        
        // Look for user info in the page
        if (buyerPageResponse.data.includes(TEST_USER.email)) {
          console.log('✅ User email found in page content');
        }
      }
      
      // Step 5: Test other protected routes
      const protectedRoutes = ['/dashboard', '/developer', '/investor'];
      console.log('\n🛡️ Step 5: Testing other protected routes...');
      
      for (const route of protectedRoutes) {
        const response = await axios.get(`${BASE_URL}${route}`, {
          headers: {
            'Cookie': allCookies.join('; ')
          },
          maxRedirects: 0,
          validateStatus: (status) => status < 500
        });
        
        console.log(`${route}: ${response.status} - ${response.status === 200 ? '✅ Accessible' : '❌ Not accessible'}`);
      }
      
    } else {
      console.log('❌ No authentication cookies received');
    }
    
    console.log('\n✅ Page flow test completed');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testPageFlow();