'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building, Upload, FileText, Users, BarChart, Briefcase, 
  Shield, Cpu, ChevronRight, CheckCircle, TrendingUp, Clock,
  Target, DollarSign, Settings, MessageSquare, Calendar, Home,
  Palette, LineChart, PieChart, Lock, Database, Smartphone,
  Layers, ArrowUpRight, Star, Award, MapPin, CreditCard
} from 'lucide-react';

export default function DeveloperPlatformPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 to-blue-900 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full mb-6">
              <span className="text-blue-300 font-medium">Developer Solutions</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              The Complete Platform for
              <span className="block text-blue-400">Property Developers</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Streamline every aspect of your development projects, from planning to sale. 
              Manage documents, track sales, handle customizations, and maximize profits – all in one integrated platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/demo"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl"
              >
                Book a Demo
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/30"
              >
                Talk to Sales
                <MessageSquare className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
            <MetricCard 
              icon={<TrendingUp className="h-8 w-8" />}
              value="35%"
              label="Faster Sales Cycle"
              description="Average reduction in time-to-sale"
            />
            <MetricCard 
              icon={<DollarSign className="h-8 w-8" />}
              value="€2M+"
              label="Additional Revenue"
              description="Through optimized pricing & upgrades"
            />
            <MetricCard 
              icon={<Users className="h-8 w-8" />}
              value="10,000+"
              label="Active Buyers"
              description="Engaged on our platform"
            />
            <MetricCard 
              icon={<Home className="h-8 w-8" />}
              value="500+"
              label="Projects Managed"
              description="Successfully delivered"
            />
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Build Smarter, Sell Faster, Profit More
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              PropIE transforms how developers manage projects, engage buyers, and maximize returns
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-6">The Challenges You Face</h3>
              <ul className="space-y-4">
                <Challenge text="Manual document management across multiple stakeholders" />
                <Challenge text="Disconnected sales and marketing processes" />
                <Challenge text="Inefficient buyer communication and updates" />
                <Challenge text="Complex customization and upgrade tracking" />
                <Challenge text="Limited visibility into project performance" />
                <Challenge text="Time-consuming compliance and reporting" />
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-6">Our Integrated Solution</h3>
              <ul className="space-y-4">
                <Solution text="Centralized digital document hub with role-based access" />
                <Solution text="Unified sales CRM with automated lead routing" />
                <Solution text="Real-time buyer portal with instant notifications" />
                <Solution text="Visual customization tools with automated pricing" />
                <Solution text="Comprehensive analytics dashboard with KPI tracking" />
                <Solution text="Automated compliance workflows and reporting" />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Tabs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools designed specifically for property developers
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-8 border-b">
            {['overview', 'project', 'sales', 'buyer', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab} {tab === 'overview' ? 'Platform' : tab === 'buyer' ? 'Experience' : 'Management'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-12">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'project' && <ProjectTab />}
            {activeTab === 'sales' && <SalesTab />}
            {activeTab === 'buyer' && <BuyerTab />}
            {activeTab === 'analytics' && <AnalyticsTab />}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Seamlessly Integrates with Your Tools
            </h2>
            <p className="text-xl text-gray-600">
              Connect with the software you already use and love
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <IntegrationCard name="Sage" category="Accounting" />
            <IntegrationCard name="Xero" category="Accounting" />
            <IntegrationCard name="MS Project" category="Project Management" />
            <IntegrationCard name="Primavera" category="Construction" />
            <IntegrationCard name="AutoCAD" category="Design" />
            <IntegrationCard name="Revit" category="BIM" />
            <IntegrationCard name="Salesforce" category="CRM" />
            <IntegrationCard name="Office 365" category="Productivity" />
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories from Leading Developers
            </h2>
            <p className="text-xl text-gray-600">
              See how PropIE is transforming the development industry
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <CaseStudyCard 
              developer="Fitzgerald Development Group"
              project="Fitzgerald Gardens"
              metric="40% faster sales"
              description="Achieved complete sell-out 6 months ahead of schedule through digital buyer engagement"
              image="/images/developments/fitzgerald-gardens/hero.jpeg"
            />
            <CaseStudyCard 
              developer="Ballymakenny Properties"
              project="Ballymakenny View"
              metric="€1.2M in upgrades"
              description="Generated additional revenue through online customization portal"
              image="/images/developments/Ballymakenny-View/hero.jpg"
            />
            <CaseStudyCard 
              developer="Riverside Developments"
              project="Ellwood Apartments"
              metric="90% digital adoption"
              description="Eliminated paper processes with full digital transformation"
              image="/images/developments/Ellwood-Logos/hero.jpg"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Flexible Pricing for Every Developer
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that scales with your business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard 
              tier="Starter"
              price="€499"
              period="per project/month"
              features={[
                "Up to 50 units",
                "Basic document management",
                "Standard buyer portal",
                "Email support",
                "Monthly reporting"
              ]}
              cta="Start Free Trial"
              highlighted={false}
            />
            <PricingCard 
              tier="Professional"
              price="€999"
              period="per project/month"
              features={[
                "Up to 200 units",
                "Advanced document workflows",
                "Custom buyer portal",
                "Priority support",
                "Real-time analytics",
                "API access",
                "Custom integrations"
              ]}
              cta="Get Started"
              highlighted={true}
            />
            <PricingCard 
              tier="Enterprise"
              price="Custom"
              period="tailored to your needs"
              features={[
                "Unlimited units",
                "White-label options",
                "Dedicated success manager",
                "24/7 phone support",
                "Custom development",
                "On-premise deployment",
                "SLA guarantees"
              ]}
              cta="Contact Sales"
              highlighted={false}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <FAQItem 
              question="How quickly can we get started?"
              answer="Most developers are fully onboarded within 48 hours. Our team handles data migration, user setup, and provides comprehensive training to ensure a smooth launch."
            />
            <FAQItem 
              question="Can we customize the platform for our brand?"
              answer="Absolutely. The platform can be fully white-labeled with your branding, custom domains, and tailored workflows to match your processes."
            />
            <FAQItem 
              question="What kind of support do you provide?"
              answer="We offer tiered support from email to 24/7 phone support. Professional and Enterprise plans include dedicated success managers who become experts in your business."
            />
            <FAQItem 
              question="Is our data secure?"
              answer="Yes. We use bank-level encryption, comply with GDPR, and undergo regular security audits. Your data is backed up hourly with instant recovery capabilities."
            />
            <FAQItem 
              question="Can we integrate with our existing systems?"
              answer="We have pre-built integrations with major construction, accounting, and CRM systems. Our API also allows custom integrations with any system."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Development Process?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join leading developers who are building smarter and selling faster with PropIE
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/demo"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              Schedule a Demo
              <Calendar className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/trial"
              className="inline-flex items-center px-8 py-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-all border border-blue-600"
            >
              Start Free Trial
              <ArrowUpRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          <p className="mt-6 text-sm text-blue-200">
            No credit card required · 14-day free trial · Full feature access
          </p>
        </div>
      </section>
    </div>
  );
}

