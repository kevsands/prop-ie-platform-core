'use client';

import React from 'react';
import PropertyAlertsManager from '@/features/property-alerts/PropertyAlertsManager';
import { useSession } from 'next-auth/react';

export default function PropertyAlertsPage() {
  const sessionData = useSession();
  const session = sessionData?.data;
  const status = sessionData?.status || 'loading';

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <PropertyAlertsManager
          userId={session?.user?.id || 'demo-user'}
          onAlertCreated={(alert) => {
            console.log('Alert created:', alert);
          }}
          onAlertDeleted={(alertId) => {
            console.log('Alert deleted:', alertId);
          }}
        />
      </div>
    </div>
  );
}