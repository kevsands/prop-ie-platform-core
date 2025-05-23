'use client';

import React, { useState } from 'react';
import { AlertCircle, Clock, Shield, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BuyerRegistrationFlow from './BuyerRegistrationFlow';

interface DevelopmentCTAProps {
  developmentId: string;
  developmentName: string;
  status: string;
  unitsAvailable: number;
  startingPrice: string;
}

export default function DevelopmentCTA({ 
  developmentId, 
  developmentName, 
  status, 
  unitsAvailable,
  startingPrice 
}: DevelopmentCTAProps) {
  const router = useRouter();
  const [showRegistrationsetShowRegistration] = useState(false);

  // Determine CTA based on status
  if (status === 'Sold Out') {
    return (
      <div className="bg-gray-100 rounded-lg p-8">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-gray-600 mr-2" />
          <h3 className="text-xl font-bold text-gray-800">Fully Sold</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Unfortunately, all units in this development have been sold. Register your interest for future phases or similar developments.
        </p>
        <Link
          href="/register-interest"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Register Interest for Phase 2
        </Link>
      </div>
    );
  }

  if (status === 'Coming Soon') {
    return (
      <div className="bg-blue-50 rounded-lg p-8">
        <div className="flex items-center mb-4">
          <Clock className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-xl font-bold text-blue-800">Coming Soon</h3>
        </div>
        <p className="text-blue-700 mb-6">
          This exciting development will be launching soon. Register now to be first in line when sales open.
        </p>
        <Link
          href={`/register-interest/${developmentId}`}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Register Early Interest
        </Link>
      </div>
    );
  }

  // For available units - urgent CTA
  return (
    <>
      {!showRegistration ? (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-8 border-2 border-red-200">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center mb-2">
                <TrendingUp className="w-6 h-6 text-red-600 mr-2" />
                <h3 className="text-2xl font-bold text-red-800">
                  {unitsAvailable === 1 ? 'Last Unit Available!' : `Only ${unitsAvailable} Units Left!`}
                </h3>
              </div>
              <p className="text-red-700 font-medium">
                High demand - Reserve now to avoid disappointment
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Starting from</p>
              <p className="text-2xl font-bold text-gray-900">{startingPrice}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Secure Your Home in 4 Steps:</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  1
                </div>
                <p className="text-sm text-gray-600">Register & Verify</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  2
                </div>
                <p className="text-sm text-gray-600">Upload Documents</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  3
                </div>
                <p className="text-sm text-gray-600">Proof of Funds</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  4
                </div>
                <p className="text-sm text-gray-600">Reserve Property</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="w-4 h-4 mr-2" />
              <span>Fully secure process • Bank-level encryption</span>
            </div>
            <button
              onClick={() => setShowRegistration(true)}
              className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors animate-pulse"
            >
              Reserve Now - €5,000 Deposit
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              By proceeding, you acknowledge that this is a <span className="font-semibold">non-refundable deposit</span> and 
              you are entering into a <span className="font-semibold">legally binding purchase agreement</span>.
            </p>
          </div>
        </div>
      ) : (
        <BuyerRegistrationFlow
          developmentId={developmentId}
          developmentName={developmentName}
          onComplete={(data: any) => {
            // In real app, would process payment and create reservation
            router.push(`/buyer/dashboard?reservation=${developmentId}`);
          }
        />
      )}
    </>
  );
}