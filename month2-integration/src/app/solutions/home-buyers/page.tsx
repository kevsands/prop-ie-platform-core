'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Home, Search, Calculator, FileText, Users, Shield, 
  CheckCircle, TrendingUp, Clock, Target, DollarSign, Heart,
  MessageSquare, Calendar, MapPin, Star, Award, Smartphone,
  Eye, BarChart, Bell, Zap, CreditCard, ArrowRight,
  Building, PiggyBank, Key, BookOpen, ChevronRight,
  Banknote, Database, Lock, Phone, Mail, Info,
  Palette, Lightbulb, ShoppingCart
} from 'lucide-react';

export default function HomeBuyersPage() {
  const [activeTab, setActiveTab] = useState('search');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-900 to-blue-700 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <span className="text-blue-100 font-medium">Home Buyer Solutions</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Dream Home
              <span className="block text-blue-300">With Confidence</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Navigate the Irish property market with ease. From search to settlement, we provide everything 
              you need to make informed decisions and secure your perfect home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/properties"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
              >
                Start Your Search
                <Search className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/first-time-buyers"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all border border-blue-500"
              >
                First-Time Buyer Guide
                <BookOpen className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
            <StatCard 
              icon={<Home className="h-8 w-8" />}
              value="10,000+"
              label="Properties Listed"
              description="New homes across Ireland"
            />
            <StatCard 
              icon={<Users className="h-8 w-8" />}
              value="50,000+"
              label="Happy Homeowners"
              description="Families housed since 2020"
            />
            <StatCard 
              icon={<Calculator className="h-8 w-8" />}
              value="€15,000"
              label="Average Savings"
              description="Through our negotiation tools"
            />
            <StatCard 
              icon={<Clock className="h-8 w-8" />}
              value="60 days"
              label="Average Time to Close"
              description="From search to keys"
            />
          </div>
        </div>
      </section>

      {/* Your Journey Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Home Buying Journey, Simplified
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We guide you through every step, making the complex simple and the stressful seamless
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            <JourneyStep 
              number="1"
              title="Search & Discover"
              description="Browse thousands of new homes with advanced filters"
              icon={<Search className="h-6 w-6" />}
              active={true}
            />
            <JourneyStep 
              number="2"
              title="Finance & Budget"
              description="Get mortgage pre-approval and understand your budget"
              icon={<Calculator className="h-6 w-6" />}
            />
            <JourneyStep 
              number="3"
              title="View & Compare"
              description="Schedule viewings and compare properties side-by-side"
              icon={<Eye className="h-6 w-6" />}
            />
            <JourneyStep 
              number="4"
              title="Offer & Negotiate"
              description="Make offers with confidence using market insights"
              icon={<Target className="h-6 w-6" />}
            />
            <JourneyStep 
              number="5"
              title="Close & Move In"
              description="Complete paperwork and get your keys"
              icon={<Key className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* Core Features Tabs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Buy Smart
            </h2>
            <p className="text-xl text-gray-600">
              Powerful tools designed to give you an edge in the property market
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-8 border-b">
            {['search', 'finance', 'insights', 'support', 'legal'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'search' ? 'Property Search' : 
                 tab === 'finance' ? 'Finance Tools' :
                 tab === 'insights' ? 'Market Insights' :
                 tab === 'support' ? 'Buyer Support' : 'Legal Help'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-12">
            {activeTab === 'search' && <SearchTab />}
            {activeTab === 'finance' && <FinanceTab />}
            {activeTab === 'insights' && <InsightsTab />}
            {activeTab === 'support' && <SupportTab />}
            {activeTab === 'legal' && <LegalTab />}
          </div>
        </div>
      </section>

      {/* Revolutionary Off-Plan Platform Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <span className="text-blue-100 font-medium">Game-Changing Innovation</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ireland's First Digital Off-Plan Platform
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              The reason PROP exists: revolutionizing how Irish buyers purchase new homes. 
              Buy directly from developers, secure your home digitally, and unlock unprecedented 
              customization options through PROP Choice.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <ShoppingCart className="h-8 w-8 text-blue-300 mb-4" />
              <h3 className="text-lg font-bold mb-2">Buy Off-Plan Online</h3>
              <p className="text-blue-100 text-sm">Reserve your home instantly with secure digital contracts and payments</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Shield className="h-8 w-8 text-blue-300 mb-4" />
              <h3 className="text-lg font-bold mb-2">100% Secure</h3>
              <p className="text-blue-100 text-sm">Bank-level security, regulated transactions, full buyer protection</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Zap className="h-8 w-8 text-blue-300 mb-4" />
              <h3 className="text-lg font-bold mb-2">Instant Booking</h3>
              <p className="text-blue-100 text-sm">No queues, no paperwork, reserve your dream home in minutes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Target className="h-8 w-8 text-blue-300 mb-4" />
              <h3 className="text-lg font-bold mb-2">Direct from Developer</h3>
              <p className="text-blue-100 text-sm">Best prices, no middlemen, direct communication throughout</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">How Our Off-Plan Platform Works</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <div className="ml-4">
                    <h4 className="font-semibold mb-1">Browse Available Developments</h4>
                    <p className="text-blue-100">Explore new builds, view floor plans, virtual tours, and pricing</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <div className="ml-4">
                    <h4 className="font-semibold mb-1">Reserve Online Instantly</h4>
                    <p className="text-blue-100">Select your unit, pay booking deposit securely, sign contracts digitally</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div className="ml-4">
                    <h4 className="font-semibold mb-1">Track Construction Progress</h4>
                    <p className="text-blue-100">Real-time updates, milestone notifications, direct developer communication</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                  <div className="ml-4">
                    <h4 className="font-semibold mb-1">Complete Purchase Digitally</h4>
                    <p className="text-blue-100">Final payments, legal completion, and key handover - all online</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-800/50 rounded-lg h-96 flex items-center justify-center">
              <span className="text-blue-300">Off-Plan Platform Demo</span>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/resources/buy-off-plan"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              Learn About Buying Off-Plan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* PROP Choice Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <span className="text-purple-100 font-medium">Exclusive to Off-Plan Buyers</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              PROP Choice: Complete Home Furnishing
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-4">
              When you buy off-plan through our platform, you unlock PROP Choice - Ireland's most 
              comprehensive home furnishing and customization solution. Select furniture, choose 
              finishes, and add smart features before you move in.
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-yellow-400/20 border border-yellow-400/40 rounded-full">
              <Zap className="h-5 w-5 text-yellow-300 mr-2" />
              <span className="text-yellow-200 font-semibold">Close within 30 days and receive €2,500 PROP Choice credit!</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <CustomizationCard 
              icon={<Home className="h-8 w-8" />}
              title="Room Purpose Packs"
              description="Complete furniture solutions for every room"
              features={[
                "Office Pack: Desk, chair, shelving, lighting",
                "Toddler Room: Crib, storage, safety features",
                "Guest Suite: Bed, wardrobe, bedside tables",
                "Home Gym: Equipment, mirrors, flooring"
              ]}
            />
            <CustomizationCard 
              icon={<Shield className="h-8 w-8" />}
              title="Smart Living Features"
              description="Add cutting-edge technology to your home"
              features={[
                "Integrated robot vacuum systems",
                "Smart climate control zones",
                "Automated window treatments",
                "USB outlets in every room"
              ]}
            />
            <CustomizationCard 
              icon={<Palette className="h-8 w-8" />}
              title="Premium Upgrades"
              description="Elevate your home with luxury finishes"
              features={[
                "Italian marble countertops",
                "Premium hardwood flooring",
                "Designer paint schemes",
                "High-end appliance packages"
              ]}
            />
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-center">How PROP Choice Works</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">1. Buy Off-Plan</h4>
                <p className="text-sm text-purple-100">Purchase your home on our platform</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">2. Visualize</h4>
                <p className="text-sm text-purple-100">See your choices in 3D</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">3. Select</h4>
                <p className="text-sm text-purple-100">Choose furniture & features</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="h-8 w-8" />
                </div>
                <h4 className="font-semibold mb-2">4. Move In</h4>
                <p className="text-sm text-purple-100">Everything ready on day one</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Visualize Every Detail</h3>
                <p className="text-purple-100 mb-6">
                  Our 3D visualization tool lets you experiment with different furniture layouts and 
                  finishes. See exactly how that third bedroom looks with a single bed for a teenager 
                  versus bunk beds for young children. Try the office pack or convert it to a craft room. 
                  Every decision is yours, and you can see the results instantly.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 text-purple-300 mr-3" />
                    <span>Walk through your furnished home in VR</span>
                  </div>
                  <div className="flex items-center">
                    <Smartphone className="h-5 w-5 text-purple-300 mr-3" />
                    <span>Design on mobile or desktop</span>
                  </div>
                  <div className="flex items-center">
                    <Calculator className="h-5 w-5 text-purple-300 mr-3" />
                    <span>Real-time pricing for every item</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-purple-300 mr-3" />
                    <span>Share designs with family</span>
                  </div>
                </div>
              </div>
              <div className="bg-purple-800/50 rounded-lg h-80 flex items-center justify-center">
                <span className="text-purple-300">PROP Choice 3D Visualizer</span>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link 
              href="/customisation/how-it-works"
              className="inline-flex items-center px-8 py-4 bg-white text-purple-900 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              Explore PROP Choice
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Special Programs Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Special Programs for Every Buyer
            </h2>
            <p className="text-xl text-gray-600">
              Take advantage of exclusive schemes and incentives
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ProgramCard 
              title="First-Time Buyers"
              description="Access Help to Buy schemes, reduced stamp duty, and special mortgage rates"
              icon={<Home className="h-8 w-8" />}
              benefits={[
                "Help to Buy equity loan up to €30,000",
                "First Home Scheme shared equity",
                "Tax relief on mortgage interest",
                "Dedicated support team"
              ]}
              cta="Learn More"
              ctaLink="/first-time-buyers"
              featured={true}
            />
            <ProgramCard 
              title="Affordable Housing"
              description="Explore cost-reduced homes through local authority schemes"
              icon={<Building className="h-8 w-8" />}
              benefits={[
                "Homes priced below market rate",
                "Priority allocation system",
                "Income-based eligibility",
                "Long-term affordability"
              ]}
              cta="Check Eligibility"
              ctaLink="/affordable-housing"
            />
            <ProgramCard 
              title="Property Investors"
              description="Tools and insights for buy-to-let and investment properties"
              icon={<TrendingUp className="h-8 w-8" />}
              benefits={[
                "Rental yield calculators",
                "Market trend analysis",
                "Tax optimization guides",
                "Portfolio management"
              ]}
              cta="Investment Tools"
              ctaLink="/solutions/investors"
            />
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real Buyers, Real Stories
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands who found their perfect home with PropIE
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <SuccessStoryCard 
              quote="The platform made everything so simple. We found our dream home in Fitzgerald Gardens within weeks and saved €12,000 through the Help to Buy scheme."
              author="Sarah & Michael O'Brien"
              role="First-Time Buyers"
              location="Dublin"
              image="/images/testimonials/testimonial-1.jpg"
              development="Fitzgerald Gardens"
            />
            <SuccessStoryCard 
              quote="As a single buyer, I was worried about the process. The team guided me through everything and I'm now a proud homeowner in Ballymakenny View."
              author="Emma Walsh"
              role="Young Professional"
              location="Drogheda"
              image="/images/testimonials/testimonial-2.jpg"
              development="Ballymakenny View"
            />
            <SuccessStoryCard 
              quote="Moving from renting to owning seemed impossible until we found PropIE. The financial tools helped us understand exactly what we could afford."
              author="James & Lisa Murphy"
              role="Growing Family"
              location="Cork"
              image="/images/testimonials/testimonial-3.jpg"
              development="Ellwood"
            />
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Free Resources & Tools
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to make informed decisions
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <ResourceCard 
              icon={<Calculator className="h-8 w-8" />}
              title="Mortgage Calculator"
              description="Calculate monthly payments and affordability"
              link="/resources/calculators/mortgage-calculator"
            />
            <ResourceCard 
              icon={<FileText className="h-8 w-8" />}
              title="Buyer's Guide"
              description="Step-by-step guide to buying in Ireland"
              link="/resources/guides/buyers-guide"
            />
            <ResourceCard 
              icon={<DollarSign className="h-8 w-8" />}
              title="Stamp Duty Calculator"
              description="Estimate your stamp duty costs"
              link="/resources/calculators/stamp-duty"
            />
            <ResourceCard 
              icon={<Shield className="h-8 w-8" />}
              title="Legal Checklist"
              description="Essential documents and legal requirements"
              link="/resources/guides/legal-checklist"
            />
            <ResourceCard 
              icon={<MapPin className="h-8 w-8" />}
              title="Area Guides"
              description="Detailed guides to Irish neighborhoods"
              link="/resources/area-guides"
            />
            <ResourceCard 
              icon={<Bell className="h-8 w-8" />}
              title="Price Alerts"
              description="Get notified when prices drop"
              link="/alerts"
            />
            <ResourceCard 
              icon={<Banknote className="h-8 w-8" />}
              title="Budget Planner"
              description="Plan your complete home buying budget"
              link="/resources/calculators/budget-planner"
            />
            <ResourceCard 
              icon={<Heart className="h-8 w-8" />}
              title="Wishlist Tool"
              description="Save and compare your favorite properties"
              link="/wishlist"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Common Questions from Home Buyers
            </h2>
          </div>

          <div className="space-y-6">
            <FAQItem 
              question="How much deposit do I need to buy a home in Ireland?"
              answer="Typically, you'll need a minimum deposit of 10% for first-time buyers or 20% for subsequent buyers. However, with Help to Buy schemes, you may be able to reduce this. Our mortgage calculator can help you understand exactly what you'll need based on your situation."
            />
            <FAQItem 
              question="What is the Help to Buy scheme and am I eligible?"
              answer="The Help to Buy scheme provides a tax refund to first-time buyers purchasing or building a new home. You could receive up to €30,000 (or 10% of the purchase price). To be eligible, you must be a first-time buyer, take out a mortgage of at least 70%, and the property must be your primary residence."
            />
            <FAQItem 
              question="How long does the home buying process take?"
              answer="On average, it takes 8-12 weeks from having an offer accepted to receiving your keys. This includes mortgage approval (2-3 weeks), surveys and legal work (4-6 weeks), and final closing (1-2 weeks). We help streamline this process wherever possible."
            />
            <FAQItem 
              question="What additional costs should I budget for?"
              answer="Beyond your deposit, budget for: stamp duty (1% for properties up to €1M), legal fees (€1,500-€3,000), survey costs (€400-€600), mortgage protection insurance, home insurance, and moving costs. Our budget planner tool provides a detailed breakdown."
            />
            <FAQItem 
              question="Can I buy a home if I'm self-employed?"
              answer="Yes, self-employed buyers can get mortgages in Ireland. You'll typically need 2-3 years of accounts, tax returns, and proof of income. Some lenders have specific products for self-employed buyers. Our mortgage advisors can help you navigate this process."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-blue-900 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of happy homeowners who found their dream property with PropIE
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/properties"
              className="inline-flex items-center px-8 py-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all border border-blue-600"
            >
              Browse Properties
              <Home className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <p className="mt-6 text-sm text-blue-200">
            No credit card required · Free forever · Instant access
          </p>
        </div>
      </section>
    </div>
  );
}

// Component Definitions

function StatCard({ icon, value, label, description }: { icon: React.ReactNode; value: string; label: string; description: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="text-blue-300 mb-4">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-lg font-semibold text-white">{label}</div>
      <div className="text-sm text-blue-200">{description}</div>
    </div>
  );
}

function JourneyStep({ number, title, description, icon, active = false }: { 
  number: string; 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div className={`text-center ${active ? '' : 'opacity-75'}`}>
      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
        active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
      }`}>
        {icon}
      </div>
      <div className={`text-sm font-semibold mb-1 ${active ? 'text-blue-600' : 'text-gray-500'}`}>
        Step {number}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function SearchTab() {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h3 className="text-3xl font-bold mb-6">Advanced Property Search</h3>
        <p className="text-lg text-gray-600 mb-6">
          Find your perfect home with our intelligent search tools. Filter by location, 
          price, features, and more. Save searches and get instant alerts when new 
          properties match your criteria.
        </p>
        <div className="space-y-4">
          <Feature icon={<MapPin />} title="Location Intelligence" description="Search by area, commute time, school districts" />
          <Feature icon={<Home />} title="Property Filters" description="Bedrooms, property type, garden, parking" />
          <Feature icon={<Bell />} title="Smart Alerts" description="Get notified instantly for new matches" />
          <Feature icon={<Heart />} title="Save Favorites" description="Create wishlists and compare properties" />
        </div>
      </div>
      <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
        <span className="text-gray-500">Property Search Interface Preview</span>
      </div>
    </div>
  );
}

function FinanceTab() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-4">Complete Financial Toolkit</h3>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Understand your buying power and get mortgage-ready with our comprehensive financial tools
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <FinanceFeature 
          icon={<Calculator />}
          title="Mortgage Calculator"
          description="Calculate monthly payments based on property price, deposit, and interest rates"
        />
        <FinanceFeature 
          icon={<PiggyBank />}
          title="Savings Tracker"
          description="Track your deposit savings progress and get tips to save faster"
        />
        <FinanceFeature 
          icon={<Target />}
          title="Affordability Check"
          description="See exactly what you can afford based on income and expenses"
        />
        <FinanceFeature 
          icon={<CreditCard />}
          title="Credit Score Tips"
          description="Improve your credit rating for better mortgage rates"
        />
        <FinanceFeature 
          icon={<Banknote />}
          title="Cost Estimator"
          description="Full breakdown of buying costs including fees and taxes"
        />
        <FinanceFeature 
          icon={<Building />}
          title="Mortgage Comparison"
          description="Compare rates from Ireland's leading lenders"
        />
      </div>
    </div>
  );
}

function InsightsTab() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-4">Market Intelligence at Your Fingertips</h3>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Make informed decisions with real-time market data and professional insights
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <InsightFeature 
          icon={<TrendingUp />}
          title="Price Trends"
          description="Track property price movements in your areas of interest with historical data and future projections"
        />
        <InsightFeature 
          icon={<BarChart />}
          title="Area Analytics"
          description="Detailed neighborhood reports including demographics, amenities, transport links, and development plans"
        />
        <InsightFeature 
          icon={<Clock />}
          title="Days on Market"
          description="Understand how quickly properties sell in different areas to time your offer perfectly"
        />
        <InsightFeature 
          icon={<Target />}
          title="Investment Potential"
          description="See rental yields, capital appreciation forecasts, and investment hotspots"
        />
      </div>
    </div>
  );
}

function SupportTab() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-4">Expert Support Every Step of the Way</h3>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          From first search to moving in, our team of experts is here to help
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <SupportFeature 
          icon={<Users />}
          title="Buyer Advocates"
          description="Personal advisors to guide you through the entire process"
        />
        <SupportFeature 
          icon={<MessageSquare />}
          title="24/7 Chat Support"
          description="Get instant answers to your questions anytime"
        />
        <SupportFeature 
          icon={<Phone />}
          title="Viewing Scheduling"
          description="We coordinate viewings and accompany you if needed"
        />
        <SupportFeature 
          icon={<FileText />}
          title="Document Help"
          description="Assistance with paperwork and applications"
        />
        <SupportFeature 
          icon={<Shield />}
          title="Negotiation Support"
          description="Expert help to get the best price and terms"
        />
        <SupportFeature 
          icon={<Home />}
          title="Moving Assistance"
          description="Connect with trusted movers and service providers"
        />
      </div>
    </div>
  );
}

function LegalTab() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-4">Legal Support Made Simple</h3>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Navigate the legal aspects of buying with confidence
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <LegalFeature 
            icon={<Shield />}
            title="Solicitor Network"
            description="Access to pre-vetted property solicitors with transparent pricing"
          />
          <LegalFeature 
            icon={<FileText />}
            title="Contract Review"
            description="AI-powered contract analysis highlights key terms and potential issues"
          />
          <LegalFeature 
            icon={<Lock />}
            title="Secure Document Portal"
            description="Share and sign documents securely with bank-level encryption"
          />
          <LegalFeature 
            icon={<Info />}
            title="Legal Guides"
            description="Plain-English explanations of legal processes and requirements"
          />
        </div>
        <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
          <span className="text-gray-500">Legal Dashboard Preview</span>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start">
      <div className="text-blue-600 mr-4">{icon}</div>
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function ProgramCard({ title, description, icon, benefits, cta, ctaLink, featured = false }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  cta: string;
  ctaLink: string;
  featured?: boolean;
}) {
  return (
    <div className={`rounded-xl p-8 ${featured ? 'bg-blue-900 text-white ring-4 ring-blue-400' : 'bg-white border border-gray-200'}`}>
      <div className={`mb-4 ${featured ? 'text-blue-300' : 'text-blue-600'}`}>{icon}</div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className={`mb-6 ${featured ? 'text-blue-100' : 'text-gray-600'}`}>{description}</p>
      <ul className="space-y-3 mb-8">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle className={`h-5 w-5 mr-3 ${featured ? 'text-blue-300' : 'text-green-500'}`} />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
      <Link
        href={ctaLink}
        className={`block text-center py-3 px-6 rounded-lg font-semibold transition-all ${
          featured
            ? 'bg-white text-blue-900 hover:bg-gray-100'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

function SuccessStoryCard({ quote, author, role, location, image, development }: {
  quote: string;
  author: string;
  role: string;
  location: string;
  image: string;
  development: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
          ))}
        </div>
        <p className="text-gray-700 mb-4 italic">"{quote}"</p>
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
          <div>
            <p className="font-semibold text-gray-900">{author}</p>
            <p className="text-sm text-gray-500">{role} · {location}</p>
            <p className="text-sm text-blue-600">{development}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ icon, title, description, link }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <Link href={link} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all group">
      <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}

function FinanceFeature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="text-green-600 mb-4 flex justify-center">{icon}</div>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function InsightFeature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="text-purple-600 mt-1">{icon}</div>
      <div>
        <h4 className="text-lg font-semibold mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function SupportFeature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="text-indigo-600 mb-4 flex justify-center">{icon}</div>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function LegalFeature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="text-teal-600 mt-1">{icon}</div>
      <div>
        <h4 className="text-lg font-semibold mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 pb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex justify-between items-center"
      >
        <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
        <ChevronRight className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <p className="mt-4 text-gray-600">{answer}</p>
      )}
    </div>
  );
}

function CustomizationCard({ icon, title, description, features }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="text-purple-300 mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-purple-100 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle className="h-4 w-4 text-purple-300 mr-2" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}