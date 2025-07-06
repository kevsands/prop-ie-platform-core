'use client';

/**
 * Authentication Status Page
 * 
 * Shows current authentication mode and allows testing both mock and real auth.
 * Useful for verifying AWS Cognito integration.
 */

import React, { useState } from 'react';
import { useAuth } from '@/context/ProductionAuthContext';
import { environmentValidator } from '@/lib/environment-validation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  UserIcon,
  ShieldCheckIcon,
  KeyIcon,
  GlobeEuropeAfricaIcon
} from '@heroicons/react/24/outline';

export default function AuthStatusPage() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    error, 
    authMode, 
    signIn, 
    signUp, 
    signOut,
    hasRole 
  } = useAuth();

  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userType: 'buyer' as 'buyer' | 'developer' | 'agent' | 'solicitor' | 'investor'
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Get environment validation
  const validation = environmentValidator.validate();

  const handleSignIn = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      await signIn(signInForm.email, signInForm.password);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSignUp = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      await signUp(signUpForm);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : String(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleSignOut = async () => {
    setActionLoading(true);
    try {
      await signOut();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : String(err));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">PROP.ie Authentication Status</h1>
          <p className="text-gray-600 mt-2">Test and verify authentication configuration</p>
        </div>

        {/* Environment Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GlobeEuropeAfricaIcon className="h-5 w-5" />
              Environment Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium">Environment</span>
                <Badge variant={validation.environment === 'production' ? 'default' : 'secondary'}>
                  {validation.environment.toUpperCase()}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium">Auth Mode</span>
                <Badge variant={authMode === 'cognito' ? 'default' : 'secondary'}>
                  {authMode === 'cognito' ? '🔐 AWS Cognito' : '🔧 Mock Auth'}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium">Status</span>
                <Badge variant={validation.isValid ? 'default' : 'destructive'}>
                  {validation.isValid ? '✅ Valid' : '❌ Issues Found'}
                </Badge>
              </div>
            </div>

            {validation.errors.length > 0 && (
              <Alert className="mt-4">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>Configuration Issues:</strong>
                  <ul className="mt-2 space-y-1">
                    {validation.errors.map((error, index) => (
                      <li key={index} className="text-sm">• {error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {validation.warnings.length > 0 && (
              <Alert className="mt-4">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>Recommendations:</strong>
                  <ul className="mt-2 space-y-1">
                    {validation.warnings.map((warning, index) => (
                      <li key={index} className="text-sm">• {warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Current User Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Current User
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </div>
            ) : isAuthenticated && user ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Name</span>
                    <p className="text-sm">{user.firstName} {user.lastName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Email</span>
                    <p className="text-sm">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">User Type</span>
                    <Badge>{user.userType}</Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium">KYC Status</span>
                    <Badge variant={user.kycStatus === 'approved' ? 'default' : 'secondary'}>
                      {user.kycStatus}
                    </Badge>
                  </div>
                  {user.ppsNumber && (
                    <div>
                      <span className="text-sm font-medium">PPS Number</span>
                      <p className="text-sm">{user.ppsNumber}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium">Email Verified</span>
                    <Badge variant={user.isEmailVerified ? 'default' : 'secondary'}>
                      {user.isEmailVerified ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
                <Button onClick={handleSignOut} disabled={actionLoading} variant="outline">
                  Sign Out
                </Button>
              </div>
            ) : (
              <p className="text-gray-600">Not authenticated</p>
            )}

            {error && (
              <Alert className="mt-4">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Authentication Actions */}
        {!isAuthenticated && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sign In */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyIcon className="h-5 w-5" />
                  Sign In
                </CardTitle>
                <CardDescription>
                  {authMode === 'mock' ? 'Use any email/password for mock auth' : 'Use real Cognito credentials'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span htmlFor="signin-email">Email</span>
                  <Input
                    id="signin-email"
                    type="email"
                    value={signInForm.email}
                    onChange={(e) => setSignInForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder={authMode === 'mock' ? 'test@prop.ie' : 'your.email@example.com'}
                  />
                </div>
                <div>
                  <span htmlFor="signin-password">Password</span>
                  <Input
                    id="signin-password"
                    type="password"
                    value={signInForm.password}
                    onChange={(e) => setSignInForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder={authMode === 'mock' ? 'any password' : 'Your password'}
                  />
                </div>
                <Button 
                  onClick={handleSignIn} 
                  disabled={actionLoading || !signInForm.email}
                  className="w-full"
                >
                  {actionLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </CardContent>
            </Card>

            {/* Sign Up */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5" />
                  Sign Up
                </CardTitle>
                <CardDescription>
                  Create a new account for property transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span htmlFor="signup-firstname">First Name</span>
                    <Input
                      id="signup-firstname"
                      value={signUpForm.firstName}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <span htmlFor="signup-lastname">Last Name</span>
                    <Input
                      id="signup-lastname"
                      value={signUpForm.lastName}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Smith"
                    />
                  </div>
                </div>
                <div>
                  <span htmlFor="signup-email">Email</span>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="john.smith@example.com"
                  />
                </div>
                <div>
                  <span htmlFor="signup-password">Password</span>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signUpForm.password}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="8+ chars with upper, lower, number, symbol"
                  />
                </div>
                <div>
                  <span htmlFor="signup-usertype">User Type</span>
                  <select
                    id="signup-usertype"
                    value={signUpForm.userType}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, userType: e.target.value as any }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="buyer">Property Buyer</option>
                    <option value="developer">Property Developer</option>
                    <option value="agent">Estate Agent</option>
                    <option value="solicitor">Solicitor</option>
                    <option value="investor">Investor</option>
                  </select>
                </div>
                <Button 
                  onClick={handleSignUp} 
                  disabled={actionLoading || !signUpForm.email || !signUpForm.firstName}
                  className="w-full"
                >
                  {actionLoading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {actionError && (
          <Alert className="mt-6">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertDescription>{actionError}</AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        {authMode === 'mock' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Mock Authentication Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                You're currently using mock authentication for development. To enable real AWS Cognito:
              </p>
              <ol className="mt-2 text-sm text-gray-600 space-y-1">
                <li>1. Set up AWS Cognito User Pool (follow setup-aws-cognito.md)</li>
                <li>2. Update environment variables with real Cognito credentials</li>
                <li>3. Restart the development server</li>
              </ol>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}