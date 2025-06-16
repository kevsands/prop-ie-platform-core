import React from 'react';
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/ui/icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, AlertCircle, Mail, Lock, User, Phone, Building, Briefcase } from 'lucide-react';

// Validation schema
const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Invalid phone number').optional().or(z.literal('')),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  role: z.enum(['BUYER', 'DEVELOPER', 'SOLICITOR', 'AGENT', 'INVESTOR']),
  organization: z.string().optional(),
  position: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
  agreeToMarketing: z.boolean().optional()}).refine((data: any) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]});

type RegisterFormData = z.infer<typeof registerSchema>
  );
// Role descriptions
const roleDescriptions = {
  BUYER: 'Individual looking to purchase property',
  DEVELOPER: 'Property developer or construction company',
  SOLICITOR: 'Legal professional handling property transactions',
  AGENT: 'Real estate agent or broker',
  INVESTOR: 'Investment professional or fund manager'};

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [isLoadingsetIsLoading] = useState(false);
  const [showPasswordsetShowPassword] = useState(false);
  const [showConfirmPasswordsetShowConfirmPassword] = useState(false);
  const [errorsetError] = useState<string | null>(null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'BUYER',
      organization: '',
      position: '',
      agreeToTerms: false,
      agreeToMarketing: false});

  const selectedRole = form.watch('role');
  const showOrganizationFields = ['DEVELOPER', 'SOLICITOR', 'AGENT', 'INVESTOR'].includes(selectedRole);

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true);
    setError(null);

    try {
      // Register user via API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'},
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || null,
          password: data.password,
          role: data.role,
          organization: data.organization || null,
          position: data.position || null,
          agreeToMarketing: data.agreeToMarketing || false})});

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      // Auto sign in after successful registration
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false});

      if (signInResult?.error) {
        // Registration succeeded but login failed
        toast({
          title: 'Registration successful',
          description: 'Please sign in with your new account.'});
        router.push('/auth/login');
      } else {
        toast({
          title: 'Welcome to the platform!',
          description: 'Your account has been created successfully.'});

        // Redirect based on role
        const roleRedirects: Record<string, string> = {
          BUYER: '/buyer/setup',
          DEVELOPER: '/developer/onboarding',
          SOLICITOR: '/solicitor/onboarding',
          AGENT: '/agent/onboarding',
          INVESTOR: '/investor/onboarding'};

        router.push(roleRedirects[data.role] || '/dashboard');
        router.refresh();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  // Handle OAuth registration
  async function handleOAuthSignUp(provider: 'google' | 'azure-ad') {
    setIsLoading(true);
    setError(null);

    try {
      await signIn(provider, {
        callbackUrl: '/auth/complete-profile', // Complete profile after OAuth
      });
    } catch (error) {
      setError('Failed to sign up with ' + provider);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create your account</CardTitle>
          <CardDescription className="text-center">
            Join the platform and start your property journey
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    {...form.register('firstName')}
                    id="firstName"
                    placeholder="John"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
                {form.formState.errors.firstName && (
                  <p className="text-sm text-red-600">{form.formState.errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    {...form.register('lastName')}
                    id="lastName"
                    placeholder="Doe"
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
                {form.formState.errors.lastName && (
                  <p className="text-sm text-red-600">{form.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  {...form.register('email')}
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  className="pl-10"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {form.formState.errors.email && (
                <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  {...form.register('phone')}
                  id="phone"
                  type="tel"
                  placeholder="+353 123 456 7890"
                  className="pl-10"
                  disabled={isLoading}
                  autoComplete="tel"
                />
              </div>
              {form.formState.errors.phone && (
                <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
              )}
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <Select
                value={selectedRole}
                onValueChange={(value: any) => form.setValue('role', value as any)}
                disabled={isLoading}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select your account type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(roleDescriptions).map(([roledescription]) => (
                    <SelectItem key={role} value={role}>
                      <div>
                        <div className="font-medium">{role.charAt(0) + role.slice(1).toLowerCase()}</div>
                        <div className="text-sm text-gray-600">{description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.role && (
                <p className="text-sm text-red-600">{form.formState.errors.role.message}</p>
              )}
            </div>

            {/* Organization Fields */}
            {showOrganizationFields && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      {...form.register('organization')}
                      id="organization"
                      placeholder="Company Name"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      {...form.register('position')}
                      id="position"
                      placeholder="Your role in the organization"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Password Fields */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  {...form.register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  className="pl-10 pr-10"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
              )}
              <p className="text-xs text-gray-600">
                Must be at least 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  {...form.register('confirmPassword')}
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-600">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={form.watch('agreeToTerms')}
                  onCheckedChange={(checked: any) => form.setValue('agreeToTerms', checked as boolean)}
                  disabled={isLoading}
                  className="mt-1"
                />
                <Label htmlFor="agreeToTerms" className="text-sm font-normal">
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500 underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500 underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {form.formState.errors.agreeToTerms && (
                <p className="text-sm text-red-600">{form.formState.errors.agreeToTerms.message}</p>
              )}

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeToMarketing"
                  checked={form.watch('agreeToMarketing')}
                  onCheckedChange={(checked: any) => form.setValue('agreeToMarketing', checked as boolean)}
                  disabled={isLoading}
                  className="mt-1"
                />
                <Label htmlFor="agreeToMarketing" className="text-sm font-normal">
                  I'd like to receive updates about new properties and platform features
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </Button>
          </form>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or sign up with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handleOAuthSignUp('google')}
              disabled={isLoading}
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignUp('azure-ad')}
              disabled={isLoading}
            >
              <Icons.microsoft className="mr-2 h-4 w-4" />
              Microsoft
            </Button>
          </div>
        </CardContent>

        <CardFooter>
          <div className="w-full text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}