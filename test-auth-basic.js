#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testAuthentication() {
  log('🔐 Testing Authentication System', colors.blue);
  log('================================\n', colors.blue);

  // Test 1: Access protected route without auth
  try {
    log('Test 1: Accessing protected route without authentication...', colors.blue);
    const response = await axios.get(`${BASE_URL}/api/users/me`, {
      validateStatus: () => true
    });
    
    if (response.status === 401 || response.status === 307) {
      log('✅ Protected route properly blocks unauthenticated access\n', colors.green);
    } else {
      log(`❌ Protected route returned status ${response.status} (expected 401 or 307)\n`, colors.red);
    }
  } catch (error) {
    log(`❌ Error accessing protected route: ${error.message}\n`, colors.red);
  }

  // Test 2: Register a new user
  let testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'TestPass123!',
    userType: 'buyer'
  };

  try {
    log('Test 2: Registering a new user...', colors.blue);
    const response = await axios.post(`${BASE_URL}/api/auth/register`, testUser, {
      validateStatus: () => true
    });
    
    if (response.status === 201) {
      log('✅ User registration successful', colors.green);
      log(`User ID: ${response.data.user.id}\n`, colors.green);
    } else {
      log(`❌ Registration failed with status ${response.status}`, colors.red);
      log(`Response: ${JSON.stringify(response.data)}\n`, colors.red);
    }
  } catch (error) {
    log(`❌ Error during registration: ${error.message}\n`, colors.red);
  }

  // Test 3: Check NextAuth configuration
  try {
    log('Test 3: Checking NextAuth configuration...', colors.blue);
    const response = await axios.get(`${BASE_URL}/api/auth/providers`, {
      validateStatus: () => true
    });
    
    if (response.status === 200) {
      log('✅ NextAuth is properly configured', colors.green);
      log(`Available providers: ${JSON.stringify(response.data)}\n`, colors.green);
    } else {
      log(`❌ NextAuth check failed with status ${response.status}\n`, colors.red);
    }
  } catch (error) {
    log(`❌ Error checking NextAuth: ${error.message}\n`, colors.red);
  }

  log('\n✨ Authentication system test complete!', colors.blue);
}

testAuthentication().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, colors.red);
  process.exit(1);
});