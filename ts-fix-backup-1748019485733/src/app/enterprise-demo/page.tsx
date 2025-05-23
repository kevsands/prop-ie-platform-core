'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiZap,
  FiCode,
  FiShield,
  FiBarChart2,
  FiCpu,
  FiArrowRight,
  FiCheck,
  FiTrendingUp,
  FiGlobe,
  FiAward
} from 'react-icons/fi';

const features = [
  {
    icon: FiZap,
    title: 'Developer Onboarding',
    description: 'AI-powered 5-minute setup with video tutorials and team management',
    link: '/developer/onboarding',
    stats: '95% completion rate'
  },
  {
    icon: FiCode,
    title: 'Project Creation Wizard',
    description: 'Smart 5-step process with AI insights and financial modeling',
    link: '/developer/projects/create',
    stats: '50+ projects daily'
  },
  {
    icon: FiShield,
    title: 'Admin Verification',
    description: 'Automated risk assessment with AI-powered approvals',
    link: '/admin/verifications',
    stats: '2-hour avg approval'
  },
  {
    icon: FiBarChart2,
    title: 'Real-time Analytics',
    description: 'Predictive insights with geographic heat maps',
    link: '/analytics/dashboard',
    stats: '10TB data processed'
  },
  {
    icon: FiCpu,
    title: 'AI Platform Assistant',
    description: 'Voice-enabled helper with context-aware suggestions',
    link: '/ai-assistant',
    stats: '98% satisfaction'
  }
];

const metrics = [
  { label: 'Active Developers', value: '10,000+', change: '+127%' },
  { label: 'Projects Created', value: '50,000+', change: '+89%' },
  { label: 'Transaction Volume', value: '€2.5B', change: '+156%' },
  { label: 'Platform Uptime', value: '99.99%', change: '0%' }
];

export default function EnterpriseDemoPage() {
  const [hoveredFeaturesetHoveredFeature] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.8 }
          className="text-center"
        >
          <div className="inline-flex items-center bg-blue-500/10 rounded-full px-4 py-2 mb-8 border border-blue-500/20">
            <FiAward className="text-yellow-500 mr-2" />
            <span className="text-white text-sm">Enterprise-Grade Platform Live</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Welcome to the Future
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Experience the world's most advanced real estate platform with AI-powered features,
            real-time analytics, and enterprise security.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/developer/onboarding"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105 inline-flex items-center justify-center"
            >
              Start Building
              <FiArrowRight className="ml-2" />
            </Link>
            <Link
              href="/analytics/dashboard"
              className="px-8 py-4 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all inline-flex items-center justify-center border border-gray-700"
            >
              View Analytics
              <FiTrendingUp className="ml-2" />
            </Link>
          </div>
        </motion.div>

        {/* Real-time Metrics */}
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.8, delay: 0.2 }
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
        >
          {metrics.map((metricindex) => (
            <div
              key={metric.label}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
            >
              <p className="text-gray-400 text-sm">{metric.label}</p>
              <p className="text-3xl font-bold text-white mt-2">{metric.value}</p>
              <div className="flex items-center mt-2">
                <FiTrendingUp className={`text-sm ${metric.change.startsWith('+') ? 'text-green-500' : 'text-gray-500'} mr-1`} />
                <span className={`text-sm ${metric.change.startsWith('+') ? 'text-green-500' : 'text-gray-500'}`}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.8, delay: 0.4 }
          className="mt-20"
        >
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Enterprise Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((featureindex) => (
              <motion.div
                key={feature.title}
                initial={ opacity: 0, scale: 0.9 }
                animate={ opacity: 1, scale: 1 }
                transition={ duration: 0.5, delay: index * 0.1 }
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="relative"
              >
                <Link href={feature.link}>
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-blue-500 transition-all hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer h-full">
                    <div className="flex items-center justify-between mb-4">
                      <feature.icon className="text-4xl text-blue-500" />
                      <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                        {feature.stats}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>

                    <motion.div
                      animate={ x: hoveredFeature === index ? 5 : 0 }
                      className="flex items-center text-blue-400 mt-4"
                    >
                      <span className="text-sm mr-2">Explore</span>
                      <FiArrowRight />
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.8, delay: 0.6 }
          className="text-center mt-20 pb-20"
        >
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl p-12 border border-blue-500/30">
            <FiGlobe className="text-6xl text-blue-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of developers building the future of real estate on our platform.
              Start with our AI-powered onboarding and go live in minutes.
            </p>
            <Link
              href="/developer/onboarding"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-105 inline-flex items-center"
            >
              <FiCheck className="mr-2" />
              Start Your Journey
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}