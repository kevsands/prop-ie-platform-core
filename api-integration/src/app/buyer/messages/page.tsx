'use client';

import React from 'react';
import { SessionProtectedRoute } from '@/components/auth/SessionProtectedRoute';
import { MessagingInterface } from '@/components/messaging/MessagingInterface';

function MessagesPageContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">
            Communicate with your solicitor, agent, developer, and other professionals
          </p>
        </div>
        
        <MessagingInterface className="h-[calc(100vh-12rem)]" />
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <SessionProtectedRoute>
      <MessagesPageContent />
    </SessionProtectedRoute>
  );
}