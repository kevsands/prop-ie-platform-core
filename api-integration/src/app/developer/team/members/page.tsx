'use client';

import React from 'react';
import EnhancedTeamDashboard from '@/components/developer/EnhancedTeamDashboard';

/**
 * Team Members Management Page
 * 
 * This page provides comprehensive team member management functionality
 * using the enterprise-grade EnhancedTeamDashboard component.
 * 
 * Features:
 * - Complete team member directory with real data integration
 * - Department filtering (Design, Construction, Sales, Management)
 * - Performance tracking and analytics
 * - Task assignment and workload management
 * - Contact management and communication tools
 * - Search, filter, and export capabilities
 * - Integration with Fitzgerald Gardens project data
 */

export default function TeamMembersPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
            <p className="text-gray-600 mt-1">
              Manage your development team across all active projects
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Enterprise Active
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Real Data Integration
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Team Dashboard Component */}
      <EnhancedTeamDashboard />
    </div>
  );
}