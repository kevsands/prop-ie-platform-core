'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, CheckCircle, Shield, Clock, CreditCard, 
  FileText, Eye, Smartphone, Users, ArrowRight, Home
} from 'lucide-react';

export default function BuyOffPlanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">Buy Off-Plan Online</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Reserve Your Home
            <span className="block text-blue-300">Before It's Built</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Secure your dream property with digital contracts, secure payments, and instant reservation. 
            Ireland's first fully digital off-plan buying experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/properties?filter=off-plan"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              Browse Off-Plan Properties
              <Home className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/first-time-buyers"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all border border-blue-500"
            >
              First-Time Buyer Guide
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">How Off-Plan Buying Works</h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Four simple steps to secure your future home today
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">1. Browse & View</h4>
              <p className="text-gray-700">Virtual tours, 3D renders, and digital show homes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">2. Digital Contracts</h4>
              <p className="text-gray-700">Sign legally binding contracts online with digital signature</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">3. Secure Payment</h4>
              <p className="text-gray-700">Protected deposits with milestone-based payments</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">4. Track Progress</h4>
              <p className="text-gray-700">Real-time construction updates and completion notifications</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Buy Off-Plan with PROP</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg">
              <Shield className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">100% Secure</h3>
              <p className="text-gray-600">Your deposit is protected with bank guarantees and insurance</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 shadow-lg">
              <Clock className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Early Bird Pricing</h3>
              <p className="text-gray-600">Lock in today's prices for tomorrow's delivery</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg">
              <Smartphone className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fully Digital</h3>
              <p className="text-gray-600">Complete your purchase from anywhere, anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Secure Your Future Home?</h2>
          <p className="text-xl mb-8">
            Browse available off-plan properties or speak with our experts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/properties?filter=off-plan"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:scale-105 transition-all"
            >
              View Off-Plan Properties
            </Link>
            <Link 
              href="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all"
            >
              Speak with an Expert
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}