// Component definitions

function MetricCard({ icon, value, label, description }: { icon: React.ReactNode; value: string; label: string; description: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="text-blue-400 mb-4">{icon}</div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-lg font-semibold text-white">{label}</div>
      <div className="text-sm text-gray-300">{description}</div>
    </div>
  );
}

function Challenge({ text }: { text: string }) {
  return (
    <li className="flex items-start">
      <div className="text-red-500 mr-3 mt-1">
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <span className="text-gray-700">{text}</span>
    </li>
  );
}

function Solution({ text }: { text: string }) {
  return (
    <li className="flex items-start">
      <div className="text-green-500 mr-3 mt-1">
        <CheckCircle className="h-5 w-5" />
      </div>
      <span className="text-gray-700">{text}</span>
    </li>
  );
}

function OverviewTab() {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h3 className="text-3xl font-bold mb-6">All-in-One Developer Platform</h3>
        <p className="text-lg text-gray-600 mb-6">
          PropIE brings together every tool you need to manage your property developments efficiently. 
          From initial planning to final sale, our platform streamlines workflows, enhances collaboration, 
          and maximizes profitability.
        </p>
        <div className="space-y-4">
          <FeatureItem icon={<Building />} title="Project Management" description="Track progress, manage timelines, coordinate teams" />
          <FeatureItem icon={<FileText />} title="Document Center" description="Centralized storage with version control and permissions" />
          <FeatureItem icon={<Users />} title="Stakeholder Portal" description="Connect buyers, agents, solicitors in one place" />
          <FeatureItem icon={<BarChart />} title="Analytics Dashboard" description="Real-time insights into sales and performance" />
        </div>
      </div>
      <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
        <span className="text-gray-500">Platform Overview Graphic</span>
      </div>
    </div>
  );
}

function ProjectTab() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-4">Comprehensive Project Management</h3>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Manage every aspect of your development project with powerful tools designed for the construction industry
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Upload />}
          title="Quick Setup"
          description="Upload project details, branding, and documentation in minutes. AI-powered data extraction speeds up onboarding."
        />
        <FeatureCard 
          icon={<Layers />}
          title="Phase Management"
          description="Track multiple phases, manage unit allocation, and coordinate releases with visual planning tools."
        />
        <FeatureCard 
          icon={<Calendar />}
          title="Timeline Tracking"
          description="Integrated Gantt charts, milestone tracking, and automated alerts keep projects on schedule."
        />
        <FeatureCard 
          icon={<Users />}
          title="Team Collaboration"
          description="Assign roles, manage permissions, and enable secure collaboration with all stakeholders."
        />
        <FeatureCard 
          icon={<Shield />}
          title="Compliance Management"
          description="Built-in workflows for planning permissions, building regs, and safety certifications."
        />
        <FeatureCard 
          icon={<Database />}
          title="Data Integration"
          description="Connect with existing project management tools and construction software seamlessly."
        />
      </div>
    </div>
  );
}

