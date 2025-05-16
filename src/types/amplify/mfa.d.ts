/**
 * Type definitions for AWS Amplify v6 MFA
 * 
 * These type definitions provide proper TypeScript support for AWS Amplify v6+ MFA module.
 */

// MFA module from AWS Amplify v6
declare module '@aws-amplify/auth/mfa' {
  // MFA types
  export type MFAType = 'SMS' | 'TOTP' | 'NOMFA';
  
  export interface MFAPreference {
    enabled: MFAType[];
    preferred?: MFAType;
  }
  
  export interface SetupTOTPResult {
    getSetupUri: () => string;
    secretKey: string;
  }
  
  // MFA options interfaces
  export interface SetPreferredMFAOptions {
    mfaType: MFAType;
  }
  
  export interface UpdateMFAPreferenceInput {
    enabled: MFAType[];
    preferred?: MFAType;
  }
  
  export interface SetupTOTPInput {
    secretKey: string;
  }
  
  export interface ConfirmTOTPInput {
    code: string;
  }
  
  export interface GenerateTOTPSecretKeyOutput {
    secretKey: string;
  }
  
  // MFA functions
  export function setPreferredMFA(options: SetPreferredMFAOptions): Promise<void>;
  export function getMFAPreference(): Promise<MFAPreference>;
  export function updateMFAPreference(input: UpdateMFAPreferenceInput): Promise<void>;
  export function setupTOTP(input: SetupTOTPInput): Promise<SetupTOTPResult>;
  export function confirmTOTP(input: ConfirmTOTPInput): Promise<void>;
  export function generateTOTPSecretKey(): Promise<string>;
}

// Custom MFA types for our application
export enum MFAMethod {
  NONE = 'NONE',
  TOTP = 'TOTP',
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  RECOVERY_CODE = 'RECOVERY_CODE'
}

export interface MFAStatus {
  enabled: boolean;
  methods: MFAMethod[];
  preferredMethod: MFAMethod;
  phoneNumber?: string;
  email?: string;
  lastUpdated: number;
}

export interface MFASetupTOTPResult {
  secretCode: string;
  qrCode: string;
}