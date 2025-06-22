/**
 * Client Portal Page
 * 
 * Enhanced client portal integrating with AI-enhanced multi-professional ecosystem
 * Provides unified client experience with real-time project coordination
 */

'use client';

import React from 'react';
import EnhancedClientDashboard from '@/components/client/EnhancedClientDashboard';

export default function ClientPortalPage() {
  // In a real implementation, this would get the client ID from authentication
  const clientId = 'client_001'; // This would come from auth context
  
  return (
    <EnhancedClientDashboard 
      clientId={clientId}
      defaultView="overview"
    />
  );
}