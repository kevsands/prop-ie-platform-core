'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Add Three.js type support
// import '../../../types/three-extensions';
import { 
  Home, Shield, Palette, Zap, Building, Eye, Target, Key, Smartphone, Users, Calculator, ArrowRight, Star, CheckCircle, Sofa, BedDouble, LampDesk, Tv, Speaker, Award, MessageSquare, Video, Phone, HelpCircle, ChevronRight, KeyRound, TrendingUp, DollarSign, Baby, Maximize2, BedSingle, Brain, FileText, Lightbulb
} from 'lucide-react';

const roomPacks = [
  {
    icon: Sofa,
    title: 'Living Room Pack',
    description: 'Designer sofa, coffee table, TV unit, lighting, decor',
    features: ['Premium sofa', 'Smart TV', 'Designer lighting', 'Rug & decor']
  },
  {
    icon: BedDouble,
    title: 'Bedroom Pack',
    description: 'Bed, mattress, wardrobe, bedside tables, lamps',
    features: ['Luxury bed', 'Memory foam mattress', 'Wardrobe', 'Bedside lamps']
  },
  {
    icon: LampDesk,
    title: 'Home Office Pack',
    description: 'Desk, ergonomic chair, storage, smart lighting',
    features: ['Ergonomic desk', 'Premium chair', 'Smart lamp', 'Shelving']
  },
  {
    icon: Tv,
    title: 'Media Room Pack',
    description: 'Home cinema, surround sound, blackout blinds',
    features: ['4K projector', 'Surround sound', 'Blackout blinds', 'Acoustic panels']
  },
  {
    icon: Baby,
    title: 'Nursery Pack',
    description: 'Complete nursery setup for your new arrival',
    features: ['Convertible crib', 'Changing station', 'Baby monitor', 'Blackout curtains', 'Rocking chair'],
    isNew: true
  },
  {
    icon: KeyRound,
    title: 'Ready to Rent',
    description: 'Fully furnished for immediate rental income',
    features: ['Premium furniture', 'Smart home ready', 'Investor package', 'High ROI setup'],
    isSpecial: true
  }
];

const smartFeatures = [
  {
    icon: Shield,
    title: 'Smart Security',
    description: 'Video doorbell, smart locks, alarm system',
    features: ['App control', '24/7 monitoring', 'Remote access']
  },
  {
    icon: Smartphone,
    title: 'Home Automation',
    description: 'Lighting, heating, blinds, all app-controlled',
    features: ['Voice assistant', 'Scene presets', 'Energy savings']
  },
  {
    icon: Speaker,
    title: 'Integrated Audio',
    description: 'Multi-room speakers, streaming, voice control',
    features: ['Hi-fi sound', 'Spotify/AirPlay', 'Invisible install']
  }
];

const premiumUpgrades = [
  {
    icon: Palette,
    title: 'Luxury Finishes',
    description: 'Marble, hardwood, designer paint, custom cabinetry',
    features: ['Italian marble', 'Hardwood floors', 'Designer paint', 'Custom kitchen']
  },
  {
    icon: Zap,
    title: 'Energy Efficiency',
    description: 'Solar panels, heat pumps, EV charging',
    features: ['Solar PV', 'A-rated appliances', 'EV charger', 'Smart thermostat']
  }
];

const testimonials = [
  {
    quote: 'PROP Choice let us design our home exactly how we wanted. The 3D tool was a game changer – we could see every detail before moving in.',
    author: 'Aoife & Mark',
    role: 'First-Time Buyers',
    image: '/images/testimonials/testimonial-1.jpg'
  },
  {
    quote: 'We picked all our furniture and finishes online. Everything was ready on move-in day. The process was seamless and fun!',
    author: 'James & Sarah',
    role: 'Young Professionals',
    image: '/images/testimonials/testimonial-2.jpg'
  }
];

const faqs = [
  {
    question: 'How does PROP Choice work?',
    answer: 'After reserving your home, you unlock access to our customisation platform. Choose room packs, smart features, and premium upgrades. Visualise your selections in 3D, get real-time pricing, and confirm your order. Everything is installed before you move in.'
  },
  {
    question: 'Can I see my choices in 3D?',
    answer: 'Yes! Our 3D visualiser lets you walk through your future home, swap finishes, and try different furniture layouts. Share your designs with family or your interior designer.'
  },
  {
    question: 'Is there a credit or incentive for using PROP Choice?',
    answer: 'Yes. Buyers who close within 30 days receive a €2,500 PROP Choice credit to spend on furnishings or upgrades.'
  },
  {
    question: 'Can I customise every room?',
    answer: 'Absolutely. Every room can be tailored with packs, finishes, and add-ons. If you want something unique, our team can help source it.'
  }
];

