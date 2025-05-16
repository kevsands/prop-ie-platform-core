'use client';

// src/components/htb/buyer/developer/HTBStatusViewer.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useHTB, HTBClaim, HTBDocument, HTBNote, HTBStatusUpdate, HTBClaimStatus } from "@/context/HTBContext";
import { formatDate } from "@/utils/date-utils";

/**
 * Component to display the current status of a buyer's HTB claim
 */
export const HTBStatusViewer: React.FC<{ claimId?: string }> = ({ claimId }) => {
  const { selectedBuyerClaim, fetchClaimById, buyerClaims, isLoading, error } = useHTB();
  const [activeTab, setActiveTab] = useState<"details" | "documents" | "notes">("details");
  
  useEffect(() => {
    // If claim ID is provided, fetch that specific claim
    if (claimId) {
      fetchClaimById(claimId, "buyer");
    } 
    // If no claim ID but we have claims, select the first one
    else if (buyerClaims.length > 0 && !selectedBuyerClaim) {
      fetchClaimById(buyerClaims[0].id, "buyer");
    }
  }, [claimId, buyerClaims, selectedBuyerClaim, fetchClaimById]);
  
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
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "INITIATED":
      case "ACCESS_CODE_RECEIVED":
        return "bg-blue-100 text-blue-800";
      case "ACCESS_CODE_SUBMITTED":
      case "DEVELOPER_PROCESSING":
      case "CLAIM_CODE_RECEIVED":
        return "bg-yellow-100 text-yellow-800";
      case "FUNDS_REQUESTED":
      case "FUNDS_RECEIVED":
      case "DEPOSIT_APPLIED":
        return "bg-indigo-100 text-indigo-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
      case "EXPIRED":
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const renderStatusStep = (label: string, date: Date | null, status: "complete" | "current" | "upcoming") => {
    return (
      <div className="relative pb-8">
        {/* Line connecting steps */}
        {status !== "upcoming" && (
          <div
            className="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300"
            aria-hidden="true"
          ></div>
        )}
        <div className="relative flex items-start group">
          {/* Status circle */}
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
              ) : status === "current" ? (
                <div className="w-4 h-4 bg-white rounded-full"></div>
              ) : (
                <div className="w-4 h-4 bg-white rounded-full"></div>
              )}
            </div>
          </div>
          
          {/* Step content */}
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
  
  const renderStatusTimeline = () => {
    const claim = selectedBuyerClaim;
    const steps = [];
    
    // Application initiated
    steps.push(
      renderStatusStep(
        "Application Initiated",
        new Date(claim.applicationDate),
        "complete"
      )
    );
    
    // Access code submitted
    if (claim.status === HTBClaimStatus.ACCESS_CODE_SUBMITTED || 
        [HTBClaimStatus.DEVELOPER_PROCESSING, HTBClaimStatus.CLAIM_CODE_RECEIVED, HTBClaimStatus.FUNDS_REQUESTED, 
         HTBClaimStatus.FUNDS_RECEIVED, HTBClaimStatus.DEPOSIT_APPLIED, HTBClaimStatus.COMPLETED].includes(claim.status)) {
      steps.push(
        renderStatusStep(
          "Access Code Submitted",
          // Find status update for access code submission
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
    
    // Developer processing
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
    
    // Funds requested
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
    
    // Funds received
    if ([HTBClaimStatus.FUNDS_RECEIVED, HTBClaimStatus.DEPOSIT_APPLIED, HTBClaimStatus.COMPLETED].includes(claim.status)) {
      steps.push(
        renderStatusStep(
          "Funds Received",
          claim.statusHistory.find(u => u.newStatus === HTBClaimStatus.FUNDS_RECEIVED)?.updatedAt
            ? new Date(claim.statusHistory.find(u => u.newStatus === HTBClaimStatus.FUNDS_RECEIVED)!.updatedAt)
            : null,
          "complete"
        )
      );
    } else {
      steps.push(
        renderStatusStep(
          "Funds Received",
          null,
          claim.status === HTBClaimStatus.FUNDS_REQUESTED ? "current" : "upcoming"
        )
      );
    }
    
    // Deposit applied
    if ([HTBClaimStatus.DEPOSIT_APPLIED, HTBClaimStatus.COMPLETED].includes(claim.status)) {
      steps.push(
        renderStatusStep(
          "Deposit Applied",
          claim.statusHistory.find(u => u.newStatus === HTBClaimStatus.DEPOSIT_APPLIED)?.updatedAt
            ? new Date(claim.statusHistory.find(u => u.newStatus === HTBClaimStatus.DEPOSIT_APPLIED)!.updatedAt)
            : null,
          "complete"
        )
      );
    } else {
      steps.push(
        renderStatusStep(
          "Deposit Applied",
          null,
          claim.status === HTBClaimStatus.FUNDS_RECEIVED ? "current" : "upcoming"
        )
      );
    }
    
    // Completed
    if (claim.status === HTBClaimStatus.COMPLETED) {
      steps.push(
        renderStatusStep(
          "Process Complete",
          claim.statusHistory.find(u => u.newStatus === HTBClaimStatus.COMPLETED)?.updatedAt
            ? new Date(claim.statusHistory.find(u => u.newStatus === HTBClaimStatus.COMPLETED)!.updatedAt)
            : null,
          "complete"
        )
      );
    } else {
      steps.push(
        renderStatusStep(
          "Process Complete",
          null,
          claim.status === HTBClaimStatus.DEPOSIT_APPLIED ? "current" : "upcoming"
        )
      );
    }
    
    // Special case for rejected/expired/cancelled
    if ([HTBClaimStatus.REJECTED, HTBClaimStatus.EXPIRED, HTBClaimStatus.CANCELLED].includes(claim.status)) {
      steps.push(
        renderStatusStep(
          `Process ${claim.status.toLowerCase()}`,
          claim.statusHistory.find(u => [HTBClaimStatus.REJECTED, HTBClaimStatus.EXPIRED, HTBClaimStatus.CANCELLED].includes(u.newStatus))?.updatedAt
            ? new Date(claim.statusHistory.find(u => [HTBClaimStatus.REJECTED, HTBClaimStatus.EXPIRED, HTBClaimStatus.CANCELLED].includes(u.newStatus))!.updatedAt)
            : null,
          "complete"
        )
      );
    }
    
    return steps;
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Help-to-Buy Claim Status</h1>
      <p className="text-gray-600 mb-6">
        Track the progress of your Help-to-Buy application and next steps.
      </p>
      
      {/* Status overview */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">HTB Claim Overview</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Current status and key information about your Help-to-Buy claim.
            </p>
          </div>
          <span
            className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(
              selectedBuyerClaim.status
            )}`}
          >
            {selectedBuyerClaim.status.replace(/_/g, " ")}
          </span>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Property</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {selectedBuyerClaim.propertyId}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Access Code</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {selectedBuyerClaim.accessCode || "Not yet submitted"}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Requested Amount</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                €{selectedBuyerClaim.requestedAmount.toLocaleString()}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Approved Amount</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {selectedBuyerClaim.approvedAmount
                  ? `€${selectedBuyerClaim.approvedAmount.toLocaleString()}`
                  : "Pending approval"}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Application Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(new Date(selectedBuyerClaim.applicationDate))}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(new Date(selectedBuyerClaim.lastUpdatedDate))}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab("details")}
            className={`${
              activeTab === "details"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Status Timeline
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`${
              activeTab === "documents"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ml-8`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`${
              activeTab === "notes"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ml-8`}
          >
            Notes
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      <div className="bg-white shadow sm:rounded-lg p-6">
        {activeTab === "details" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status Timeline</h3>
            <div className="flow-root">
              <ul className="-mb-8">{renderStatusTimeline()}</ul>
            </div>
          </div>
        )}
        
        {activeTab === "documents" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
            
            {selectedBuyerClaim.documents.length === 0 ? (
              <div className="text-sm text-gray-500">No documents available yet.</div>
            ) : (
              <div className="overflow-hidden border border-gray-200 sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {selectedBuyerClaim.documents.map((doc: HTBDocument) => (
                    <li key={doc.id}>
                      <div className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <svg
                                className="flex-shrink-0 h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <p className="ml-2 text-sm font-medium text-blue-600 truncate">
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {doc.name}
                                </a>
                              </p>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                {doc.type.replace(/_/g, " ")}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                {formatDate(new Date(doc.uploadedAt))}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {activeTab === "notes" && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notes & Updates</h3>
            
            {selectedBuyerClaim.notes.filter((note: HTBNote) => !note.isPrivate).length === 0 ? (
              <div className="text-sm text-gray-500">No notes available yet.</div>
            ) : (
              <div className="flow-root">
                <ul className="-mb-8">
                  {selectedBuyerClaim.notes
                    .filter((note: HTBNote) => !note.isPrivate)
                    .map((note: HTBNote, noteIdx: number) => (
                      <li key={note.id}>
                        <div className="relative pb-8">
                          {noteIdx !== selectedBuyerClaim.notes.filter((n: HTBNote) => !n.isPrivate).length - 1 && (
                            <span
                              className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            ></span>
                          )}
                          <div className="relative flex items-start space-x-3">
                            <div className="relative">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center ring-8 ring-white">
                                <svg
                                  className="h-5 w-5 text-gray-500"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div>
                                <div className="text-sm">
                                  <span className="font-medium text-gray-900">
                                    Note
                                  </span>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">
                                  {formatDate(new Date(note.createdAt))}
                                </p>
                              </div>
                              <div className="mt-2 text-sm text-gray-700">
                                <p>{note.content}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Help information */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900">Need Help?</h3>
        <p className="mt-2 text-sm text-blue-700">
          If you have questions about your Help-to-Buy claim, please contact your developer or
          reach out to our support team for assistance.
        </p>
        <div className="mt-4">
          <a
            href="mailto:support@prop.ie"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};