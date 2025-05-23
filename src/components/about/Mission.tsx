'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Mission = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={ once: true, margin: "-100px" }
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-sm uppercase tracking-wider text-blue-600 font-semibold mb-2">Our Mission</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Revolutionizing Property Development in Ireland
            </h3>
          </motion.div>

          <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-8 leading-relaxed">
            At Prop, we're on a mission to transform how people experience property development and purchasing. 
            By combining innovative technology with deep industry expertise, we create seamless, transparent 
            processes that put buyers at the center of their journey.
          </motion.p>

          <motion.div variants={itemVariants} className="flex justify-center items-center">
            <div className="h-0.5 w-16 bg-blue-600"></div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-10 grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <h4 className="text-xl font-bold mb-4 text-gray-900">For Property Buyers</h4>
              <p className="text-gray-600">
                We empower buyers with intuitive tools and personalized support throughout the entire
                property purchase journey, from exploration to customization and beyond.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h4 className="text-xl font-bold mb-4 text-gray-900">For Developers</h4>
              <p className="text-gray-600">
                We provide developers with streamlined workflows, real-time insights, and integrated 
                solutions that enhance efficiency and buyer satisfaction.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Mission;