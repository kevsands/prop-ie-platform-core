'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Offices = () => {
  const offices = [
    {
      name: 'Dublin Headquarters',
      address: '123 Business Park, Dublin 2, D02 AB12',
      phone: '+353 1 234 5678',
      email: 'dublin@prop.ie',
      image: '/images/contact/office-dublin.jpg'
    },
    {
      name: 'Cork Office',
      address: '45 City Centre, Cork, T12 XY45',
      phone: '+353 21 234 5678',
      email: 'cork@prop.ie',
      image: '/images/contact/office-cork.jpg'
    },
    {
      name: 'Galway Office',
      address: '67 Waterfront, Galway, H91 PQ23',
      phone: '+353 91 234 5678',
      email: 'galway@prop.ie',
      image: '/images/contact/office-galway.jpg'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Offices</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Visit us at any of our offices across Ireland to discuss your property needs in person.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offices.map((office, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={office.image}
                  alt={office.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{office.name}</h3>
                <address className="not-italic text-gray-600 mb-4">
                  {office.address}
                </address>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    <span className="text-gray-700">{office.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span className="text-gray-700">{office.email}</span>
                  </div>
                </div>
                <div className="mt-6">
                  <button className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                    <span className="mr-1">Get Directions</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offices;