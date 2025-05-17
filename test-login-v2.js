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
  log('🔐 Testing Login with NextAuth', colors.blue);
  log('=============================\n', colors.blue);

  const timestamp = Date.now();
  const testUser = {
    name: `Test User ${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: 'TestPass123!',
    userType: 'buyer'
  };

  // First register the user
  try {
    log('Step 1: Registering a new user...', colors.blue);
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
    log('✅ User registered successfully', colors.green);
    log(`User ID: ${registerResponse.data.user.id}\n`, colors.green);
  } catch (error) {
    log(`❌ Registration failed: ${error.message}`, colors.red);
    if (error.response) {
      log(`Response: ${JSON.stringify(error.response.data)}\n`, colors.red);
    }
    return;
  }

  // Try the proper NextAuth signin endpoint
  try {
    log('Step 2: Getting CSRF token...', colors.blue);
    const csrfResponse = await axios.get(`${BASE_URL}/api/auth/csrf`);
    const csrfToken = csrfResponse.data.csrfToken;
    log(`✅ CSRF token obtained: ${csrfToken}\n`, colors.green);

    log('Step 3: Logging in with NextAuth credentials provider...', colors.blue);
    const formData = new URLSearchParams({
      csrfToken: csrfToken,
      email: testUser.email,
      password: testUser.password,
      callbackUrl: `${BASE_URL}/dashboard`,
      json: 'true',
    });

    const loginResponse = await axios.post(
      `${BASE_URL}/api/auth/callback/credentials`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        maxRedirects: 0,
        validateStatus: function (status) {
          return status >= 200 && status < 400; // Don't throw on redirects
        }
      }
    );

    log(`Login response status: ${loginResponse.status}`, colors.blue);
    
    if (loginResponse.status === 302 || loginResponse.status === 301) {
      log('✅ Login successful (redirect received)', colors.green);
      log(`Redirect location: ${loginResponse.headers.location}\n`, colors.green);
      
      // Get cookies
      const cookies = loginResponse.headers['set-cookie'];
      if (cookies) {
        log('Received cookies:', colors.green);
        cookies.forEach(cookie => log(`  ${cookie}`, colors.green));
      }
    } else {
      log(`Response data: ${JSON.stringify(loginResponse.data)}\n`, colors.blue);
    }
  } catch (error) {
    log(`❌ Login error: ${error.message}`, colors.red);
    if (error.response) {
      log(`Status: ${error.response.status}`, colors.red);
      log(`Response: ${JSON.stringify(error.response.data)}\n`, colors.red);
    }
  }

  // Test getting the session
  try {
    log('\nStep 4: Getting session...', colors.blue);
    const sessionResponse = await axios.get(`${BASE_URL}/api/auth/session`);
    
    if (sessionResponse.data && sessionResponse.data.user) {
      log('✅ Session found', colors.green);
      log(`User: ${JSON.stringify(sessionResponse.data.user)}\n`, colors.green);
    } else {
      log('❌ No session found', colors.red);
      log(`Response: ${JSON.stringify(sessionResponse.data)}\n`, colors.red);
    }
  } catch (error) {
    log(`❌ Session error: ${error.message}\n`, colors.red);
  }

  log('\n✨ NextAuth login test complete!', colors.blue);
}

testLogin().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, colors.red);
  process.exit(1);
});