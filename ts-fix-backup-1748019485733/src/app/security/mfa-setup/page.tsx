'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Define interfaces for component props
interface BasicProps {
  className?: string;
  children: ReactNode;
}

interface MFASetupResponse {
  setupStatus: string;
  qrCode: string;
  secretKey: string;
  errorMessage?: string;
}

// Mock auth context to avoid import issues
const useAuth = () => {
  return {
    user: { id: 'mock-user-id', email: 'user@example.com' },
    mfaEnabled: false
  };
};

// Mock Security service implementation
const Security = {
  isInitialized: () => true,
  initialize: async (): Promise<boolean> => true,
  getMFA: () => ({
    setupTOTPMFA: async (): Promise<MFASetupResponse> => ({
      setupStatus: 'SUCCESS',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      secretKey: 'ABCDEFGHIJK123456'
    }),
    verifyTOTPSetupWithCode: async (code: string): Promise<boolean> => true,
    setupSMSMFA: async (phoneNumber: string): Promise<boolean> => true,
    verifySMSSetup: async (code: string): Promise<boolean> => true
  })
};

// Simplified UI components
const Card: React.FC<BasicProps> = ({ className = "", children }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<BasicProps> = ({ className = "", children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<BasicProps> = ({ className = "", children }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription: React.FC<BasicProps> = ({ className = "", children }) => (
  <p className={`text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);

const CardContent: React.FC<BasicProps> = ({ className = "", children }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardFooter: React.FC<BasicProps> = ({ className = "", children }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
);

interface ButtonProps extends BasicProps {
  variant?: "default" | "outline";
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ 
  className = "", 
  variant = "default", 
  children, 
  disabled = false, 
  onClick, 
  ...props 
}) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${
      variant === "default" 
        ? "bg-blue-600 text-white hover:bg-blue-700" 
        : "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700"
    } h-10 px-4 py-2 ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

interface InputProps {
  className?: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  type?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  className = "", 
  id, 
  placeholder, 
  value, 
  onChange, 
  maxLength,
  type = "text",
  disabled = false,
  ...props 
}) => (
  <input
    type={type}
    id={id}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    maxLength={maxLength}
    disabled={disabled}
    {...props}
  />
);

interface LabelProps extends BasicProps {
  htmlFor: string;
}

const Label: React.FC<LabelProps> = ({ className = "", children, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
  >
    {children}
  </label>
);

const Alert: React.FC<BasicProps> = ({ className = "", children }) => (
  <div className={`relative w-full rounded-lg border p-4 ${className}`}>
    {children}
  </div>
);

const AlertDescription: React.FC<BasicProps> = ({ className = "", children }) => (
  <div className={`text-sm ${className}`}>
    {children}
  </div>
);

// LoadingSpinner component
const LoadingSpinner: React.FC<{className?: string}> = ({ className = "" }) => (
  <div className={`animate-spin rounded-full h-4 w-4 border-b-2 border-white ${className}`}></div>
);

/**
 * MFA Setup Page
 * 
 * This page allows users to set up multi-factor authentication methods.
 * Supports TOTP (authenticator apps) and SMS-based verification.
 */
export default function MFASetupPage(): JSX.Element {
  const router = useRouter();
  const { user, mfaEnabled } = useAuth();

  const [activeTabsetActiveTab] = useState('totp');
  const [loadingsetLoading] = useState(false);
  const [errorsetError] = useState<string | null>(null);
  const [successsetSuccess] = useState<string | null>(null);

  // TOTP setup state
  const [totpDatasetTotpData] = useState<{ qrCode: string; secretKey: string } | null>(null);
  const [verificationCodesetVerificationCode] = useState('');

  // SMS setup state
  const [phoneNumbersetPhoneNumber] = useState('');
  const [smsVerificationCodesetSmsVerificationCode] = useState('');
  const [smsSetupStagesetSmsSetupStage] = useState<'phone' | 'verify'>('phone');

  // Check if MFA is already enabled on mount
  useEffect(() => {
    if (mfaEnabled) {
      setSuccess('MFA is already enabled for your account.');
    }
  }, [mfaEnabled]);

  // Handle TOTP setup
  const handleSetupTOTP = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Initialize security if needed
      if (!Security.isInitialized()) {
        await Security.initialize();
      }

      // Get MFA service
      const MFAService = Security.getMFA();

      // Setup TOTP
      const result = await MFAService.setupTOTPMFA();

      if (result.setupStatus === 'ERROR') {
        throw new Error(result.errorMessage || 'Failed to setup TOTP');
      }

      // Store TOTP data for display
      setTotpData({
        qrCode: result.qrCode || '',
        secretKey: result.secretKey || ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during TOTP setup');
    } finally {
      setLoading(false);
    }
  };

  // Verify TOTP setup with code
  const handleVerifyTOTP = async (): Promise<void> => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get MFA service
      const MFAService = Security.getMFA();

      // Verify TOTP setup
      const success = await MFAService.verifyTOTPSetupWithCode(verificationCode);

      if (success) {
        setSuccess('TOTP verification successful! MFA has been enabled for your account.');
        setTimeout(() => {
          router.push('/protected-test');
        }, 2000);
      } else {
        setError('Verification failed. Please try again with a new code.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle SMS setup - Step 1: Set phone number
  const handleSMSSetup = async (): Promise<void> => {
    if (!phoneNumber || !/^\+?[1-9]\d{9,14}$/.test(phoneNumber)) {
      setError('Please enter a valid phone number (E.164 format recommended: +1234567890)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get MFA service
      const MFAService = Security.getMFA();

      // Setup SMS MFA with phone number
      const success = await MFAService.setupSMSMFA(phoneNumber);

      if (success) {
        setSmsSetupStage('verify');
        setSuccess('Verification code sent to your phone number. Please enter it below.');
      } else {
        setError('Failed to send verification code. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup SMS verification');
    } finally {
      setLoading(false);
    }
  };

  // Handle SMS verification - Step 2: Verify code
  const handleVerifySMS = async (): Promise<void> => {
    if (!smsVerificationCode || smsVerificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get MFA service
      const MFAService = Security.getMFA();

      // Verify SMS setup
      const success = await MFAService.verifySMSSetup(smsVerificationCode);

      if (success) {
        setSuccess('SMS verification successful! MFA has been enabled for your account.');
        setTimeout(() => {
          router.push('/protected-test');
        }, 2000);
      } else {
        setError('Verification failed. Please try again with a new code.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Set Up Multi-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account by enabling MFA.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success && (
            <Alert className="mb-6 border-green-500 bg-green-50">
              <AlertDescription className="text-green-700">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-6 border-red-500 bg-red-50">
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="w-full">
            <div className="inline-flex items-center justify-center rounded-md bg-gray-100 p-1 grid w-full grid-cols-2">
              <button
                className={`inline-flex items-center justify-center whitespace-nowrap rounded px-3 py-1.5 text-sm font-medium transition-all ${
                  activeTab === 'totp' 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab('totp')}
              >
                Authenticator App
              </button>
              <button
                className={`inline-flex items-center justify-center whitespace-nowrap rounded px-3 py-1.5 text-sm font-medium transition-all ${
                  activeTab === 'sms' 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-900"
                }`}
                onClick={() => setActiveTab('sms')}
              >
                SMS Verification
              </button>
            </div>

            {/* TOTP Setup */}
            <div className={`mt-2 ring-offset-white ${activeTab === 'totp' ? "block" : "hidden" space-y-4 mt-4`}>
              {!totpData ? (
                <div className="text-center space-y-4">
                  <p className="text-gray-600 mb-4">
                    Set up authentication using an authenticator app like Google Authenticator, 
                    Microsoft Authenticator, or Authy.
                  </p>
                  <Button 
                    onClick={handleSetupTOTP} 
                    disabled={loading || !!success}
                    className="w-full"
                  >
                    {loading ? <LoadingSpinner className="mr-2" /> : null}
                    Set Up Authenticator
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto w-56 h-56 relative mb-4 bg-gray-100 p-2 rounded-lg">
                      {/* QR Code Image */}
                      {totpData.qrCode && (
                        <div className="w-full h-full flex items-center justify-center">
                          <img 
                            src={totpData.qrCode} 
                            alt="QR Code for TOTP setup" 
                            className="max-w-full max-h-full"
                          />
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      <p className="mb-2">Scan this QR code with your authenticator app, or enter the key manually:</p>
                      <code className="bg-gray-100 px-2 py-1 rounded font-mono">
                        {totpData.secretKey}
                      </code>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="verification-code">Enter the 6-digit verification code</Label>
                    <Input
                      id="verification-code"
                      placeholder="123456"
                      maxLength={6}
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').substring(06))}
                    />
                  </div>

                  <Button 
                    onClick={handleVerifyTOTP} 
                    disabled={loading || verificationCode.length !== 6 || !!success}
                    className="w-full"
                  >
                    {loading ? <LoadingSpinner className="mr-2" /> : null}
                    Verify and Enable
                  </Button>
                </div>
              )}
            </div>

            {/* SMS Setup */}
            <div className={`mt-2 ring-offset-white ${activeTab === 'sms' ? "block" : "hidden" space-y-4 mt-4`}>
              {smsSetupStage === 'phone' ? (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">
                    Receive verification codes via SMS text message when signing in.
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="phone-number">Phone Number (include country code)</Label>
                    <Input
                      id="phone-number"
                      placeholder="+1234567890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d+]/g, ''))}
                    />
                    <p className="text-xs text-gray-500">
                      Format: +1234567890 (including country code)
                    </p>
                  </div>

                  <Button 
                    onClick={handleSMSSetup} 
                    disabled={loading || !!success}
                    className="w-full"
                  >
                    {loading ? <LoadingSpinner className="mr-2" /> : null}
                    Send Verification Code
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">
                    Enter the verification code sent to {phoneNumber}.
                  </p>

                  <div className="space-y-2">
                    <Label htmlFor="sms-code">Verification Code</Label>
                    <Input
                      id="sms-code"
                      placeholder="123456"
                      maxLength={6}
                      value={smsVerificationCode}
                      onChange={(e) => setSmsVerificationCode(e.target.value.replace(/\D/g, '').substring(06))}
                    />
                  </div>

                  <Button 
                    onClick={handleVerifySMS} 
                    disabled={loading || smsVerificationCode.length !== 6 || !!success}
                    className="w-full"
                  >
                    {loading ? <LoadingSpinner className="mr-2" /> : null}
                    Verify and Enable
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={() => setSmsSetupStage('phone')}
                    disabled={loading || !!success}
                    className="w-full mt-2"
                  >
                    Change Phone Number
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button 
            variant="outline" 
            onClick={() => router.push('/protected-test')}
            className="w-full"
          >
            Back to Protected Test
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}