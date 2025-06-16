'use client';

import React, { useState, useEffect } from 'react';
import { MFAService, MFAStatus } from '@/lib/security/mfa';
import { useFeatureFlag } from '@/lib/features/featureFlags';
import { useAuth } from '@/context/AuthContext';

interface MFASetupProps {
  onSetupComplete?: () => void;
  onCancel?: () => void;
}

/**
 * Multi-Factor Authentication setup component
 * 
 * Provides a user interface for setting up and managing MFA methods:
 * - TOTP (Time-based One-Time Password)
 * - SMS-based verification
 * - Recovery codes management
 */
export function MFASetup({ onSetupComplete, onCancel }: MFASetupProps): JSX.Element {
  const [stepsetStep] = useState<'method-selection' | 'totp-setup' | 'verify-totp' | 'sms-setup' | 'verify-sms' | 'recovery-codes' | 'complete'>('method-selection');
  const [mfaStatussetMfaStatus] = useState<MFAStatus | null>(null);
  const [isLoadingsetIsLoading] = useState(true);
  const [errorsetError] = useState<string | null>(null);
  const [qrCodesetQrCode] = useState<string>('');
  const [secretKeysetSecretKey] = useState<string>('');
  const [verificationCodesetVerificationCode] = useState<string>('');
  const [phoneNumbersetPhoneNumber] = useState<string>('');
  const [recoveryCodessetRecoveryCodes] = useState<string[]>([]);

  const { user } = useAuth();
  const mfaEnabled = useFeatureFlag('enable-mfa', true);

  // Load initial MFA status
  useEffect(() => {
    const loadMfaStatus = async () => {
      try {
        setIsLoading(true);
        const status = await MFAService.getCachedMFAStatus();
        setMfaStatus(status);
      } catch (error) {
        setError('Failed to load MFA status. Please try again later.');

      } finally {
        setIsLoading(false);
      }
    };

    loadMfaStatus();
  }, []);

  // Start TOTP setup
  const handleStartTOTPSetup = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await MFAService.setupTOTPMFA();
      if (response.setupStatus === 'ERROR') {
        setError(response.errorMessage || 'Failed to set up TOTP MFA. Please try again.');
        return;
      }

      setQrCode(response.qrCode || '');
      setSecretKey(response.secretKey || '');
      setStep('totp-setup');
    } catch (error) {
      setError('Failed to set up TOTP MFA. Please try again.');

    } finally {
      setIsLoading(false);
    }
  };

  // Verify TOTP setup
  const handleVerifyTOTP = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const success = await MFAService.verifyTOTPSetupWithCode(verificationCode);
      if (success) {
        // Generate recovery codes
        const codes = await MFAService.generateRecoveryCodes();
        setRecoveryCodes(codes);
        setStep('recovery-codes');

        // Refresh MFA status
        const status = await MFAService.getCachedMFAStatus();
        setMfaStatus(status);
      } else {
        setError('Verification failed. Please try again with a new code.');
      }
    } catch (error) {
      setError('Failed to verify TOTP setup. Please try again.');

    } finally {
      setIsLoading(false);
    }
  };

  // Start SMS setup
  const handleStartSMSSetup = async () => {
    setStep('sms-setup');
  };

  // Send verification code to phone
  const handleSendSMSCode = async () => {
    if (!phoneNumber || phoneNumber.length <10) {
      setError('Please enter a valid phone number.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const success = await MFAService.setupSMSMFA(phoneNumber);
      if (success) {
        setStep('verify-sms');
      } else {
        setError('Failed to send verification code. Please try again.');
      }
    } catch (error) {
      setError('Failed to set up SMS MFA. Please try again.');

    } finally {
      setIsLoading(false);
    }
  };

  // Verify SMS setup
  const handleVerifySMS = async () => {
    if (!verificationCode || verificationCode.length <4) {
      setError('Please enter a valid verification code.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const success = await MFAService.verifySMSSetup(verificationCode);
      if (success) {
        // Generate recovery codes
        const codes = await MFAService.generateRecoveryCodes();
        setRecoveryCodes(codes);
        setStep('recovery-codes');

        // Refresh MFA status
        const status = await MFAService.getCachedMFAStatus();
        setMfaStatus(status);
      } else {
        setError('Verification failed. Please try again with a new code.');
      }
    } catch (error) {
      setError('Failed to verify SMS setup. Please try again.');

    } finally {
      setIsLoading(false);
    }
  };

  // Complete setup
  const handleCompleteSetup = () => {
    setStep('complete');
    if (onSetupComplete) {
      onSetupComplete();
    }
  };

  // Disable MFA
  const handleDisableMFA = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const success = await MFAService.disableMFA();
      if (success) {
        // Refresh MFA status
        const status = await MFAService.getCachedMFAStatus();
        setMfaStatus(status);
        setStep('method-selection');
      } else {
        setError('Failed to disable MFA. Please try again.');
      }
    } catch (error) {
      setError('Failed to disable MFA. Please try again.');

    } finally {
      setIsLoading(false);
    }
  };

  if (!mfaEnabled) {
    return (
      <div className="p-4 border rounded-lg bg-yellow-50 text-yellow-800">
        <h3 className="text-lg font-semibold mb-2">Multi-Factor Authentication is currently disabled</h3>
        <p>This feature is not currently available. Please contact your administrator for more information.</p>
      </div>
    );
  }

  if (isLoading && !mfaStatus) {
    return (
      <div className="p-4 border rounded-lg">
        <div className="flex justify-center items-center h-40">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md">
          {error}
        </div>
      )}

      {/* Method Selection Step */}
      {step === 'method-selection' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Multi-Factor Authentication Setup</h2>

          {mfaStatus?.enabled ? (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md">
              <p className="font-medium">MFA is currently enabled</p>
              <p className="text-sm mt-1">Current method: {mfaStatus.preferred}</p>
            </div>
          ) : (
            <p className="mb-4">Enhance your account security by setting up multi-factor authentication.</p>
          )}

          <div className="space-y-4">
            <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer" onClick={handleStartTOTPSetup}>
              <h3 className="font-medium">Authenticator App</h3>
              <p className="text-sm text-gray-600">Use an app like Google Authenticator or Authy to generate verification codes.</p>
            </div>

            <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer" onClick={handleStartSMSSetup}>
              <h3 className="font-medium">SMS Verification</h3>
              <p className="text-sm text-gray-600">Receive verification codes via text message.</p>
            </div>

            {mfaStatus?.enabled && (
              <button
                onClick={handleDisableMFA}
                className="mt-6 w-full px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                disabled={isLoading}
              >
                Disable MFA
              </button>
            )}

            {onCancel && (
              <button
                onClick={onCancel}
                className="mt-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* TOTP Setup Step */}
      {step === 'totp-setup' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Set Up Authenticator App</h2>

          <div className="mb-4">
            <p className="mb-2">1. Scan this QR code with your authenticator app:</p>

            <div className="mb-4 p-4 bg-white border flex justify-center">
              {qrCode ? (
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">QR Code Loading...</span>
                </div>
              )}
            </div>

            <p className="mb-2">2. Or manually enter this secret key:</p>
            <div className="mb-4 p-2 bg-gray-50 border font-mono text-center break-all">
              {secretKey}
            </div>
          </div>

          <button
            onClick={() => setStep('verify-totp')}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={isLoading || !qrCode}
          >
            Next
          </button>

          <button
            onClick={() => setStep('method-selection')}
            className="mt-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            disabled={isLoading}
          >
            Back
          </button>
        </div>
      )}

      {/* Verify TOTP Step */}
      {step === 'verify-totp' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Verify Authenticator App</h2>

          <p className="mb-4">Enter the 6-digit code from your authenticator app to verify setup:</p>

          <div className="mb-4">
            <input
              type="text"
              value={verificationCode}
              onChange={(e: any) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0))}
              className="w-full p-2 border rounded-md text-center text-2xl tracking-wider"
              placeholder="000000"
              maxLength={6}
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleVerifyTOTP}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={isLoading || verificationCode.length !== 6}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>

          <button
            onClick={() => setStep('totp-setup')}
            className="mt-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            disabled={isLoading}
          >
            Back
          </button>
        </div>
      )}

      {/* SMS Setup Step */}
      {step === 'sms-setup' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Set Up SMS Authentication</h2>

          <p className="mb-4">Enter your phone number to receive verification codes:</p>

          <div className="mb-4">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e: any) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              className="w-full p-2 border rounded-md"
              placeholder="+1 (555) 555-5555"
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 mt-1">Enter numbers only, including country code</p>
          </div>

          <button
            onClick={handleSendSMSCode}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={isLoading || phoneNumber.length <10}
          >
            {isLoading ? 'Sending...' : 'Send Verification Code'}
          </button>

          <button
            onClick={() => setStep('method-selection')}
            className="mt-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            disabled={isLoading}
          >
            Back
          </button>
        </div>
      )}

      {/* Verify SMS Step */}
      {step === 'verify-sms' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Verify SMS Code</h2>

          <p className="mb-4">Enter the verification code sent to your phone:</p>

          <div className="mb-4">
            <input
              type="text"
              value={verificationCode}
              onChange={(e: any) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              className="w-full p-2 border rounded-md text-center text-2xl tracking-wider"
              placeholder="0000"
              maxLength={6}
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleVerifySMS}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={isLoading || verificationCode.length <4}
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>

          <button
            onClick={() => setStep('sms-setup')}
            className="mt-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            disabled={isLoading}
          >
            Back
          </button>
        </div>
      )}

      {/* Recovery Codes Step */}
      {step === 'recovery-codes' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Save Your Recovery Codes</h2>

          <p className="mb-4">
            <strong>Important:</strong> Store these recovery codes in a safe place. You will need them if you lose access 
            to your authentication device.
          </p>

          <div className="mb-6 p-3 bg-gray-50 border rounded-md">
            <div className="grid grid-cols-2 gap-2">
              {recoveryCodes.map((codeindex: any) => (
                <div key={index} className="font-mono text-sm p-1 bg-white border">
                  {code}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <button
              onClick={() => {
                const text = recoveryCodes.join('\n');
                navigator.clipboard.writeText(text);
              }
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
              disabled={isLoading}
            >
              Copy All Codes
            </button>
          </div>

          <button
            onClick={handleCompleteSetup}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={isLoading}
          >
            I've Saved My Recovery Codes
          </button>
        </div>
      )}

      {/* Complete Step */}
      {step === 'complete' && (
        <div>
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold mb-2">MFA Setup Complete!</h2>
            <p className="text-gray-600">
              Your account is now protected with multi-factor authentication.
            </p>
          </div>

          <button
            onClick={() => setStep('method-selection')}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

export default MFASetup;