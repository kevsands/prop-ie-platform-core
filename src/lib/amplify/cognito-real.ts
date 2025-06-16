'use client';

/**
 * AWS Cognito Real Authentication Module for PROP.ie
 * 
 * This module provides real AWS Cognito authentication for property transactions.
 * Configured for Irish property business requirements.
 */

import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  GetUserCommand,
  AdminInitiateAuthCommand,
  AdminGetUserCommand,
  AdminSetUserPasswordCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  UpdateUserAttributesCommand,
  ChangePasswordCommand
} from '@aws-sdk/client-cognito-identity-provider';

// Types for Irish property business
export interface PropertyBuyerUser {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  ppsNumber?: string; // Irish PPS number for KYC
  userType: 'buyer' | 'developer' | 'agent' | 'solicitor' | 'investor';
  kycStatus: 'not_started' | 'in_progress' | 'approved' | 'rejected';
  roles: string[];
  accessToken?: string;
  refreshToken?: string;
  tokenExpiration?: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface SignInParams {
  username: string;
  password: string;
}

export interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  userType: 'buyer' | 'developer' | 'agent' | 'solicitor' | 'investor';
}

export interface SignInResult {
  isSignedIn: boolean;
  user?: PropertyBuyerUser;
  nextStep?: {
    signInStep: 'CONFIRM_SIGN_UP' | 'CONFIRM_SIGN_IN_WITH_SMS_CODE' | 'CONFIRM_SIGN_IN_WITH_TOTP_CODE' | 'NEW_PASSWORD_REQUIRED';
    codeDeliveryDetails?: {
      destination: string;
      deliveryMedium: 'EMAIL' | 'SMS';
    };
  };
  session?: string;
}

class CognitoAuth {
  private client: CognitoIdentityProviderClient;
  private userPoolId: string;
  private clientId: string;
  private region: string;

  constructor() {
    this.region = process.env.NEXT_PUBLIC_COGNITO_REGION || 'eu-west-1';
    this.userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '';
    this.clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '';

    if (!this.userPoolId || !this.clientId) {
      throw new Error('Missing Cognito configuration. Please set up your environment variables.');
    }

    this.client = new CognitoIdentityProviderClient({
      region: this.region,
    });
  }

