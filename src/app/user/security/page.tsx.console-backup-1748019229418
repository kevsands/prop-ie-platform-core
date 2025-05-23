'use client';

import React from 'react';
import EnhancedSecurityDashboard, { SecurityFeatures } from '../../../components/security/EnhancedSecurityDashboard';

export default function SecurityDashboardPage() {
  const handleFeaturesChange = (features: SecurityFeatures) => {
    console.log('Security features updated:', features);
    // In a real app, this would save to the backend
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Security Dashboard</h1>
        <p className="text-gray-500 mb-8">
          Monitor and manage the security of your account. Enable additional security 
          features to enhance your protection.
        </p>
        
        <EnhancedSecurityDashboard 
          initialFeatures={{
            mfa: true,
            sessionFingerprinting: true,
            deviceTrust: true,
            auditLogging: true,
            securityAlerts: true,
            ipBlocking: false,
            enhancedLoginProtection: false
          }}
          onFeaturesChange={handleFeaturesChange}
        />
      </div>
    </div>
  );
}