'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Rocket,
  Target,
  TrendingUp,
  Clock,
  Shield,
  Users,
  BarChart,
  Building,
  Zap,
  Check,
  ArrowRight,
  PieChart,
  FileCode,
  Play,
  DollarSign,
  Award,
  Globe,
  MessageSquare,
  Cloud,
  Cpu,
  Database,
  Phone,
  Mail,
  MapPin,
  Star,
  Sparkles,
  ChevronRight,
  LineChart,
  Package,
  Settings,
  Code,
  Layers,
  GitBranch,
  Terminal,
  Box,
  Users2,
  CreditCard,
  CheckCircle2,
  Lock,
  Briefcase,
  Heart,
  Eye,
  Download,
  Share2,
  Calendar,
  Megaphone,
  HelpCircle,
  Monitor,
  Smartphone,
  Tablet,
  Construction,
  Building2,
  Home,
  Key,
  FileSearch,
  FileText,
  Lightbulb,
  Brain,
  Workflow,
  LucideIcon
} from 'lucide-react';

// Hero Section with Parallax
const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
      />
      
      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0] 
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute top-20 left-20 opacity-10"
      >
        <Building size={200} className="text-white" />
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0] 
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute bottom-20 right-20 opacity-10"
      >
        <Code size={300} className="text-white" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ opacity }}
        >
          {/* Animated Badge */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white mb-8"
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Trusted by Ireland's Top Developers</span>
          </motion.div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6">
            <span className="block">Build. Sell. Scale.</span>
            <motion.span 
              className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              The Developer Platform of Tomorrow
            </motion.span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Revolutionize your property development workflow with Ireland's most advanced 
            digital sales platform. From planning to handover, PROP streamlines every step.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Start Free Trial
              <ArrowRight className="inline-block ml-2" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold text-lg border border-white/20 hover:bg-white/20 transition-all"
            >
              <Play className="inline-block mr-2" />
              Watch Demo
            </motion.button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <h3 className="text-3xl font-bold text-white">500+</h3>
              <p className="text-gray-300">Developments Listed</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <h3 className="text-3xl font-bold text-white">€2B+</h3>
              <p className="text-gray-300">Property Sales</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-center"
            >
              <h3 className="text-3xl font-bold text-white">98%</h3>
              <p className="text-gray-300">Satisfaction Rate</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
};

