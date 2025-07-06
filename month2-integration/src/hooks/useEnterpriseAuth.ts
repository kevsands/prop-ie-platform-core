import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, signUp, getCurrentUser, confirmSignUp } from 'aws-amplify/auth';
import { z } from 'zod';

// Comprehensive user types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  status: AccountStatus;
  security: SecuritySettings;
  compliance: ComplianceStatus;
  metadata: UserMetadata;
}

type UserRole = 'BUYER' | 'SELLER' | 'DEVELOPER' | 'AGENT' | 'SOLICITOR' | 'INVESTOR' | 'ADMIN';
type AccountStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'LOCKED';

interface Permission {
  resource: string;
  actions: string[];
  constraints?: Record<string, any>;
}

interface SecuritySettings {
  mfaEnabled: boolean;
  mfaMethod?: 'SMS' | 'TOTP' | 'EMAIL';
  biometricEnabled: boolean;
  passwordStrength: number;
  lastPasswordChange: Date;
  sessionTimeout: number;
  trustedDevices: string[];
  loginNotifications: boolean;
}

interface ComplianceStatus {
  kycStatus: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED';
  kycCompletedAt?: Date;
  amlStatus: 'CLEAR' | 'REVIEW' | 'FLAGGED';
  documentsVerified: boolean;
  riskScore: number;
  pepStatus: boolean;
  sanctionsChecked: boolean;
  lastCheckDate?: Date;
}

interface UserMetadata {
  createdAt: Date;
  lastLogin?: Date;
  loginCount: number;
  lastActivity?: Date;
  deviceInfo?: DeviceInfo;
  location?: LocationInfo;
  preferences: UserPreferences;
}

interface DeviceInfo {
  deviceId: string;
  userAgent: string;
  platform: string;
  browser: string;
  version: string;
  isTrusted: boolean;
  lastSeen: Date;
}

interface LocationInfo {
  ipAddress: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface UserPreferences {
  language: string;
  currency: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  theme: 'light' | 'dark' | 'system';
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  marketing: boolean;
  security: boolean;
  transactions: boolean;
}

interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
  marketing: boolean;
  publicProfile: boolean;
}

// Authentication options
interface AuthOptions {
  rememberMe?: boolean;
  deviceTrust?: boolean;
  mfaRequired?: boolean;
  elevatedSecurity?: boolean;
}

// Authentication context
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  authStep: AuthStep;
  sessionExpiry?: Date;
  securityLevel: SecurityLevel;
  requiresAction?: RequiredAction;
}

type AuthStep = 'IDLE' | 'CHECKING_USER' | 'CREDENTIALS' | 'MFA' | 'BIOMETRIC' | 'COMPLETE';
type SecurityLevel = 'BASIC' | 'ELEVATED' | 'MAXIMUM';
type RequiredAction = 'VERIFY_EMAIL' | 'SETUP_MFA' | 'UPDATE_PASSWORD' | 'COMPLETE_KYC' | 'ACCEPT_TERMS';

