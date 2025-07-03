'use client';

import React, { useState, useEffect } from 'react';
import UnifiedDocumentManager from '@/components/documents/UnifiedDocumentManager';
import { useVerification } from '@/context/VerificationContext';
import { useEnterpriseAuth } from '@/context/EnterpriseAuthContext';
import { useDocumentSync, useBuyerSync } from '@/hooks/useBuyerSync';
import { 
  FileText, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Users, 
  Building2, 
  Target,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';
import Link from 'next/link';

export default function BuyerDocumentsPage() {
  // Remove user dependency for now to prevent 500 error
  // Remove verification dependency for now to prevent 500 error  
  const verificationData = null;
  const isLoadingVerification = false;
  const { 
    documentsUploaded, 
    documentsVerified, 
    documentsPending, 
    totalDocuments,
    documentProgress 
  } = useDocumentSync();
  const { getCompletionPercentage, getJourneyStatus, data, isLoading: isSyncLoading, error } = useBuyerSync();

  const documentStats = {
    uploaded: documentsUploaded,
    verified: documentsVerified,
    pending: documentsPending,
    total: totalDocuments
  };

  const completionPercentage = getCompletionPercentage();
  const journeyStatus = getJourneyStatus();

  const getStatusBadge = (verified: number, total: number) => {
    const percentage = (verified / total) * 100;
    if (percentage >= 80) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
          <CheckCircle size={14} />
          Nearly Complete
        </span>
      );
    } else if (percentage >= 50) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
          <Clock size={14} />
          In Progress
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">
          <AlertTriangle size={14} />
          Getting Started
        </span>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Management</h1>
            <p className="text-gray-600">
              Securely upload and manage all your documents required for the home buying process.
            </p>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {/* Sync Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${isSyncLoading ? 'bg-amber-500 animate-pulse' : error ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <span className="text-xs text-gray-600">
                {isSyncLoading ? 'Syncing...' : error ? 'Sync Error' : 'Synchronized'}
              </span>
              {data?.lastSyncedAt && (
                <span className="text-xs text-gray-400">
                  {new Date(data.lastSyncedAt).toLocaleTimeString()}
                </span>
              )}
            </div>
            
            <Link
              href="/buyer/verification"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Shield size={16} />
              Verification Status
            </Link>
            <Link
              href="/buyer/journey"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Target size={16} />
              Journey Progress
            </Link>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Uploaded</p>
                <p className="text-xl font-bold text-gray-900">{documentStats.uploaded}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-xl font-bold text-gray-900">{documentStats.verified}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold text-gray-900">{documentStats.pending}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completion</p>
                <p className="text-xl font-bold text-gray-900">{completionPercentage}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-blue-900">Advanced Document System</h3>
                  {getStatusBadge(documentStats.verified, documentStats.total)}
                </div>
                <p className="text-sm text-blue-700">
                  Comprehensive document management integrating verification, journey tracking, and buyer overview systems
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">{documentStats.verified}/{documentStats.total}</div>
              <div className="text-sm text-blue-700">Documents Verified</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-blue-700">Overall Progress</span>
              <span className="text-sm text-blue-600">{completionPercentage}% Complete</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link href="/buyer/journey" className="group">
            <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Target size={20} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Journey Progress</h4>
                  <p className="text-sm text-gray-600">Track your home buying journey</p>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          </Link>
          
          <Link href="/buyer/verification" className="group">
            <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Shield size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Verification Status</h4>
                  <p className="text-sm text-gray-600">Identity and financial verification</p>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          </Link>
          
          <Link href="/buyer/overview" className="group">
            <div className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Building2 size={20} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">Buyer Overview</h4>
                  <p className="text-sm text-gray-600">Complete dashboard and metrics</p>
                </div>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Advanced Unified Document Manager */}
      <UnifiedDocumentManager 
        showIntegrationOptions={true}
        userType="existing-buyer"
      />

      {/* Synchronization Info */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <RefreshCw className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Real-time Synchronization</h3>
          </div>
          <p className="text-sm text-green-800">
            Your documents are automatically synchronized across your journey progress, verification status, 
            and buyer overview dashboard. Upload once, access everywhere.
          </p>
        </div>
        
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Secure & Compliant</h3>
          </div>
          <p className="text-sm text-blue-800">
            All documents are encrypted, securely stored, and compliant with Irish data protection regulations. 
            Access is logged and monitored for your security.
          </p>
        </div>
      </div>
    </div>
  );
}
