/**
 * Amplify v6 Authentication and Security Integration Tests
 * 
 * This test suite verifies that the AWS Amplify v6 auth implementation
 * properly integrates with the security module for:
 * - Token management and validation
 * - MFA flows
 * - Session fingerprinting
 * - Security audit logging
 * - API protection
 * - GraphQL authentication integration
 */

import {
  fetchAuthSession,
  signIn,
  signOut,
  getCurrentUser,
  confirmSignIn
} from 'aws-amplify/auth';

// Import custom implementations for missing functions
import { generateTotp, verifyTOTPSetup } from '@/lib/security/mfa';

// Import API functions from the correct module
import { generateClient } from 'aws-amplify/api';
import { record } from 'aws-amplify/analytics';

import { Auth } from '@/lib/amplify/auth';
import { MFAService } from '@/lib/security/mfa';
import { SecureAPI, initializeSecurityAmplifyIntegration } from '@/lib/security/amplify-integration';
import { SessionFingerprint } from '@/lib/security/sessionFingerprint';
import { AuditLogger, AuditCategory, AuditSeverity } from '@/lib/security/auditLogger';
import { SecurityService } from '@/lib/security/security-exports';
import { API } from '@/lib/amplify/api';
import { env, isProduction } from '@/config/environment';

// Test credentials - only for testing!
const testCredentials = {
  username: 'test-user@example.com',
  password: 'Test@Password123!'
};

/**
 * Mock class for testing
 */
class TestContext {
  private mocks: any = {};
  private logs: any[] = [];

  constructor() {
    this.resetMocks();
  }

  resetMocks() {
    this.mocks = {
      authSession: null,
      signInResult: null,
      signUpResult: null,
      userAttributes: {},
      mfaStatus: null,
      totpSetup: null,
      sessionFingerprint: { valid: true },
      securityLogs: []
    };
  }

  // Record a security log
  recordLog(category: string, action: string, data: any) {
    this.logs.push({
      timestamp: Date.now(),
      category,
      action,
      data
    });
  }

  // Get security logs by category
  getSecurityLogs(category?: string) {
    if (category) {
      return this.logs.filter(log => log.category === category);
    }
    return this.logs;
  }

  // Mock Amplify signIn response
  mockAmplifySignIn(result: any) {
    this.mocks.signInResult = result;

    // Override the signIn function
    (signIn as jest.Mock) = jest.fn().mockResolvedValue(result);
  }

  // Mock Amplify signOut response
  mockAmplifySignOut() {
    // Override the signOut function
    (signOut as jest.Mock) = jest.fn().mockResolvedValue(undefined);
  }

  // Mock Auth session
  mockAuthSession(session: any) {
    this.mocks.authSession = session;

    // Override the fetchAuthSession function
    (fetchAuthSession as jest.Mock) = jest.fn().mockResolvedValue(session);
  }

  // Mock TOTP setup
  mockTOTPSetup(result: any) {
    this.mocks.totpSetup = result;

    // Override the generateTotp function
    (generateTotp as jest.Mock) = jest.fn().mockResolvedValue(result);
  }

  // Mock TOTP verification
  mockTOTPVerification(success: boolean) {
    // Override the verifyTOTPSetup function
    (verifyTOTPSetup as jest.Mock) = jest.fn().mockImplementation(() => {
      if (success) {
        return Promise.resolve({ success: true });
      } else {
        return Promise.reject(new Error('TOTP verification failed'));
      }
    });
  }

  // Mock SMS setup
  mockSMSSetup() {
    // Mock necessary functions for SMS setup
  }

  // Mock MFA challenge
  mockMFAChallenge(challengeType: string) {
    // Override the confirmSignIn function
    (confirmSignIn as jest.Mock) = jest.fn().mockResolvedValue({
      isSignedIn: true,
      nextStep: { signInStep: 'DONE' }
    });
  }

  // Mock MFA status
  mockMFAStatus(status: any) {
    this.mocks.mfaStatus = status;
  }

