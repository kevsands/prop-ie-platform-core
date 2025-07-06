'use client';

import React from 'react';
import Image from 'next/image';
import { motion, MotionStyle, Variants, Transition } from 'framer-motion';

// Type definitions for motion props
type MotionProps = {
  initial?: Record<string, number | string>;
  animate?: Record<string, number | string | number[]>;
  whileInView?: Record<string, number | string>;
  viewport?: { once?: boolean };
  transition?: Transition;
  className?: string;
  style?: MotionStyle;
};

const Hero = () => {
  // Animation variants
  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const scrollIndicatorVariants: Variants = {
    animate: {
      y: [0, 10, 0],
      transition: { repeat: Infinity, duration: 1.5 }
    }
  };

  return (
    <div className="relative w-full h-[70vh] bg-gray-900 text-white overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/about/hero-bg.jpg" 
          alt="Prop.ie offices"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Building a Better Future in Irish Real Estate
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            At Prop, we're transforming the property development and buying experience
            through innovation, transparency, and commitment to excellence.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors">
              Our Developments
            </button>
            <button className="bg-transparent border border-white hover:bg-white/10 text-white font-medium py-3 px-6 rounded-md transition-colors">
              Learn More
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <motion.div 
          variants={scrollIndicatorVariants}
          animate="animate"
          className="flex flex-col items-center"
        >
          <span className="text-sm font-medium mb-2">Scroll Down</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="feather feather-chevron-down"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;