function SalesTab() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-4">Accelerate Your Sales Process</h3>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Modern sales tools that help you sell faster, manage leads better, and close more deals
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <SalesFeature 
            icon={<Target />}
            title="Lead Management"
            description="Capture and nurture leads with automated follow-ups, scoring, and intelligent routing to agents."
          />
          <SalesFeature 
            icon={<Home />}
            title="Unit Availability"
            description="Real-time availability management with hold periods, reservations, and automated release workflows."
          />
          <SalesFeature 
            icon={<DollarSign />}
            title="Pricing Optimization"
            description="Dynamic pricing tools with market analysis, competitor tracking, and yield management."
          />
          <SalesFeature 
            icon={<CreditCard />}
            title="Payment Tracking"
            description="Monitor deposits, stage payments, and final settlements with integrated accounting."
          />
        </div>
        <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
          <span className="text-gray-500">Sales Dashboard Preview</span>
        </div>
      </div>
    </div>
  );
}

function BuyerTab() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-4">Exceptional Buyer Experience</h3>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Give your buyers a premium digital experience that drives satisfaction and accelerates sales
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <BuyerFeature 
          icon={<Smartphone />}
          title="Mobile-First Portal"
          description="Beautiful, responsive buyer portal accessible from any device, anywhere, anytime."
        />
        <BuyerFeature 
          icon={<Palette />}
          title="3D Customization"
          description="Interactive tools for buyers to customize finishes, upgrades, and see real-time pricing."
        />
        <BuyerFeature 
          icon={<FileText />}
          title="Digital Documents"
          description="Secure access to contracts, specifications, and important documents with e-signature support."
        />
        <BuyerFeature 
          icon={<MessageSquare />}
          title="Direct Communication"
          description="In-app messaging with sales teams, automated updates, and milestone notifications."
        />
        <BuyerFeature 
          icon={<BarChart />}
          title="Progress Tracking"
          description="Visual construction progress updates with photos, videos, and timeline information."
        />
        <BuyerFeature 
          icon={<Star />}
          title="Post-Sale Support"
          description="Warranty management, maintenance requests, and ongoing buyer support tools."
        />
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-4">Data-Driven Decision Making</h3>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Comprehensive analytics and reporting tools to optimize your development strategy
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <AnalyticsFeature 
            icon={<LineChart />}
            title="Sales Performance"
            description="Track sales velocity, conversion rates, and revenue projections with advanced forecasting."
          />
          <AnalyticsFeature 
            icon={<PieChart />}
            title="Market Analysis"
            description="Competitor benchmarking, pricing analysis, and demand forecasting for better positioning."
          />
          <AnalyticsFeature 
            icon={<TrendingUp />}
            title="ROI Tracking"
            description="Measure marketing effectiveness, channel performance, and cost per acquisition."
          />
          <AnalyticsFeature 
            icon={<Clock />}
            title="Time Analytics"
            description="Identify bottlenecks in sales process, optimize workflows, and reduce time-to-sale."
          />
        </div>
        <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
          <span className="text-gray-500">Analytics Dashboard Preview</span>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-blue-600 mb-4">{icon}</div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function SalesFeature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="text-green-600 mt-1">{icon}</div>
      <div>
        <h4 className="text-lg font-semibold mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function BuyerFeature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="text-purple-600 mb-4 flex justify-center">{icon}</div>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function AnalyticsFeature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="text-indigo-600 mt-1">{icon}</div>
      <div>
        <h4 className="text-lg font-semibold mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function IntegrationCard({ name, category }: { name: string; category: string }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-center">
      <div className="h-16 w-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
      <h4 className="font-semibold text-gray-900">{name}</h4>
      <p className="text-sm text-gray-500">{category}</p>
    </div>
  );
}

function CaseStudyCard({ developer, project, metric, description, image }: { 
  developer: string; 
  project: string; 
  metric: string; 
  description: string; 
  image: string;
}) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg">
      <div className="h-48 relative">
        <Image 
          src={image}
          alt={project}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="text-sm text-gray-500 mb-1">{developer}</div>
        <h4 className="text-xl font-semibold mb-2">{project}</h4>
        <div className="text-3xl font-bold text-blue-600 mb-3">{metric}</div>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function PricingCard({ tier, price, period, features, cta, highlighted }: {
  tier: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}) {
  return (
    <div className={`rounded-xl p-8 ${highlighted ? 'bg-blue-900 text-white ring-4 ring-blue-400 transform scale-105' : 'bg-white border border-gray-200'}`}>
      {highlighted && (
        <div className="text-center mb-4">
          <span className="bg-blue-400 text-blue-900 px-3 py-1 rounded-full text-sm font-semibold">Most Popular</span>
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2">{tier}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className={`text-sm ${highlighted ? 'text-blue-200' : 'text-gray-500'}`}> {period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle className={`h-5 w-5 mr-3 ${highlighted ? 'text-blue-300' : 'text-green-500'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/contact"
        className={`block text-center py-3 px-6 rounded-lg font-semibold transition-all ${
          highlighted
            ? 'bg-white text-blue-900 hover:bg-gray-100'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {cta}
      </Link>
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