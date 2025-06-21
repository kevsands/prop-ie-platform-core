'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Target, 
  TrendingUp, 
  Users, 
  ArrowRight,
  CheckCircle,
  PlusCircle,
  BarChart3,
  Mail,
  Calendar,
  MapPin,
  Award,
  Shield,
  Sparkles
} from 'lucide-react';

import ProgressiveProfilingEngine from '@/components/enterprise/ProgressiveProfilingEngine';
import { CustomerArchetype } from '@/types/enterprise/customer-archetypes';

export default function DeveloperOnboarding() {
  const router = useRouter();
  const [currentPhase, setCurrentPhase] = useState<'welcome' | 'profiling' | 'dashboard'>('welcome');
  const [profileData, setProfileData] = useState({});
  const [marketingPlan, setMarketingPlan] = useState<any>(null);

  const userArchetype: CustomerArchetype = {
    primaryRole: 'DEVELOPER',
    subtype: 'PROPERTY_DEVELOPER',
    geographicFocus: 'DUBLIN',
    urgency: 'ACTIVE',
    experience: 'SOME_EXPERIENCE'
  };

  const handleProfileComplete = async (data: any) => {
    setProfileData(data);
    
    // Generate marketing recommendations
    const plan = generateMarketingPlan(data);
    setMarketingPlan(plan);
    
    setCurrentPhase('dashboard');
  };

  const generateMarketingPlan = (data: any) => {
    const hasHTBBuyers = data.targetBuyers?.includes('ftb');
    const isLargeProject = parseInt(data.currentProjects) > 3;
    
    return {
      recommendedChannels: [
        {
          channel: 'First-Time Buyer Portal',
          enabled: hasHTBBuyers,
          reach: '15,000+ qualified HTB buyers',
          cost: 'Free for first 3 months',
          roi: '300% average ROI'
        },
        {
          channel: 'Premium Property Listings',
          enabled: true,
          reach: '25,000+ active property browsers',
          cost: '€99/month per development',
          roi: '250% average ROI'
        },
        {
          channel: 'Investor Network',
          enabled: data.targetBuyers?.includes('investors'),
          reach: '5,000+ buy-to-let investors',
          cost: '€199/month',
          roi: '400% average ROI'
        }
      ],
      estimatedLeads: Math.max(50, parseInt(data.currentProjects || 1) * 25),
      projectedSales: Math.max(5, parseInt(data.currentProjects || 1) * 3),
      timeToFirstLead: '24 hours'
    };
  };

  if (currentPhase === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Welcome Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <Building2 className="text-blue-600" size={40} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to PROP Developer Platform 🏗️
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Connect with Ireland's largest network of qualified property buyers. 
              Sell faster with our premium marketing tools and buyer insights.
            </p>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
              <Award size={20} />
              <span className="font-semibold">Join 500+ top developers already selling on PROP</span>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Qualified Leads</h3>
              <p className="text-gray-600 mb-4">Reach buyers who are ready to purchase</p>
              <div className="text-2xl font-bold text-green-600">15,000+</div>
              <div className="text-sm text-gray-500">Active HTB buyers</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Faster Sales</h3>
              <p className="text-gray-600 mb-4">Average time from listing to sale</p>
              <div className="text-2xl font-bold text-blue-600">45 days</div>
              <div className="text-sm text-gray-500">vs 90 days industry average</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Higher ROI</h3>
              <p className="text-gray-600 mb-4">Marketing return on investment</p>
              <div className="text-2xl font-bold text-purple-600">300%</div>
              <div className="text-sm text-gray-500">Average ROI</div>
            </div>
          </div>

          {/* Platform Features */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Everything You Need to Sell Properties
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Premium Property Listings</h3>
                    <p className="text-gray-600">Showcase with 3D tours, floor plans, and virtual staging</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Buyer Matching</h3>
                    <p className="text-gray-600">AI-powered matching with qualified buyers</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sales Analytics</h3>
                    <p className="text-gray-600">Real-time insights and performance tracking</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Lead Nurturing</h3>
                    <p className="text-gray-600">Automated email campaigns and follow-ups</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="text-teal-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Viewing Management</h3>
                    <p className="text-gray-600">Online booking and automated scheduling</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="text-red-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sales Team Tools</h3>
                    <p className="text-gray-600">CRM integration and team collaboration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Success Stories */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">€2.5M</div>
                <div className="text-blue-100">Sales in first quarter</div>
                <div className="text-sm text-blue-200 mt-1">- Ballymore Properties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">60%</div>
                <div className="text-blue-100">Faster sales cycle</div>
                <div className="text-sm text-blue-200 mt-1">- Cairn Homes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">200+</div>
                <div className="text-blue-100">Qualified leads per month</div>
                <div className="text-sm text-blue-200 mt-1">- Glenveagh Properties</div>
              </div>
            </div>
          </div>

          {/* Getting Started */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Get Started in 3 Simple Steps
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Complete Your Developer Profile</h3>
                  <p className="text-gray-600">Tell us about your company and development portfolio (3 minutes)</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Add Your First Development</h3>
                  <p className="text-gray-600">Upload property details and get instant buyer matching (5 minutes)</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Start Receiving Leads</h3>
                  <p className="text-gray-600">Get matched with qualified buyers within 24 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield size={16} />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award size={16} />
                <span>PropTech Ireland Member</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles size={16} />
                <span>ISO 27001 Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp size={16} />
                <span>€500M+ in Sales</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => setCurrentPhase('profiling')}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 flex items-center space-x-3 mx-auto"
            >
              <span>Start Selling Today</span>
              <ArrowRight size={24} />
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Free setup • No long-term contracts • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentPhase === 'profiling') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to PROP Developer Dashboard! 🚀
            </h1>
            <p className="text-lg text-gray-600">
              Your premium developer account is now active. Let's get your first development listed.
            </p>
          </div>

          {/* Marketing Plan */}
          {marketingPlan && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Recommended Channels */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Personalized Marketing Plan</h2>
                <div className="space-y-4">
                  {marketingPlan.recommendedChannels.map((channel: any, index: number) => (
                    <div 
                      key={index} 
                      className={`border rounded-lg p-4 ${
                        channel.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{channel.channel}</h3>
                        {channel.enabled ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                            Recommended
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm">
                            Optional
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>📊 Reach: {channel.reach}</div>
                        <div>💰 Cost: {channel.cost}</div>
                        <div>📈 ROI: {channel.roi}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projections */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">30-Day Projections</h2>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {marketingPlan.estimatedLeads}
                    </div>
                    <div className="text-sm text-gray-600">Estimated Leads</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {marketingPlan.projectedSales}
                    </div>
                    <div className="text-sm text-gray-600">Projected Sales</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">
                      {marketingPlan.timeToFirstLead}
                    </div>
                    <div className="text-sm text-gray-600">Time to First Lead</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => router.push('/developer/projects/add')}
                className="p-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-500 hover:bg-blue-50 flex flex-col items-center space-y-2"
              >
                <PlusCircle size={32} />
                <span className="font-semibold">Add Development</span>
                <span className="text-sm">List your first project</span>
              </button>
              
              <button
                onClick={() => router.push('/developer/buyers')}
                className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 hover:bg-green-100 flex flex-col items-center space-y-2"
              >
                <Users size={32} />
                <span className="font-semibold">Browse Buyers</span>
                <span className="text-sm">See active buyers</span>
              </button>
              
              <button
                onClick={() => router.push('/developer/analytics')}
                className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-purple-600 hover:bg-purple-100 flex flex-col items-center space-y-2"
              >
                <BarChart3 size={32} />
                <span className="font-semibold">View Analytics</span>
                <span className="text-sm">Track performance</span>
              </button>
              
              <button
                onClick={() => router.push('/developer/help')}
                className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-600 hover:bg-orange-100 flex flex-col items-center space-y-2"
              >
                <Mail size={32} />
                <span className="font-semibold">Get Support</span>
                <span className="text-sm">Contact our team</span>
              </button>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <button
              onClick={() => router.push('/developer/projects/add')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2 mx-auto"
            >
              <PlusCircle size={20} />
              <span>Add Your First Development</span>
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Takes 5 minutes • Start receiving leads within 24 hours
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}