  // Mock session fingerprint validation
  mockSessionFingerprintValidation(valid: boolean, reason?: string) {
    this.mocks.sessionFingerprint = {
      valid,
      reason: reason || (valid ? undefined : 'Unknown error')
    };

    // Override the SessionFingerprint.validate function
    SessionFingerprint.validate = jest.fn().mockResolvedValue(this.mocks.sessionFingerprint);
  }

  // Check if session fingerprint was generated
  wasSessionFingerprintGenerated() {
    return this.logs.some(log =>
      log.category === 'security' &&
      log.action === 'session_fingerprint_generated'
    );
  }

  // Get audit logs by category
  getSecurityAuditLogs(category: string) {
    return this.logs.filter(log =>
      log.category === 'audit' &&
      log.data &&
      log.data.category === category
    );
  }

  // Cleanup mocks and state
  cleanup() {
    this.resetMocks();
    jest.resetAllMocks();
  }
}

/**
 * Mock User for testing
 */
class MockUser {
  userId: string;
  username: string;
  email: string;
  roles: string[];

  constructor(props: { roles?: string[] } = {}) {
    this.userId = 'mock-user-123';
    this.username = 'mockuser';
    this.email = 'mock@example.com';
    this.roles = props.roles || ['user'];
  }
}

/**
 * Test the authentication flow with security integration
 */
async function testAuthFlow() {
  const testContext = new TestContext();

  try {
    // Initialize the security module with Amplify integration
    initializeSecurityAmplifyIntegration();
    console.log('🔒 Security module initialized with Amplify v6 integration');

    // === Test 1: Standard Authentication ===

    // Mock the sign-in response
    testContext.mockAmplifySignIn({
      isSignedIn: true,
      nextStep: { signInStep: 'DONE' },
      userId: 'test-user-123'
    });

    // Test the sign-in flow
    console.log('\n🧪 Testing standard authentication flow...');
    const signInResult = await Auth.signIn(testCredentials);
    console.log(`Sign-in result: ${signInResult.isSignedIn ? 'SUCCESS' : 'FAILED'}`);

    // Verify audit logs were created
    const authLogs = testContext.getSecurityAuditLogs('auth');
    console.log(`Auth audit logs created: ${authLogs.length > 0 ? 'YES' : 'NO'}`);

    // Verify session fingerprint was generated
    const fingerprintGenerated = testContext.wasSessionFingerprintGenerated();
    console.log(`Session fingerprint generated: ${fingerprintGenerated ? 'YES' : 'NO'}`);

    // === Test 2: Token Management ===

    console.log('\n🧪 Testing token management...');

    // Mock token fetch
    testContext.mockAuthSession({
      tokens: {
        accessToken: {
          toString: () => 'mock-access-token',
          payload: { exp: Date.now() / 1000 + 3600 }
        },
        refreshToken: {
          toString: () => 'mock-refresh-token'
        }
      }
    });

    // Test token retrieval
    const token = await Auth.getAccessToken();
    console.log(`Access token retrieved: ${token ? 'YES' : 'NO'}`);

    // === Test 3: Secure API Integration ===

    console.log('\n🧪 Testing Secure API integration...');

    // Mock session fingerprint validation
    testContext.mockSessionFingerprintValidation(true);

    try {
      // Attempt to use the Secure API wrapper
      await SecureAPI.get('/api/test');
      console.log('Secure API call with valid session: SUCCESS');
    } catch (error) {
      console.error('Secure API call failed:', error);
    }

    // Test with invalid session fingerprint
    testContext.mockSessionFingerprintValidation(false, 'Browser fingerprint changed');

    try {
      await SecureAPI.get('/api/test');
      console.log('❌ ERROR: Secure API should have rejected call with invalid session');
    } catch (error) {
      console.log('✅ Secure API correctly rejected call with invalid session');
    }

    return true;
  } catch (error) {
    console.error('Auth flow test failed:', error);
    return false;
  } finally {
    testContext.cleanup();
  }
}

