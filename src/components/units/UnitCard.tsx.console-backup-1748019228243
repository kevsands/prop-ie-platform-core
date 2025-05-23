'use client';

// components/units/UnitCard.tsx
import React from 'react';
import Link from 'next/link';
import { FiHome, FiMaximize2, FiUsers, FiTag, FiCalendar } from 'react-icons/fi';

interface UnitCardProps {
  unit: {
    id: string;
    unitNumber: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    floorArea: number;
    price: number;
    status: string;
    imageUrl?: string;
    projectSlug: string;
    projectName: string;
    phase?: string;
    completionDate?: string;
  };
  orgSlug: string;
  onClick?: () => void;
}

const UnitCard: React.FC<UnitCardProps> = ({ unit, orgSlug, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-blue-100 text-blue-800';
      case 'sold':
        return 'bg-purple-100 text-purple-800';
      case 'under construction':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(amount);
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="h-40 bg-gray-200 relative">
        {unit.imageUrl ? (
          <img 
            src={unit.imageUrl} 
            alt={`Unit ${unit.unitNumber}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiHome className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(unit.status)}`}>
            {unit.status}
          </span>
        </div>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          Unit {unit.unitNumber}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{unit.address}</h3>
            <p className="text-sm text-gray-600 mt-1">{unit.projectName}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-[#2B5273]">{formatCurrency(unit.price)}</p>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex items-center text-sm text-gray-600">
            <FiUsers className="mr-1" />
            <span>{unit.bedrooms} bed</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span>{unit.bathrooms} bath</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FiMaximize2 className="mr-1" />
            <span>{unit.floorArea} m²</span>
          </div>
        </div>
        
        {unit.phase && (
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <FiTag className="mr-1" />
            <span>Phase: {unit.phase}</span>
          </div>
        )}
        
        {unit.completionDate && (
          <div className="mt-1 flex items-center text-sm text-gray-600">
            <FiCalendar className="mr-1" />
            <span>Completion: {new Date(unit.completionDate).toLocaleDateString()}</span>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
          <Link 
            href={`/${orgSlug}/projects/${unit.projectSlug}/units/${unit.id}`}
            className="text-[#2B5273] hover:text-[#1E3142] text-sm font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnitCard;