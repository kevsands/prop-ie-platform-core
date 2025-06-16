'use client';

// src/components/htb/buyer/developer/HTBStatusViewer.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useHTB, HTBClaim, HTBDocument, HTBNote, HTBStatusUpdate, HTBClaimStatus } from "@/context/HTBContext";
import { formatDate } from "@/utils/date-utils";

interface HTBStatusViewerProps {
  claimId?: string;
}

/**
 * Component to display the current status of a buyer's HTB claim
 */
export const HTBStatusViewer: React.FC<HTBStatusViewerProps> = ({ claimId }) => {
  const { selectedBuyerClaim, fetchClaimById, buyerClaims, isLoading, error } = useHTB();
  const [activeTabsetActiveTab] = useState<"details" | "documents" | "notes">("details");

  useEffect(() => {
    if (claimId) {
      fetchClaimById(claimId, "buyer");
    } else if (buyerClaims.length> 0 && !selectedBuyerClaim) {
      fetchClaimById(buyerClaims[0].id, "buyer");
    }
  }, [claimIdbuyerClaimsselectedBuyerClaimfetchClaimById]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading HTB Claim</h3>
            <p className="text-sm text-red-700 mt-1">{error.toString()}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedBuyerClaim) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">No HTB Claim Found</h3>
            <p className="text-sm text-yellow-700 mt-1">
              You don't have any active Help-to-Buy claims. Start a new application to continue.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status: HTBClaimStatus): string => {
    switch (status) {
      case HTBClaimStatus.INITIATED:
      case HTBClaimStatus.ACCESS_CODE_RECEIVED:
        return "bg-blue-100 text-blue-800";
      case HTBClaimStatus.ACCESS_CODE_SUBMITTED:
      case HTBClaimStatus.DEVELOPER_PROCESSING:
      case HTBClaimStatus.CLAIM_CODE_RECEIVED:
        return "bg-yellow-100 text-yellow-800";
      case HTBClaimStatus.FUNDS_REQUESTED:
      case HTBClaimStatus.FUNDS_RECEIVED:
      case HTBClaimStatus.DEPOSIT_APPLIED:
        return "bg-indigo-100 text-indigo-800";
      case HTBClaimStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case HTBClaimStatus.REJECTED:
      case HTBClaimStatus.EXPIRED:
      case HTBClaimStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStatusStep = (
    label: string,
    date: Date | null,
    status: "complete" | "current" | "upcoming"
  ): React.ReactElement => {
    return (
      <div className="relative pb-8">
        {status !== "upcoming" && (
          <div
            className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300"
            aria-hidden="true"
          ></div>
        )}
        <div className="relative flex items-start group">
          <div className="h-9 flex items-center">
            <div
              className={`relative z-10 w-8 h-8 flex items-center justify-center ${
                status === "complete"
                  ? "bg-green-500"
                  : status === "current"
                  ? "bg-blue-500"
                  : "bg-gray-300"
              } rounded-full`}
            >
              {status === "complete" ? (
                <svg
                  className="w-5 h-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <div className="w-4 h-4 bg-white rounded-full"></div>
              )}
            </div>
          </div>

          <div className="ml-4">
            <div
              className={`text-sm font-medium ${
                status === "upcoming" ? "text-gray-500" : "text-gray-900"
              }`}
            >
              {label}
            </div>
            {date && (
              <div className="text-xs text-gray-500">{formatDate(date)}</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderStatusTimeline = (): React.ReactElement => {
    const claim = selectedBuyerClaim;
    const steps: React.ReactElement[] = [];

    steps.push(
      renderStatusStep(
        "Application Initiated",
        new Date(claim.applicationDate),
        "complete"
      )
    );

    if (claim.status === HTBClaimStatus.ACCESS_CODE_SUBMITTED || 
        [HTBClaimStatus.DEVELOPER_PROCESSING, HTBClaimStatus.CLAIM_CODE_RECEIVED, HTBClaimStatus.FUNDS_REQUESTED, 
         HTBClaimStatus.FUNDS_RECEIVED, HTBClaimStatus.DEPOSIT_APPLIED, HTBClaimStatus.COMPLETED].includes(claim.status)) {
      steps.push(
        renderStatusStep(
          "Access Code Submitted",
          claim.statusHistory.find(u => u.newStatus === HTBClaimStatus.ACCESS_CODE_SUBMITTED)?.updatedAt 
            ? new Date(claim.statusHistory.find(u => u.newStatus === HTBClaimStatus.ACCESS_CODE_SUBMITTED)!.updatedAt)
            : null,
          "complete"
        )
      );
    } else {
      steps.push(
        renderStatusStep(
          "Submit Access Code",
          null,
          claim.status === HTBClaimStatus.ACCESS_CODE_RECEIVED ? "current" : "upcoming"
        )
      );
    }

    if ([HTBClaimStatus.DEVELOPER_PROCESSING, HTBClaimStatus.CLAIM_CODE_RECEIVED, HTBClaimStatus.FUNDS_REQUESTED, 
         HTBClaimStatus.FUNDS_RECEIVED, HTBClaimStatus.DEPOSIT_APPLIED, HTBClaimStatus.COMPLETED].includes(claim.status)) {
      steps.push(
        renderStatusStep(
          "Developer Processing",
          claim.statusHistory.find(u => u.newStatus === HTBClaimStatus.DEVELOPER_PROCESSING)?.updatedAt
            ? new Date(claim.statusHistory.find(u => u.newStatus === HTBClaimStatus.DEVELOPER_PROCESSING)!.updatedAt)
            : null,
          "complete"
        )
      );
    } else {
      steps.push(
        renderStatusStep(
          "Developer Processing",
          null,
          claim.status === HTBClaimStatus.ACCESS_CODE_SUBMITTED ? "current" : "upcoming"
        )
      );
    }

    if ([HTBClaimStatus.FUNDS_REQUESTED, HTBClaimStatus.FUNDS_RECEIVED, HTBClaimStatus.DEPOSIT_APPLIED, HTBClaimStatus.COMPLETED].includes(claim.status)) {
      steps.push(
        renderStatusStep(
          "Funds Requested",
          claim.statusHistory.find(u => u.newStatus === HTBClaimStatus.FUNDS_REQUESTED)?.updatedAt
            ? new Date(claim.statusHistory.find(u => u.newStatus === HTBClaimStatus.FUNDS_REQUESTED)!.updatedAt)
            : null,
          "complete"
        )
      );
    } else {
      steps.push(
        renderStatusStep(
          "Funds Requested",
          null,
          claim.status === HTBClaimStatus.CLAIM_CODE_RECEIVED ? "current" : "upcoming"
        )
      );
    }

    return (
      <div className="flow-root">
        <ul className="-mb-8">{steps}</ul>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Help-to-Buy Claim Status</h1>
      <p className="text-gray-600 mb-6">
        Track the progress of your Help-to-Buy application and next steps.
      </p>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Claim Status</h2>
              <p className="text-sm text-gray-500">Current status of your application</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(selectedBuyerClaim.status)}`}>
              {selectedBuyerClaim.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Application Timeline</h3>
          {renderStatusTimeline()}
        </div>
      </div>
    </div>
  );
};