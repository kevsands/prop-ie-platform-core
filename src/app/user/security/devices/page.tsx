'use client';

import React from 'react';
import TrustedDevices from '../../../../components/security/TrustedDevices';

export default function TrustedDevicesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Device Management</h1>
        <p className="text-gray-500 mb-8">
          Manage the devices you use to access your account. Trusted devices help improve 
          your security by verifying familiar devices during sign-in.
        </p>

        <TrustedDevices />
      </div>
    </div>
  );
}