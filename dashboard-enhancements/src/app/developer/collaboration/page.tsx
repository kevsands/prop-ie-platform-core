'use client';

import React from 'react';
import EnterpriseCollaborationHub from '@/components/developer/EnterpriseCollaborationHub';

/**
 * Enterprise Collaboration Hub Page
 * 
 * Unified communication and collaboration platform for PROP.ie developers
 * integrating all enterprise systems into a cohesive communication experience.
 * 
 * Features:
 * - Multi-channel communication (Project, Team, Financial, Procurement)
 * - Real-time messaging with system integrations
 * - Meeting management and scheduling
 * - Intelligent notifications and alerts
 * - Cross-system collaboration analytics
 * - Integration with team management, financial control, and procurement systems
 */

export default function DeveloperCollaborationPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <EnterpriseCollaborationHub mode="overview" />
    </div>
  );
}