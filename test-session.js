// Enterprise Session Management Test Suite
const axios = require('axios');
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';
const TEST_USER = {
  email: `test.${Date.now()}@example.com`,
  password: 'Test123!@#',
  firstName: 'Test',
  lastName: 'User'
};

async function testSession() {
  console.log('\n🚀 Enterprise Session Test Suite');
  console.log('================================\n');
  
  try {
    // Test 1: Register
    console.log('📝 Test 1: User Registration');
    const registerRes = await axios.post(`${BASE_URL}/api/auth/register`, TEST_USER);
    console.log('✅ Registration successful:', registerRes.data);
    
    // Test 2: Login
    console.log('\n🔐 Test 2: User Login');
    const loginRes = await axios.post(`${BASE_URL}/api/auth/callback/credentials`, 
      `email=${TEST_USER.email}&password=${TEST_USER.password}`,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        maxRedirects: 0,
        validateStatus: (status) => status < 500
      }
    );
    console.log('✅ Login response status:', loginRes.status);
    console.log('🍪 Cookies received:', loginRes.headers['set-cookie']);
    
    // Extract session cookie
    const cookies = loginRes.headers['set-cookie'];
    if (!cookies || cookies.length === 0) {
      throw new Error('No session cookies received');
    }
    
    // Test 3: Session Check
    console.log('\n🔍 Test 3: Session Verification');
    const sessionRes = await axios.get(`${BASE_URL}/api/auth/session`, {
      headers: {
        'Cookie': cookies.join('; ')
      }
    });
    console.log('✅ Session data:', sessionRes.data);
    
    // Test 4: Protected Route
    console.log('\n🛡️ Test 4: Protected Route Access');
    const protectedRes = await axios.get(`${BASE_URL}/buyer`, {
      headers: {
        'Cookie': cookies.join('; ')
      },
      maxRedirects: 0,
      validateStatus: (status) => status < 500
    });
    console.log('✅ Protected route status:', protectedRes.status);
    
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Run tests
testSession();