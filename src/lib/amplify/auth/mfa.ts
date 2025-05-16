/**
 * Multi-Factor Authentication Module
 * 
 * This module extends the core authentication functionality with MFA support
 * using AWS Cognito's built-in MFA capabilities.
 */

import { 
  confirmSignIn, 
  setUpTOTP, 
  confirmTOTPSetup,
  getCurrentUser,
  fetchUserAttributes
} from 'aws-amplify/auth';
import { initialize } from '../index';

/**
 * MFA setup response
 */
export interface MFASetupResponse {
  secretCode: string;
  qrCode: string;
}

/**
 * MFA verification challenge types
 */
export enum MFAChallengeType {
  SMS = 'SMS_MFA',
  TOTP = 'SOFTWARE_TOKEN_MFA'
}

/**
 * MFA service for handling multi-factor authentication operations
 */
export class MFAService {
  /**
   * Set up TOTP (Time-based One-Time Password) for a user
   * 
   * @returns Secret code and QR code URL for authenticator apps
   */
  static async setupTOTP(): Promise<MFASetupResponse> {
    initialize();
    try {
      // First make sure the user is signed in
      await getCurrentUser();

      // Set up TOTP for the user
      const totpSetup = await setUpTOTP();
      
      return {
        secretCode: totpSetup.secretKey,
        qrCode: totpSetup.getSetupUri(true) // Get QR code URI
      };
    } catch (error) {
      console.error('Error setting up TOTP:', error);
      throw error;
    }
  }

  /**
   * Verify and confirm TOTP setup with a code from the authenticator app
   * 
   * @param code - Verification code from the authenticator app
   */
  static async verifyTOTP(code: string): Promise<boolean> {
    initialize();
    try {
      await confirmTOTPSetup({ challengeAnswer: code });
      return true;
    } catch (error) {
      console.error('Error verifying TOTP:', error);
      throw error;
    }
  }

  /**
   * Respond to an MFA challenge during sign-in
   * 
   * @param code - Verification code from SMS or authenticator app
   * @param challengeResponse - The challenge response from the initial sign-in
   */
  static async confirmMFACode(code: string, challengeResponse: any): Promise<any> {
    initialize();
    try {
      const result = await confirmSignIn({
        challengeAnswer: code,
        options: {
          // Use the challenge from the sign-in response
          ...challengeResponse
        }
      });
      
      return result;
    } catch (error) {
      console.error('Error confirming MFA code:', error);
      throw error;
    }
  }

  /**
   * Check if MFA is enabled for the current user
   */
  static async isMFAEnabled(): Promise<boolean> {
    initialize();
    try {
      const user = await getCurrentUser();
      if (!user) return false;
      
      // Get user attributes to check MFA settings
      const attributes = await fetchUserAttributes();
      
      // Check if MFA is enabled based on the attributes
      // The exact attribute name may vary depending on your Cognito setup
      return attributes['custom:mfa_enabled'] === 'true' || 
             attributes['phone_number_verified'] === 'true' || 
             !!attributes['preferred_mfa_setting'];
    } catch (error) {
      console.error('Error checking MFA status:', error);
      return false;
    }
  }

  /**
   * Get the preferred MFA type for the current user
   */
  static async getPreferredMFAType(): Promise<MFAChallengeType | null> {
    initialize();
    try {
      const user = await getCurrentUser();
      if (!user) return null;
      
      const attributes = await fetchUserAttributes();
      
      // Check preferred MFA type
      const preferredMFA = attributes['preferred_mfa_setting'];
      
      if (preferredMFA === 'SMS_MFA') {
        return MFAChallengeType.SMS;
      } else if (preferredMFA === 'SOFTWARE_TOKEN_MFA') {
        return MFAChallengeType.TOTP;
      }
      
      // Default to null if no preference is set
      return null;
    } catch (error) {
      console.error('Error getting preferred MFA type:', error);
      return null;
    }
  }
}