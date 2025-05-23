'use client';

import React from 'react';
import { AboutPageData } from '@/types/about';

interface AboutPageClientProps {
  data: AboutPageData;
}

/**
 * About Page Client Component
 */
export default function AboutPageClient({ data }: AboutPageClientProps) {
  const { hero, mission, team, values, timeline, statistics, partnerships, testimonials, cta } = data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative h-[400px] mb-12 rounded-lg overflow-hidden">
        <img 
          src={hero.backgroundImage} 
          alt={hero.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center p-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{hero.title}</h1>
          <p className="text-xl md:text-2xl max-w-2xl">{hero.subtitle}</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">{mission.title}</h2>
        <div className="space-y-6">
          <p className="text-lg">{mission.content}</p>
          <ul className="list-disc list-inside space-y-2">
            {mission.highlights.map((highlightindex: any) => (
              <li key={index} className="text-lg">{highlight}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value: any) => (
            <div key={value.id} className="text-center p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
              <p>{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member: any) => (
            <div key={member.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img 
                src={member.image} 
                alt={member.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-600 mb-2">{member.role}</p>
                <p className="text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Our Journey</h2>
        <div className="space-y-8">
          {timeline.map((itemindex: any) => (
            <div key={item.id} className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {item.year}
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-2">{item.description}</p>
                {item.milestones && (
                  <ul className="list-disc list-inside text-sm text-gray-500">
                    {item.milestones.map((milestoneidx: any) => (
                      <li key={idx}>{milestone}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="mb-16 bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-8 text-center">By the Numbers</h2>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold text-blue-600">{statistics.metrics.homesBuilt}+</h3>
            <p>Homes Built</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-blue-600">{statistics.metrics.happyFamilies}+</h3>
            <p>Happy Families</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-blue-600">{statistics.metrics.sustainabilityRating}%</h3>
            <p>Sustainability Rating</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-blue-600">{statistics.metrics.employeeCount}+</h3>
            <p>Team Members</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">What Our Clients Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial: any) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg italic mb-4">"{testimonial.content}"</p>
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 bg-blue-600 text-white rounded-lg">
        <h2 className="text-3xl font-bold mb-4">{cta.title}</h2>
        <p className="text-xl mb-8">{cta.description}</p>
        <div className="space-x-4">
          <a href={cta.primaryButton.link} className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            {cta.primaryButton.text}
          </a>
          <a href={cta.secondaryButton.link} className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
            {cta.secondaryButton.text}
          </a>
        </div>
      </section>
    </div>
  );
}