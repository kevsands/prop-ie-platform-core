import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SolutionCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
}

export default function SolutionCard({ title, description, icon, href }: SolutionCardProps) {
  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-lg shadow-md p-6 h-full transition-all hover:shadow-lg hover:translate-y-[-2px]">
        <div className="flex items-start">
          <div className="flex-shrink-0 h-12 w-12 bg-[#2B5273]/10 rounded-full flex items-center justify-center">
            <Image 
              src={icon} 
              alt={title} 
              width={28} 
              height={28} 
            />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
} 