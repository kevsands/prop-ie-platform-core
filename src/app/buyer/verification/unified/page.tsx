'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import UnifiedKYCFlow from '@/components/verification/UnifiedKYCFlow';
import { useEnterpriseAuth } from '@/context/EnterpriseAuthContext';
import { useVerification } from '@/context/VerificationContext';

export default function UnifiedVerificationPage() {
  const router = useRouter();
  const { isAuthenticated } = useEnterpriseAuth();
  const { isVerificationComplete } = useVerification();

  const handleComplete = () => {
    // Redirect to buyer dashboard or next step in journey
    router.push('/buyer/dashboard');
  };

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=' + encodeURIComponent('/buyer/verification/unified'));
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <UnifiedKYCFlow onComplete={handleComplete} />
  );
}