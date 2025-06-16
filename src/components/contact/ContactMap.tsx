import React from 'react';
'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapProps } from '@/types/contact';
import styles from '@/app/contact/contact.module.css';

// Register the ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const ContactMap: React.FC<MapProps> = ({ 
  offices, 
  defaultCenter = { lat: 53.3498, lng: -6.2603 },  // Default to Dublin
  defaultZoom = 12 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // This effect handles animation
    const mapContainer = mapContainerRef.current;

    if (mapContainer && typeof window !== 'undefined') {
      gsap.fromTo(
        mapContainer,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          scrollTrigger: {
            trigger: mapContainer,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    }
  }, []);

  useEffect(() => {
    // This effect initializes the Leaflet map
    if (typeof window !== 'undefined' && mapContainerRef.current) {
      // Dynamically import Leaflet only on the client side
      const initializeMap = async () => {
        try {
          const L = (await import('leaflet')).default;

          // Make sure we have the CSS
          await import('leaflet/dist/leaflet.css');

          // Clean up existing map instance if it exists
          if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            markersRef.current = [];
          }

          // Create map instance
          const map = L.map(mapContainerRef.current, {
            center: [defaultCenter.lat, defaultCenter.lng],
            zoom: defaultZoom,
            scrollWheelZoom: false,
            zoomControl: true
          });

          mapInstanceRef.current = map;

          // Add OpenStreetMap tile layer
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);

          // Custom icon for markers
          const customIcon = L.icon({
            iconUrl: '/images/map-marker.svg',
            iconSize: [3232],
            iconAnchor: [1632],
            popupAnchor: [0, -32]
          });

          // Add office markers
          if (offices && offices.length> 0) {
            const bounds = L.latLngBounds([]);

            offices.forEach(office => {
              const { coordinates, name, address, phone } = office;

              // Create marker
              const marker = L.marker(
                [coordinates.lat, coordinates.lng],
                { 
                  icon: customIcon || L.Icon.Default,
                  title: name
                }
              ).addTo(map);

              // Add popup
              marker.bindPopup(`
                <div class="map-popup">
                  <h3>${name}</h3>
                  <p>${address}</p>
                  <p>${phone}</p>
                </div>
              `);

              // Store marker reference
              markersRef.current.push(marker);

              // Extend bounds
              bounds.extend([coordinates.lat, coordinates.lng]);
            });

            // Fit map to bounds if multiple offices
            if (offices.length> 1) {
              map.fitBounds(bounds, {
                padding: [5050],
                maxZoom: 15
              });
            }
          }

          // Handle resize
          const handleResize = () => {
            map.invalidateSize();
          };

          window.addEventListener('resize', handleResize);

          // Handle cleanup
          return () => {
            window.removeEventListener('resize', handleResize);
            if (map) {
              map.remove();
            }
          };
        } catch (error) {

        }
      };

      initializeMap();
    }
  }, [officesdefaultCenterdefaultZoom]);

  return (
    <section className={styles.mapSection}>
      <div className={styles.mapContainer} ref={mapContainerRef}></div>
    </section>
  );
};

export default ContactMap;