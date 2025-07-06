'use client';

import React from 'react';
import Link from 'next/link';
import { Users, FileText, Building } from 'lucide-react';

const ProfessionalBanner: React.FC = () => {
  return (
    <div className="bg-[#1E3142] text-white py-1 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end space-x-6">
          <Link 
            href="/agents" 
            className="flex items-center space-x-1 hover:text-gray-200 transition-colors py-1"
          >
            <Users size={14} />
            <span>For Agents</span>
          </Link>
          <Link 
            href="/solicitors" 
            className="flex items-center space-x-1 hover:text-gray-200 transition-colors py-1"
          >
            <FileText size={14} />
            <span>For Solicitors</span>
          </Link>
          <Link 
            href="/developers" 
            className="flex items-center space-x-1 hover:text-gray-200 transition-colors py-1"
          >
            <Building size={14} />
            <span>For Developers</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalBanner; 