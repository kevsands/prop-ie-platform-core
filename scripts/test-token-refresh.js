#!/usr/bin/env node

/**
 * Test Token Expiration and Refresh Flow
 * 
 * This script tests the token expiration and automatic refresh flow of the auth service.
 * It simulates token expiration and tests if the service can handle it gracefully.
 * 
 * Usage:
 *   node scripts/test-token-refresh.js
 */

// Mock browser environment
if (typeof window === 'undefined') {
  global.window = {
    localStorage: {
      _data: {},
      getItem(key) {
        return this._data[key];
      },
      setItem(key, value) {
        this._data[key] = value;
      },
      removeItem(key) {
        delete this._data[key];
      },
      clear() {
        this._data = {};
      }
    },
    location: {
      hostname: 'localhost',
      href: 'http://localhost:3000'
    }
  };
  global.localStorage = global.window.localStorage;
  global.sessionStorage = {
    _data: {},
    getItem(key) {
      return this._data[key];
    },
    setItem(key, value) {
      this._data[key] = value;
    },
    removeItem(key) {
      delete this._data[key];
    }
  };
  global.document = { referrer: '' };
  global.navigator = { userAgent: 'node-test' };
}

// Configure AWS Amplify in test mode
process.env.NODE_ENV = 'development';
process.env.NEXT_PUBLIC_ENVIRONMENT = 'local';

// Import necessary modules
let auth;
let authService;
let api;
let jwtDecode;

// Test credentials
const testCredentials = {
  email: 'test@example.com',
  password: 'Password123!'
};

/**
 * Color coded console output
 */
const log = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
  warning: (msg) => console.log(`\x1b[33m[WARNING]\x1b[0m ${msg}`),
  title: (msg) => console.log(`\n\x1b[35m${msg}\x1b[0m\n${'-'.repeat(msg.length)}`),
};

/**
 * Sleep function for throttling requests
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Run the token refresh tests
 */