export default function PropChoiceHowItWorksPage() {
  const [expandedFAQsetExpandedFAQ] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-blue-800/90 z-0" />
        <div className="absolute inset-0 bg-grid-white/5 z-0" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-xl">
            PROP Choice
          </h1>
          <p className="text-2xl md:text-3xl text-purple-100 mb-10 max-w-3xl mx-auto">
            Customise your new home, choose furnishings, and add smart features – all before you move in
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/properties" className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-all flex items-center gap-2">
              <Home className="w-6 h-6" />
              Find a Home to Customise
            </Link>
            <button className="px-8 py-4 bg-white/90 text-purple-900 rounded-xl font-bold text-lg shadow-lg hover:bg-white transition-all flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              Estimate My Budget
            </button>
          </div>
        </div>
      </section>

      {/* Step-by-Step Journey */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">How PROP Choice Works</h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Four simple steps to your fully furnished, move-in-ready home
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">1. Reserve Your Home</h4>
              <p className="text-gray-700">Buy off-plan or new build on PROP.ie</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">2. Visualise in 3D</h4>
              <p className="text-gray-700">See your choices in our 3D/AR visualiser</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">3. Customise & Add</h4>
              <p className="text-gray-700">Pick room packs, finishes, and smart features</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Key className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">4. Move In</h4>
              <p className="text-gray-700">Everything installed and ready on day one</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Room Packs */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Room Packs</h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Choose complete furniture solutions for every room
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            {roomPacks.map((packidx) => (
              <div 
                key={idx} 
                className={`relative ${
                  pack.isSpecial 
                    ? 'bg-gradient-to-br from-[#1e3347] to-[#2b5273] text-white lg:col-span-2'
                    : pack.isNew
                    ? 'bg-gradient-to-br from-pink-100 to-purple-100'
                    : 'bg-gradient-to-br from-purple-100 to-blue-50'
                } rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all ${
                  pack.isSpecial ? 'border-2 border-yellow-400' : ''
                } ${pack.isNew ? 'border-2 border-pink-400' : ''}`}
              >
                {pack.isNew && (
                  <div className="absolute -top-2 -right-2 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    NEW
                  </div>
                )}
                <div className={`w-14 h-14 rounded-xl ${
                  pack.isSpecial 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    : pack.isNew
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                } flex items-center justify-center text-white mb-4`}>
                  {React.createElement(pack.icon, { size: 28 })}
                </div>
                {pack.isSpecial && (
                  <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold mb-2">
                    <TrendingUp size={16} />
                    For Institutional Investors
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{pack.title}</h3>
                <p className={`${pack.isSpecial ? 'text-gray-200' : 'text-gray-600'} mb-4`}>
                  {pack.description}
                </p>
                <ul className="space-y-2">
                  {pack.features.map((featurebIdx) => (
                    <li key={bIdx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`${
                        pack.isSpecial ? 'text-yellow-400' : 
                        pack.isNew ? 'text-pink-500' : 
                        'text-green-400'
                      }`} size={16} />
                      <span className={pack.isSpecial ? 'text-gray-100' : 'text-gray-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                {pack.isSpecial && (
                  <div className="mt-4 pt-4 border-t border-yellow-400/30">
                    <p className="text-sm text-gray-200 mb-2">
                      Perfect for institutional investors seeking rental-ready properties
                    </p>
                    <Link 
                      href="/solutions/institutional"
                      className="inline-flex items-center text-yellow-400 font-medium hover:text-yellow-300 transition"
                    >
                      Learn more
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                )}
                {pack.isNew && (
                  <div className="mt-4 pt-4 border-t border-pink-300">
                    <p className="text-sm text-gray-700">
                      Complete setup for your little one's arrival
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Landlord Optimization Section */}
      <section className="py-16 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold mb-4">
              <Lightbulb size={20} />
              NEW: Landlord Revenue Maximization
            </div>
            <h2 className="text-4xl font-bold mb-4">Maximize Your Rental Income</h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Our expert consultants help landlords optimize space to increase rental yield by up to 40%
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Space Optimization */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center mb-6">
                <Maximize2 size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Space Optimization</h3>
              <p className="text-gray-200 mb-6">
                Transform your property to maximize rental potential
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-yellow-400 mt-0.5" size={20} />
                  <div>
                    <strong>3-Bed to 5-Bed Conversion</strong>
                    <p className="text-gray-300 text-sm mt-1">
                      Convert living areas to additional bedrooms, add mezzanines, or optimize layouts
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-yellow-400 mt-0.5" size={20} />
                  <div>
                    <strong>En-suite Addition</strong>
                    <p className="text-gray-300 text-sm mt-1">
                      Add en-suites to maximize per-room rental rates
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-yellow-400 mt-0.5" size={20} />
                  <div>
                    <strong>HMO Compliance</strong>
                    <p className="text-gray-300 text-sm mt-1">
                      Ensure all conversions meet local HMO regulations
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Professional Management */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mb-6">
                <Brain size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart Rental Strategies</h3>
              <p className="text-gray-200 mb-6">
                Data-driven approaches to maximize your returns
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-400 mt-0.5" size={20} />
                  <div>
                    <strong>Market Analysis</strong>
                    <p className="text-gray-300 text-sm mt-1">
                      AI-powered rent optimization based on local demand
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-400 mt-0.5" size={20} />
                  <div>
                    <strong>Tenant Profiling</strong>
                    <p className="text-gray-300 text-sm mt-1">
                      Target high-value tenants: professionals, families, corporate lets
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-green-400 mt-0.5" size={20} />
                  <div>
                    <strong>Revenue Forecasting</strong>
                    <p className="text-gray-300 text-sm mt-1">
                      Predictive analytics for long-term income planning
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* ROI Calculator */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Rental Yield Calculator</h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-gray-300 mb-2">Current 3-Bed Rental</p>
                <p className="text-3xl font-bold">€2,200/mo</p>
                <p className="text-sm text-gray-400">Standard configuration</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-gray-300 mb-2">Optimized 5-Bed Rental</p>
                <p className="text-3xl font-bold text-green-400">€3,100/mo</p>
                <p className="text-sm text-gray-400">With room conversions</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-gray-300 mb-2">Yield Increase</p>
                <p className="text-3xl font-bold text-yellow-400">+41%</p>
                <p className="text-sm text-gray-400">Additional €900/month</p>
              </div>
            </div>
            <Link href="/landlord-consultation" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-xl font-bold shadow-lg hover:scale-105 transition-all">
              <Calculator size={24} />
              Get Free Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Smart Features & Premium Upgrades */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Smart Features & Premium Upgrades</h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Add the latest technology and luxury finishes to your home
          </p>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {smartFeatures.map((featureidx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mb-4">
                  {React.createElement(feature.icon, { size: 28 })}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((fbIdx) => (
                    <li key={bIdx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-green-400" size={16} />
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {premiumUpgrades.map((upgradeidx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-yellow-500 to-pink-500 flex items-center justify-center text-white mb-4">
                  {React.createElement(upgrade.icon, { size: 28 })}
                </div>
                <h3 className="text-xl font-semibold mb-2">{upgrade.title}</h3>
                <p className="text-gray-600 mb-4">{upgrade.description}</p>
                <ul className="space-y-2">
                  {upgrade.features.map((fbIdx) => (
                    <li key={bIdx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-green-400" size={16} />
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D/AR Visualizer Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-4">Visualise Your Home in 3D</h2>
              <p className="text-xl text-gray-600 mb-6">
                Walk through your future home, try different layouts, and share your designs. Our 3D/AR tool (coming soon) makes customisation immersive and fun.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-lg"><Eye className="text-purple-500" size={22} /> 3D walkthroughs of every room</li>
                <li className="flex items-center gap-3 text-lg"><Smartphone className="text-purple-500" size={22} /> Design on mobile or desktop</li>
                <li className="flex items-center gap-3 text-lg"><Users className="text-purple-500" size={22} /> Share with family or your designer</li>
                <li className="flex items-center gap-3 text-lg"><Calculator className="text-purple-500" size={22} /> Real-time pricing for every choice</li>
              </ul>
              <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                <Video className="w-6 h-6" />
                Watch Demo
              </button>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl h-80 flex items-center justify-center">
              <span className="text-purple-400 text-2xl font-bold">3D/AR Visualiser Coming Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Upsell & Incentives */}
      <section className="py-16 bg-gradient-to-r from-yellow-100 to-pink-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Exclusive Offer: €2,500 PROP Choice Credit</h2>
          <p className="text-xl mb-8 text-gray-700">
            Close your purchase within 30 days and receive a €2,500 credit to spend on furnishings, upgrades, or smart features. Make your home truly yours from day one.
          </p>
          <Link href="/properties" className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-all flex items-center gap-2">
            <Star className="w-6 h-6" />
            Find a Home to Customise
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What Buyers Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((tidx) => (
              <div key={idx} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 shadow-lg flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <p className="text-lg text-gray-700 mb-4">“{t.quote}”</p>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-purple-700">{t.author}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500 text-sm">{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faqindex) => (
              <div key={index} className="border rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-medium text-left">{faq.question}</span>
                  <ChevronRight className={`transform transition-transform ${expandedFAQ === index ? 'rotate-90' : ''}`} />
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Customise Your Home?</h2>
          <p className="text-xl mb-8">
            Start your journey with PROP Choice and move into a home that's truly yours
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/properties" className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:scale-105 transition-all">
              Find a Home to Customise
            </Link>
            <Link href="/contact" className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all">
              Book a Design Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 