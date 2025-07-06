'use client';

import React from 'react';
import { EnterpriseAuthProvider } from '@/context/EnterpriseAuthContext';
import EnterpriseLoginForm from '@/components/auth/EnterpriseLoginForm';

export default function EnterpriseLoginPage() {
  return (
    <EnterpriseAuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-[#2B5273] text-white p-3 rounded-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              PROP.ie Enterprise
            </h2>
            <p className="text-gray-600">
              Ireland's Advanced Property Technology Platform
            </p>
          </div>

          {/* Login Form */}
          <EnterpriseLoginForm />

          {/* Footer */}
          <div className="text-center">
            <div className="border-t border-gray-200 pt-6">
              <p className="text-xs text-gray-500 mb-4">
                Enterprise-grade property transaction platform
              </p>
              <div className="flex justify-center space-x-6 text-xs text-gray-400">
                <a href="/privacy" className="hover:text-gray-600 transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="hover:text-gray-600 transition-colors">
                  Terms of Service
                </a>
                <a href="/support" className="hover:text-gray-600 transition-colors">
                  Support
                </a>
              </div>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Trusted by Ireland's Property Leaders
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#2B5273]">€847M+</div>
                <div className="text-xs text-gray-600">Annual Transactions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2B5273]">500+</div>
                <div className="text-xs text-gray-600">Partners</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2B5273]">99.97%</div>
                <div className="text-xs text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EnterpriseAuthProvider>
  );
}