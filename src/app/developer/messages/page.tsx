'use client';

import React from 'react';
import { DeveloperMessagingInterface } from '@/components/developer/DeveloperMessagingInterface';

export default function DeveloperMessagesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Developer Communications Hub</h1>
          <p className="text-gray-600 mt-2">
            Manage communications with your design team, construction team, buyers, and stakeholders
          </p>
        </div>
        
        <DeveloperMessagingInterface className="h-[calc(100vh-12rem)]" />
      </div>
    </div>
  );
}