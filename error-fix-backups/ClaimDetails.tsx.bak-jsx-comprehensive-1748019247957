'use client';

import React from 'react';
import { formatDate } from '@/utils/date-utils';
import { HTBClaimStatus } from '@/types/htb';

interface ClaimDetailsProps {
  claim: any; // Ideally, you should define a proper type for your claim
}

export function ClaimDetails({ claim }: ClaimDetailsProps) {
  if (!claim) {
    return <div className="text-center py-8 text-gray-500">No claim details available</div>;
  }

  const getBadgeClass = (status: string) => {
    switch (status) {
      case HTBClaimStatus.SUBMITTED:
        return 'bg-blue-100 text-blue-800';
      case HTBClaimStatus.ACCESS_CODE_APPROVED:
      case HTBClaimStatus.CLAIM_CODE_ISSUED:
        return 'bg-green-100 text-green-800';
      case HTBClaimStatus.FUNDS_REQUESTED:
        return 'bg-yellow-100 text-yellow-800';
      case HTBClaimStatus.FUNDS_RECEIVED:
      case HTBClaimStatus.DEPOSIT_APPLIED:
      case HTBClaimStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case HTBClaimStatus.ACCESS_CODE_REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            HTB Claim Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Property: {claim.propertyAddress || 'Not specified'}
          </p>
        </div>
        <div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeClass(claim.status)}`}>
            {claim.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Claim ID</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{claim.id}</dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Buyer</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {claim.buyerName || 'Not specified'}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Contact</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {claim.buyerEmail || 'No email'} {claim.buyerPhone ? `| ${claim.buyerPhone}` : ''}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Requested Amount</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              €{claim.requestedAmount ? claim.requestedAmount.toLocaleString() : '0'}
            </dd>
          </div>
          {claim.approvedAmount && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Approved Amount</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                €{claim.approvedAmount.toLocaleString()}
              </dd>
            </div>
          )}
          {claim.claimCode && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Claim Code</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {claim.claimCode}
                {claim.claimCodeExpiryDate && (
                  <span className="ml-2 text-xs text-gray-500">
                    (Expires: {formatDate(claim.claimCodeExpiryDate)})
                  </span>
                )}
              </dd>
            </div>
          )}
          {claim.accessCodeApprovalDate && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Access Code Approved</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(claim.accessCodeApprovalDate)}
              </dd>
            </div>
          )}
          {claim.claimCodeIssueDate && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Claim Code Issued</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(claim.claimCodeIssueDate)}
              </dd>
            </div>
          )}
          {claim.fundsRequestDate && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Funds Requested</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(claim.fundsRequestDate)}
              </dd>
            </div>
          )}
          {claim.fundsReceivedDate && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Funds Received</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(claim.fundsReceivedDate)}
                {claim.fundsReceivedAmount && (
                  <span className="ml-2">
                    (€{claim.fundsReceivedAmount.toLocaleString()})
                  </span>
                )}
              </dd>
            </div>
          )}
          {claim.depositAppliedDate && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Deposit Applied</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(claim.depositAppliedDate)}
              </dd>
            </div>
          )}
          {claim.completionDate && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Claim Completed</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(claim.completionDate)}
              </dd>
            </div>
          )}
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Submission Date</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {formatDate(claim.createdAt)}
            </dd>
          </div>
          {claim.lastUpdated && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(claim.lastUpdated)}
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}