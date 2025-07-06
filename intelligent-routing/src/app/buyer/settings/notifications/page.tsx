'use client';

import React from 'react';
import { SessionProtectedRoute } from '@/components/auth/SessionProtectedRoute';
import { NotificationPreferences } from '@/components/notifications/NotificationPreferences';
import { ArrowLeft, Bell, Settings } from 'lucide-react';
import Link from 'next/link';

function NotificationSettingsContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Link 
            href="/buyer/settings"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Settings
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
              <p className="text-gray-600 mt-1">
                Manage how and when you receive notifications from PROP.ie
              </p>
            </div>
          </div>
        </div>

        {/* Notification Preferences Component */}
        <NotificationPreferences />

        {/* Additional Information */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">About Notification Settings</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  <strong>In-App:</strong> Notifications appear within the PROP.ie platform when you're logged in.
                </p>
                <p>
                  <strong>Email:</strong> Notifications sent to your registered email address.
                </p>
                <p>
                  <strong>SMS:</strong> Text messages sent to your mobile phone for urgent notifications.
                </p>
                <p>
                  <strong>Push:</strong> Browser or mobile app notifications that appear even when you're not actively using PROP.ie.
                </p>
                <p className="mt-3">
                  <strong>Quiet Hours:</strong> During these times, only urgent notifications (financial and legal) will be delivered via SMS and push. Other notifications will be delayed until your quiet hours end.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Your notification preferences are encrypted and stored securely. We never share your contact information with third parties.
            <br />
            <Link href="/privacy" className="text-blue-600 hover:underline">
              View our Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function NotificationSettingsPage() {
  return (
    <SessionProtectedRoute>
      <NotificationSettingsContent />
    </SessionProtectedRoute>
  );
}