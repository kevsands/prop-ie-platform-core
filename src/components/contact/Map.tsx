'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Map = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Check if Leaflet is available in the client
    if (typeof window !== 'undefined' && mapContainerRef.current) {
      // Dynamically import Leaflet to avoid SSR issues
      import('leaflet').then((L) => {
        // Make sure the map container is still mounted
        if (!mapContainerRef.current) return;
        
        // Initialize map if it hasn't been initialized yet
        if (!mapContainerRef.current.classList.contains('leaflet-container')) {
          // Define custom icon
          const customIcon = L.icon({
            iconUrl: '/images/map-marker.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          });
          
          // Set map view to Dublin
          const map = L.map(mapContainerRef.current).setView([53.349805, -6.26031], 13);
          
          // Add OpenStreetMap tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
          
          // Add marker for company location
          const marker = L.marker([53.349805, -6.26031], { icon: customIcon }).addTo(map);
          
          // Add popup to marker
          marker.bindPopup('<strong>Prop Headquarters</strong><br>123 Business Park<br>Dublin 2, D02 AB12').openPopup();
          
          // Cleanup function
          return () => {
            map.remove();
          };
        }
      }).catch(err => {
        console.error('Error loading Leaflet:', err);
      });
    }
  }, []);
  
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900">Our Location</h2>
          <p className="text-gray-600 mt-2">Find us in the heart of Dublin's business district</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-[400px] rounded-lg overflow-hidden shadow-md"
        >
          <div ref={mapContainerRef} className="w-full h-full">
            {/* Map will be rendered here */}
            {/* Fallback for when map isn't loaded */}
            <div className="flex items-center justify-center h-full bg-gray-100">
              <p className="text-gray-500">Loading map...</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Map;