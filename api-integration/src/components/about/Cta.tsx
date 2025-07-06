'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Cta = () => {
  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Property Experience?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Whether you're a property developer looking to streamline your projects
              or a buyer searching for your dream home, we're here to help.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/developments" className="bg-white text-blue-600 hover:bg-blue-50 font-medium py-3 px-8 rounded-md transition-colors inline-block">
                Browse Developments
              </Link>
              <Link href="/contact" className="bg-transparent border border-white hover:bg-white/10 text-white font-medium py-3 px-8 rounded-md transition-colors inline-block">
                Contact Us
              </Link>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold mb-2">15+</div>
                <p className="text-blue-100">Active Developments</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <div className="text-5xl font-bold mb-2">500+</div>
                <p className="text-blue-100">Happy Homeowners</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center"
              >
                <div className="text-5xl font-bold mb-2">98%</div>
                <p className="text-blue-100">Customer Satisfaction</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Cta;