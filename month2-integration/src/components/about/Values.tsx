'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Values = () => {
  const values = [
    {
      icon: "💡",
      title: "Innovation",
      description: "We constantly seek new ways to improve the property development and buying experience through technology and creative solutions."
    },
    {
      icon: "🤝",
      title: "Transparency",
      description: "We believe in open communication and full visibility into the entire property development and purchase process."
    },
    {
      icon: "🏆",
      title: "Excellence",
      description: "We are committed to the highest standards in every aspect of our service, from technology to customer support."
    },
    {
      icon: "🌱",
      title: "Sustainability",
      description: "We prioritize environmentally responsible practices in property development and operations."
    },
    {
      icon: "🔒",
      title: "Security",
      description: "We implement robust measures to protect user data and financial transactions throughout the property journey."
    },
    {
      icon: "🤲",
      title: "Community",
      description: "We foster connections between developers, buyers, and local communities to create thriving neighborhoods."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm uppercase tracking-wider text-blue-600 font-semibold mb-2">
              Our Core Values
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Principles That Guide Us
            </h3>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              These foundational values shape our approach to every aspect of our business
              and define how we serve our customers and partners.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h4 className="text-xl font-bold mb-3 text-gray-900">{value.title}</h4>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values;