'use client';

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Calculator, 
  Shield, 
  TrendingUp, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Download,
  Phone,
  Mail,
  Heart,
  Users,
  MapPin,
  Clock,
  Gift,
  Zap
} from 'lucide-react';
import EmailCaptureWidget from '../../../components/EmailCaptureWidget';
import { acquisitionFunnelEngine, ConversionGoal } from '../../../services/acquisitionFunnelEngine';

export default function FirstTimeBuyersLanding() {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    // Track visitor entry into funnel
    const initializeTracking = async () => {
      const visitor = await acquisitionFunnelEngine.trackVisitorEntry(
        `session-${Date.now()}`,
        {
          landingPage: '/landing/first-time-buyers',
          acquisitionSource: 'organic-search', // Would be detected from referrer
          utmParams: {
            source: 'google',
            medium: 'organic',
            campaign: 'first-time-buyer-seo'
          }
        }
      );
      setVisitorId(visitor.id);
    };

    initializeTracking();

    // Show email capture after 45 seconds
    const timer = setTimeout(() => {
      setShowEmailCapture(true);
    }, 45000);

    return () => clearTimeout(timer);
  }, []);

  const handleDownloadGuide = async () => {
    if (visitorId) {
      await acquisitionFunnelEngine.updateVisitorBehavior(visitorId, {
        clickEvent: 'download-guide-click'
      });
      
      await acquisitionFunnelEngine.recordConversion(
        visitorId,
        ConversionGoal.EMAIL_SIGNUP,
        100, // Value of guide download
        '/landing/first-time-buyers',
        'ftb-guide-download'
      );
    }
    setShowEmailCapture(true);
  };

  const handleCalculatorClick = async () => {
    if (visitorId) {
      await acquisitionFunnelEngine.updateVisitorBehavior(visitorId, {
        clickEvent: 'mortgage-calculator-click',
        formInteraction: 'calculator-usage'
      });
    }
  };

  const handleConsultationRequest = async () => {
    if (visitorId) {
      await acquisitionFunnelEngine.recordConversion(
        visitorId,
        ConversionGoal.PROPERTY_INQUIRY,
        200, // Value of consultation request
        '/landing/first-time-buyers',
        'ftb-consultation'
      );
    }
  };

  // Track scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      
      if (visitorId && scrolled > 25) {
        acquisitionFunnelEngine.updateVisitorBehavior(visitorId, {
          scrollDepth: scrolled
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visitorId]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Gift className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">FREE First-Time Buyer Guide Worth €500</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Buy Your First Home in Ireland 
                <span className="text-yellow-300"> with Confidence</span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Join 10,000+ successful first-time buyers who used our proven system to secure their dream home. 
                Get expert guidance, exclusive properties, and government scheme support.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleDownloadGuide}
                  className="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-all font-bold text-lg transform hover:scale-105"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Get FREE Guide Now
                </button>
                <button
                  onClick={handleCalculatorClick}
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-700 transition-all font-medium"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Affordability
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  <span className="text-sm">Government Approved</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-400" />
                  <span className="text-sm">Secure & Licensed</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-400" />
                  <span className="text-sm">10,000+ Success Stories</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">What You'll Get FREE:</h3>
                <ul className="space-y-4">
                  {[
                    'Complete step-by-step buying guide',
                    'Help-to-Buy scheme application help',
                    'Mortgage pre-approval assistance',
                    'Exclusive property previews',
                    'Solicitor recommendations',
                    'First-time buyer grants guide'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 p-4 bg-yellow-400/20 rounded-lg border border-yellow-400/30">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Total Value:</span>
                    <span className="text-xl font-bold text-yellow-300">€500</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span>Your Price Today:</span>
                    <span className="text-2xl font-bold text-green-400">FREE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join Thousands of Successful First-Time Buyers
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from real people who achieved homeownership through PROP.ie
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah & James McCarthy',
                location: 'Fitzgerald Gardens, Dublin',
                image: '/images/testimonials/sarah-james.jpg',
                quote: 'PROP.ie made our first home purchase completely stress-free. The guide was invaluable and we saved months of research.',
                timeline: '3 months from search to keys',
                savings: '€15,000 saved on fees'
              },
              {
                name: 'Michael O\'Sullivan',
                location: 'Ballymakenny View, Drogheda',
                image: '/images/testimonials/michael.jpg',
                quote: 'The Help-to-Buy support was incredible. They handled everything and I got my €30,000 grant approved in weeks.',
                timeline: '6 weeks to approval',
                savings: '€30,000 Help-to-Buy grant'
              },
              {
                name: 'Emma & David Walsh',
                location: 'Ellwood, Cork',
                image: '/images/testimonials/emma-david.jpg',
                quote: 'We thought buying was impossible on our budget. PROP.ie found us the perfect home and helped with 100% financing.',
                timeline: '2 months to completion',
                savings: '€0 deposit required'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Home className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-green-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{testimonial.timeline}</span>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span>{testimonial.savings}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Simple Path to Homeownership
            </h2>
            <p className="text-xl text-gray-600">
              Our proven 5-step process has helped 10,000+ first-time buyers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              {
                step: 1,
                title: 'Get Your FREE Guide',
                description: 'Download our comprehensive first-time buyer guide with all the insider tips',
                icon: Download,
                color: 'blue'
              },
              {
                step: 2,
                title: 'Check Your Budget',
                description: 'Use our mortgage calculator to see exactly what you can afford',
                icon: Calculator,
                color: 'green'
              },
              {
                step: 3,
                title: 'Get Pre-Approved',
                description: 'We connect you with the best mortgage brokers for fast approval',
                icon: CheckCircle,
                color: 'purple'
              },
              {
                step: 4,
                title: 'Find Your Home',
                description: 'Browse exclusive properties matched to your budget and preferences',
                icon: Home,
                color: 'orange'
              },
              {
                step: 5,
                title: 'Move In',
                description: 'Our team handles everything from contracts to keys in your hands',
                icon: Heart,
                color: 'red'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 bg-${step.color}-100 rounded-full flex items-center justify-center`}>
                  <step.icon className={`w-8 h-8 text-${step.color}-600`} />
                </div>
                <div className={`w-8 h-8 mx-auto mb-4 bg-${step.color}-600 text-white rounded-full flex items-center justify-center font-bold`}>
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Schemes Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Maximize Your Government Support
            </h2>
            <p className="text-xl text-gray-600">
              We help you access every grant and scheme you're entitled to
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                scheme: 'Help-to-Buy',
                amount: 'Up to €30,000',
                description: 'Cash back on new builds',
                eligible: '95% of our buyers qualify'
              },
              {
                scheme: 'First Home Scheme',
                amount: 'Up to €400,000',
                description: 'Shared equity with government',
                eligible: 'No upper age limit'
              },
              {
                scheme: 'Local Authority',
                amount: 'Up to €320,000',
                description: 'Affordable housing schemes',
                eligible: 'Income limits apply'
              },
              {
                scheme: 'Rebuilding Ireland',
                amount: 'Various supports',
                description: 'Multiple funding options',
                eligible: 'Area-specific programs'
              }
            ].map((scheme, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{scheme.scheme}</h3>
                  <div className="text-2xl font-bold text-green-600 mb-2">{scheme.amount}</div>
                  <p className="text-gray-600 text-sm mb-3">{scheme.description}</p>
                  <div className="inline-flex items-center px-3 py-1 bg-green-50 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-xs text-green-800">{scheme.eligible}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleDownloadGuide}
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-bold text-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Get FREE Scheme Application Help
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Homeownership Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Download your FREE guide now and take the first step towards owning your dream home in Ireland.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={handleDownloadGuide}
              className="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-all font-bold text-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download FREE Guide
            </button>
            <button
              onClick={handleConsultationRequest}
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all font-medium"
            >
              <Phone className="w-5 h-5 mr-2" />
              Get FREE Consultation
            </button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-blue-100">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>No spam, ever</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              <span>100% secure</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>Instant download</span>
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture Widget */}
      {showEmailCapture && (
        <EmailCaptureWidget
          page="/landing/first-time-buyers"
          context="homepage"
        />
      )}
    </div>
  );
}