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

async function testLogin() {
  log('🔐 Testing Login Flow', colors.blue);
  log('====================\n', colors.blue);

  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'TestPass123!',
  };

  // First register the user
  try {
    log('Step 1: Registering a new user...', colors.blue);
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      name: 'Test User',
      ...testUser,
      userType: 'buyer'
    });
    log('✅ User registered successfully\n', colors.green);
  } catch (error) {
    log(`❌ Registration failed: ${error.message}\n`, colors.red);
    return;
  }

  // Try logging in
  try {
    log('Step 2: Logging in with credentials...', colors.blue);
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/signin/credentials`, {
      ...testUser,
      redirect: false,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (loginResponse.status === 200) {
      log('✅ Login successful', colors.green);
      log(`Response: ${JSON.stringify(loginResponse.data)}\n`, colors.green);
    } else {
      log(`❌ Login failed with status ${loginResponse.status}`, colors.red);
      log(`Response: ${JSON.stringify(loginResponse.data)}\n`, colors.red);
    }
  } catch (error) {
    log(`❌ Login error: ${error.message}`, colors.red);
    if (error.response) {
      log(`Response: ${JSON.stringify(error.response.data)}\n`, colors.red);
    }
  }

  // Test accessing protected route with session
  try {
    log('Step 3: Testing session/cookie retrieval...', colors.blue);
    const sessionResponse = await axios.get(`${BASE_URL}/api/auth/session`);
    
    if (sessionResponse.data && sessionResponse.data.user) {
      log('✅ Session retrieved successfully', colors.green);
      log(`User: ${JSON.stringify(sessionResponse.data.user)}\n`, colors.green);
    } else {
      log('❌ No session found', colors.red);
      log(`Response: ${JSON.stringify(sessionResponse.data)}\n`, colors.red);
    }
  } catch (error) {
    log(`❌ Session error: ${error.message}\n`, colors.red);
  }

  log('\n✨ Login test complete!', colors.blue);
}

testLogin().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, colors.red);
  process.exit(1);
});