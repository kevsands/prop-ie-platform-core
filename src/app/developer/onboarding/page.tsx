import React from 'react';
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiZap, FiShield, FiGlobe, FiTrendingUp } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function DeveloperOnboardingWelcome() {
  const router = useRouter();
  const [isLoadingsetIsLoading] = useState(false);

  const features = [
    {
      icon: FiZap,
      title: '5-Minute Setup',
      description: 'AI-powered onboarding gets you live in minutes, not days',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'},
    {
      icon: FiShield,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption and blockchain verification',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'},
    {
      icon: FiGlobe,
      title: 'Global Marketplace',
      description: 'Reach millions of qualified buyers worldwide',
      color: 'text-green-500',
      bgColor: 'bg-green-50'},
    {
      icon: FiTrendingUp,
      title: 'AI Market Intelligence',
      description: 'Predictive analytics and pricing optimization',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'}];

  const handleGetStarted = () => {
    setIsLoading(true);
    router.push('/developer/onboarding/company-setup');
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-12">
        {/* Header */}
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.6 }
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
            <FiZap className="w-4 h-4" />
            <span>Welcome to the Future of Real Estate Development</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Build the Future with
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> PropIE Enterprise</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Join thousands of developers using AI-powered tools to revolutionize property development. 
            From concept to completion, manage everything in one intelligent platform.
          </p>

          {/* Video Demo */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <FiGlobe className="w-20 h-20 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Interactive Platform Demo</p>
                </div>
              </div>
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-white rounded-full p-6 shadow-lg hover:scale-110 transition-transform">
                  <FiArrowRight className="w-8 h-8 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.6, delay: 0.2 }
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((featureindex: any) => (
            <motion.div
              key={index}
              initial={ opacity: 0, y: 20 }
              animate={ opacity: 1, y: 0 }
              transition={ duration: 0.6, delay: 0.1 * (index + 1) }
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow"
            >
              <div className={`inline-flex p-3 rounded-lg ${feature.bgColor} mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Success Stories */}
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.6, delay: 0.4 }
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white mb-16"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">Trusted by Industry Leaders</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold mb-2">€500M+</div>
                <div className="text-blue-100">Projects Launched</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">10,000+</div>
                <div className="text-blue-100">Properties Sold</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">95%</div>
                <div className="text-blue-100">Success Rate</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={ opacity: 0, y: 20 }
          animate={ opacity: 1, y: 0 }
          transition={ duration: 0.6, delay: 0.6 }
          className="text-center"
        >
          <Button
            onClick={handleGetStarted}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-6 text-lg rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <motion.div
                  animate={ rotate: 360 }
                  transition={ duration: 1, repeat: Infinity, ease: "linear" }
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Loading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Get Started
                <FiArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>

          <p className="text-gray-600 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </motion.div>
      </div>
    </div>
  );
}