export function useEnterpriseAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    authStep: 'IDLE',
    securityLevel: 'BASIC',
  });

  // Initialize authentication state
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Monitor session expiry
  useEffect(() => {
    if (!authState.sessionExpiry) return;

    const checkExpiry = setInterval(() => {
      if (new Date() > authState.sessionExpiry!) {
        handleSessionExpiry();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkExpiry);
  }, [authState.sessionExpiry]);

  const checkAuthStatus = async () => {
    try {
      const cognitoUser = await getCurrentUser();
      const userProfile = await fetchUserProfile(cognitoUser.username);
      
      setAuthState({
        user: userProfile,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        authStep: 'COMPLETE',
        securityLevel: determineSecurityLevel(userProfile),
        sessionExpiry: calculateSessionExpiry(userProfile),
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: false,
      }));
    }
  };

  const authenticateUser = async (
    email: string,
    password: string,
    options: AuthOptions = {}
  ) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Check user status first
      const userCheck = await checkUser(email);
      
      if (!userCheck.exists) {
        throw new Error('User not found');
      }

      if (userCheck.requiresEnhancedAuth) {
        setAuthState(prev => ({
          ...prev,
          authStep: 'CREDENTIALS',
          securityLevel: 'ELEVATED',
        }));
      }

      // Attempt sign in
      const signInResult = await signIn({
        username: email,
        password,
        options: {
          authFlowType: 'USER_PASSWORD_AUTH',
        },
      });

      // Handle MFA requirement
      if (signInResult.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_MFA_CODE') {
        setAuthState(prev => ({
          ...prev,
          authStep: 'MFA',
          isLoading: false,
        }));
        return { requiresMFA: true };
      }

      // Handle new password requirement
      if (signInResult.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setAuthState(prev => ({
          ...prev,
          requiresAction: 'UPDATE_PASSWORD',
          isLoading: false,
        }));
        return { requiresNewPassword: true };
      }

      // Success - fetch full user profile
      const userProfile = await fetchUserProfile(signInResult.userId!);
      
      // Check compliance status
      if (!isCompliant(userProfile)) {
        setAuthState(prev => ({
          ...prev,
          requiresAction: 'COMPLETE_KYC',
          user: userProfile,
        }));
        return { requiresCompliance: true };
      }

      // Set authenticated state
      setAuthState({
        user: userProfile,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        authStep: 'COMPLETE',
        securityLevel: determineSecurityLevel(userProfile),
        sessionExpiry: calculateSessionExpiry(userProfile),
      });

      // Log activity
      await logAuthActivity('LOGIN_SUCCESS', {
        userId: userProfile.id,
        method: 'password',
        deviceTrust: options.deviceTrust,
      });

      // Navigate to appropriate dashboard
      navigateToDashboard(userProfile.role);

      return { success: true, user: userProfile };
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));

      // Log failed attempt
      await logAuthActivity('LOGIN_FAILED', {
        email,
        error: error.message,
      });

      return { success: false, error: error.message };
    }
  };

  const confirmMFA = async (code: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const result = await confirmSignIn({ challengeResponse: code });
      
      if (result.isSignedIn) {
        await checkAuthStatus();
        return { success: true };
      }

      return { success: false, error: 'Invalid code' };
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  };

  const registerUser = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phoneNumber?: string;
    acceptedTerms: boolean;
    marketingConsent?: boolean;
  }) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Validate input
      const validation = validateRegistration(userData);
      if (!validation.success) {
        throw new Error(validation.error);
      }

      // Create Cognito user
      const { userId, isSignUpComplete, nextStep } = await signUp({
        username: userData.email,
        password: userData.password,
        options: {
          userAttributes: {
            email: userData.email,
            given_name: userData.firstName,
            family_name: userData.lastName,
            phone_number: userData.phoneNumber,
            'custom:role': userData.role,
            'custom:accepted_terms': userData.acceptedTerms.toString(),
            'custom:marketing_consent': userData.marketingConsent?.toString() || 'false',
          },
        },
      });

      // Create user profile in database
      await createUserProfile({
        id: userId!,
        ...userData,
        status: 'PENDING',
        compliance: {
          kycStatus: 'PENDING',
          amlStatus: 'CLEAR',
          documentsVerified: false,
          riskScore: 0,
          pepStatus: false,
          sanctionsChecked: false,
        },
        security: {
          mfaEnabled: false,
          biometricEnabled: false,
          passwordStrength: calculatePasswordStrength(userData.password),
          lastPasswordChange: new Date(),
          sessionTimeout: 1800, // 30 minutes
          trustedDevices: [],
          loginNotifications: true,
        },
        metadata: {
          createdAt: new Date(),
          loginCount: 0,
          preferences: {
            language: 'en',
            currency: 'EUR',
            theme: 'light',
            notifications: {
              email: true,
              sms: false,
              push: false,
              inApp: true,
              marketing: userData.marketingConsent || false,
              security: true,
              transactions: true,
            },
            privacy: {
              dataSharing: false,
              analytics: true,
              marketing: userData.marketingConsent || false,
              publicProfile: false,
            },
          },
        },
      });

      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setAuthState(prev => ({
          ...prev,
          requiresAction: 'VERIFY_EMAIL',
          isLoading: false,
        }));
        return { success: true, requiresVerification: true };
      }

      return { success: true, userId };
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  };

  const confirmRegistration = async (email: string, code: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      await confirmSignUp({ username: email, confirmationCode: code });
      
      // Auto sign in after confirmation
      await authenticateUser(email, ''); // Password will be prompted
      
      return { success: true };
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      return { success: false, error: error.message };
    }
  };

  const logoutUser = async () => {
    try {
      await signOut();
      
      // Log activity
      if (authState.user) {
        await logAuthActivity('LOGOUT', { userId: authState.user.id });
      }
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        authStep: 'IDLE',
        securityLevel: 'BASIC',
      });
      
      router.push('/');
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  const elevateSecurityLevel = async (level: SecurityLevel) => {
    if (level === authState.securityLevel) return;

    setAuthState(prev => ({
      ...prev,
      securityLevel: level,
      sessionExpiry: calculateSessionExpiry(prev.user!, level),
    }));

    // May require re-authentication
    if (level === 'MAXIMUM') {
      router.push('/auth/step-up');
    }
  };

  const hasPermission = (permission: string) => {
    if (!authState.user) return false;
    return authState.user.permissions.some(p => 
      p.resource === permission || p.actions.includes(permission)
    );
  };

  const hasRole = (role: UserRole | UserRole[]) => {
    if (!authState.user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(authState.user.role);
  };

  const isCompliant = (user: User) => {
    const { compliance } = user;
    return compliance.kycStatus === 'APPROVED' && 
           compliance.amlStatus === 'CLEAR' &&
           compliance.documentsVerified;
  };

  // Helper functions
  const checkUser = async (email: string) => {
    const response = await fetch('/api/auth/check-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return response.json();
  };

  const fetchUserProfile = async (userId: string): Promise<User> => {
    const response = await fetch(`/api/users/${userId}/profile`);
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return response.json();
  };

  const createUserProfile = async (userData: any) => {
    const response = await fetch('/api/users/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create user profile');
    return response.json();
  };

  const logAuthActivity = async (action: string, details: any) => {
    try {
      await fetch('/api/auth/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          details,
          timestamp: new Date().toISOString(),
          deviceInfo: getDeviceInfo(),
        }),
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  const getDeviceInfo = () => ({
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password)) strength += 12.5;
    if (/[A-Z]/.test(password)) strength += 12.5;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[^A-Za-z0-9]/.test(password)) strength += 12.5;
    return strength;
  };

  const determineSecurityLevel = (user: User): SecurityLevel => {
    if (user.role === 'ADMIN' || user.role === 'DEVELOPER') return 'MAXIMUM';
    if (user.role === 'SOLICITOR' || user.compliance.riskScore > 50) return 'ELEVATED';
    return 'BASIC';
  };

  const calculateSessionExpiry = (user: User, level?: SecurityLevel): Date => {
    const baseTimeout = user.security.sessionTimeout || 1800; // 30 minutes default
    const actualLevel = level || authState.securityLevel;
    
    const multipliers = {
      BASIC: 1,
      ELEVATED: 0.5,
      MAXIMUM: 0.25,
    };
    
    const timeout = baseTimeout * multipliers[actualLevel];
    return new Date(Date.now() + timeout * 1000);
  };

  const handleSessionExpiry = async () => {
    await logAuthActivity('SESSION_EXPIRED', { userId: authState.user?.id });
    await logoutUser();
  };

  const navigateToDashboard = (role: UserRole) => {
    const dashboards: Record<UserRole, string> = {
      BUYER: '/buyer/dashboard',
      SELLER: '/seller/dashboard',
      DEVELOPER: '/developer/dashboard',
      AGENT: '/agent/dashboard',
      SOLICITOR: '/solicitor/dashboard',
      INVESTOR: '/investor/dashboard',
      ADMIN: '/admin/dashboard',
    };
    
    router.push(dashboards[role] || '/dashboard');
  };

  const validateRegistration = (userData: any) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/),
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      role: z.enum(['BUYER', 'SELLER', 'DEVELOPER', 'AGENT', 'SOLICITOR', 'INVESTOR']),
      acceptedTerms: z.boolean().refine(val => val === true),
    });

    try {
      schema.parse(userData);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    ...authState,
    authenticateUser,
    registerUser,
    confirmRegistration,
    confirmMFA,
    logoutUser,
    elevateSecurityLevel,
    hasPermission,
    hasRole,
    isCompliant,
    refreshSession: checkAuthStatus,
  };
}