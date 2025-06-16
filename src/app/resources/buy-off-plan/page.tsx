'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Shield, CheckCircle, Clock, TrendingUp, Award, 
  ArrowRight, Building, Calculator, FileText, 
  ShieldCheck, CreditCard, Star, Zap, Info,
  Home, Lock, Globe, Phone, Mail, ChevronRight,
  Banknote, Calendar, Gift, Sparkles, Trophy,
  Timer, Users, Flame, AlertTriangle, Eye,
  TrendingDown, Activity, Target, Cpu, Gauge
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Real-time inventory tracker
const [currentBuyerstotalSlots] = [157200];

// Dynamic pricing tiers
const pricingTiers = [
  { units: 50, discount: 5, time: 48 }, // First 50 units: 5% discount, 48hr lock
  { units: 100, discount: 3, time: 24 }, // Next 50 units: 3% discount, 24hr lock
  { units: 150, discount: 1, time: 12 }, // Next 50 units: 1% discount, 12hr lock
  { units: 200, discount: 0, time: 6 },  // Last 50 units: Full price, 6hr lock
];

// Purchase acceleration options
const accelerationOptions = [
  {
    id: 'instant-lock',
    name: 'Instant Lock™',
    price: 500,
    time: '6 hours',
    features: [
      'Secure unit for 6 hours',
      'Price locked at current rate',
      'Full refund if not proceeding',
      'Priority KYC processing'
    ],
    speed: 'Lightning Fast',
    popular: true
  },
  {
    id: 'priority-queue',
    name: 'Priority Queue',
    price: 250,
    time: '24 hours',
    features: [
      'Join priority buyer queue',
      'Daily price protection',
      'Automated bidding system',
      'Queue position guarantee'
    ],
    speed: 'Fast Track',
    popular: false
  },
  {
    id: 'smart-reserve',
    name: 'Smart Reserve™',
    price: 1000,
    time: '72 hours',
    features: [
      '72-hour exclusive hold',
      'AI-powered unit matching',
      'Multi-unit reservation',
      'Transferable rights'
    ],
    speed: 'Flexible',
    popular: false
  }
];

// Gamification achievements
const achievements = [
  { id: 'early-bird', name: 'Early Bird', icon: '🌅', description: 'Among first 50 buyers', credits: 500 },
  { id: 'speed-demon', name: 'Speed Demon', icon: '⚡', description: 'Complete in <30 mins', credits: 300 },
  { id: 'full-stack', name: 'Full Stack', icon: '🏆', description: 'Complete all steps', credits: 1000 },
  { id: 'social-butterfly', name: 'Social Butterfly', icon: '🦋', description: 'Refer 3 friends', credits: 750 },
  { id: 'vip-status', name: 'VIP Status', icon: '👑', description: 'Reach Platinum level', credits: 2000 }
];

