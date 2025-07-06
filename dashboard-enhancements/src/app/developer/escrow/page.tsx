'use client';

import React from 'react';
import { EscrowDashboard } from '@/components/escrow/EscrowDashboard';
import { ArrowLeft, Shield, Building2, DollarSign, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DeveloperEscrowPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Link 
            href="/developer"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Escrow Management</h1>
              <p className="text-gray-600 mt-1">
                Secure fund management for all property transactions across your developments
              </p>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Escrow Value</p>
                <p className="text-2xl font-bold text-gray-900">€2.4M</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="text-sm text-green-600 font-medium">+12%</span>
                  <span className="text-sm text-gray-500">this month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Escrow Accounts</p>
                <p className="text-2xl font-bold text-gray-900">18</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-blue-600 font-medium">3 new</span>
                  <span className="text-sm text-gray-500">this week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Properties with Escrow</p>
                <p className="text-2xl font-bold text-gray-900">42</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-purple-600 font-medium">8 pending</span>
                  <span className="text-sm text-gray-500">completion</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Release Time</p>
                <p className="text-2xl font-bold text-gray-900">5.2 days</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-amber-600 font-medium">-1.3 days</span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Escrow Dashboard */}
        <EscrowDashboard 
          className="mb-8"
          transactionId="all" // Show all escrow accounts for developer
        />

        {/* Quick Actions and Guidelines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                href="/developer/escrow/create"
                className="block text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Create New Escrow Account
              </Link>
              <Link 
                href="/developer/escrow/bulk-release"
                className="block text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Bulk Fund Release Management
              </Link>
              <Link 
                href="/developer/escrow/compliance"
                className="block text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Escrow Compliance Reports
              </Link>
              <Link 
                href="/developer/escrow/templates"
                className="block text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Manage Escrow Templates
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Escrow Benefits</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Shield size={16} className="text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Secure Fund Management</p>
                  <p className="text-xs text-gray-600">Funds held safely until all conditions are met</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users size={16} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Multi-Party Coordination</p>
                  <p className="text-xs text-gray-600">Seamless coordination between all stakeholders</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp size={16} className="text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Automated Releases</p>
                  <p className="text-xs text-gray-600">Conditional fund releases based on milestones</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign size={16} className="text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Transparent Tracking</p>
                  <p className="text-xs text-gray-600">Real-time visibility into all fund movements</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Flow Information */}
        <div className="mt-8 bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Escrow Process Flow</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield size={24} className="text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">1. Create Escrow</h4>
              <p className="text-sm text-gray-600">Set up secure escrow account with all participants and conditions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <DollarSign size={24} className="text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">2. Deposit Funds</h4>
              <p className="text-sm text-gray-600">Buyers deposit funds which are held securely until conditions are met</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">3. Conditional Release</h4>
              <p className="text-sm text-gray-600">Funds are released automatically when all milestones are completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}