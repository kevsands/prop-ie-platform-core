'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHTB } from '@/context/HTBContext';
import { HTBClaimStatus, HTBClaim } from '@/types/htb';

// Import our new components
import { 
  AccessCodeForm, 
  ClaimCodeForm, 
  RequestFundsForm,
  FundsReceivedForm,
  DepositAppliedForm,
  CompleteClaimForm,
  AddNoteForm,
  DocumentUploadForm
} from './forms';
import { ClaimDetails } from './ClaimDetails';
import { ClaimDocuments } from './ClaimDocuments';
import { ClaimNotes } from './ClaimNotes';
import { ClaimTabs, TabType } from './ClaimTabs';

/**
 * Component for developers to process a specific HTB claim
 */
export function HTBClaimProcessor({ claimId }: { claimId: string }) {
  const router = useRouter();
  const { 
    selectedDeveloperClaim, 
    fetchClaimById,
    isLoading, 
    error 
  } = useHTB();
  
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    if (claimId) {
      fetchClaimById(claimId, "developer");
    }
  }, [claimId, fetchClaimById]);
  
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Clear any action messages when changing tabs
    setActionError(null);
    setActionSuccess(null);
  };
  
  const handleActionSuccess = (message: string) => {
    setActionSuccess(message);
    setActionError(null);
    // Refresh claim data
    fetchClaimById(claimId, "developer");
  };
  
  const handleActionError = (error: string) => {
    setActionError(error);
    setActionSuccess(null);
  };
  
  // Determine available actions based on claim status
  const getAvailableActions = () => {
    if (!selectedDeveloperClaim) return {};
    
    const status = selectedDeveloperClaim.status;
    
    return {
      canProcessAccessCode: status === HTBClaimStatus.SUBMITTED,
      canUpdateClaimCode: status === HTBClaimStatus.ACCESS_CODE_APPROVED,
      canRequestFunds: status === HTBClaimStatus.CLAIM_CODE_ISSUED,
      canMarkFundsReceived: status === HTBClaimStatus.FUNDS_REQUESTED,
      canMarkDepositApplied: status === HTBClaimStatus.FUNDS_RECEIVED,
      canCompleteClaim: status === HTBClaimStatus.DEPOSIT_APPLIED,
      canAddNote: true, // Always available
      canUploadDocument: true, // Always available
    };
  };
  
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading claim details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading claim: {error instanceof Error ? error.message : String(error)}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Claims
          </button>
        </div>
      </div>
    );
  }
  
  if (!selectedDeveloperClaim) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Claim not found. The claim may have been deleted or you do not have permission to view it.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Claims
          </button>
        </div>
      </div>
    );
  }
  
  const availableActions = getAvailableActions();
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            HTB Claim: {selectedDeveloperClaim.id}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Property: {selectedDeveloperClaim.propertyAddress || 'Not specified'}
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Claims
        </button>
      </div>
      
      {/* Tab Navigation */}
      <ClaimTabs activeTab={activeTab} onTabChange={handleTabChange} />
      
      {/* Action Notifications */}
      {actionSuccess && (
        <div className="mt-4 mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{actionSuccess}</p>
            </div>
          </div>
        </div>
      )}
      
      {actionError && (
        <div className="mt-4 mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{actionError}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Tab Content */}
      <div className="mt-6">
        {/* Details Tab */}
        {activeTab === "details" && (
          <ClaimDetails claim={selectedDeveloperClaim} />
        )}
        
        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="space-y-6">
            <ClaimDocuments documents={selectedDeveloperClaim.documents || []} />
            
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Upload Document
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Upload additional documents for this HTB claim.</p>
                </div>
                <div className="mt-5">
                  <DocumentUploadForm 
                    claimId={claimId} 
                    onSuccess={() => handleActionSuccess('Document uploaded successfully')} 
                    onError={handleActionError}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div className="space-y-6">
            <ClaimNotes notes={selectedDeveloperClaim.notes || []} />
            
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Add Note
                </h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Add a note to this HTB claim.</p>
                </div>
                <div className="mt-5">
                  <AddNoteForm 
                    claimId={claimId} 
                    onSuccess={() => handleActionSuccess('Note added successfully')} 
                    onError={handleActionError}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Actions Tab */}
        {activeTab === "actions" && (
          <div className="space-y-6">
            {/* Process Access Code */}
            {availableActions.canProcessAccessCode && (
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Process Access Code Request
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Approve or reject the buyer's HTB access code request
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <AccessCodeForm 
                    claimId={claimId} 
                    onSuccess={() => handleActionSuccess('Access code processed successfully')} 
                    onError={handleActionError}
                  />
                </div>
              </div>
            )}
            
            {/* Update Claim Code */}
            {availableActions.canUpdateClaimCode && (
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Update Claim Code
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Enter the claim code issued by Revenue
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <ClaimCodeForm 
                    claimId={claimId} 
                    onSuccess={() => handleActionSuccess('Claim code updated successfully')} 
                    onError={handleActionError}
                  />
                </div>
              </div>
            )}
            
            {/* Request Funds */}
            {availableActions.canRequestFunds && (
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Request Funds
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Request the funds from Revenue
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <RequestFundsForm 
                    claimId={claimId} 
                    onSuccess={() => handleActionSuccess('Funds requested successfully')} 
                    onError={handleActionError}
                  />
                </div>
              </div>
            )}
            
            {/* Mark Funds Received */}
            {availableActions.canMarkFundsReceived && (
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Mark Funds Received
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Record when the funds have been received in your account
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <FundsReceivedForm 
                    claimId={claimId} 
                    initialAmount={selectedDeveloperClaim.approvedAmount || selectedDeveloperClaim.requestedAmount}
                    onSuccess={() => handleActionSuccess('Funds marked as received')} 
                    onError={handleActionError}
                  />
                </div>
              </div>
            )}
            
            {/* Mark Deposit Applied */}
            {availableActions.canMarkDepositApplied && (
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Mark Deposit Applied
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Record when the funds have been applied as a deposit
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <DepositAppliedForm 
                    claimId={claimId} 
                    onSuccess={() => handleActionSuccess('Deposit marked as applied')} 
                    onError={handleActionError}
                  />
                </div>
              </div>
            )}
            
            {/* Complete Claim */}
            {availableActions.canCompleteClaim && (
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Complete HTB Claim
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Final step to mark the HTB claim as fully completed
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <CompleteClaimForm 
                    claimId={claimId} 
                    onSuccess={() => handleActionSuccess('Claim completed successfully')} 
                    onError={handleActionError}
                  />
                </div>
              </div>
            )}
            
            {/* No Actions Available */}
            {!Object.values(availableActions).some(value => value === true) && (
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6 text-center">
                  <p className="text-gray-500">No actions available for this claim</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}