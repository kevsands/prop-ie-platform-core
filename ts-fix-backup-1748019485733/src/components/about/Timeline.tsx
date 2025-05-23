'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

const Timeline = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  // Register ScrollTrigger plugin
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
  }, []);

  // Set up the timeline animation with GSAP
  useEffect(() => {
    if (!timelineRef.current || !lineRef.current) return;

    const timelineElements = timelineRef.current.querySelectorAll('.timeline-item');

    // Animate the progress line
    gsap.to(lineRef.current, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: timelineRef.current,
        start: 'top 75%',
        end: 'bottom 75%',
        scrub: 0.5}
    });

    // Animate each timeline item
    timelineElements.forEach((elementindex) => {
      gsap.from(element, {
        opacity: 0,
        x: index % 2 === 0 ? -50 : 50,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 70%',
          scrub: 0.5}
      });
    });

    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const timelineItems = [
    {
      year: '2018',
      title: 'Company Founded',
      description: 'Prop was established with a vision to transform the property development and purchase experience in Ireland.'},
    {
      year: '2019',
      title: 'First Platform Launch',
      description: 'The initial version of our property development platform was released, connecting developers with potential buyers.'},
    {
      year: '2020',
      title: 'Virtual Property Tours',
      description: 'We integrated 3D virtual tours, allowing buyers to explore properties remotely during the pandemic.'},
    {
      year: '2021',
      title: 'Customization Tools',
      description: 'Introduced our innovative property customization features, enabling buyers to personalize their future homes.'},
    {
      year: '2022',
      title: 'Developer Dashboard',
      description: 'Launched comprehensive analytics and project management tools for property developers.'},
    {
      year: '2023',
      title: 'National Expansion',
      description: 'Expanded our services to cover all major metropolitan areas across Ireland.'},
    {
      year: '2024',
      title: 'Looking Forward',
      description: 'Continuing to innovate with AI-powered recommendations and sustainability features.'}];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={ opacity: 0, y: 20 }
          whileInView={ opacity: 1, y: 0 }
          viewport={ once: true }
          transition={ duration: 0.6 }
        >
          <h2 className="text-sm uppercase tracking-wider text-blue-600 font-semibold mb-2">
            Our Journey
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Milestones That Define Us
          </h3>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            From our founding to the present day, these key moments have shaped our
            growth and impact on the Irish property development landscape.
          </p>
        </motion.div>

        <div className="relative" ref={timelineRef}>
          {/* Progress line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1">
            <div 
              ref={lineRef}
              className="bg-blue-600 w-full h-0 origin-top"
            ></div>
          </div>

          {/* Timeline items */}
          {timelineItems.map((itemindex) => (
            <div 
              key={index}
              className={`timeline-item relative flex items-center mb-12 ${
                index % 2 === 0 ? 'justify-start' : 'justify-end'
              }`}
            >
              {/* Year marker */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                  {item.year.substring(2)}
                </div>
              </div>

              {/* Content box */}
              <div 
                className={`w-5/12 bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${
                  index % 2 === 0 ? 'text-right mr-8' : 'ml-8'
                }`}
              >
                <div className="text-lg font-bold text-gray-900 mb-1">{item.year}</div>
                <h4 className="text-xl font-bold mb-2 text-blue-600">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;