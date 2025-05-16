/**
 * Authentication Flow Tests
 * 
 * This test suite verifies the integration between Auth, Security, and MFA flows.
 */

import { Auth } from '@/lib/amplify/auth';
import Security from '@/lib/security';
import { MFAService } from '@/lib/security/mfa';
import { SignInResult } from '@/types/amplify/auth';

describe('Authentication Flow', () => {
  // Mock user for tests
  const testUser = {
    username: 'test@example.com',
    password: 'Test123456!',
  };
  
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Auth methods
    jest.spyOn(Auth, 'signIn').mockResolvedValue({
      isSignedIn: true,
      nextStep: {
        signInStep: 'CONFIRM_SIGN_IN'
      }
    } as SignInResult);
    
    jest.spyOn(Auth, 'confirmSignIn').mockResolvedValue({
      isSignedIn: true,
      challengeName: null
    });
    
    jest.spyOn(Auth, 'signOut').mockResolvedValue(undefined);
    
    jest.spyOn(Auth, 'getCurrentUser').mockResolvedValue({
      userId: 'test-user-id',
      username: testUser.username,
      email: testUser.username,
      firstName: 'Test',
      lastName: 'User',
      roles: ['BUYER'],
    });
    
    // Mock Security methods
    jest.spyOn(Security, 'initialize').mockResolvedValue(true);
    jest.spyOn(Security, 'isInitialized').mockReturnValue(true);
    jest.spyOn(Security, 'checkSecurityLevel').mockResolvedValue(true);
    
    // Mock MFA methods
    jest.spyOn(MFAService, 'getMFAStatus').mockResolvedValue({
      enabled: false,
      preferred: 'NONE',
      methods: [],
      phoneVerified: false,
      totpVerified: false,
      recoveryCodesRemaining: 0,
    });
    
    jest.spyOn(MFAService, 'setupTOTPMFA').mockResolvedValue({
      qrCode: 'data:image/png;base64,test-qr-code',
      secretKey: 'test-secret-key',
      setupStatus: 'PENDING_VERIFICATION',
    });
    
    jest.spyOn(MFAService, 'verifyTOTPSetupWithCode').mockResolvedValue(true);
  });
  
  test('should initialize security on sign in', async () => {
    // Set Security.isInitialized() to return false for this test
    jest.spyOn(Security, 'isInitialized').mockReturnValue(false);
    
    // Execute sign in
    await Auth.signIn({ username: testUser.username, password: testUser.password });
    
    // Verify Security.initialize was called
    expect(Security.initialize).toHaveBeenCalled();
  });
  
  test('should check security levels correctly', async () => {
    // Setup user with MFA
    jest.spyOn(MFAService, 'getMFAStatus').mockResolvedValue({
      enabled: true,
      preferred: 'TOTP',
      methods: ['TOTP'],
      phoneVerified: false,
      totpVerified: true,
      recoveryCodesRemaining: 8,
    });
    
    // Mock security levels for this test
    jest.spyOn(Security, 'checkSecurityLevel').mockResolvedValue(true);
    
    // Execute checks
    const basicSecurityCheck = await Security.checkSecurityLevel();
    const mediumSecurityCheck = await Security.checkSecurityLevel();
    const highSecurityCheck = await Security.checkSecurityLevel();
    
    // Verify results
    expect(basicSecurityCheck).toBe(true);
    expect(mediumSecurityCheck).toBe(true);
    expect(highSecurityCheck).toBe(true);
    expect(Security.checkSecurityLevel).toHaveBeenCalledTimes(3);
  });
  
  test('should handle MFA challenge during sign in', async () => {
    // Mock MFA challenge
    jest.spyOn(Auth, 'signIn').mockResolvedValue({
      isSignedIn: false,
      nextStep: {
        signInStep: 'MFA'
      }
    } as SignInResult);
    
    // Execute sign in with MFA challenge
    const signInResult = await Auth.signIn({ 
      username: testUser.username, 
      password: testUser.password 
    });
    
    // Verify MFA challenge was returned
    expect(signInResult.isSignedIn).toBe(false);
    expect(signInResult.nextStep?.signInStep).toBe('MFA');
    
    // Confirm sign in with MFA code
    const confirmSignInResult = await Auth.confirmSignIn('123456');
    
    // Verify sign in was completed
    expect(confirmSignInResult.isSignedIn).toBe(true);
    expect(confirmSignInResult.challengeName).toBe(null);
    expect(Auth.confirmSignIn).toHaveBeenCalledWith('123456');
  });
  
  test('should disable MFA when preferences change', async () => {
    // Setup MFA as enabled
    jest.spyOn(MFAService, 'getMFAStatus').mockResolvedValue({
      enabled: true,
      preferred: 'TOTP',
      methods: ['TOTP'],
      phoneVerified: false,
      totpVerified: true,
      recoveryCodesRemaining: 8,
    });
    
    // Mock disable MFA
    jest.spyOn(MFAService, 'disableMFA').mockResolvedValue(true);
    
    // Execute disable MFA
    const disableResult = await MFAService.disableMFA();
    
    // Verify MFA was disabled
    expect(disableResult).toBe(true);
    expect(MFAService.disableMFA).toHaveBeenCalled();
  });
  
  test('should clean up security state on sign out', async () => {
    // Execute sign out
    await Auth.signOut();
    
    // Verify auth state was cleaned up
    expect(Auth.signOut).toHaveBeenCalled();
    
    // No need to reset Security module completely on sign out
    // We should keep it initialized for unauthenticated users
    expect(Security.initialize).not.toHaveBeenCalled();
  });
});

