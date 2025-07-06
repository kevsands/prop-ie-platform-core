'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Home,
  ArrowRight,
  Calculator,
  FileText,
  Users,
  Shield,
  Sparkles,
  CheckCircle,
  Clock,
  Phone,
  MessageSquare,
  Video,
  PiggyBank,
  TrendingUp,
  Gift,
  Lock,
  Smartphone,
  Globe,
  BarChart3,
  Building,
  Star,
  Award,
  HeartHandshake,
  Zap,
  Gauge,
  Target,
  BookOpen,
  HelpCircle,
  ChevronRight,
  LucideIcon
} from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  benefit: string;
}

interface Testimonial {
  name: string;
  age: number;
  location: string;
  quote: string;
  propertyPrice: string;
  htbBenefit: string;
  image: string;
}

interface Process {
  step: number;
  title: string;
  description: string;
  duration: string;
  icon: LucideIcon;
}

const features: Feature[] = [
  {
    icon: PiggyBank,
    title: 'HTB Integration',
    description: 'Automatically calculate and apply your Help-to-Buy benefit',
    benefit: 'Save up to €30,000'
  },
  {
    icon: Calculator,
    title: 'Smart Calculators',
    description: 'Mortgage affordability and stamp duty calculators',
    benefit: 'Know your budget instantly'
  },
  {
    icon: FileText,
    title: 'Document Hub',
    description: 'All your documents secured in one place',
    benefit: 'Never lose important papers'
  },
  {
    icon: Clock,
    title: 'Real-Time Updates',
    description: 'Track your purchase progress 24/7',
    benefit: 'No more waiting in the dark'
  },
  {
    icon: Shield,
    title: 'Legal Protection',
    description: 'Verified solicitors and secure transactions',
    benefit: 'Complete peace of mind'
  },
  {
    icon: Sparkles,
    title: 'PROP Choice',
    description: 'Customize finishes and furniture before moving in',
    benefit: 'Make it yours from day one'
  }
];

const testimonials: Testimonial[] = [
  {
    name: 'Sarah O\'Brien',
    age: 28,
    location: 'Dublin',
    quote: 'PROP made buying my first home so simple. The HTB calculator showed I could afford €25,000 more than I thought!',
    propertyPrice: '€325,000',
    htbBenefit: '€25,000',
    image: '/testimonials/sarah.jpg'
  },
  {
    name: 'Michael Murphy',
    age: 32,
    location: 'Cork',
    quote: 'Being able to customize everything online and track my purchase in real-time was incredible. Moved in within 3 months!',
    propertyPrice: '€285,000',
    htbBenefit: '€22,000',
    image: '/testimonials/michael.jpg'
  },
  {
    name: 'Emma Kelly',
    age: 26,
    location: 'Galway',
    quote: 'The support team held my hand through everything. As a complete novice, I felt confident every step of the way.',
    propertyPrice: '€295,000',
    htbBenefit: '€28,000',
    image: '/testimonials/emma.jpg'
  }
];

const process: Process[] = [
  {
    step: 1,
    title: 'Calculate & Plan',
    description: 'Use our tools to understand your budget and HTB benefit',
    duration: '15 minutes',
    icon: Calculator
  },
  {
    step: 2,
    title: 'Browse & Select',
    description: 'Explore properties with virtual tours and detailed info',
    duration: '1-2 weeks',
    icon: Home
  },
  {
    step: 3,
    title: 'Reserve Digitally',
    description: 'Secure your property with just €500 online',
    duration: 'Instant',
    icon: Lock
  },
  {
    step: 4,
    title: 'Complete Purchase',
    description: 'Digital contracts, mortgage application, and closing',
    duration: '8-10 weeks',
    icon: FileText
  }
];

const faqs = [
  {
    question: 'What makes PROP different for first-time buyers?',
    answer: 'PROP is Ireland\'s only fully digital property platform designed specifically with first-time buyers in mind. We integrate government benefits, provide step-by-step guidance, and offer exclusive tools like HTB calculators and virtual viewings.'
  },
  {
    question: 'How does the Help-to-Buy integration work?',
    answer: 'Our platform automatically calculates your HTB benefit based on your tax history and applies it to your purchase. You\'ll see exactly how much you can claim and how it affects your buying power.'
  },
  {
    question: 'Can I really complete everything online?',
    answer: 'Yes! From browsing properties to signing contracts and tracking your purchase, everything happens digitally. You\'ll never need to queue at a sales office or handle physical paperwork.'
  },
  {
    question: 'What support do I get as a first-time buyer?',
    answer: 'You get dedicated support through live chat, phone, and video calls. Our expert team specializes in first-time buyers and will guide you through every step.'
  }
];

export default function SolutionsFirstTimeBuyersPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-purple-800/90 z-0" />
        <div className="absolute inset-0 bg-grid-white/5 z-0" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-full text-green-300 font-medium mb-6">
            <Sparkles size={20} />
            <span>Ireland\'s #1 Platform for First-Time Buyers</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Your First Home,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
              Made Simple
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-blue-100 mb-10 max-w-4xl mx-auto">
            The only platform that combines HTB benefits, digital purchasing, and home customization in one seamless journey
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            <Link href="/first-time-buyers/register"
              className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              Start Your Journey
              <ArrowRight size={20} />
            </Link>
            <Link href="/first-time-buyers/how-it-works"
              className="px-8 py-4 bg-white/90 text-blue-900 rounded-xl font-bold text-lg shadow-lg hover:bg-white transition-all flex items-center gap-2"
            >
              See How It Works
              <Video size={20} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 justify-center text-white">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-400" />
              <span>No Stamp Duty</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-400" />
              <span>10% Deposit Only</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-400" />
              <span>Up to €30k HTB</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-16 bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">2,847</div>
              <div className="text-gray-600">First-Time Buyers</div>
              <div className="text-sm text-gray-500">This Year</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">€22.5k</div>
              <div className="text-gray-600">Average HTB Benefit</div>
              <div className="text-sm text-gray-500">Per Buyer</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">87%</div>
              <div className="text-gray-600">Faster Than Traditional</div>
              <div className="text-sm text-gray-500">Time to Close</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">4.9/5</div>
              <div className="text-gray-600">Buyer Satisfaction</div>
              <div className="text-sm text-gray-500">1,200+ Reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Everything You Need to Buy Your First Home</h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Powerful tools and features designed specifically for first-time buyers
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {React.createElement(feature.icon, { size: 32 })}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="flex items-center gap-2 text-blue-600 font-medium">
                  <Sparkles size={16} />
                  <span>{feature.benefit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Your Path to Homeownership</h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            From first click to house keys in just 4 simple steps
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="relative">
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 -z-10" />
                )}
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mb-4 mx-auto">
                    {React.createElement(step.icon, { size: 36 })}
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Step {step.step}</div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-2">{step.description}</p>
                    <div className="text-sm text-blue-600 font-medium">
                      <Clock size={14} className="inline mr-1" />
                      {step.duration}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Real First-Time Buyer Success Stories</h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Join thousands who\'ve already found their dream home with PROP
          </p>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                {testimonials.map((testimonial, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTestimonial(index)}
                    className={`px-6 py-3 rounded-full font-medium transition-all ${
                      selectedTestimonial === index
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-white text-gray-600 hover:shadow-md'
                    }`}
                  >
                    {testimonial.name}
                  </button>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-xl">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white text-2xl font-bold">
                    {testimonials[selectedTestimonial].name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{testimonials[selectedTestimonial].name}</h3>
                    <p className="text-gray-600">
                      {testimonials[selectedTestimonial].age} years old • {testimonials[selectedTestimonial].location}
                    </p>
                  </div>
                </div>
                <blockquote className="text-lg text-gray-700 mb-6 italic">
                  "{testimonials[selectedTestimonial].quote}"
                </blockquote>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Property Price</div>
                    <div className="text-xl font-bold text-blue-900">{testimonials[selectedTestimonial].propertyPrice}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">HTB Benefit</div>
                    <div className="text-xl font-bold text-green-900">{testimonials[selectedTestimonial].htbBenefit}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offer */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <Gift className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">First-Time Buyer Special Offer</h2>
          <p className="text-xl mb-8">
            Close within 30 days and get €2,500 PROP Choice credit for furniture and customization
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-lg font-medium mb-8">
            <Clock size={20} />
            <span>Limited Time: Offer ends in 15 days</span>
          </div>
          <Link href="/first-time-buyers/register"
            className="inline-block px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg hover:scale-105 transition-all"
          >
            Claim Your Offer
          </Link>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">First-Time Buyer FAQs</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
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
      <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Dream Home is Waiting
          </h2>
          <p className="text-xl mb-8">
            Join 2,847 first-time buyers who found their perfect home this year
          </p>
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link href="/first-time-buyers/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:scale-105 transition-all"
            >
              Get Started Now
            </Link>
            <Link href="/first-time-buyers/calculator"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all"
            >
              Calculate Your Benefits
            </Link>
          </div>
          <div className="flex flex-wrap gap-8 justify-center">
            <div className="flex items-center gap-2">
              <Shield size={24} />
              <span>Bank-Level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake size={24} />
              <span>Dedicated Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={24} />
              <span>Award-Winning Platform</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-white border-t">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-8 justify-center items-center">
            <div className="text-center">
              <div className="text-sm text-gray-600">Regulated by</div>
              <div className="font-semibold">Central Bank of Ireland</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Member of</div>
              <div className="font-semibold">Property Services Regulatory Authority</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Awards</div>
              <div className="font-semibold">PropTech Ireland 2024 Winner</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Security</div>
              <div className="font-semibold">ISO 27001 Certified</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}