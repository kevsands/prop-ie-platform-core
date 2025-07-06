'use client';

import React from 'react';
import EnterpriseFinancialControlSystem from '@/components/developer/EnterpriseFinancialControlSystem';

/**
 * Enterprise Financial Control Dashboard
 * 
 * Comprehensive financial management system for PROP.ie developers
 * providing real-time visibility into costs across all projects and teams.
 * 
 * Features:
 * - 7 Cost Category Management (Land, Bonds/Levies, Connections, Professional, Construction, Financing, Marketing)
 * - Multi-project financial oversight and budget control
 * - Team cost allocation and performance tracking
 * - Payment scheduling and invoice matching
 * - Cash flow forecasting and compliance monitoring
 * - Integration with procurement and team management systems
 */

export default function DeveloperFinancialControlPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <EnterpriseFinancialControlSystem mode="overview" />
    </div>
  );
}