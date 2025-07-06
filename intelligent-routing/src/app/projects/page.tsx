'use client';

import React from "react";
import Link from "next/link";
import ClientLayout from "../ClientLayout";

export default function ProjectsPage() {
  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <p className="mt-4 text-lg text-gray-600">
          View all our current property development projects.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCard 
            title="Riverside Manor" 
            description="Luxury riverside apartments with panoramic views"
            href="/projects/project-details?id=riverside-manor"
          />
          <ProjectCard 
            title="Fitzgerald Gardens" 
            description="Family homes in a carefully planned community"
            href="/projects/project-details?id=fitzgerald-gardens"
          />
          <ProjectCard 
            title="Ballymakenny View" 
            description="Modern living with excellent transport links"
            href="/projects/project-details?id=ballymakenny-view"
          />
        </div>
      </div>
    </ClientLayout>
  );
}

function ProjectCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link 
      href={href}
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <h3 className="text-xl font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
      <div className="mt-4 flex items-center text-[#2B5273]">
        <span>View Details</span>
        <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </Link>
  );
}