  /**
   * Sign in a user for property transactions
   */
  async signIn({ username, password }: SignInParams): Promise<SignInResult> {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      });

      const response = await this.client.send(command);

      if (response.ChallengeName) {
        // Handle MFA or other challenges
        return {
          isSignedIn: false,
          nextStep: {
            signInStep: this.mapChallengeName(response.ChallengeName),
            codeDeliveryDetails: response.ChallengeParameters?.CODE_DELIVERY_DESTINATION_EMAIL ? {
              destination: response.ChallengeParameters.CODE_DELIVERY_DESTINATION_EMAIL,
              deliveryMedium: 'EMAIL' as const,
            } : undefined,
          },
          session: response.Session,
        };
      }

      if (response.AuthenticationResult) {
        const user = await this.getUserFromToken(response.AuthenticationResult.AccessToken!);
        return {
          isSignedIn: true,
          user: {
            ...user,
            accessToken: response.AuthenticationResult.AccessToken,
            refreshToken: response.AuthenticationResult.RefreshToken,
            tokenExpiration: Date.now() + (response.AuthenticationResult.ExpiresIn! * 1000),
          },
        };
      }

      throw new Error('Unexpected response from Cognito');
    } catch (error: any) {
      if (error.name === 'UserNotConfirmedException') {
        return {
          isSignedIn: false,
          nextStep: {
            signInStep: 'CONFIRM_SIGN_UP',
            codeDeliveryDetails: {
              destination: username,
              deliveryMedium: 'EMAIL',
            },
          },
        };
      }
      throw this.handleCognitoError(error);
    }
  }

  /**
   * Sign up a new property buyer/investor
   */
  async signUp({ email, password, firstName, lastName, phoneNumber, userType }: SignUpParams) {
    try {
      const command = new SignUpCommand({
        ClientId: this.clientId,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'given_name', Value: firstName },
          { Name: 'family_name', Value: lastName },
          { Name: 'custom:user_type', Value: userType },
          { Name: 'custom:kyc_status', Value: 'not_started' },
          ...(phoneNumber ? [{ Name: 'phone_number', Value: phoneNumber }] : []),
        ],
      });

      const response = await this.client.send(command);

      return {
        isSignUpComplete: !response.UserSub ? false : true,
        userId: response.UserSub,
        nextStep: {
          signUpStep: 'CONFIRM_SIGN_UP',
          codeDeliveryDetails: {
            destination: email,
            deliveryMedium: 'EMAIL' as const,
          },
        },
      };
    } catch (error: any) {
      throw this.handleCognitoError(error);
    }
  }

  /**
   * Confirm user registration with email verification code
   */
  async confirmSignUp(username: string, confirmationCode: string) {
    try {
      const command = new ConfirmSignUpCommand({
        ClientId: this.clientId,
        Username: username,
        ConfirmationCode: confirmationCode,
      });

      await this.client.send(command);

      return {
        isSignUpComplete: true,
      };
    } catch (error: any) {
      throw this.handleCognitoError(error);
    }
  }

  /**
   * Get current user information from access token
   */
  async getCurrentUser(accessToken?: string): Promise<PropertyBuyerUser | null> {
    try {
      if (!accessToken) {
        // Try to get from localStorage or session
        accessToken = this.getStoredAccessToken();
        if (!accessToken) return null;
      }

      return await this.getUserFromToken(accessToken);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Start password reset flow
   */
  async resetPassword(username: string) {
    try {
      const command = new ForgotPasswordCommand({
        ClientId: this.clientId,
        Username: username,
      });

      const response = await this.client.send(command);

      return {
        nextStep: {
          resetPasswordStep: 'CONFIRM_RESET_PASSWORD',
          codeDeliveryDetails: {
            destination: response.CodeDeliveryDetails?.Destination || username,
            deliveryMedium: response.CodeDeliveryDetails?.DeliveryMedium === 'EMAIL' ? 'EMAIL' as const : 'SMS' as const,
          },
        },
      };
    } catch (error: any) {
      throw this.handleCognitoError(error);
    }
  }

  /**
   * Confirm password reset with verification code
   */
  async confirmResetPassword(username: string, confirmationCode: string, newPassword: string) {
    try {
      const command = new ConfirmForgotPasswordCommand({
        ClientId: this.clientId,
        Username: username,
        ConfirmationCode: confirmationCode,
        Password: newPassword,
      });

      await this.client.send(command);

      return { success: true };
    } catch (error: any) {
      throw this.handleCognitoError(error);
    }
  }

  /**
   * Update KYC status for Irish compliance
   */
  async updateKycStatus(accessToken: string, kycStatus: 'in_progress' | 'approved' | 'rejected') {
    try {
      const command = new UpdateUserAttributesCommand({
        AccessToken: accessToken,
        UserAttributes: [
          { Name: 'custom:kyc_status', Value: kycStatus },
        ],
      });

      await this.client.send(command);
      return { success: true };
    } catch (error: any) {
      throw this.handleCognitoError(error);
    }
  }

  /**
   * Add PPS number for Irish KYC compliance
   */
  async updatePpsNumber(accessToken: string, ppsNumber: string) {
    try {
      const command = new UpdateUserAttributesCommand({
        AccessToken: accessToken,
        UserAttributes: [
          { Name: 'custom:pps_number', Value: ppsNumber },
        ],
      });

      await this.client.send(command);
      return { success: true };
    } catch (error: any) {
      throw this.handleCognitoError(error);
    }
  }

  /**
   * Sign out user
   */
  async signOut() {
    // Clear stored tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cognitoAccessToken');
      localStorage.removeItem('cognitoRefreshToken');
      sessionStorage.clear();
    }
  }

  // Helper methods
  private async getUserFromToken(accessToken: string): Promise<PropertyBuyerUser> {
    const command = new GetUserCommand({
      AccessToken: accessToken,
    });

    const response = await this.client.send(command);

    const attributes = response.UserAttributes || [];
    const getAttr = (name: string) => attributes.find(attr => attr.Name === name)?.Value || '';

    return {
      userId: response.Username || '',
      username: response.Username || '',
      email: getAttr('email'),
      firstName: getAttr('given_name'),
      lastName: getAttr('family_name'),
      phoneNumber: getAttr('phone_number') || undefined,
      ppsNumber: getAttr('custom:pps_number') || undefined,
      userType: (getAttr('custom:user_type') as any) || 'buyer',
      kycStatus: (getAttr('custom:kyc_status') as any) || 'not_started',
      roles: [getAttr('custom:user_type') || 'buyer'],
      isEmailVerified: getAttr('email_verified') === 'true',
      isPhoneVerified: getAttr('phone_number_verified') === 'true',
    };
  }

  private mapChallengeName(challengeName: string): SignInResult['nextStep']['signInStep'] {
    switch (challengeName) {
      case 'SMS_MFA':
        return 'CONFIRM_SIGN_IN_WITH_SMS_CODE';
      case 'SOFTWARE_TOKEN_MFA':
        return 'CONFIRM_SIGN_IN_WITH_TOTP_CODE';
      case 'NEW_PASSWORD_REQUIRED':
        return 'NEW_PASSWORD_REQUIRED';
      default:
        return 'CONFIRM_SIGN_UP';
    }
  }

  private handleCognitoError(error: any): Error {
    const message = error.message || 'Authentication error occurred';
    
    switch (error.name) {
      case 'UserNotFoundException':
        return new Error('User not found. Please check your email and try again.');
      case 'NotAuthorizedException':
        return new Error('Incorrect email or password. Please try again.');
      case 'UserNotConfirmedException':
        return new Error('Please verify your email address before signing in.');
      case 'CodeMismatchException':
        return new Error('Invalid verification code. Please try again.');
      case 'ExpiredCodeException':
        return new Error('Verification code has expired. Please request a new one.');
      case 'LimitExceededException':
        return new Error('Too many attempts. Please try again later.');
      case 'InvalidPasswordException':
        return new Error('Password does not meet requirements. Must be at least 8 characters with uppercase, lowercase, numbers, and special characters.');
      case 'UsernameExistsException':
        return new Error('An account with this email already exists.');
      default:
        return new Error(message);
    }
  }

  private getStoredAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cognitoAccessToken');
    }
    return null;
  }
}

// Export singleton instance
export const cognitoAuth = new CognitoAuth();

// Export for direct use
export { CognitoAuth };