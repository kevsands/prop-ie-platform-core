'use client';

import React, { useState } from 'react';
import SecuritySetupWizard from '../../../../components/security/SecuritySetupWizard';
import { useRouter } from 'next/navigation';

export default function SecuritySetupPage() {
  const router = useRouter();
  const [setupComplete, setSetupComplete] = useState(false);
  
  const handleComplete = () => {
    setSetupComplete(true);
    router.push('/user/security');
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        {!setupComplete ? (
          <SecuritySetupWizard onComplete={handleComplete} />
        ) : (
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold mb-4">Setup Complete!</h1>
            <p>Redirecting to your security dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}