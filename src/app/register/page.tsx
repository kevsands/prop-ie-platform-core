'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ClientLayout from '../ClientLayout';
import { EnterpriseAuthProvider } from '@/context/EnterpriseAuthContext';
import AuthErrorBoundary from '@/components/auth/AuthErrorBoundary';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Target,
  Home,
  PiggyBank
} from 'lucide-react';

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [journeyContext, setJourneyContext] = useState({
    source: 'direct',
    intent: 'general',
    referrer: '',
    utmSource: '',
    utmCampaign: '',
    suggestedFlow: 'basic'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  // Journey context detection on mount
  useEffect(() => {
    const detectJourneyContext = () => {
      const referrer = document.referrer;
      const utmSource = searchParams.get('utm_source') || '';
      const utmCampaign = searchParams.get('utm_campaign') || '';
      const redirect = searchParams.get('redirect') || '';
      
      let source = 'direct';
      let intent = 'general';
      let suggestedFlow = 'basic';

      // Detect source and intent
      if (referrer.includes('first-time-buyer')) {
        source = 'ftb-pages';
        intent = 'first-time-buyer';
        suggestedFlow = 'enhanced';
      } else if (referrer.includes('/property/') || referrer.includes('search')) {
        source = 'property-search';
        intent = 'property-focused';
        suggestedFlow = 'enhanced';
      } else if (utmSource.includes('google') || utmSource.includes('facebook')) {
        source = 'paid-advertising';
        intent = 'marketing-driven';
      } else if (redirect.includes('/buyer')) {
        source = 'buyer-flow';
        intent = 'buyer-focused';
        suggestedFlow = 'enhanced';
      }

      setJourneyContext({
        source,
        intent,
        referrer,
        utmSource,
        utmCampaign,
        suggestedFlow
      });
    };

    detectJourneyContext();
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    
    // Validate form
    const newErrors: any = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
    
    try {
      // Call enterprise registration API
      const response = await fetch('/api/auth/enterprise/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          journeyContext: journeyContext,
          userRole: 'buyer'
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Store journey context for profile completion
        const registrationData = {
          ...formData,
          journeyContext,
          registeredAt: new Date().toISOString(),
          completionScore: 30, // Basic info complete
          needsProfileCompletion: journeyContext.suggestedFlow === 'enhanced'
        };
        
        localStorage.setItem('userRegistration', JSON.stringify(registrationData));
        
        // Store auth token if provided (auto-login)
        if (result.data?.accessToken) {
          localStorage.setItem('prop_access_token', result.data.accessToken);
          localStorage.setItem('prop_refresh_token', result.data.refreshToken);
        }
        
        // Intelligent routing based on journey context
        if (journeyContext.suggestedFlow === 'enhanced') {
          // Route to profile completion wizard
          router.push('/buyer/profile-completion?source=registration');
        } else {
          // Route to basic buyer dashboard
          router.push('/buyer');
        }
      } else {
        setErrors({ submit: result.error?.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Smart flow suggestion component
  const FlowSuggestion = () => {
    if (journeyContext.suggestedFlow === 'basic') return null;
    
    return (
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Sparkles className="text-blue-600 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">
              Enhanced Registration Recommended
            </h3>
            <p className="text-blue-800 text-sm mb-3">
              Based on your interest in {journeyContext.intent === 'first-time-buyer' ? 'first-time buying' : 'property search'}, 
              we recommend our comprehensive registration for a personalized experience.
            </p>
            <div className="flex gap-2">
              <Link 
                href="/first-time-buyers/register"
                className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                Get Personalized Experience
              </Link>
              <button 
                onClick={() => setJourneyContext(prev => ({ ...prev, suggestedFlow: 'basic' }))}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Continue with basic
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ClientLayout>
      <div className="min-h-screen pt-20 pb-12 bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Join Ireland's leading property platform
            </p>
            
            <FlowSuggestion />
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-[#2B5273] focus:border-[#2B5273] ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-[#2B5273] focus:border-[#2B5273] ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-[#2B5273] focus:border-[#2B5273] ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-[#2B5273] focus:border-[#2B5273] ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-[#2B5273] focus:border-[#2B5273] ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
              
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center">
                    <AlertCircle className="text-red-600 mr-2" size={16} />
                    <p className="text-red-800 text-sm">{errors.submit}</p>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2B5273] text-white py-3 px-4 rounded-md hover:bg-[#1E3142] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-[#2B5273] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Journey context display for development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-3 bg-gray-50 rounded-md">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">Journey Context (Dev)</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><span className="font-medium">Source:</span> {journeyContext.source}</p>
                  <p><span className="font-medium">Intent:</span> {journeyContext.intent}</p>
                  <p><span className="font-medium">Suggested Flow:</span> {journeyContext.suggestedFlow}</p>
                  {journeyContext.referrer && (
                    <p><span className="font-medium">Referrer:</span> {journeyContext.referrer}</p>
                  )}
                </div>
              </div>
            )}

            {/* Post-registration expectations */}
            {journeyContext.suggestedFlow === 'enhanced' && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="text-sm font-semibold text-green-900 mb-2">What happens next?</h4>
                <div className="text-sm text-green-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} />
                    <span>Complete your personalized profile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target size={14} />
                    <span>Get matched with relevant properties</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PiggyBank size={14} />
                    <span>Access financial tools and calculators</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

export default function RegisterPage() {
  return (
    <EnterpriseAuthProvider>
      <AuthErrorBoundary>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <RegisterPageContent />
        </Suspense>
      </AuthErrorBoundary>
    </EnterpriseAuthProvider>
  );
}