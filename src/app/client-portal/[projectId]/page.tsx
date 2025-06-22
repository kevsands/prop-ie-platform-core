/**
 * Client Portal Project Page
 * 
 * Project-specific client portal view with AI-enhanced insights
 * Integrates with multi-professional coordination ecosystem
 */

'use client';

import React from 'react';
import EnhancedClientDashboard from '@/components/client/EnhancedClientDashboard';

interface ClientPortalProjectPageProps {
  params: {
    projectId: string;
  };
}

export default function ClientPortalProjectPage({ params }: ClientPortalProjectPageProps) {
  // In a real implementation, this would get the client ID from authentication
  const clientId = 'client_001'; // This would come from auth context
  
  return (
    <EnhancedClientDashboard 
      clientId={clientId}
      projectId={params.projectId}
      defaultView="project"
    />
  );
}