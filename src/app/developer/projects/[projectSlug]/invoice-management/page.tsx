'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import useProjectData from '@/hooks/useProjectData';
import InvoiceManagement from '@/components/developer/InvoiceManagement';

export default function InvoiceManagementPage() {
  const params = useParams();
  const projectSlug = params.projectSlug as string;

  const {
    project,
    isLoading,
    error,
    invoices,
    feeProposals,
    professionalAppointments
  } = useProjectData(projectSlug);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice management...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600">Error loading invoice management</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Invoice Management</h2>
          <p className="text-gray-600 mt-1">Manage invoices and fee proposals for {project.name}</p>
        </div>
        <div className="text-sm text-gray-500 text-right">
          <div>Active Invoices: {invoices?.length || 0}</div>
          <div>Pending Proposals: {feeProposals?.length || 0}</div>
        </div>
      </div>

      <InvoiceManagement 
        projectName={project.name}
        initialInvoices={invoices}
        initialProposals={feeProposals}
        initialAppointments={professionalAppointments}
      />
    </div>
  );
}