export default function BuyOffPlanPage() {
  const [timeRemainingsetTimeRemaining] = useState(3600); // 1 hour in seconds
  const [currentStagesetCurrentStage] = useState(0);
  const [userCreditssetUserCredits] = useState(0);
  const [selectedOptionsetSelectedOption] = useState('instant-lock');
  const [queuePositionsetQueuePosition] = useState(null);
  const [priceMultipliersetPriceMultiplier] = useState(1);
  const [achievementssetAchievements] = useState([]);
  const [liveViewerssetLiveViewers] = useState(342);
  const [recentActivitysetRecentActivity] = useState([]);
  const [unitHeatmapsetUnitHeatmap] = useState({});

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev> 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate live activity
  useEffect(() => {
    const activityTimer = setInterval(() => {
      const activities = [
        'John D. secured Unit 42B',
        'Sarah M. completed KYC',
        'Michael R. joined priority queue',
        'Emma L. earned Speed Demon badge',
        'David K. locked in Unit 15A'
      ];
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setRecentActivity(prev => [randomActivity, ...prev.slice(0)]);
      setLiveViewers(prev => prev + Math.floor(Math.random() * 10) - 5);
    }, 5000);
    return () => clearInterval(activityTimer);
  }, []);

  const formatTime = (seconds: any) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentTier = () => {
    return pricingTiers.find(tier => currentBuyers <= tier.units) || pricingTiers[pricingTiers.length - 1];
  };

  const tier = getCurrentTier();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Live Ticker Bar */}
      <div className="bg-gradient-to-r from-red-900 to-orange-900 py-2 overflow-hidden">
        <div className="flex items-center gap-8 animate-marquee">
          <span className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-yellow-400" />
            <strong>FLASH SALE ACTIVE</strong>
          </span>
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {currentBuyers}/{totalSlots} Units Claimed
          </span>
          <span className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {liveViewers} Watching Now
          </span>
          <span className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            Prices Increase in {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      {/* Hero Section with Live Counter */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.div
              initial={ opacity: 0, scale: 0.8 }
              animate={ opacity: 1, scale: 1 }
              className="inline-flex items-center px-6 py-3 bg-red-600/20 backdrop-blur-sm border border-red-500/50 rounded-full mb-6"
            >
              <Timer className="h-5 w-5 mr-2 text-red-400 animate-pulse" />
              <span className="text-white font-bold">LIMITED TIME: {tier.discount}% OFF</span>
            </motion.div>

            <motion.h1 
              initial={ opacity: 0, y: 20 }
              animate={ opacity: 1, y: 0 }
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent"
            >
              Secure Your Future Home NOW
            </motion.h1>

            <motion.p 
              initial={ opacity: 0, y: 20 }
              animate={ opacity: 1, y: 0 }
              transition={ delay: 0.1 }
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
            >
              Revolutionary instant purchase technology. Lock your unit in seconds: any, not months.
            </motion.p>

            {/* Live Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <motion.div 
                whileHover={ scale: 1.05 }
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <div className="text-3xl font-bold text-green-400">{currentBuyers}</div>
                <div className="text-sm text-white/70">Units Secured</div>
              </motion.div>
              <motion.div 
                whileHover={ scale: 1.05 }
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <div className="text-3xl font-bold text-yellow-400">{totalSlots - currentBuyers}</div>
                <div className="text-sm text-white/70">Available Now</div>
              </motion.div>
              <motion.div 
                whileHover={ scale: 1.05 }
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <div className="text-3xl font-bold text-red-400">{formatTime(timeRemaining)}</div>
                <div className="text-sm text-white/70">Until Price Rise</div>
              </motion.div>
              <motion.div 
                whileHover={ scale: 1.05 }
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <div className="text-3xl font-bold text-blue-400">{tier.discount}%</div>
                <div className="text-sm text-white/70">Current Discount</div>
              </motion.div>
            </div>

            <motion.div 
              initial={ opacity: 0, y: 20 }
              animate={ opacity: 1, y: 0 }
              transition={ delay: 0.2 }
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2">
                <Zap className="h-5 w-5" />
                Secure My Unit NOW
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-xl font-medium hover:bg-white/20 transition-all">
                Join Virtual Queue
              </button>
            </motion.div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 overflow-hidden">
              <span className="text-yellow-400 font-bold">LIVE:</span>
              {recentActivity.map((activityidx: any) => (
                <motion.span
                  key={idx}
                  initial={ opacity: 0, x: 50 }
                  animate={ opacity: 1, x: 0 }
                  className="text-white/80 whitespace-nowrap"
                >
                  {activity} •
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Pricing Visualization */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dynamic Pricing Algorithm
            </h2>
            <p className="text-xl text-gray-400">
              Prices adjust in real-time based on demand
            </p>
          </div>

          <div className="bg-black/50 rounded-2xl p-8 border border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {pricingTiers.map((tierindex: any) => {
                const isActive = currentBuyers <= tier.units && currentBuyers> (pricingTiers[index - 1]?.units || 0);
                return (
                  <motion.div
                    key={index}
                    whileHover={ scale: 1.05 }
                    className={`relative p-6 rounded-xl border-2 ${
                      isActive 
                        ? 'border-green-500 bg-green-500/10' 
                        : currentBuyers> tier.units 
                          ? 'border-gray-700 bg-gray-900/50 opacity-50' 
                          : 'border-gray-700 bg-gray-900/50'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="px-3 py-1 bg-green-500 text-black text-sm font-bold rounded-full">
                          ACTIVE NOW
                        </span>
                      </div>
                    )}

                    <div className="text-center">
                      <div className="text-2xl font-bold mb-2">
                        Units {pricingTiers[index - 1]?.units || 0} - {tier.units}
                      </div>
                      <div className="text-4xl font-bold text-green-400 mb-2">
                        {tier.discount}% OFF
                      </div>
                      <div className="text-gray-400 mb-4">
                        {tier.time} hour lock period
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                          style={
                            width: `${Math.min(
                              100,
                              ((currentBuyers - (pricingTiers[index - 1]?.units || 0)) / 
                              (tier.units - (pricingTiers[index - 1]?.units || 0))) * 100
                            )}%`
                          }
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Instant Lock Options */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={ opacity: 0, y: 20 }
              animate={ opacity: 1, y: 0 }
              className="inline-flex items-center px-4 py-2 bg-purple-600/20 backdrop-blur-sm border border-purple-500/50 rounded-full mb-4"
            >
              <Cpu className="h-4 w-4 mr-2 text-purple-400" />
              <span className="text-purple-300 font-medium">AI-Powered Matching</span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Purchase Speed
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Revolutionary technology that lets you secure your property instantly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {accelerationOptions.map((option: any) => (
              <motion.div
                key={option.id}
                whileHover={ y: -10 }
                className={`relative rounded-2xl overflow-hidden ${
                  selectedOption === option.id 
                    ? 'ring-2 ring-purple-500 shadow-2xl shadow-purple-500/20' 
                    : 'shadow-lg'
                }`}
              >
                {option.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-bold px-4 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}

                <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">
                      {option.name}
                    </h3>
                    <div className="px-3 py-1 bg-purple-600/20 border border-purple-500/50 rounded-full">
                      <span className="text-sm font-medium text-purple-300">{option.speed}</span>
                    </div>
                  </div>

                  <div className="text-4xl font-bold text-green-400 mb-2">
                    €{option.price}
                  </div>
                  <div className="text-gray-400 mb-6">
                    Lock for {option.time}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {option.features.map((featureidx: any) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setSelectedOption(option.id)}
                    className={`w-full py-3 rounded-lg font-medium transition-all ${
                      selectedOption === option.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {selectedOption === option.id ? 'Selected' : 'Select This Option'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Unit Heatmap */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Live Availability Heatmap
            </h2>
            <p className="text-xl text-gray-400">
              Units are being claimed in real-time
            </p>
          </div>

          <div className="bg-black/50 rounded-2xl p-8 border border-gray-800">
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: 100 }, (_i: any) => {
                const isAvailable = Math.random() > 0.6;
                const demand = Math.random();
                return (
                  <motion.div
                    key={i}
                    whileHover={ scale: 1.2 }
                    className={`aspect-square rounded cursor-pointer ${
                      !isAvailable
                        ? 'bg-red-900/50'
                        : demand> 0.8
                        ? 'bg-yellow-500/50'
                        : demand> 0.5
                        ? 'bg-green-500/50'
                        : 'bg-gray-700/50'
                    }`}
                    title={`Unit ${i + 1}: ${isAvailable ? 'Available' : 'Claimed'}`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-700/50 rounded" />
                <span className="text-gray-400">Low Demand</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500/50 rounded" />
                <span className="text-gray-400">Medium Demand</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500/50 rounded" />
                <span className="text-gray-400">High Demand</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-900/50 rounded" />
                <span className="text-gray-400">Claimed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Queue System */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-8 border border-blue-500/50">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Virtual Queue System
              </h2>
              <p className="text-xl text-gray-300">
                Join the queue and we\'ll notify you when units become available
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-400 mb-2">342</div>
                <div className="text-gray-400">People in Queue</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-yellow-400 mb-2">~15min</div>
                <div className="text-gray-400">Average Wait Time</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-400 mb-2">89%</div>
                <div className="text-gray-400">Success Rate</div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all">
                Join Virtual Queue
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Achievement System */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Unlock Achievements & Rewards
            </h2>
            <p className="text-xl text-gray-400">
              Earn credits and exclusive perks as you progress
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {achievements.map((achievement: any) => (
              <motion.div
                key={achievement.id}
                whileHover={ scale: 1.05 }
                className="bg-gray-800 rounded-xl p-6 text-center"
              >
                <div className="text-4xl mb-4">{achievement.icon}</div>
                <h3 className="font-bold mb-2">{achievement.name}</h3>
                <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                <div className="text-yellow-400 font-bold">+{achievement.credits} Credits</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal & Compliance */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-900/20 rounded-2xl p-8 border border-blue-500/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-600 text-white rounded-full">
                <Shield className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold">
                Legal Protection & Instant Compliance
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Buyer Protection</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span>Instant digital contracts via DocuSign</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span>Blockchain-verified transaction records</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span>Automated escrow protection</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span>Real-time legal AI assistance</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Developer Benefits</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span>Instant qualified buyer verification</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span>Dynamic pricing optimization</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span>Reduced holding costs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                    <span>Automated compliance reporting</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-900 to-pink-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Don\'t Miss Out - Prices Rise In
          </h2>
          <div className="text-6xl font-bold text-yellow-400 mb-8">
            {formatTime(timeRemaining)}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/instant-purchase"
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all font-bold text-lg"
            >
              <Zap className="mr-2 h-6 w-6" />
              Secure My Unit NOW
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
            <Link
              href="/virtual-tour"
              className="inline-flex items-center px-10 py-5 border-2 border-white text-white rounded-xl hover:bg-white hover:text-purple-900 transition-all font-bold text-lg"
            >
              Take Virtual Tour
              <Eye className="ml-2 h-6 w-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}