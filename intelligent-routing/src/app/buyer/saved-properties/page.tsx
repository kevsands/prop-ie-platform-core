/**
 * Enhanced Saved Properties Page
 * Features smart wishlist with AI-powered alerts and recommendations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EnterpriseAuthProvider } from '@/context/EnterpriseAuthContext';
import { useEnterpriseAuth } from '@/context/EnterpriseAuthContext';
import AuthErrorBoundary from '@/components/auth/AuthErrorBoundary';
import SmartWishlist from '@/components/wishlist/SmartWishlist';
import { UserProfile } from '@/lib/algorithms/PropertyRecommendationEngine';
import { 
  Heart, 
  TrendingUp, 
  Bell, 
  Target,
  Sparkles,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle,
  Settings,
  Home,
  ArrowRight
} from 'lucide-react';

function SavedPropertiesContent() {
  const router = useRouter();
  const { user, isAuthenticated } = useEnterpriseAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalSaved: 0,
    unreadAlerts: 0,
    priceDrops: 0,
    newSimilar: 0,
    scheduledViewings: 0
  });

  // Build user profile
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const buildUserProfile = () => {
      const storedData = localStorage.getItem('userRegistration');
      let profile: UserProfile = {};

      if (storedData) {
        const registrationData = JSON.parse(storedData);
        profile = {
          firstName: registrationData.firstName,
          lastName: registrationData.lastName,
          email: registrationData.email,
          journeySource: registrationData.journeyContext?.source,
        };
      }

      if (user) {
        profile = {
          ...profile,
          firstName: user.firstName || profile.firstName,
          lastName: user.lastName || profile.lastName,
          email: user.email || profile.email,
        };
      }

      // Add demo preferences
      profile = {
        ...profile,
        budget: '350-500',
        hasHTB: true,
        preferredCounties: ['Dublin', 'Kildare'],
        propertyType: ['apartment', 'house'],
        bedrooms: '2-3',
        currentStatus: 'first-time-buyer',
        importantFeatures: ['parking', 'balcony', 'garden'],
        completionScore: 80
      };

      setUserProfile(profile);
    };

    buildUserProfile();
  }, [isAuthenticated, user]);

  // Update stats from localStorage
  useEffect(() => {
    const updateStats = () => {
      const wishlist = JSON.parse(localStorage.getItem('propertyWishlist') || '[]');
      const alerts = JSON.parse(localStorage.getItem('wishlistAlerts') || '[]');
      
      const unreadAlerts = alerts.filter((alert: any) => !alert.isRead).length;
      const priceDropAlerts = alerts.filter((alert: any) => alert.type === 'price_drop' && !alert.isRead).length;
      const similarPropertyAlerts = alerts.filter((alert: any) => alert.type === 'similar_property' && !alert.isRead).length;
      
      setDashboardStats({
        totalSaved: wishlist.length,
        unreadAlerts,
        priceDrops: priceDropAlerts,
        newSimilar: similarPropertyAlerts,
        scheduledViewings: Math.floor(wishlist.length * 0.3) // Simulate some having viewings
      });
    };

    updateStats();
    
    // Update stats periodically
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart size={48} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view your saved properties</h2>
          <button
            onClick={() => router.push('/login?redirect=/buyer/saved-properties')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="text-red-500" />
                Saved Properties
              </h1>
              <p className="text-gray-600 mt-1">
                Smart wishlist with AI-powered alerts and recommendations
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/properties')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Home size={16} />
                Browse Properties
              </button>
              
              <button
                onClick={() => router.push('/buyer/dashboard')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <BarChart3 size={16} />
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saved Properties</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalSaved}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Smart Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.unreadAlerts}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-600" />
              {dashboardStats.unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Price Drops</p>
                <p className="text-2xl font-bold text-green-600">{dashboardStats.priceDrops}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600 transform rotate-180" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Similar Found</p>
                <p className="text-2xl font-bold text-purple-600">{dashboardStats.newSimilar}</p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Viewings</p>
                <p className="text-2xl font-bold text-orange-600">{dashboardStats.scheduledViewings}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Alert Summary */}
        {dashboardStats.unreadAlerts > 0 && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Sparkles size={20} />
                  Smart Alerts Active
                </h3>
                <p className="text-blue-100">
                  You have {dashboardStats.unreadAlerts} new alerts about your saved properties
                </p>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  {dashboardStats.priceDrops > 0 && (
                    <span className="flex items-center gap-1">
                      <TrendingUp size={14} className="transform rotate-180" />
                      {dashboardStats.priceDrops} price drops
                    </span>
                  )}
                  {dashboardStats.newSimilar > 0 && (
                    <span className="flex items-center gap-1">
                      <Target size={14} />
                      {dashboardStats.newSimilar} similar properties
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
                  <Bell size={24} />
                </div>
                <p className="text-sm text-blue-100">Check alerts below</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => router.push('/properties/recommendations')}
            className="bg-white rounded-lg p-6 border hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="text-white" size={20} />
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-blue-600" size={16} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Find Similar Properties</h3>
            <p className="text-gray-600 text-sm">
              Get AI recommendations based on your saved properties
            </p>
          </button>

          <button
            onClick={() => router.push('/buyer/htb/calculator')}
            className="bg-white rounded-lg p-6 border hover:border-green-300 hover:bg-green-50 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="text-white" size={20} />
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-green-600" size={16} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">HTB Calculator</h3>
            <p className="text-gray-600 text-sm">
              Calculate potential Help to Buy savings on saved properties
            </p>
          </button>

          <button
            onClick={() => router.push('/buyer/viewings')}
            className="bg-white rounded-lg p-6 border hover:border-purple-300 hover:bg-purple-50 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="text-white" size={20} />
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-purple-600" size={16} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Schedule Viewings</h3>
            <p className="text-gray-600 text-sm">
              Book property viewings for your saved properties
            </p>
          </button>
        </div>

        {/* Smart Wishlist Component */}
        <SmartWishlist userProfile={userProfile || undefined} />

        {/* Help Section */}
        <div className="mt-8 bg-gray-100 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Settings size={20} />
            Smart Wishlist Features
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-medium mb-2">Intelligent Alerts</h4>
              <ul className="space-y-1">
                <li>• Price drop notifications</li>
                <li>• Similar property discoveries</li>
                <li>• Status change updates</li>
                <li>• Open house announcements</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Smart Organization</h4>
              <ul className="space-y-1">
                <li>• Tag-based categorization</li>
                <li>• Match score sorting</li>
                <li>• Viewing history tracking</li>
                <li>• Custom note taking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SavedPropertiesPage() {
  return (
    <EnterpriseAuthProvider>
      <AuthErrorBoundary>
        <SavedPropertiesContent />
      </AuthErrorBoundary>
    </EnterpriseAuthProvider>
  );
}