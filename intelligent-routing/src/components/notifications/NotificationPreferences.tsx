'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Phone, 
  Clock, 
  Settings, 
  Save,
  Smartphone,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface NotificationChannel {
  inApp: boolean;
  email: boolean;
  sms: boolean;
  push: boolean;
}

interface NotificationCategory {
  system: NotificationChannel;
  communication: NotificationChannel;
  financial: NotificationChannel;
  legal: NotificationChannel;
  property: NotificationChannel;
  task: NotificationChannel;
}

interface QuietHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
  timezone: string;
}

interface DigestSettings {
  realTime: boolean;
  digest: 'never' | 'daily' | 'weekly';
  digestTime: string;
}

interface NotificationPreferences {
  userId: string;
  categories: NotificationCategory;
  quietHours: QuietHours;
  frequency: DigestSettings;
}

interface NotificationPreferencesProps {
  className?: string;
}

export function NotificationPreferences({ className = '' }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    userId: '',
    categories: {
      system: { inApp: true, email: true, sms: false, push: true },
      communication: { inApp: true, email: true, sms: false, push: true },
      financial: { inApp: true, email: true, sms: true, push: true },
      legal: { inApp: true, email: true, sms: true, push: true },
      property: { inApp: true, email: true, sms: false, push: true },
      task: { inApp: true, email: false, sms: false, push: true }
    },
    quietHours: {
      enabled: true,
      startTime: '22:00',
      endTime: '08:00',
      timezone: 'Europe/Dublin'
    },
    frequency: {
      realTime: true,
      digest: 'daily',
      digestTime: '09:00'
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/notifications/preferences', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notification preferences');
      }

      const data = await response.json();
      if (data.preferences) {
        setPreferences(data.preferences);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/notifications/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        throw new Error('Failed to save notification preferences');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateCategoryChannel = (category: keyof NotificationCategory, channel: keyof NotificationChannel, enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories[category],
          [channel]: enabled
        }
      }
    }));
  };

  const updateQuietHours = (field: keyof QuietHours, value: any) => {
    setPreferences(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value
      }
    }));
  };

  const updateFrequency = (field: keyof DigestSettings, value: any) => {
    setPreferences(prev => ({
      ...prev,
      frequency: {
        ...prev.frequency,
        [field]: value
      }
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system': return <Settings size={16} className="text-gray-600" />;
      case 'communication': return <MessageSquare size={16} className="text-blue-600" />;
      case 'financial': return <Shield size={16} className="text-green-600" />;
      case 'legal': return <AlertTriangle size={16} className="text-purple-600" />;
      case 'property': return <Bell size={16} className="text-orange-600" />;
      case 'task': return <CheckCircle size={16} className="text-indigo-600" />;
      default: return <Info size={16} className="text-gray-600" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'system': return 'System Updates';
      case 'communication': return 'Messages & Communication';
      case 'financial': return 'Payments & Financial';
      case 'legal': return 'Legal & Compliance';
      case 'property': return 'Property Updates';
      case 'task': return 'Tasks & Milestones';
      default: return category;
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'system': return 'Platform updates, maintenance notices, security alerts';
      case 'communication': return 'New messages from professionals, conversation updates';
      case 'financial': return 'Payment confirmations, transaction updates, HTB status';
      case 'legal': return 'Contract updates, compliance requirements, legal deadlines';
      case 'property': return 'Property status changes, viewing confirmations, developer updates';
      case 'task': return 'Task completions, milestone achievements, reminders';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border shadow-sm p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notification preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
              <p className="text-sm text-gray-600 mt-1">
                Control how and when you receive notifications
              </p>
            </div>
          </div>
          <button
            onClick={savePreferences}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save size={16} />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
        
        {success && (
          <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            <span className="text-green-800 text-sm">Preferences saved successfully!</span>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertTriangle size={16} className="text-red-600" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-8">
        {/* Notification Categories */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Categories</h3>
          <div className="space-y-6">
            {Object.entries(preferences.categories).map(([category, channels]) => (
              <div key={category} className="border rounded-lg p-4">
                <div className="flex items-start gap-3 mb-4">
                  {getCategoryIcon(category)}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{getCategoryLabel(category)}</h4>
                    <p className="text-sm text-gray-600 mt-1">{getCategoryDescription(category)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* In-App */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.inApp}
                      onChange={(e) => updateCategoryChannel(category as keyof NotificationCategory, 'inApp', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Bell size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-700">In-App</span>
                  </label>
                  
                  {/* Email */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.email}
                      onChange={(e) => updateCategoryChannel(category as keyof NotificationCategory, 'email', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Mail size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-700">Email</span>
                  </label>
                  
                  {/* SMS */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.sms}
                      onChange={(e) => updateCategoryChannel(category as keyof NotificationCategory, 'sms', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <MessageSquare size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-700">SMS</span>
                  </label>
                  
                  {/* Push */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channels.push}
                      onChange={(e) => updateCategoryChannel(category as keyof NotificationCategory, 'push', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Smartphone size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-700">Push</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiet Hours */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Moon size={20} className="text-indigo-600" />
            Quiet Hours
          </h3>
          <div className="border rounded-lg p-4 space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.quietHours.enabled}
                onChange={(e) => updateQuietHours('enabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Enable quiet hours (reduce non-urgent notifications)</span>
            </label>
            
            {preferences.quietHours.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={preferences.quietHours.startTime}
                    onChange={(e) => updateQuietHours('startTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={preferences.quietHours.endTime}
                    onChange={(e) => updateQuietHours('endTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Frequency */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-green-600" />
            Delivery Frequency
          </h3>
          <div className="border rounded-lg p-4 space-y-4">
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.frequency.realTime}
                  onChange={(e) => updateFrequency('realTime', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Volume2 size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">Real-time notifications (instant delivery)</span>
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Digest</label>
              <select
                value={preferences.frequency.digest}
                onChange={(e) => updateFrequency('digest', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="never">Never send email digest</option>
                <option value="daily">Daily digest</option>
                <option value="weekly">Weekly digest</option>
              </select>
            </div>
            
            {preferences.frequency.digest !== 'never' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Digest Time</label>
                <input
                  type="time"
                  value={preferences.frequency.digestTime}
                  onChange={(e) => updateFrequency('digestTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                // Enable all notifications
                const allEnabled = { inApp: true, email: true, sms: true, push: true };
                setPreferences(prev => ({
                  ...prev,
                  categories: Object.keys(prev.categories).reduce((acc, key) => ({
                    ...acc,
                    [key]: allEnabled
                  }), {} as NotificationCategory)
                }));
              }}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
            >
              Enable All
            </button>
            
            <button
              onClick={() => {
                // Disable all except in-app
                const minimalEnabled = { inApp: true, email: false, sms: false, push: false };
                setPreferences(prev => ({
                  ...prev,
                  categories: Object.keys(prev.categories).reduce((acc, key) => ({
                    ...acc,
                    [key]: minimalEnabled
                  }), {} as NotificationCategory)
                }));
              }}
              className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
            >
              Minimal Notifications
            </button>
            
            <button
              onClick={() => {
                // Essential only (financial and legal)
                const essentialCategories = ['financial', 'legal'];
                setPreferences(prev => ({
                  ...prev,
                  categories: Object.keys(prev.categories).reduce((acc, key) => ({
                    ...acc,
                    [key]: essentialCategories.includes(key) 
                      ? { inApp: true, email: true, sms: true, push: true }
                      : { inApp: true, email: false, sms: false, push: false }
                  }), {} as NotificationCategory)
                }));
              }}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}