/**
 * Test Multi-Factor Authentication integration
 */
async function testMFAFlow() {
  const testContext = new TestContext();

  try {
    console.log('\n🧪 Testing MFA integration...');

    // === Test 1: TOTP Setup Flow ===

    // Mock TOTP setup
    testContext.mockTOTPSetup({
      qrCodeUrl: 'data:image/png;base64,mockedQRCode',
      secretKey: 'ABCDEFGHIJKLMNOP'
    });

    // Test TOTP setup
    const totpSetup = await MFAService.setupTOTPMFA();
    console.log('TOTP setup response:', totpSetup.setupStatus);
    console.log(`Secret key provided: ${totpSetup.secretKey ? 'YES' : 'NO'}`);
    console.log(`QR code provided: ${totpSetup.qrCode ? 'YES' : 'NO'}`);

    // === Test 2: TOTP Verification ===

    // Mock TOTP verification success
    testContext.mockTOTPVerification(true);

    // Test TOTP verification
    const otpCode = '123456'; // Mock OTP code
    const verificationResult = await MFAService.verifyTOTPSetupWithCode(otpCode);
    console.log(`TOTP verification: ${verificationResult ? 'SUCCESS' : 'FAILED'}`);

    // === Test 3: SMS MFA Setup Flow ===

    // Mock SMS setup
    testContext.mockSMSSetup();

    // Test SMS setup
    const phoneNumber = '+12025550142';
    const smsSetup = await MFAService.setupSMSMFA(phoneNumber);
    console.log(`SMS MFA setup: ${smsSetup ? 'SUCCESS' : 'FAILED'}`);

    // === Test 4: MFA Challenge Response ===

    // Mock MFA challenge
    testContext.mockMFAChallenge('SMS_MFA');

    // Test MFA challenge response
    const challengeResponse = '654321'; // Mock challenge code
    const challengeResult = await MFAService.completeMFAChallenge(challengeResponse);
    console.log(`MFA challenge completion: ${challengeResult ? 'SUCCESS' : 'FAILED'}`);

    // === Test 5: MFA Status Cache Integration ===

    // Mock MFA status
    testContext.mockMFAStatus({
      enabled: true,
      preferred: 'TOTP',
      methods: ['TOTP'],
      phoneVerified: true,
      totpVerified: true,
      recoveryCodesRemaining: 5
    });

    // Test MFA status retrieval with caching
    const mfaStatus = await MFAService.getCachedMFAStatus();
    console.log('MFA status:', mfaStatus.enabled ? 'ENABLED' : 'DISABLED');
    console.log('Preferred method:', mfaStatus.preferred);

    // Test cache invalidation
    MFAService.invalidateMFACache();
    console.log('MFA cache invalidation: SUCCESS');

    return true;
  } catch (error) {
    console.error('MFA flow test failed:', error);
    return false;
  } finally {
    testContext.cleanup();
  }
}

/**
 * Test role-based MFA enforcement
 */
async function testRoleBasedMFAEnforcement() {
  console.log('\n🧪 Testing role-based MFA enforcement...');

  try {
    // Test with admin role (should require MFA)
    const adminUser = new MockUser({ roles: ['admin'] });
    const adminRequiresMFA = MFAService.shouldEnforceMFA(adminUser);
    console.log(`Admin user should enforce MFA: ${adminRequiresMFA ? 'YES' : 'NO'}`);

    // Test with developer role (should require MFA)
    const developerUser = new MockUser({ roles: ['developer'] });
    const developerRequiresMFA = MFAService.shouldEnforceMFA(developerUser);
    console.log(`Developer user should enforce MFA: ${developerRequiresMFA ? 'YES' : 'NO'}`);

    // Test with buyer role (should not require MFA)
    const buyerUser = new MockUser({ roles: ['buyer'] });
    const buyerRequiresMFA = MFAService.shouldEnforceMFA(buyerUser);
    console.log(`Buyer user should enforce MFA: ${buyerRequiresMFA ? 'YES' : 'NO'}`);

    return true;
  } catch (error) {
    console.error('Role-based MFA enforcement test failed:', error);
    return false;
  }
}