// Problem/Solution Section
const ProblemSolutionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const problems = [
    {
      icon: Clock,
      title: "Time-Consuming Processes",
      description: "Manual paperwork and disconnected systems waste precious time"
    },
    {
      icon: Users,
      title: "Buyer Management Chaos",
      description: "Tracking buyers across multiple channels is overwhelming"
    },
    {
      icon: FileSearch,
      title: "Document Nightmares",
      description: "Physical documents get lost, delayed, or require constant follow-ups"
    },
    {
      icon: TrendingUp,
      title: "Limited Sales Insights",
      description: "Lack of real-time data makes decision-making difficult"
    }
  ];

  const solutions = [
    {
      icon: Zap,
      title: "Automated Workflows",
      description: "Streamline every process from listing to completion"
    },
    {
      icon: Database,
      title: "Centralized CRM",
      description: "All buyer information in one powerful platform"
    },
    {
      icon: Cloud,
      title: "Digital Document Hub",
      description: "Secure, instant access to all documents anytime, anywhere"
    },
    {
      icon: BarChart,
      title: "Real-Time Analytics",
      description: "Make data-driven decisions with comprehensive insights"
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">
            Transform Your Development Business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stop losing sales to outdated processes. Start winning with modern technology.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Problems */}
          <div>
            <h3 className="text-2xl font-bold mb-8 text-red-600">The Old Way</h3>
            <div className="space-y-6">
              {problems.map((problem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4 p-6 bg-red-50 rounded-xl"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <problem.icon className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{problem.title}</h4>
                    <p className="text-gray-600">{problem.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-2xl font-bold mb-8 text-green-600">The PROP Way</h3>
            <div className="space-y-6">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4 p-6 bg-green-50 rounded-xl"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <solution.icon className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">{solution.title}</h4>
                    <p className="text-gray-600">{solution.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            See How It Works
            <ArrowRight className="inline-block ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// Platform Features Section
const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const features = [
    {
      icon: Building2,
      title: "Project Management",
      description: "Manage multiple developments with ease",
      details: [
        "Development timeline tracking",
        "Construction progress updates",
        "Multi-site overview dashboard",
        "Resource allocation tools"
      ],
      color: "blue"
    },
    {
      icon: Users2,
      title: "Buyer Management",
      description: "Complete CRM for property buyers",
      details: [
        "Lead capture and qualification",
        "Automated follow-ups",
        "Document collection",
        "Communication history"
      ],
      color: "purple"
    },
    {
      icon: FileCode,
      title: "Digital Contracts",
      description: "Paperless transaction management",
      details: [
        "E-signature integration",
        "Legal compliance checks",
        "Automated reminders",
        "Secure document storage"
      ],
      color: "green"
    },
    {
      icon: BarChart,
      title: "Sales Analytics",
      description: "Real-time insights and reporting",
      details: [
        "Sales funnel visualization",
        "Revenue forecasting",
        "Buyer behavior analytics",
        "Custom report generation"
      ],
      color: "orange"
    },
    {
      icon: Globe,
      title: "Marketing Hub",
      description: "Integrated marketing tools",
      details: [
        "Property listing syndication",
        "Virtual tours and 3D models",
        "Lead generation campaigns",
        "Social media integration"
      ],
      color: "pink"
    },
    {
      icon: Shield,
      title: "Compliance & Security",
      description: "Irish market compliance built-in",
      details: [
        "KYC/AML verification",
        "GDPR compliance tools",
        "Legal document templates",
        "Audit trail tracking"
      ],
      color: "indigo"
    }
  ];

  const [selectedFeature, setSelectedFeature] = useState(0);

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A complete platform designed specifically for Irish property developers
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Feature Cards */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedFeature(index)}
                className={`p-6 rounded-2xl cursor-pointer transition-all border-2 ${
                  selectedFeature === index
                    ? `border-${feature.color}-500 shadow-xl bg-${feature.color}-50`
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-600 flex items-center justify-center mb-4`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Feature Details */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFeature}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="sticky top-32 bg-gray-50 rounded-2xl p-8"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br from-${features[selectedFeature].color}-400 to-${features[selectedFeature].color}-600 flex items-center justify-center mb-6`}>
                  {React.createElement(features[selectedFeature].icon, { className: "w-10 h-10 text-white" })}
                </div>
                <h3 className="text-2xl font-bold mb-4">{features[selectedFeature].title}</h3>
                <p className="text-gray-600 mb-6">{features[selectedFeature].description}</p>
                <ul className="space-y-3">
                  {features[selectedFeature].details.map((detail, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className={`w-6 h-6 text-${features[selectedFeature].color}-500 flex-shrink-0`} />
                      <span className="text-gray-700">{detail}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`mt-8 w-full py-3 bg-gradient-to-r from-${features[selectedFeature].color}-500 to-${features[selectedFeature].color}-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all`}
                >
                  Learn More
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

// Workflow Visualization
const WorkflowSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const steps = [
    {
      icon: Package,
      title: "List Your Development",
      description: "Upload property details, plans, and pricing in minutes"
    },
    {
      icon: Megaphone,
      title: "Market Automatically",
      description: "Reach qualified buyers across multiple channels"
    },
    {
      icon: Users,
      title: "Manage Buyers",
      description: "Track leads, schedule viewings, and collect documents"
    },
    {
      icon: FileText,
      title: "Process Sales",
      description: "Digital contracts and automated compliance checks"
    },
    {
      icon: Key,
      title: "Complete Handover",
      description: "Seamless digital handover with all documentation"
    },
    {
      icon: LineChart,
      title: "Analyze & Optimize",
      description: "Use insights to improve your next development"
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">
            From Listing to Handover in 6 Simple Steps
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how PROP streamlines your entire development sales process
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 to-purple-300 transform -translate-y-1/2 hidden lg:block" />
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-24 h-24 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center relative z-10"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                  </motion.div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Schedule a Demo
            <ArrowRight className="inline-block ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// ROI Calculator
const ROISection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const [units, setUnits] = useState(50);
  const [avgPrice, setAvgPrice] = useState(400000);
  const [salesCycle, setSalesCycle] = useState(18);
  
  // Calculate ROI metrics
  const totalRevenue = units * avgPrice;
  const timeSaved = Math.round(salesCycle * 0.4); // 40% reduction
  const costSavings = Math.round(totalRevenue * 0.02); // 2% of revenue
  const additionalSales = Math.round(units * 0.15); // 15% more sales
  const additionalRevenue = additionalSales * avgPrice;

  return (
    <section ref={ref} className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">
            Calculate Your ROI
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how much time and money PROP can save your business
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Calculator Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="bg-gray-800 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-8">Your Development Details</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Number of Units</label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={units}
                  onChange={(e) => setUnits(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>10</span>
                  <span className="text-lg font-semibold text-white">{units} units</span>
                  <span>500</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Average Unit Price</label>
                <input
                  type="range"
                  min="200000"
                  max="1000000"
                  step="50000"
                  value={avgPrice}
                  onChange={(e) => setAvgPrice(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>€200k</span>
                  <span className="text-lg font-semibold text-white">€{avgPrice.toLocaleString()}</span>
                  <span>€1M</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Current Sales Cycle (months)</label>
                <input
                  type="range"
                  min="6"
                  max="36"
                  value={salesCycle}
                  onChange={(e) => setSalesCycle(parseInt(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>6</span>
                  <span className="text-lg font-semibold text-white">{salesCycle} months</span>
                  <span>36</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-8">Your Potential Savings</h3>
            
            <div className="space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="flex items-center gap-4 mb-2">
                  <Clock className="w-8 h-8 text-blue-300" />
                  <h4 className="text-lg font-semibold">Time Saved</h4>
                </div>
                <p className="text-3xl font-bold">{timeSaved} months</p>
                <p className="text-blue-200">Faster sales cycle</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="flex items-center gap-4 mb-2">
                  <DollarSign className="w-8 h-8 text-green-300" />
                  <h4 className="text-lg font-semibold">Cost Savings</h4>
                </div>
                <p className="text-3xl font-bold">€{costSavings.toLocaleString()}</p>
                <p className="text-green-200">In operational costs</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <div className="flex items-center gap-4 mb-2">
                  <TrendingUp className="w-8 h-8 text-purple-300" />
                  <h4 className="text-lg font-semibold">Additional Revenue</h4>
                </div>
                <p className="text-3xl font-bold">€{additionalRevenue.toLocaleString()}</p>
                <p className="text-purple-200">From {additionalSales} more sales</p>
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
            >
              Get Custom ROI Report
              <ArrowRight className="inline-block ml-2" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Success Stories Carousel
const SuccessStoriesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [activeStory, setActiveStory] = useState(0);

  const stories = [
    {
      developer: "Prestige Developments",
      logo: "/images/developers/prestige-logo.png",
      person: "Michael O'Brien",
      role: "CEO",
      quote: "PROP transformed our sales process. We sold out Fitzgerald Gardens 3 months ahead of schedule.",
      metrics: {
        units: 85,
        timeReduction: "45%",
        costSaving: "€120,000"
      },
      image: "/images/developments/fitzgerald-gardens/hero.jpg"
    },
    {
      developer: "Quality Homes Ireland",
      logo: "/images/developers/quality-logo.png",
      person: "Sarah McCarthy",
      role: "Sales Director",
      quote: "The digital buyer journey and automated compliance checks have been game-changers for us.",
      metrics: {
        units: 120,
        timeReduction: "50%",
        costSaving: "€200,000"
      },
      image: "/images/developments/ballymakenny-view/hero.jpg"
    },
    {
      developer: "Green Valley Properties",
      logo: "/images/developers/green-valley-logo.png",
      person: "Tom Kelly",
      role: "Managing Director",
      quote: "We've increased our sales velocity by 60% since switching to PROP. The ROI is incredible.",
      metrics: {
        units: 200,
        timeReduction: "60%",
        costSaving: "€350,000"
      },
      image: "/images/developments/riverside-manor.jpg"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % stories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [stories.length]);

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join Ireland's leading developers who are already transforming their business with PROP
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStory}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-3xl overflow-hidden"
            >
              <div className="grid md:grid-cols-2">
                {/* Content */}
                <div className="p-12">
                  <div className="mb-8">
                    <div className="h-12 mb-4">
                      {/* Logo placeholder */}
                      <div className="h-full w-32 bg-gray-300 rounded-lg"></div>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{stories[activeStory].developer}</h3>
                    <p className="text-gray-600">{stories[activeStory].person} • {stories[activeStory].role}</p>
                  </div>

                  <blockquote className="text-xl text-gray-700 mb-8 italic">
                    "{stories[activeStory].quote}"
                  </blockquote>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-xl">
                      <p className="text-2xl font-bold text-blue-600">{stories[activeStory].metrics.units}</p>
                      <p className="text-sm text-gray-600">Units Sold</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl">
                      <p className="text-2xl font-bold text-green-600">{stories[activeStory].metrics.timeReduction}</p>
                      <p className="text-sm text-gray-600">Faster Sales</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl">
                      <p className="text-2xl font-bold text-purple-600">{stories[activeStory].metrics.costSaving}</p>
                      <p className="text-sm text-gray-600">Saved</p>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="relative h-full min-h-[400px]">
                  <Image
                    src={stories[activeStory].image}
                    alt={stories[activeStory].developer}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStory(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeStory
                    ? 'bg-blue-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Read Full Case Studies
            <ArrowRight className="inline-block ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// Integrations Section
const IntegrationsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const integrations = [
    { name: "Salesforce", category: "CRM", icon: Cloud },
    { name: "DocuSign", category: "Documents", icon: FileText },
    { name: "Stripe", category: "Payments", icon: CreditCard },
    { name: "HubSpot", category: "Marketing", icon: Megaphone },
    { name: "Xero", category: "Accounting", icon: PieChart },
    { name: "Microsoft Teams", category: "Communication", icon: MessageSquare },
    { name: "Zoom", category: "Meetings", icon: Video },
    { name: "Slack", category: "Team Chat", icon: MessageSquare },
    { name: "Google Analytics", category: "Analytics", icon: BarChart },
    { name: "Mailchimp", category: "Email", icon: Mail },
    { name: "Calendly", category: "Scheduling", icon: Calendar },
    { name: "Zapier", category: "Automation", icon: Zap }
  ];

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">
            Integrates With Your Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PROP works seamlessly with the tools you already use and love
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                <integration.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-1">{integration.name}</h3>
              <p className="text-sm text-gray-600">{integration.category}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-8">
            Don't see your tool? We're always adding new integrations.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all border border-gray-200"
          >
            Request Integration
            <ArrowRight className="inline-block ml-2" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// Pricing Section
const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small developers",
      monthlyPrice: 299,
      yearlyPrice: 249,
      features: [
        "Up to 50 units",
        "Basic CRM",
        "Document management",
        "Email support",
        "Standard analytics",
        "1 user license"
      ],
      color: "blue",
      popular: false
    },
    {
      name: "Professional",
      description: "For growing developers",
      monthlyPrice: 599,
      yearlyPrice: 499,
      features: [
        "Up to 200 units",
        "Advanced CRM",
        "All document features",
        "Priority support",
        "Advanced analytics",
        "5 user licenses",
        "Marketing tools",
        "API access"
      ],
      color: "purple",
      popular: true
    },
    {
      name: "Enterprise",
      description: "For large developments",
      monthlyPrice: 999,
      yearlyPrice: 849,
      features: [
        "Unlimited units",
        "Enterprise CRM",
        "Custom workflows",
        "24/7 support",
        "Custom analytics",
        "Unlimited users",
        "White labeling",
        "Dedicated manager"
      ],
      color: "green",
      popular: false
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your development needs
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-gray-900 shadow-md'
                  : 'text-gray-600'
              }`}
            >
              Yearly
              <span className="ml-2 text-green-600 text-sm">Save 20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 bg-yellow-400 text-gray-900 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={plan.popular ? 'text-gray-100' : 'text-gray-600'}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <p className="text-5xl font-bold mb-2">
                  €{billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                </p>
                <p className={plan.popular ? 'text-gray-100' : 'text-gray-600'}>
                  per month
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <CheckCircle2 className={`w-6 h-6 flex-shrink-0 ${
                      plan.popular ? 'text-green-300' : 'text-green-600'
                    }`} />
                    <span className={plan.popular ? 'text-gray-100' : 'text-gray-700'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  plan.popular
                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                }`}
              >
                Start Free Trial
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-8">
            All plans include a 30-day money-back guarantee
          </p>
          <Link
            href="/contact/sales"
            className="text-blue-600 font-semibold hover:text-blue-700"
          >
            Need a custom plan? Contact our sales team →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// Final CTA Section
const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-10"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full opacity-10"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold mb-6">
            Ready to Transform Your Development Business?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join 100+ Irish developers who are already selling properties faster and more efficiently with PROP
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Start Your Free Trial
              <ArrowRight className="inline-block ml-2" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent text-white rounded-xl font-bold text-lg border-2 border-white hover:bg-white hover:text-gray-900 transition-all"
            >
              <Phone className="inline-block mr-2" />
              Book a Call
            </motion.button>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p className="text-gray-200">No credit card required</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p className="text-gray-200">30-day free trial</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <p className="text-gray-200">Cancel anytime</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Main Page Component
export default function DeveloperSalesPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <WorkflowSection />
      <ROISection />
      <SuccessStoriesSection />
      <IntegrationsSection />
      <PricingSection />
      <CTASection />
      
      {/* Fixed Contact Button */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
        >
          <MessageSquare size={24} />
        </motion.button>
      </motion.div>
    </div>
  );
}