'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  X, 
  Sparkles, 
  Gift, 
  TrendingUp, 
  Home,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { emailMarketingEngine, UserCategory } from '../services/emailMarketingEngine';

interface EmailCaptureProps {
  page?: string;
  context?: 'property-view' | 'search' | 'homepage' | 'exit-intent';
  propertyId?: string;
  searchQuery?: string;
}

export default function EmailCaptureWidget({ 
  page = 'homepage', 
  context = 'homepage',
  propertyId,
  searchQuery 
}: EmailCaptureProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Show widget based on context and user behavior
  useEffect(() => {
    let timer: NodeJS.Timeout;

    switch (context) {
      case 'exit-intent':
        // Show on mouse leave (exit intent)
        const handleMouseLeave = (e: MouseEvent) => {
          if (e.clientY <= 0) {
            setIsVisible(true);
          }
        };
        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);

      case 'property-view':
        // Show after 30 seconds on property page
        timer = setTimeout(() => setIsVisible(true), 30000);
        break;

      case 'search':
        // Show after 45 seconds on search results
        timer = setTimeout(() => setIsVisible(true), 45000);
        break;

      default:
        // Show after 20 seconds on homepage
        timer = setTimeout(() => setIsVisible(true), 20000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [context]);

  const getWidgetContent = () => {
    switch (context) {
      case 'exit-intent':
        return {
          title: "Wait! Don't Miss Out 🏠",
          subtitle: "Get exclusive property alerts before they hit the market",
          benefit: "Early access to new developments",
          cta: "Get Exclusive Access"
        };
      
      case 'property-view':
        return {
          title: "Interested in This Property? 🏡",
          subtitle: "Get instant alerts for similar properties in this area",
          benefit: "Personalized property recommendations",
          cta: "Get Property Alerts"
        };
      
      case 'search':
        return {
          title: "Save Your Search 💾",
          subtitle: "Get notified when new properties match your criteria",
          benefit: "Never miss your perfect home",
          cta: "Save Search"
        };
      
      default:
        return {
          title: "Find Your Dream Home 🌟",
          subtitle: "Join 10,000+ buyers getting exclusive property alerts",
          benefit: "AI-powered property matching",
          cta: "Get Started"
        };
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      // Track visitor behavior based on context
      const behaviorData = {
        pageViews: 1,
        timeOnSite: 60, // Estimated
        pagesVisited: [page],
        searchQueries: searchQuery ? [searchQuery] : [],
        propertyViews: propertyId ? [propertyId] : [],
        deviceType: window.innerWidth < 768 ? 'mobile' as const : 'desktop' as const,
        referralSource: document.referrer || 'direct',
        location: 'Ireland' // Could be detected via IP
      };

      // Create contact in email marketing system
      const contact = await emailMarketingEngine.trackVisitorBehavior(
        `visitor-${Date.now()}`,
        behaviorData,
        email
      );

      if (contact) {
        // Add firstName if provided
        if (firstName) {
          contact.firstName = firstName;
        }

        // Add interest tags
        if (interests.length > 0) {
          contact.tags = [...contact.tags, ...interests];
        }

        console.log(`✅ Email captured: ${email} (${contact.category})`);
      }

      setIsSuccess(true);
      setCurrentStep(3);

      // Hide widget after success
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);

    } catch (error) {
      console.error('Failed to capture email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInterestToggle = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const interestOptions = [
    { id: 'first-time-buyer', label: 'First-time buyer', icon: '🏠' },
    { id: 'investment', label: 'Investment properties', icon: '📈' },
    { id: 'new-builds', label: 'New developments', icon: '🏗️' },
    { id: 'help-to-buy', label: 'Help to Buy scheme', icon: '💝' },
    { id: 'luxury', label: 'Luxury properties', icon: '⭐' },
    { id: 'rental', label: 'Rental properties', icon: '🔑' }
  ];

  const content = getWidgetContent();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success State */}
        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">You're All Set! 🎉</h3>
            <p className="text-gray-600 mb-4">
              Welcome to PROP! You'll receive your first property recommendations within 24 hours.
            </p>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>What's next:</strong> Check your email for a welcome message with exclusive property insights.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-6 pb-0">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{content.title}</h3>
                <p className="text-gray-600">{content.subtitle}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleEmailSubmit} className="p-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name (optional)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    disabled={!email}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      What are you interested in? (Select all that apply)
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {interestOptions.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleInterestToggle(option.id)}
                          className={`p-3 rounded-lg border text-left text-sm transition-colors ${
                            interests.includes(option.id)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <span className="mr-2">{option.icon}</span>
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 font-medium"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium flex items-center justify-center"
                    >
                      {isSubmitting ? 'Joining...' : content.cta}
                      {!isSubmitting && <Mail className="w-4 h-4 ml-2" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Benefits */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <Gift className="w-4 h-4 mr-2 text-green-500" />
                  <span>{content.benefit}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                  <span>AI-powered property matching</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-2">
                  <Home className="w-4 h-4 mr-2 text-purple-500" />
                  <span>Exclusive early access to new developments</span>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Join 10,000+ buyers • No spam • Unsubscribe anytime
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}