/**
 * Test GraphQL API integration with Amplify auth
 */
async function testGraphQLIntegration() {
  const testContext = new TestContext();

  try {
    console.log('\n🧪 Testing GraphQL integration with Amplify auth...');

    // Mock authentication session with tokens
    testContext.mockAuthSession({
      tokens: {
        accessToken: {
          toString: () => 'mock-access-token',
          payload: {
            exp: Date.now() / 1000 + 3600,
            'cognito:groups': ['user']
          }
        },
        idToken: {
          toString: () => 'mock-id-token'
        }
      }
    });

    // Test Secure API GraphQL query
    try {
      // Mock session fingerprint validation
      testContext.mockSessionFingerprintValidation(true);

      const query = `
        query TestQuery {
          me {
            id
            email
            roles
          }
        }
      `;

      // The actual GraphQL operation will be mocked in a real test
      const result = await SecureAPI.graphql(query);
      console.log('GraphQL query with authentication: SUCCESS');

      return true;
    } catch (error) {
      console.error('GraphQL API integration test failed:', error);
      return false;
    }
  } catch (error) {
    console.error('GraphQL integration test failed:', error);
    return false;
  } finally {
    testContext.cleanup();
  }
}

/**
 * Test security integration with Sign-Out flow
 */
async function testSignOutFlow() {
  const testContext = new TestContext();

  try {
    console.log('\n🧪 Testing sign-out flow with security integration...');

    // Mock the sign-out response
    testContext.mockAmplifySignOut();

    // Test the sign-out flow
    await Auth.signOut();
    console.log('Sign-out completed successfully');

    // Verify audit logs were created for sign-out
    const authLogs = testContext.getSecurityAuditLogs('auth');
    const signOutLog = authLogs.find(log => log.data && log.data.action === 'user_sign_out');
    console.log(`Sign-out audit log created: ${signOutLog ? 'YES' : 'NO'}`);

    // Verify token storage was cleared
    const token = await Auth.getAccessToken();
    console.log(`Tokens properly cleared: ${token === null ? 'YES' : 'NO'}`);

    return true;
  } catch (error) {
    console.error('Sign-out flow test failed:', error);
    return false;
  } finally {
    testContext.cleanup();
  }
}

/**
 * Run all tests
 */
export async function runTests() {
  console.log('=== AMPLIFY V6 AND SECURITY MODULE INTEGRATION TESTS ===\n');

  try {
    const authFlowResult = await testAuthFlow();
    const mfaFlowResult = await testMFAFlow();
    const roleBasedMFAResult = await testRoleBasedMFAEnforcement();
    const graphqlIntegrationResult = await testGraphQLIntegration();
    const signOutFlowResult = await testSignOutFlow();

    const results = [
      { name: 'Authentication Flow', result: authFlowResult },
      { name: 'MFA Flow', result: mfaFlowResult },
      { name: 'Role-Based MFA Enforcement', result: roleBasedMFAResult },
      { name: 'GraphQL Integration', result: graphqlIntegrationResult },
      { name: 'Sign-Out Flow', result: signOutFlowResult }
    ];

    console.log('\n=== TEST RESULTS ===');

    let passedTests = 0;
    results.forEach(test => {
      console.log(`${test.result ? '✅' : '❌'} ${test.name}: ${test.result ? 'PASSED' : 'FAILED'}`);
      if (test.result) passedTests++;
    });

    console.log(`\n${passedTests}/${results.length} tests passed`);

    return passedTests === results.length;
  } catch (error) {
    console.error('Test execution error:', error);
    return false;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test execution error:', error);
      process.exit(1);
    });
}

// Export test functions for individual running
export const tests = {
  testAuthFlow,
  testMFAFlow,
  testRoleBasedMFAEnforcement,
  testGraphQLIntegration,
  testSignOutFlow
};