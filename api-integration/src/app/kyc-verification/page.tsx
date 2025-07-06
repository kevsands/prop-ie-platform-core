import React from 'react';
import KycAmlFlow from '@/components/compliance/KycAmlFlow';

export default function KycVerificationPage() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#2B5273]">KYC/AML Verification</h1>
          <p className="text-gray-600">
            Complete your identity and anti-money laundering verification to proceed with your property transaction.
            This process is required by regulatory authorities and helps ensure a secure transaction experience.
          </p>
        </div>
        
        <KycAmlFlow />
        
        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-3 text-[#2B5273]">Why We Need This Information</h2>
          <p className="text-gray-600 mb-4">
            KYC (Know Your Customer) and AML (Anti-Money Laundering) verification is a legal requirement for all property transactions in Ireland.
            This process helps:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Protect all parties involved in the transaction</li>
            <li>Prevent fraud and financial crime</li>
            <li>Ensure compliance with Irish and EU regulations</li>
            <li>Facilitate a smoother transaction process</li>
          </ul>
          <p className="mt-4 text-sm text-gray-500">
            All your information is securely stored and processed in accordance with GDPR and our <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
} 