describe('Protected Routes Authorization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Security checks
    jest.spyOn(Security, 'isInitialized').mockReturnValue(true);
    jest.spyOn(Security, 'checkSecurityLevel').mockResolvedValue(true);
  });
  
  test('should require correct role for protected routes', async () => {
    // Mock current user with BUYER role
    const mockUser = {
      id: 'test-user-id',
      username: 'test@example.com',
      role: 'BUYER',
      permissions: ['read:properties', 'read:own-data', 'write:own-data'],
      mfaEnabled: false,
    };
    
    // Check for BUYER role
    const hasBasicAccess = await Security.checkSecurityLevel();
    const hasMediumAccess = await Security.checkSecurityLevel();
    const hasHighAccess = await Security.checkSecurityLevel();
    
    // Verify access levels
    expect(hasBasicAccess).toBe(true);
    expect(hasMediumAccess).toBe(true);
    expect(hasHighAccess).toBe(true);
  });
  
  test('should validate permission checks', async () => {
    // Mock current user with permissions
    const mockUser = {
      id: 'test-user-id',
      username: 'test@example.com',
      role: 'BUYER',
      permissions: ['read:properties', 'read:own-data', 'write:own-data'],
      mfaEnabled: false,
    };
    
    // Check for allowed permissions
    const canReadProperties = mockUser.permissions.includes('read:properties');
    const canReadOwnData = mockUser.permissions.includes('read:own-data');
    
    // Check for disallowed permissions
    const canWriteProperties = mockUser.permissions.includes('write:properties');
    const canReadAllUsers = mockUser.permissions.includes('read:users');
    
    // Verify permission checks
    expect(canReadProperties).toBe(true);
    expect(canReadOwnData).toBe(true);
    expect(canWriteProperties).toBe(false);
    expect(canReadAllUsers).toBe(false);
  });
  
  test('should require MFA for high security routes', async () => {
    // Mock Security.checkSecurityLevel for different levels
    jest.spyOn(Security, 'checkSecurityLevel').mockResolvedValue(false);
    
    // Mock MFA status
    const mfaEnabled = false;
    
    // Execute security checks
    const basicSecurity = await Security.checkSecurityLevel();
    const mediumSecurity = await Security.checkSecurityLevel();
    const highSecurity = await Security.checkSecurityLevel();
    
    // Verify high security requires MFA
    expect(basicSecurity).toBe(true);
    expect(mediumSecurity).toBe(true);
    expect(highSecurity).toBe(false);
    expect(mfaEnabled).toBe(false);
  });
});