'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home, Shield, Palette, Zap, Building, Eye, Target, Key, Smartphone, Users, Calculator, ArrowRight, Star, CheckCircle, Sofa, BedDouble, LampDesk, Tv, Speaker, Award, MessageSquare, Video, Phone, HelpCircle, ChevronRight
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
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

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
          <div className="grid md:grid-cols-4 gap-8">
            {roomPacks.map((pack, idx) => (
              <div key={idx} className="bg-gradient-to-br from-purple-100 to-blue-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white mb-4">
                  {React.createElement(pack.icon, { size: 28 })}
                </div>
                <h3 className="text-xl font-semibold mb-2">{pack.title}</h3>
                <p className="text-gray-600 mb-4">{pack.description}</p>
                <ul className="space-y-2">
                  {pack.features.map((feature, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-green-400" size={16} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
            {smartFeatures.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mb-4">
                  {React.createElement(feature.icon, { size: 28 })}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((f, bIdx) => (
                    <li key={bIdx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-green-400" size={16} />
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {premiumUpgrades.map((upgrade, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-yellow-500 to-pink-500 flex items-center justify-center text-white mb-4">
                  {React.createElement(upgrade.icon, { size: 28 })}
                </div>
                <h3 className="text-xl font-semibold mb-2">{upgrade.title}</h3>
                <p className="text-gray-600 mb-4">{upgrade.description}</p>
                <ul className="space-y-2">
                  {upgrade.features.map((f, bIdx) => (
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
            {testimonials.map((t, idx) => (
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
            {faqs.map((faq, index) => (
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