#!/usr/bin/env node

/**
 * Test Authentication Flow Script
 * 
 * This script tests the authentication flow including login, registration, token handling,
 * and permission checking. Run it with Node.js in a development environment.
 * 
 * Usage:
 *   node scripts/test-auth.js
 */

// Mock browser environment for localStorage
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
      hostname: 'localhost'
    }
  };
  global.localStorage = global.window.localStorage;
  global.document = { referrer: '' };
  global.navigator = { userAgent: 'node-test' };
}

// Configure AWS Amplify in test mode
process.env.NODE_ENV = 'development';
process.env.NEXT_PUBLIC_ENVIRONMENT = 'local';

// Import necessary modules
let auth;
let authService;
let authLogger;
let api;

const testUsers = {
  valid: {
    email: 'test@example.com',
    password: 'Password123!'
  },
  invalid: {
    email: 'nonexistent@example.com',
    password: 'wrongpassword'
  },
  new: {
    email: `test-${Date.now()}@example.com`,
    password: 'NewUser123!',
    name: 'Test User',
    role: 'buyer'
  }
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
 * Run the authentication tests
 */
async function runTests() {
  log.title('Authentication Service Test Script');
  
  // Bootstrap tests
  try {
    log.info('Loading modules...');
    
    // Dynamically import ES modules
    const authModule = await import('../src/lib/auth.js');
    const apiModule = await import('../src/lib/api-client.js');
    const loggerModule = await import('../src/lib/security/authLogger.js');
    
    auth = authModule.default;
    authService = authModule.authService;
    authLogger = loggerModule.default;
    api = apiModule.api;
    
    log.success('Modules loaded successfully');
  } catch (error) {
    log.error(`Failed to load modules: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
  
  // Configure logger for testing
  authLogger.configureAuthLogger({
    enableConsoleLogging: true,
    enableServerReporting: false,
    logLevel: 'debug',
  });
  
  // Run test cases
  await testLoginInvalidCredentials();
  await testLoginValidCredentials();
  await testTokenRetrieval();
  await testLogout();
  await testUserRegistration();
  
  log.title('All Tests Completed');
}

/**
 * Test login with invalid credentials
 */
async function testLoginInvalidCredentials() {
  log.title('Test: Login with Invalid Credentials');
  
  try {
    await authService.login({
      email: testUsers.invalid.email,
      password: testUsers.invalid.password
    });
    
    log.error('Test failed: Login with invalid credentials succeeded unexpectedly');
  } catch (error) {
    log.success('Login correctly failed with invalid credentials');
    log.info(`Error message: ${error.message}`);
  }
  
  await sleep(1000);
}

/**
 * Test login with valid credentials
 */
async function testLoginValidCredentials() {
  log.title('Test: Login with Valid Credentials');
  
  try {
    const result = await authService.login({
      email: testUsers.valid.email,
      password: testUsers.valid.password
    });
    
    log.success('Login successful');
    log.info(`User ID: ${result.user.id}`);
    log.info(`User Role: ${result.user.role}`);
    log.info(`Token received: ${result.token ? 'Yes' : 'No'}`);
    
    // Test getCurrentUser
    const currentUser = await authService.getCurrentUser();
    if (currentUser) {
      log.success('getCurrentUser returned the logged-in user');
    } else {
      log.error('getCurrentUser failed to return the user');
    }
    
    // Test isAuthenticated
    const isAuthenticated = authService.isAuthenticated();
    if (isAuthenticated) {
      log.success('isAuthenticated correctly returned true');
    } else {
      log.error('isAuthenticated incorrectly returned false');
    }
  } catch (error) {
    log.error(`Login failed: ${error.message}`);
    console.error(error);
  }
  
  await sleep(1000);
}

/**
 * Test token retrieval and storage
 */
async function testTokenRetrieval() {
  log.title('Test: Token Retrieval and Storage');
  
  const token = authService.getToken();
  if (token) {
    log.success('Token successfully retrieved from storage');
    log.info(`Token length: ${token.length} characters`);
  } else {
    log.error('Failed to retrieve token from storage');
  }
  
  await sleep(1000);
}

/**
 * Test logout functionality
 */
async function testLogout() {
  log.title('Test: Logout Functionality');
  
  try {
    await authService.logout();
    log.success('Logout completed successfully');
    
    const isAuthenticated = authService.isAuthenticated();
    if (!isAuthenticated) {
      log.success('isAuthenticated correctly returned false after logout');
    } else {
      log.error('isAuthenticated incorrectly returned true after logout');
    }
    
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) {
      log.success('getCurrentUser correctly returned null after logout');
    } else {
      log.error('getCurrentUser incorrectly returned a user after logout');
    }
  } catch (error) {
    log.error(`Logout failed: ${error.message}`);
  }
  
  await sleep(1000);
}

/**
 * Test user registration
 */
async function testUserRegistration() {
  log.title('Test: User Registration');
  
  try {
    log.info(`Attempting to register user: ${testUsers.new.email}`);
    
    const result = await authService.register({
      email: testUsers.new.email,
      password: testUsers.new.password,
      name: testUsers.new.name,
      role: testUsers.new.role
    });
    
    if (result.isNewUser) {
      log.success('Registration successful - user needs confirmation');
      log.info(`User email: ${result.user.email}`);
    } else {
      log.success('Registration and auto sign-in successful');
      log.info(`User ID: ${result.user.id}`);
      log.info(`User email: ${result.user.email}`);
      log.info(`User role: ${result.user.role}`);
    }
  } catch (error) {
    // This might fail if using real Cognito which requires email verification
    log.warning(`Registration test: ${error.message}`);
    log.info('Note: Registration might fail in test environment with real Cognito');
  }
  
  await sleep(1000);
}

// Run the tests
runTests().catch(error => {
  console.error('Test script failed:', error);
  process.exit(1);
});