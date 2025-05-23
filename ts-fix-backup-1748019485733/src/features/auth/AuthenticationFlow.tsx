'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  DevicePhoneMobileIcon,
  FingerPrintIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon} from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';

interface AuthStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address')});

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
  role: z.enum(['BUYER', 'SELLER', 'DEVELOPER', 'AGENT', 'SOLICITOR', 'INVESTOR']),
  acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions')}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]});

export function AuthenticationFlow() {
  const router = useRouter();
  const { signIn, signUp, sendOTP, verifyOTP } = useAuth();
  const [authModesetAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentStepsetCurrentStep] = useState(0);
  const [showPasswordsetShowPassword] = useState(false);
  const [isLoadingsetIsLoading] = useState(false);
  const [verificationCodesetVerificationCode] = useState('');
  const [sessionDatasetSessionData] = useState<any>(null);

  const signInSteps: AuthStep[] = [
    {
      id: 'email',
      title: 'Enter your email',
      description: 'We\'ll check if you have an account',
      icon: <EnvelopeIcon className="h-5 w-5" />},
    {
      id: 'authentication',
      title: 'Verify your identity',
      description: 'Choose your preferred authentication method',
      icon: <ShieldCheckIcon className="h-5 w-5" />},
    {
      id: 'verification',
      title: 'Complete verification',
      description: 'Enter the code we sent you',
      icon: <DevicePhoneMobileIcon className="h-5 w-5" />}];

  const signUpSteps: AuthStep[] = [
    {
      id: 'account',
      title: 'Create your account',
      description: 'Tell us about yourself',
      icon: <UserIcon className="h-5 w-5" />},
    {
      id: 'security',
      title: 'Set up security',
      description: 'Protect your account',
      icon: <LockClosedIcon className="h-5 w-5" />},
    {
      id: 'verification',
      title: 'Verify your identity',
      description: 'Complete your registration',
      icon: <CheckCircleIcon className="h-5 w-5" />}];

  const currentSteps = authMode === 'signin' ? signInSteps : signUpSteps;
  const progress = ((currentStep + 1) / currentSteps.length) * 100;

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' });

  const signUpForm = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      role: 'BUYER' as const,
      acceptTerms: false});

  const handleEmailSubmit = async (data: z.infer<typeof emailSchema>) => {
    setIsLoading(true);
    try {
      // Check if user exists
      const response = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })});

      const result = await response.json();

      if (result.exists) {
        setSessionData({ email: data.email });
        setCurrentStep(1);
      } else {
        // Switch to signup flow
        setAuthMode('signup');
        signUpForm.setValue('email', data.email);
        setCurrentStep(0);
      }
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsLoading(true);
    try {
      const result = await signUp({
        email: data.email,
        password: data.password,
        attributes: {
          given_name: data.firstName,
          family_name: data.lastName,
          phone_number: data.phoneNumber,
          'custom:role': data.role});

      setSessionData(result);
      setCurrentStep(2);
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthMethodSelect = async (method: 'password' | 'biometric' | 'otp') => {
    setIsLoading(true);
    try {
      if (method === 'otp') {
        await sendOTP({ email: sessionData.email });
        setCurrentStep(2);
      } else if (method === 'biometric') {
        // Implement biometric authentication
        // For demo, we'll simulate success
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async () => {
    setIsLoading(true);
    try {
      const result = await verifyOTP({
        email: sessionData.email,
        code: verificationCode});

      if (result.success) {
        // Animate success before redirect
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={ opacity: 0, y: 20 }
        animate={ opacity: 1, y: 0 }
        className="w-full max-w-2xl"
      >
        <Card className="border-0 shadow-2xl">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold">
                {authMode === 'signin' ? 'Welcome back' : 'Create your account'}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                  setCurrentStep(0);
                }
              >
                {authMode === 'signin' ? 'Need an account?' : 'Already have an account?'}
              </Button>
            </div>

            {/* Progress indicator */}
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                {currentSteps.map((stepindex) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-1 ${
                      index <= currentStep ? 'text-primary font-medium' : ''
                    }`}
                  >
                    {step.icon}
                    <span>{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {authMode === 'signin' && currentStep === 0 && (
                <motion.div
                  key="email-step"
                  initial={ opacity: 0, x: 20 }
                  animate={ opacity: 1, x: 0 }
                  exit={ opacity: 0, x: -20 }
                >
                  <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        {...emailForm.register('email')}
                        className="h-12"
                      />
                      {emailForm.formState.errors.email && (
                        <p className="text-sm text-red-500">{emailForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full h-12" disabled={isLoading}>
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Checking...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Continue
                          <ArrowRightIcon className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}

              {authMode === 'signin' && currentStep === 1 && (
                <motion.div
                  key="auth-methods"
                  initial={ opacity: 0, x: 20 }
                  animate={ opacity: 1, x: 0 }
                  exit={ opacity: 0, x: -20 }
                  className="space-y-4"
                >
                  <p className="text-center text-muted-foreground">
                    Choose how you'd like to sign in
                  </p>

                  <div className="grid gap-3">
                    <Button
                      variant="outline"
                      className="h-14 justify-start"
                      onClick={() => handleAuthMethodSelect('biometric')}
                    >
                      <FingerPrintIcon className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Biometric authentication</div>
                        <div className="text-sm text-muted-foreground">Use Touch ID or Face ID</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-14 justify-start"
                      onClick={() => handleAuthMethodSelect('otp')}
                    >
                      <DevicePhoneMobileIcon className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">One-time code</div>
                        <div className="text-sm text-muted-foreground">We'll send a code to your email</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="h-14 justify-start"
                      onClick={() => setCurrentStep(2)}
                    >
                      <LockClosedIcon className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Password</div>
                        <div className="text-sm text-muted-foreground">Use your account password</div>
                      </div>
                    </Button>
                  </div>
                </motion.div>
              )}

              {authMode === 'signin' && currentStep === 2 && (
                <motion.div
                  key="verification"
                  initial={ opacity: 0, x: 20 }
                  animate={ opacity: 1, x: 0 }
                  exit={ opacity: 0, x: -20 }
                  className="space-y-4"
                >
                  <Alert>
                    <AlertDescription>
                      We've sent a verification code to {sessionData?.email}
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="code">Verification code</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="h-12 text-center text-lg tracking-widest"
                      maxLength={6}
                    />
                  </div>

                  <Button
                    className="w-full h-12"
                    onClick={handleVerification}
                    disabled={isLoading || verificationCode.length !== 6}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Verifying...
                      </span>
                    ) : (
                      'Verify and sign in'
                    )}
                  </Button>

                  <div className="text-center">
                    <Button variant="link" size="sm">
                      Didn't receive a code? Resend
                    </Button>
                  </div>
                </motion.div>
              )}

              {authMode === 'signup' && currentStep === 0 && (
                <motion.div
                  key="signup-account"
                  initial={ opacity: 0, x: 20 }
                  animate={ opacity: 1, x: 0 }
                  exit={ opacity: 0, x: -20 }
                >
                  <form onSubmit={signUpForm.handleSubmit(handleSignUpSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input
                          id="firstName"
                          {...signUpForm.register('firstName')}
                          className="h-12"
                        />
                        {signUpForm.formState.errors.firstName && (
                          <p className="text-sm text-red-500">{signUpForm.formState.errors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input
                          id="lastName"
                          {...signUpForm.register('lastName')}
                          className="h-12"
                        />
                        {signUpForm.formState.errors.lastName && (
                          <p className="text-sm text-red-500">{signUpForm.formState.errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signupEmail">Email address</Label>
                      <Input
                        id="signupEmail"
                        type="email"
                        {...signUpForm.register('email')}
                        className="h-12"
                      />
                      {signUpForm.formState.errors.email && (
                        <p className="text-sm text-red-500">{signUpForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="+353 1234567890"
                        {...signUpForm.register('phoneNumber')}
                        className="h-12"
                      />
                      {signUpForm.formState.errors.phoneNumber && (
                        <p className="text-sm text-red-500">{signUpForm.formState.errors.phoneNumber.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">I am a</Label>
                      <select
                        id="role"
                        {...signUpForm.register('role')}
                        className="w-full h-12 px-3 border rounded-md"
                      >
                        <option value="BUYER">Home Buyer</option>
                        <option value="SELLER">Property Seller</option>
                        <option value="DEVELOPER">Developer</option>
                        <option value="AGENT">Estate Agent</option>
                        <option value="SOLICITOR">Solicitor</option>
                        <option value="INVESTOR">Investor</option>
                      </select>
                    </div>

                    <Button
                      type="button"
                      className="w-full h-12"
                      onClick={() => setCurrentStep(1)}
                    >
                      Continue to security setup
                    </Button>
                  </form>
                </motion.div>
              )}

              {authMode === 'signup' && currentStep === 1 && (
                <motion.div
                  key="signup-security"
                  initial={ opacity: 0, x: 20 }
                  animate={ opacity: 1, x: 0 }
                  exit={ opacity: 0, x: -20 }
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="password">Create a password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...signUpForm.register('password')}
                        className="h-12 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {signUpForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{signUpForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      {...signUpForm.register('confirmPassword')}
                      className="h-12"
                    />
                    {signUpForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">{signUpForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="acceptTerms"
                        {...signUpForm.register('acceptTerms')}
                        className="rounded"
                      />
                      <Label htmlFor="acceptTerms" className="text-sm">
                        I accept the <a href="#" className="text-primary hover:underline">terms and conditions</a> and <a href="#" className="text-primary hover:underline">privacy policy</a>
                      </Label>
                    </div>
                    {signUpForm.formState.errors.acceptTerms && (
                      <p className="text-sm text-red-500">{signUpForm.formState.errors.acceptTerms.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12"
                    onClick={signUpForm.handleSubmit(handleSignUpSubmit)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating account...
                      </span>
                    ) : (
                      'Create account'
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}