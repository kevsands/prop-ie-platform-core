"use client";

import { useHTB } from "@/context/HTBContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Calendar,
  FileText,
  User,
  Heart,
  Info,
  TrendingUp,
  Shield,
  DollarSign
} from "lucide-react";

interface HTBStatus {
  userId: string;
  active: boolean;
  eligible: boolean;
  claimCode?: string;
  status: string;
  nextAction?: string;
  pendingCompletion: boolean;
  lastKnownStatus?: string;
  applicationDate?: Date;
  approvalDate?: Date;
  claimAmount?: number;
  propertyId?: string;
  rosiReference?: string;
  completionCertificate?: string;
  timeline: HTBTimelineEvent[];
  requirements: HTBRequirement[];
}

interface HTBTimelineEvent {
  id: string;
  date: Date;
  event: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  documents?: string[];
}

interface HTBRequirement {
  id: string;
  requirement: string;
  status: 'completed' | 'pending' | 'not_applicable';
  description: string;
  dueDate?: Date;
}

export default function HTBStatus() {
  const { htbClaim, claimStatus, getClaimStatus } = useHTB();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [htbStatus, setHtbStatus] = useState<HTBStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadHTBStatus();
    }
  }, [user]);

  const loadHTBStatus = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/htb/status/${user?.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to load HTB status');
      }

      const data = await response.json();
      setHtbStatus(data);
    } catch (err) {
      console.error('Error loading HTB status:', err);
      setError(err instanceof Error ? err.message : 'Failed to load HTB status');
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = async () => {
    setRefreshing(true);
    try {
      await loadHTBStatus();
    } catch (err) {
      console.error('Error refreshing status:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'completed': 'text-green-600 bg-green-100',
      'current': 'text-blue-600 bg-blue-100',
      'pending': 'text-yellow-600 bg-yellow-100',
      'Eligible': 'text-green-600 bg-green-100',
      'Not Eligible': 'text-red-600 bg-red-100',
      'Application Submitted': 'text-blue-600 bg-blue-100',
      'Under Review': 'text-yellow-600 bg-yellow-100',
      'Approved': 'text-green-600 bg-green-100',
      'Claim Code Issued': 'text-purple-600 bg-purple-100',
      'Funds Requested': 'text-orange-600 bg-orange-100',
      'Funds Released': 'text-green-600 bg-green-100',
      'Completed': 'text-green-600 bg-green-100',
      'Rejected': 'text-red-600 bg-red-100'
    };
    return statusColors[status] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading HTB status...</p>
        </div>
      </div>
    );
  }

  if (error && !htbStatus) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Unable to Load HTB Status</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={loadHTBStatus}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Heart className="text-red-500" />
              Help-to-Buy Status
            </h1>
            <p className="mt-2 text-gray-600">
              Track your Help-to-Buy claim progress and requirements
            </p>
          </div>
          <button
            onClick={refreshStatus}
            disabled={refreshing}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Syncing...' : 'Refresh'}
          </button>
        </div>

        {htbStatus ? (
          <div className="space-y-6">
            {/* Status Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">HTB Overview</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(htbStatus.status)}`}>
                  {htbStatus.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {htbStatus.eligible ? 'Eligible' : 'Not Eligible'}
                  </div>
                  <div className="text-sm text-gray-600">Eligibility Status</div>
                </div>
                
                {htbStatus.claimAmount && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      €{htbStatus.claimAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Claim Amount</div>
                  </div>
                )}

                {htbStatus.claimCode && (
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600 font-mono">
                      {htbStatus.claimCode}
                    </div>
                    <div className="text-sm text-gray-600">Claim Code</div>
                  </div>
                )}

                {htbStatus.applicationDate && (
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {new Date(htbStatus.applicationDate).toLocaleDateString('en-IE')}
                    </div>
                    <div className="text-sm text-gray-600">Applied Date</div>
                  </div>
                )}
              </div>

              {htbStatus.nextAction && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Next Action Required</span>
                  </div>
                  <p className="text-blue-800">{htbStatus.nextAction}</p>
                </div>
              )}

              {htbStatus.rosiReference && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">ROS.ie Integration</span>
                  </div>
                  <p className="text-green-800">Reference: {htbStatus.rosiReference}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <ExternalLink className="h-3 w-3" />
                    <Link href="https://ros.ie" target="_blank" className="text-green-700 hover:text-green-900 text-sm">
                      View on ROS.ie
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline */}
            {htbStatus.timeline.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Application Timeline
                </h2>
                <div className="space-y-4">
                  {htbStatus.timeline.map((event, index) => (
                    <div key={event.id} className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {event.status === 'completed' ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : event.status === 'current' ? (
                          <Clock className="h-6 w-6 text-blue-600" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{event.event}</h3>
                          <span className="text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString('en-IE')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        {event.documents && event.documents.length > 0 && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                            <FileText className="h-3 w-3" />
                            <span>{event.documents.length} document(s) attached</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {htbStatus.requirements.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Requirements Checklist
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {htbStatus.requirements.map((requirement) => (
                    <div key={requirement.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {requirement.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : requirement.status === 'not_applicable' ? (
                            <div className="h-4 w-4 rounded-full bg-gray-300"></div>
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          )}
                          <span className="font-medium text-gray-900">{requirement.requirement}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(requirement.status)}`}>
                          {requirement.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{requirement.description}</p>
                      {requirement.dueDate && requirement.status === 'pending' && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                          <Calendar className="h-3 w-3" />
                          <span>Due: {new Date(requirement.dueDate).toLocaleDateString('en-IE')}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* No HTB Claim State */
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                No Help-to-Buy Application Found
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500 mx-auto">
                <p>You haven't submitted a Help-to-Buy application yet. Check if you're eligible and start your application.</p>
              </div>
              <div className="mt-5 flex justify-center gap-4">
                <Link
                  href="/buyer/calculator/htb"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Check Eligibility
                </Link>
                <Link
                  href="/buyer/htb"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Start Application
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
