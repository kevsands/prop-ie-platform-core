'use client';

// src/components/htb/developer/HTBClaimsDashboard.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHTB } from "@/context/HTBContext";
import { HTBClaimStatus, HTBClaim } from "@/types/htb";
import { formatDate, daysFromNow } from "@/utils/date-utils";

/**
 * Dashboard for developers to manage HTB claims
 */
export const HTBClaimsDashboard: React.FC = () => {
  const router = useRouter();
  const { developerClaims, fetchDeveloperClaims, selectedDeveloperClaim, isLoading, error } = useHTB();
  
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "processing" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch claims on component mount
  useEffect(() => {
    fetchDeveloperClaims();
  }, [fetchDeveloperClaims]);
  
  // Filter claims based on active tab and search query
  const filteredClaims = developerClaims.filter((claim: HTBClaim) => {
    // Filter by tab
    if (activeTab === "pending") {
      if (![HTBClaimStatus.ACCESS_CODE_SUBMITTED].includes(claim.status)) {
        return false;
      }
    } else if (activeTab === "processing") {
      if (![HTBClaimStatus.DEVELOPER_PROCESSING, HTBClaimStatus.CLAIM_CODE_RECEIVED, 
             HTBClaimStatus.FUNDS_REQUESTED, HTBClaimStatus.FUNDS_RECEIVED, 
             HTBClaimStatus.DEPOSIT_APPLIED].includes(claim.status)) {
        return false;
      }
    } else if (activeTab === "completed") {
      if (![HTBClaimStatus.COMPLETED, HTBClaimStatus.REJECTED, 
             HTBClaimStatus.EXPIRED, HTBClaimStatus.CANCELLED].includes(claim.status)) {
        return false;
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        claim.propertyId.toLowerCase().includes(query) ||
        claim.accessCode.toLowerCase().includes(query) ||
        claim.claimCode?.toLowerCase().includes(query) ||
        claim.buyerId.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  const handleClaimClick = (claimId: string) => {
    router.push(`/developer/htb/claims/${claimId}`);
  };
  
  const getStatusBadgeClass = (status: HTBClaimStatus) => {
    switch (status) {
      case HTBClaimStatus.ACCESS_CODE_SUBMITTED:
        return "bg-yellow-100 text-yellow-800";
      case HTBClaimStatus.DEVELOPER_PROCESSING:
        return "bg-blue-100 text-blue-800";
      case HTBClaimStatus.CLAIM_CODE_RECEIVED:
        return "bg-indigo-100 text-indigo-800";
      case HTBClaimStatus.FUNDS_REQUESTED:
        return "bg-purple-100 text-purple-800";
      case HTBClaimStatus.FUNDS_RECEIVED:
        return "bg-pink-100 text-pink-800";
      case HTBClaimStatus.DEPOSIT_APPLIED:
        return "bg-blue-100 text-blue-800";
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
  
  if (isLoading && developerClaims.length === 0) {
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
            <h3 className="text-sm font-medium text-red-800">Error Loading HTB Claims</h3>
            <p className="text-sm text-red-700 mt-1">{error.toString()}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Help-to-Buy Claims</h1>
        <div>
          <button
            onClick={() => router.push("/developer/htb/revenue-guide")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Revenue HTB Guide
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total HTB Claims</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{developerClaims.length}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Pending Review</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {developerClaims.filter(c => c.status === HTBClaimStatus.ACCESS_CODE_SUBMITTED).length}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {developerClaims.filter(c => 
                [HTBClaimStatus.DEVELOPER_PROCESSING, HTBClaimStatus.CLAIM_CODE_RECEIVED, HTBClaimStatus.FUNDS_REQUESTED, 
                 HTBClaimStatus.FUNDS_RECEIVED, HTBClaimStatus.DEPOSIT_APPLIED].includes(c.status)
              ).length}
            </dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">
              {developerClaims.filter(c => c.status === HTBClaimStatus.COMPLETED).length}
            </dd>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white shadow-sm rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "all"
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                All Claims
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Pending Review
              </button>
              <button
                onClick={() => setActiveTab("processing")}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "processing"
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === "completed"
                    ? "bg-green-100 text-green-800"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Completed
              </button>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="relative">
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search claims..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Claims Table */}
      {filteredClaims.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No claims found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeTab !== "all"
              ? `No HTB claims in the "${activeTab}" category match your criteria.`
              : "No HTB claims match your search criteria."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Property/Buyer
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Access Code
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Dates
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Next Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClaims.map((claim) => (
                      <tr 
                        key={claim.id} 
                        onClick={() => handleClaimClick(claim.id)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {claim.propertyId}
                              </div>
                              <div className="text-sm text-gray-500">
                                Buyer ID: {claim.buyerId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                              claim.status
                            )}`}
                          >
                            {claim.status.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="text-sm text-gray-900">{claim.accessCode}</div>
                          {claim.accessCodeExpiryDate && (
                            <div className="text-xs text-gray-500">
                              Expires: {formatDate(new Date(claim.accessCodeExpiryDate))}
                              {new Date(claim.accessCodeExpiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                                <span className="ml-2 text-red-500">
                                  {daysFromNow(new Date(claim.accessCodeExpiryDate)) <= 0
                                    ? "Expired"
                                    : `${daysFromNow(new Date(claim.accessCodeExpiryDate))} days left`}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            €{claim.requestedAmount.toLocaleString()}
                          </div>
                          {claim.approvedAmount && (
                            <div className="text-xs text-gray-500">
                              Approved: €{claim.approvedAmount.toLocaleString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(new Date(claim.applicationDate))}
                          </div>
                          <div className="text-xs text-gray-500">
                            Updated: {formatDate(new Date(claim.lastUpdatedDate))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {claim.status === HTBClaimStatus.ACCESS_CODE_SUBMITTED && (
                            <span className="text-yellow-600 font-medium">Process access code</span>
                          )}
                          {claim.status === HTBClaimStatus.DEVELOPER_PROCESSING && (
                            <span className="text-blue-600 font-medium">Add claim code</span>
                          )}
                          {claim.status === HTBClaimStatus.CLAIM_CODE_RECEIVED && (
                            <span className="text-indigo-600 font-medium">Request funds</span>
                          )}
                          {claim.status === HTBClaimStatus.FUNDS_REQUESTED && (
                            <span className="text-purple-600 font-medium">Mark funds received</span>
                          )}
                          {claim.status === HTBClaimStatus.FUNDS_RECEIVED && (
                            <span className="text-pink-600 font-medium">Apply to deposit</span>
                          )}
                          {claim.status === HTBClaimStatus.DEPOSIT_APPLIED && (
                            <span className="text-blue-600 font-medium">Complete claim</span>
                          )}
                          {[HTBClaimStatus.COMPLETED, HTBClaimStatus.REJECTED, HTBClaimStatus.EXPIRED, HTBClaimStatus.CANCELLED].includes(claim.status) && (
                            <span className="text-gray-600">No action needed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};