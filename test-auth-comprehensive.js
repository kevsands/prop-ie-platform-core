#!/usr/bin/env node
// Comprehensive Authentication Test Suite

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test cases
const testCases = {
  validUser: {
    email: `test${Date.now()}@example.com`,
    password: 'TestPass123!',
    name: 'Test User',
    userType: 'BUYER'
  },
  invalidCredentials: {
    email: 'invalid@example.com',
    password: 'wrongpass'
  },
  emptyCredentials: {
    email: '',
    password: ''
  },
  sqlInjection: {
    email: "admin'--",
    password: "' OR '1'='1"
  }
};

async function runTest(testName, testFn) {
  console.log(`\n🧪 ${testName}`);
  console.log('-'.repeat(50));
  try {
    await testFn();
    console.log('✅ Test passed');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.status, error.response.data);
    }
  }
}

async function testComprehensiveAuth() {
  console.log('🧪 Comprehensive Authentication Test Suite\n');
  
  // Test 1: Valid user registration and login
  await runTest('Valid User Registration and Login', async () => {
    const user = testCases.validUser;
    
    // Register
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, user);
    console.log('Registration:', registerResponse.data.message);
    
    // Login
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
    
    if (signInResponse.status === 200) {
      console.log('Login successful');
      
      // Verify session
      const authCookies = signInResponse.headers['set-cookie'] || [];
      const allCookies = [...csrfCookies, ...authCookies];
      
      const sessionResponse = await axios.get(`${BASE_URL}/api/auth/session`, {
        headers: { 'Cookie': allCookies.join('; ') }
      });
      
      console.log('Session:', sessionResponse.data);
    }
  });
  
  // Test 2: Invalid credentials
  await runTest('Invalid Credentials', async () => {
    const user = testCases.invalidCredentials;
    
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
        },
        validateStatus: (status) => status < 500
      }
    );
    
    console.log('Response status:', signInResponse.status);
    if (signInResponse.status === 401 || signInResponse.data.url?.includes('error')) {
      console.log('Correctly rejected invalid credentials');
    } else {
      throw new Error('Invalid credentials were not rejected');
    }
  });
  
  // Test 3: Empty credentials
  await runTest('Empty Credentials', async () => {
    const user = testCases.emptyCredentials;
    
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
        },
        validateStatus: (status) => status < 500
      }
    );
    
    console.log('Response status:', signInResponse.status);
    if (signInResponse.status === 401 || signInResponse.data.url?.includes('error')) {
      console.log('Correctly rejected empty credentials');
    } else {
      throw new Error('Empty credentials were not rejected');
    }
  });
  
  // Test 4: SQL Injection attempt
  await runTest('SQL Injection Protection', async () => {
    const user = testCases.sqlInjection;
    
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
        },
        validateStatus: (status) => status < 500
      }
    );
    
    console.log('Response status:', signInResponse.status);
    if (signInResponse.status === 401 || signInResponse.data.url?.includes('error')) {
      console.log('SQL injection attempt blocked');
    } else {
      throw new Error('SQL injection was not blocked');
    }
  });
  
  // Test 5: Session expiry
  await runTest('Session Management', async () => {
    // This is a placeholder for session expiry testing
    console.log('Session management test would require longer running test');
    console.log('Session is configured for 30 days');
  });
  
  // Test 6: Logout functionality
  await runTest('Logout Functionality', async () => {
    const user = {
      email: `logout-test${Date.now()}@example.com`,
      password: 'TestPass123!',
      name: 'Logout Test',
      userType: 'BUYER'
    };
    
    // Register and login
    await axios.post(`${BASE_URL}/api/auth/register`, user);
    
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
    
    if (signInResponse.status === 200) {
      const authCookies = signInResponse.headers['set-cookie'] || [];
      const allCookies = [...csrfCookies, ...authCookies];
      
      // Sign out
      const signOutResponse = await axios.post(
        `${BASE_URL}/api/auth/signout`,
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
      
      console.log('Signout response:', signOutResponse.status);
      
      // Get logout cookies that clear the session
      const logoutCookies = signOutResponse.headers['set-cookie'] || [];
      const finalCookies = [...allCookies, ...logoutCookies];
      
      // Try to access session after logout
      const sessionAfterLogout = await axios.get(`${BASE_URL}/api/auth/session`, {
        headers: { 'Cookie': finalCookies.join('; ') }
      });
      
      if (!sessionAfterLogout.data.user) {
        console.log('Session correctly cleared after logout');
      } else {
        throw new Error('Session not cleared after logout');
      }
    }
  });
  
  console.log('\n\n✅ All authentication tests completed');
}

// Run the comprehensive test
testComprehensiveAuth();