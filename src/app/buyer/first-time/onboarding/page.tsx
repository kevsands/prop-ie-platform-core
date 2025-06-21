'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PiggyBank, 
  Calculator, 
  Home, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  AlertCircle,
  Shield,
  Award,
  TrendingUp,
  Clock,
  Sparkles
} from 'lucide-react';

import ProgressiveProfilingEngine from '@/components/enterprise/ProgressiveProfilingEngine';
import { CustomerArchetype } from '@/types/enterprise/customer-archetypes';

export default function FirstTimeBuyerOnboarding() {
  const router = useRouter();
  const [currentPhase, setCurrentPhase] = useState<'welcome' | 'profiling' | 'dashboard'>('welcome');
  const [profileData, setProfileData] = useState({});
  const [htbEligibility, setHtbEligibility] = useState<any>(null);

  const userArchetype: CustomerArchetype = {
    primaryRole: 'BUYER',
    subtype: 'FIRST_TIME_IRISH',
    geographicFocus: 'DUBLIN', // This would come from registration data
    urgency: 'ACTIVE',
    experience: 'FIRST_TIME'
  };

  const handleProfileComplete = async (data: any) => {
    setProfileData(data);
    
    // Calculate HTB eligibility
    const eligibility = calculateHTBEligibility(data);
    setHtbEligibility(eligibility);
    
    setCurrentPhase('dashboard');
  };

  const calculateHTBEligibility = (data: any) => {
    // HTB calculation logic
    const isEligible = data.isFirstTime && data.isIrishResident;
    const maxGrant = 30000;
    const propertyPriceLimit = 500000;
    
    let estimatedGrant = 0;
    if (isEligible && data.depositAmount) {
      // HTB is 5% of property price up to €30,000
      const estimatedPropertyPrice = Math.min(data.depositAmount * 10, propertyPriceLimit);
      estimatedGrant = Math.min(estimatedPropertyPrice * 0.05, maxGrant);
    }

    return {
      isEligible,
      estimatedGrant,
      maxGrant,
      propertyPriceLimit,
      requirements: [
        { met: data.isFirstTime, text: 'First-time buyer status' },
        { met: data.isIrishResident, text: 'Irish tax resident' },
        { met: data.annualIncome !== '0-35000', text: 'Sufficient income level' }
      ]
    };
  };

  if (currentPhase === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Welcome Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <Home className="text-blue-600" size={40} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Your Home Buying Journey! 🏡
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              As a first-time buyer in Ireland, you have access to amazing benefits. 
              Let's get you set up to claim your €30,000 Help-to-Buy grant.
            </p>
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <Award size={20} />
              <span className="font-semibold">Up to €30,000 in grants available</span>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PiggyBank className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Help-to-Buy Grant</h3>
              <p className="text-gray-600 mb-4">Get up to €30,000 towards your first home purchase</p>
              <div className="text-2xl font-bold text-blue-600">€30,000</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Stamp Duty Relief</h3>
              <p className="text-gray-600 mb-4">No stamp duty on properties up to €500,000</p>
              <div className="text-2xl font-bold text-green-600">€0</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Exclusive Access</h3>
              <p className="text-gray-600 mb-4">First access to HTB-eligible new developments</p>
              <div className="text-2xl font-bold text-purple-600">Priority</div>
            </div>
          </div>

          {/* What We'll Do Together */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What We'll Do Together (5 minutes)
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Check Your HTB Eligibility</h3>
                  <p className="text-gray-600">Verify your eligibility for the €30,000 grant</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Calculate Your Budget</h3>
                  <p className="text-gray-600">Understand exactly how much you can borrow and afford</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Set Your Preferences</h3>
                  <p className="text-gray-600">Tell us what type of property you're looking for</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Get Matched</h3>
                  <p className="text-gray-600">Receive personalized property recommendations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust & Security */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield size={16} />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award size={16} />
                <span>Central Bank Approved</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp size={16} />
                <span>Trusted by 10,000+ Buyers</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => setCurrentPhase('profiling')}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full text-lg font-semibold hover:from-blue-700 hover:to-green-700 flex items-center space-x-3 mx-auto"
            >
              <span>Start My HTB Application</span>
              <ArrowRight size={24} />
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Free • No commitment • Takes 5 minutes
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentPhase === 'profiling') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8">
          <ProgressiveProfilingEngine
            userArchetype={userArchetype}
            onComplete={handleProfileComplete}
            onUpdate={setProfileData}
          />
        </div>
      </div>
    );
  }

  if (currentPhase === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Congratulations! Your Profile is Complete 🎉
            </h1>
            <p className="text-lg text-gray-600">
              You're now ready to start your home buying journey with all the benefits available to you.
            </p>
          </div>

          {/* HTB Results */}
          {htbEligibility && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* HTB Eligibility Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <PiggyBank className="text-blue-600" size={32} />
                  <h2 className="text-xl font-bold text-gray-900">Your HTB Grant</h2>
                </div>
                
                {htbEligibility.isEligible ? (
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      €{htbEligibility.estimatedGrant.toLocaleString()}
                    </div>
                    <p className="text-gray-600 mb-4">Estimated grant amount</p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="text-green-600" size={20} />
                        <span className="font-semibold text-green-800">You're Eligible!</span>
                      </div>
                      <p className="text-green-700 text-sm">
                        Based on your information, you qualify for the Help-to-Buy grant.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="text-orange-600" size={20} />
                      <span className="font-semibold text-orange-800">Additional Requirements</span>
                    </div>
                    <p className="text-orange-700 text-sm">
                      Please verify the following requirements to confirm eligibility.
                    </p>
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  {htbEligibility.requirements.map((req: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      {req.met ? (
                        <CheckCircle className="text-green-600" size={16} />
                      ) : (
                        <AlertCircle className="text-orange-600" size={16} />
                      )}
                      <span className={`text-sm ${req.met ? 'text-gray-700' : 'text-orange-700'}`}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Next Steps</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Browse HTB Properties</h3>
                      <p className="text-sm text-gray-600">View exclusive new developments</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Get Mortgage Pre-Approval</h3>
                      <p className="text-sm text-gray-600">Connect with trusted lenders</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Schedule Viewings</h3>
                      <p className="text-sm text-gray-600">Book property visits online</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/properties?filter=htb')}
              className="px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <Home size={20} />
              <span>Browse Properties</span>
            </button>
            
            <button
              onClick={() => router.push('/mortgage/pre-approval')}
              className="px-6 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center space-x-2"
            >
              <Calculator size={20} />
              <span>Get Pre-Approved</span>
            </button>
            
            <button
              onClick={() => router.push('/buyer/dashboard')}
              className="px-6 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 flex items-center justify-center space-x-2"
            >
              <FileText size={20} />
              <span>My Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}