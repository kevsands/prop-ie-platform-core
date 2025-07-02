'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BuyerPropChoicePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = async () => {
      try {
        // Mock user data
        const mockUser = {
          id: 'buyer-123',
          firstName: 'Sarah',
          lastName: 'O\'Connor',
          email: 'sarah@example.com'
        };
        
        setUser(mockUser);
        setLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth/login?redirect=/buyer/prop-choice');
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your customization options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-blue-800/90 z-0" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-xl">
            Welcome to PROP Choice
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-6 max-w-3xl mx-auto">
            Hello {user?.firstName}! Customize your new home with furniture, smart features, and premium upgrades
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 inline-block">
            <p className="text-yellow-300 font-bold text-lg">
              🎉 You have €2,500 PROP Choice Credit Available
            </p>
          </div>
        </div>
      </section>

      {/* Your Properties Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Your Properties</h2>
          
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-green-700">✅ Ready for Customization</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold">15 Fitzgerald Gardens, Drogheda</h4>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Deposit Paid
                  </span>
                </div>
                <p className="text-gray-600 mb-4">Reserved on March 15, 2024</p>
                <p className="text-sm text-gray-500 mb-6">Booking deposit: €10,000</p>
                <Link
                  href="/buyer/prop-choice/fitzgerald-gardens-unit-15"
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  🎨 Customize This Property
                </Link>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold">23 Fitzgerald Gardens, Drogheda</h4>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    Deposit Pending
                  </span>
                </div>
                <p className="text-gray-600 mb-4">Reserved on March 20, 2024</p>
                <p className="text-sm text-gray-500 mb-6">Outstanding deposit: €12,000</p>
                <button
                  disabled
                  className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  💳 Complete Deposit Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Packages Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Available Customization Packages</h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Preview what's available for your property customization
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-100 to-blue-50 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-2">🛋️ Room Packs</h3>
              <p className="text-gray-600 mb-4">Complete furniture solutions for every room</p>
              <p className="text-2xl font-bold text-purple-600">From €1,800</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-100 to-purple-50 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-2">🏠 Smart Features</h3>
              <p className="text-gray-600 mb-4">Home automation and security systems</p>
              <p className="text-2xl font-bold text-blue-600">From €1,600</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-100 to-orange-50 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-2">✨ Premium Upgrades</h3>
              <p className="text-gray-600 mb-4">Luxury finishes and energy efficiency</p>
              <p className="text-2xl font-bold text-orange-600">From €8,500</p>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-100 to-pink-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Your €2,500 PROP Choice Credit</h2>
          <p className="text-xl mb-8 text-gray-700">
            Use your credit towards any room packs, smart features, or premium upgrades. Credit applies automatically when you customize your reserved properties.
          </p>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 inline-block">
            <p className="text-lg font-medium text-gray-700">Available Credit Balance</p>
            <p className="text-4xl font-bold text-green-600">€2,500</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Customizing?</h2>
          <p className="text-xl mb-8">
            Select one of your reserved properties above to begin customization
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/buyer/prop-choice/fitzgerald-gardens-unit-15"
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:scale-105 transition-all"
            >
              Start Customizing
            </Link>
            <Link 
              href="/solutions/prop-choice"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-purple-600 transition-all"
            >
              Learn More About PROP Choice
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}