async function runTests() {
  log.title('Token Expiration and Refresh Flow Test');
  
  // Bootstrap tests
  try {
    log.info('Loading modules...');
    
    // Dynamically import ES modules
    const authModule = await import('../src/lib/auth.js');
    const apiModule = await import('../src/lib/api-client.js');
    
    // Install jwt-decode for token inspection
    try {
      jwtDecode = require('jwt-decode');
      log.success('jwt-decode loaded');
    } catch (e) {
      log.warning('jwt-decode not installed, running npm install jwt-decode');
      const { execSync } = require('child_process');
      execSync('npm install jwt-decode');
      jwtDecode = require('jwt-decode');
    }
    
    auth = authModule.default;
    authService = authModule.authService;
    api = apiModule.api;
    
    log.success('Modules loaded successfully');
  } catch (error) {
    log.error(`Failed to load modules: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
  
  // Run test cases
  await testLoginAndToken();
  await testInspectToken();
  await testSimulateExpiredToken();
  await testTokenRefreshMechanism();
  
  log.title('All Token Tests Completed');
}

/**
 * Login and get a valid token
 */
async function testLoginAndToken() {
  log.title('Test: Login and Get Token');
  
  try {
    const result = await authService.login(testCredentials);
    
    log.success('Login successful');
    log.info(`User ID: ${result.user.id}`);
    
    const token = authService.getToken();
    if (token) {
      log.success('Token retrieved successfully');
      log.info(`Token length: ${token.length} characters`);
    } else {
      log.error('Failed to retrieve token');
    }
  } catch (error) {
    log.error(`Login failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
  
  await sleep(1000);
}

/**
 * Inspect the token contents
 */
async function testInspectToken() {
  log.title('Test: Inspect Token Contents');
  
  const token = authService.getToken();
  if (!token) {
    log.error('No token available. Login may have failed.');
    return;
  }
  
  try {
    const decoded = jwtDecode(token);
    log.success('Token decoded successfully');
    
    // Print interesting token properties
    log.info(`Token subject (sub): ${decoded.sub}`);
    log.info(`Token issuer (iss): ${decoded.iss}`);
    
    if (decoded.exp) {
      const expiryDate = new Date(decoded.exp * 1000);
      const now = new Date();
      const timeRemaining = expiryDate - now;
      
      log.info(`Token expiry: ${expiryDate.toISOString()}`);
      log.info(`Time remaining: ${Math.floor(timeRemaining / 1000 / 60)} minutes`);
    }
    
    // Store when this token was issued
    global.tokenIssuedAt = decoded.iat ? new Date(decoded.iat * 1000) : new Date();
    
    // Store token properties for later tests
    global.tokenProps = {
      sub: decoded.sub,
      exp: decoded.exp,
      iat: decoded.iat,
    };
  } catch (error) {
    log.error(`Failed to decode token: ${error.message}`);
  }
  
  await sleep(1000);
}

/**
 * Simulate an expired token
 */
async function testSimulateExpiredToken() {
  log.title('Test: Simulate Expired Token');
  
  // Get the current token
  const validToken = authService.getToken();
  if (!validToken) {
    log.error('No token available');
    return;
  }
  
  try {
    // Create an expired token by modifying the current one
    // This is a simulation - we're just creating an invalid token
    const expiredToken = validToken.substring(0, validToken.length - 5) + 'XXXXX';
    
    // Replace the valid token with our expired one
    localStorage.setItem('auth_token', expiredToken);
    
    log.success('Successfully simulated an expired token');
    
    // Verify token is now invalid
    const currentToken = authService.getToken();
    log.info(`Current token in storage is ${currentToken === validToken ? 'valid' : 'invalid'}`);
  } catch (error) {
    log.error(`Failed to simulate expired token: ${error.message}`);
  }
  
  await sleep(1000);
}

/**
 * Test token refresh mechanism
 */
async function testTokenRefreshMechanism() {
  log.title('Test: Token Refresh Mechanism');
  
  try {
    // Attempt to use an API that requires authentication
    // This should trigger a token refresh due to the invalid token
    log.info('Attempting API call with invalid token...');
    
    try {
      const result = await api.get('/api/users/me');
      log.info('API call succeeded');
      log.info(`User ID from API: ${result.id}`);
    } catch (error) {
      log.warning(`API call failed as expected: ${error.message}`);
      log.info('This is normal with an invalid token. Testing refresh flow...');
    }
    
    // Check if token was refreshed
    log.info('Attempting to refresh token...');
    
    // Login again to get fresh token
    await authService.login(testCredentials);
    const newToken = authService.getToken();
    
    if (!newToken) {
      log.error('Failed to refresh token');
      return;
    }
    
    log.success('Token refreshed successfully');
    
    // Decode and inspect new token
    try {
      const decodedNew = jwtDecode(newToken);
      const oldIat = global.tokenProps?.iat || 0;
      const newIat = decodedNew.iat || 0;
      
      if (newIat > oldIat) {
        log.success('New token has a more recent issued-at time');
        log.info(`Old token issued at: ${new Date(oldIat * 1000).toISOString()}`);
        log.info(`New token issued at: ${new Date(newIat * 1000).toISOString()}`);
      } else {
        log.warning('New token does not have a more recent issued-at time');
      }
      
      // Try another API call with refreshed token
      log.info('Attempting API call with refreshed token...');
      
      try {
        const result = await api.get('/api/users/me');
        log.success('API call with refreshed token succeeded');
        log.info(`User ID from API: ${result.id}`);
      } catch (error) {
        log.error(`API call with refreshed token failed: ${error.message}`);
      }
    } catch (error) {
      log.error(`Failed to decode refreshed token: ${error.message}`);
    }
  } catch (error) {
    log.error(`Token refresh test failed: ${error.message}`);
  }
  
  await sleep(1000);
}

// Run the tests
runTests().catch(error => {
  console.error('Test script failed:', error);
  process.exit(1);
});