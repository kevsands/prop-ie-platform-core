'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ShieldCheckIcon,
  LockClosedIcon,
  FingerPrintIcon,
  DevicePhoneMobileIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useEnterpriseAuth } from '@/hooks/useEnterpriseAuth';

export default function StepUpAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, elevateSecurityLevel } = useEnterpriseAuth();
  
  const [authMethod, setAuthMethod] = useState<'password' | 'biometric' | 'otp' | null>(null);
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const requiredLevel = searchParams.get('level') as 'elevated' | 'maximum';
  const returnTo = searchParams.get('returnTo') || '/dashboard';
  const reason = searchParams.get('reason') || 'This action requires additional verification';

  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  const handlePasswordAuth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Verify password
      const response = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (!response.ok) {
        throw new Error('Invalid password');
      }
      
      // Elevate security level
      await elevateSecurityLevel(requiredLevel);
      
      // Redirect to original destination
      router.push(returnTo);
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check for WebAuthn support
      if (!window.PublicKeyCredential) {
        throw new Error('Biometric authentication not supported');
      }
      
      // Get credential options from server
      const optionsResponse = await fetch('/api/auth/webauthn/authenticate');
      const options = await optionsResponse.json();
      
      // Request biometric authentication
      const credential = await navigator.credentials.get({
        publicKey: options,
      });
      
      // Verify with server
      const verifyResponse = await fetch('/api/auth/webauthn/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      });
      
      if (!verifyResponse.ok) {
        throw new Error('Biometric verification failed');
      }
      
      // Elevate security level
      await elevateSecurityLevel(requiredLevel);
      
      // Redirect
      router.push(returnTo);
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const handleOTPAuth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Send OTP
      if (!otpCode) {
        const response = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: user?.id,
            method: user?.security.mfaMethod || 'EMAIL',
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to send OTP');
        }
        
        return;
      }
      
      // Verify OTP
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: otpCode }),
      });
      
      if (!response.ok) {
        throw new Error('Invalid OTP');
      }
      
      // Elevate security level
      await elevateSecurityLevel(requiredLevel);
      
      // Redirect
      router.push(returnTo);
    } catch (error: any) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto p-3 bg-red-100 rounded-full w-fit">
              <ShieldCheckIcon className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Additional Verification Required
            </CardTitle>
            <CardDescription className="text-base">
              {reason}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {!authMethod ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Choose your preferred authentication method
                </p>
                
                <Button
                  variant="outline"
                  className="w-full h-14 justify-start"
                  onClick={() => setAuthMethod('password')}
                >
                  <LockClosedIcon className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Password</div>
                    <div className="text-sm text-muted-foreground">
                      Enter your account password
                    </div>
                  </div>
                </Button>

                {user.security.biometricEnabled && (
                  <Button
                    variant="outline"
                    className="w-full h-14 justify-start"
                    onClick={() => setAuthMethod('biometric')}
                  >
                    <FingerPrintIcon className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Biometric</div>
                      <div className="text-sm text-muted-foreground">
                        Use Touch ID or Face ID
                      </div>
                    </div>
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full h-14 justify-start"
                  onClick={() => setAuthMethod('otp')}
                >
                  <DevicePhoneMobileIcon className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">One-Time Code</div>
                    <div className="text-sm text-muted-foreground">
                      We'll send a code to your {user.security.mfaMethod === 'SMS' ? 'phone' : 'email'}
                    </div>
                  </div>
                </Button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {authMethod === 'password' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="h-12"
                      />
                    </div>
                    <Button
                      className="w-full h-12"
                      onClick={handlePasswordAuth}
                      disabled={isLoading || !password}
                    >
                      {isLoading ? 'Verifying...' : 'Verify Password'}
                    </Button>
                  </>
                )}

                {authMethod === 'biometric' && (
                  <div className="text-center space-y-4">
                    <div className="mx-auto p-4 bg-blue-100 rounded-full w-fit">
                      <FingerPrintIcon className="h-12 w-12 text-blue-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Touch the sensor or look at your camera to authenticate
                    </p>
                    <Button
                      className="w-full h-12"
                      onClick={handleBiometricAuth}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Authenticating...' : 'Use Biometric'}
                    </Button>
                  </div>
                )}

                {authMethod === 'otp' && (
                  <>
                    {!otpCode ? (
                      <div className="text-center space-y-4">
                        <p className="text-sm text-muted-foreground">
                          We'll send a verification code to your registered {user.security.mfaMethod === 'SMS' ? 'phone number' : 'email address'}
                        </p>
                        <Button
                          className="w-full h-12"
                          onClick={handleOTPAuth}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Sending...' : 'Send Code'}
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Alert>
                          <AlertDescription>
                            Code sent to your {user.security.mfaMethod === 'SMS' ? 'phone' : 'email'}
                          </AlertDescription>
                        </Alert>
                        <div className="space-y-2">
                          <Label htmlFor="otp">Verification Code</Label>
                          <Input
                            id="otp"
                            type="text"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="Enter 6-digit code"
                            className="h-12 text-center text-lg tracking-widest"
                            maxLength={6}
                          />
                        </div>
                        <Button
                          className="w-full h-12"
                          onClick={handleOTPAuth}
                          disabled={isLoading || otpCode.length !== 6}
                        >
                          {isLoading ? 'Verifying...' : 'Verify Code'}
                        </Button>
                      </>
                    )}
                  </>
                )}

                {error && (
                  <Alert variant="destructive">
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setAuthMethod(null);
                    setError(null);
                    setPassword('');
                    setOtpCode('');
                  }}
                >
                  Choose Different Method
                </Button>
              </motion.div>
            )}

            <div className="pt-4 border-t">
              <p className="text-xs text-center text-muted-foreground">
                This extra security step helps protect your account and ensures that only you can access sensitive information.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={() => router.push(returnTo)}
            className="text-sm text-muted-foreground"
          >
            Cancel and go back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}