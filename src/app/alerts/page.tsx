'use client';

import React from 'react';
import PropertyAlertsManager from '@/features/property-alerts/PropertyAlertsManager';
import { useSession } from 'next-auth/react';

export default function PropertyAlertsPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <PropertyAlertsManager
          userId={session?.user?.id}
          onAlertCreated={(alert: any) => {

          }}
          onAlertDeleted={(alertId: any) => {

          }}
        />
      </div>
    </div>
  );
}