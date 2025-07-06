'use client';

import React from 'react';
import { AboutPageData } from '@/types/about';

interface AboutPageClientProps extends AboutPageData {}

/**
 * About Page Client Component
 */
export default function AboutPageClient({
  heroTitle,
  heroSubtitle,
  heroImage,
  missionTitle,
  missionStatement,
  missionImage,
  team,
  values,
  timeline,
  ctaTitle,
  ctaText,
  ctaButtonText,
  ctaButtonLink
}: AboutPageClientProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative h-[400px] mb-12 rounded-lg overflow-hidden">
        <img 
          src={heroImage} 
          alt={heroTitle} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center p-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{heroTitle}</h1>
          <p className="text-xl md:text-2xl max-w-2xl">{heroSubtitle}</p>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">{missionTitle}</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <p className="text-lg">{missionStatement}</p>
          {missionImage && (
            <img 
              src={missionImage} 
              alt={missionTitle} 
              className="rounded-lg shadow-lg"
            />
          )}
        </div>
      </section>
      
      {/* Values Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value) => (
            <div key={value.id} className="bg-white p-6 rounded-lg shadow-md">
              {value.icon && (
                <img 
                  src={value.icon} 
                  alt={value.title} 
                  className="w-12 h-12 mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Our Team</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-gray-600 mb-2">{member.role}</p>
                <p className="text-sm">{member.bio}</p>
                {member.socialLinks && (
                  <div className="mt-4 flex gap-4">
                    {member.socialLinks.linkedin && (
                      <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    )}
                    {member.socialLinks.twitter && (
                      <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        Twitter
                      </a>
                    )}
                    {member.socialLinks.email && (
                      <a href={`mailto:${member.socialLinks.email}`}>
                        Email
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Timeline Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Our Journey</h2>
        <div className="space-y-8">
          {timeline.map((item, index) => (
            <div key={item.id} className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-8`}>
              <div className="w-1/2">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="rounded-lg shadow-lg"
                  />
                )}
              </div>
              <div className="w-1/2 flex flex-col justify-center">
                <div className="text-2xl font-bold mb-2">{item.year}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-gray-100 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">{ctaTitle}</h2>
        <p className="text-lg mb-6">{ctaText}</p>
        <a 
          href={ctaButtonLink} 
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {ctaButtonText}
        </a>
      </section>
    </div>
  );
}
