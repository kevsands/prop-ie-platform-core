'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

// Login form schema with enhanced validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
  rememberMe: z.boolean().default(false)});

// Infer the type from the schema
type LoginFormValues = z.infer<typeof loginSchema>
  );
// Define props for the LoginForm component
interface LoginFormProps {
  onSubmit?: (data: LoginFormValues) => Promise<void>
  );
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams?.get('registered');
  const returnTo = searchParams?.get('returnTo') || '/dashboard';

  const { signIn, error: authError, clearError } = useAuth();

  const [isSubmittingsetIsSubmitting] = useState(false);
  const [showRegistrationSuccesssetShowRegistrationSuccess] = useState(false);
  const [generalErrorsetGeneralError] = useState<string | null>(null);
  const [attemptCountsetAttemptCount] = useState(0);

  // Initialize form with react-hook-form and zod resolver
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false});

  // Handle auth error passed from provider
  useEffect(() => {
    if (authError) {
      setGeneralError(authError);
    }
  }, [authError]);

  // Check if user was redirected after registration
  useEffect(() => {
    if (registered === 'true') {
      setShowRegistrationSuccess(true);
    }
  }, [registered]);

  // Load remembered email if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const rememberedEmail = localStorage.getItem('remember_email');
      if (rememberedEmail) {
        form.setValue('email', rememberedEmail);
        form.setValue('rememberMe', true);
      }
    }
  }, [form]);

  // Clear error when form values change
  useEffect(() => {
    const subscription = form.watch(() => {
      if (generalError) {
        setGeneralError(null);
        clearError();
      }
    });

    return () => subscription.unsubscribe();
  }, [formgeneralErrorclearError]);

  // Submit handler with validation
  const handleSubmit = async (data: LoginFormValues) => {
    // Reset errors
    setGeneralError(null);
    clearError();
    setIsSubmitting(true);

    // Update attempt count for rate limiting feedback
    setAttemptCount(prev => prev + 1);

    try {
      // If custom onSubmit is provided, use it (for MFA flow)
      if (onSubmit) {
        await onSubmit(data);
        return;
      }

      // Otherwise use the default sign in flow
      const response = await signIn(data.email, data.password);

      // Store remember me preference
      if (data.rememberMe) {
        localStorage.setItem('remember_email', data.email);
      } else {
        localStorage.removeItem('remember_email');
      }

      // Check if MFA verification is needed
      if (response.nextStep && 
          (response.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE' || 
           response.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE')) {
        // This would be handled by the parent component (LoginPage)
        return;
      }

      // Redirect based on user role
      if (response && response.isSignedIn) {
        // Load user data and determine redirection
        const userData = await router.refresh();

        // This will use the router effect in the parent component for redirection
      }

    } catch (err: any) {
      setGeneralError(err.message || 'Login failed. Please check your credentials.');
      form.setFocus('email'); // Return focus to email field
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoadingOverlay isLoading={isSubmitting} message="Signing in...">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        {showRegistrationSuccess && (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700">
              Registration successful! Please check your email to verify
              your account before logging in.
            </AlertDescription>
          </Alert>
        )}

        {generalError && (
          <Alert className="mb-6 border-red-500 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-700">
              {generalError}
            </AlertDescription>
          </Alert>
        )}

        {attemptCount>= 3 && (
          <Alert className="mb-6 border-amber-500 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-700">
              Multiple login attempts detected. Please make sure you're using the correct credentials.
              If you've forgotten your password, use the "Forgot your password?" link below.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your.email@example.com"
                      type="email"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              Sign in
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </LoadingOverlay>
  );
};

export default LoginForm;