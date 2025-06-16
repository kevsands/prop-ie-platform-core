'use client';

import React from 'react';
import { FITZGERALD_GARDENS_UNITS } from '../data/units';
// Import types directly from the core types file
import { FitzgeraldPropertyUnit } from '@/core/types/fitzgerald'; 
import { AppFeatureFlags } from '@/core/config/featureFlags';

interface PropertyCardProps {
  unit: FitzgeraldPropertyUnit;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ unit }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold text-blue-700 mb-2">{`Unit ${unit.houseNo}`}</h3>
      <p className="text-gray-700 mb-1"><span className="font-medium">Type:</span> {unit.description}</p>
      <p className="text-gray-700 mb-1"><span className="font-medium">Size:</span> {unit.sqm} sqm</p>
      <p className="text-lg font-bold text-green-600 my-2">€{unit.basePrice.toLocaleString()}</p>
      <p className={`text-sm font-semibold ${unit.status === 'Available' ? 'text-green-500' : unit.status === 'Reserved' ? 'text-yellow-500' : 'text-red-500'}`}>
        Status: {unit.status}
      </p>
      {/* Add a button or link for more details/reservation later */}
      {AppFeatureFlags.enablePropertyCustomization && (
        <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
          View Details / Customize
        </button>
      )}
    </div>
  );
};

export const FitzgeraldPropertyGrid: React.FC = () => {
  // Explicitly type unitsToShow for clarity, though FITZGERALD_GARDENS_UNITS should already be typed
  const unitsToShow: FitzgeraldPropertyUnit[] = FITZGERALD_GARDENS_UNITS;

  if (!AppFeatureFlags.showFitzgeraldGardensOnly && unitsToShow.length === 0) {
    return <p className="text-center text-gray-500 py-8">No properties currently available for Fitzgerald Gardens.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Fitzgerald Gardens - Available Properties</h2>
      {unitsToShow.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {unitsToShow.map((unit) => (
            <PropertyCard key={unit.houseNo} unit={unit} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">No properties currently listed for this development.</p>
      )}
    </div>
  );
}; 