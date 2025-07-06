/**
 * First-Time Buyer Dashboard Page
 * 
 * This page displays the dashboard for first-time buyers, allowing them to 
 * track their buying journey, view reservations, monitor mortgage applications,
 * manage snag lists, and access their digital home pack.
 */

'use client';

import React from 'react';
import FirstTimeBuyerDashboard from '@/components/buyer/FirstTimeBuyerDashboard';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';

export default function FirstTimeBuyerDashboardPage() {
  return (
    <AuthProvider>
      <FirstTimeBuyerDashboard />
      <Toaster />
    </AuthProvider>
  );
}