'use client';

import React, { useState } from 'react';

// TypeScript interfaces
interface Coordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Unit {
  id: string;
  number: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  status: 'available' | 'reserved' | 'sold';
  price: number;
  coordinates: Coordinates;
}

interface Development {
  id: string;
  name: string;
  slug: string;
  units: Unit[];
}

interface DevelopmentSiteMapProps {
  development: Development;
}

export default function DevelopmentSiteMap({ development }: DevelopmentSiteMapProps) {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getUnitColor = (status: Unit['status']): string => {
    switch (status) {
      case 'available':
        return 'fill-green-500 hover:fill-green-600';
      case 'reserved':
        return 'fill-yellow-500 hover:fill-yellow-600';
      case 'sold':
        return 'fill-red-500 hover:fill-red-600';
      default:
        return 'fill-gray-300 hover:fill-gray-400';
    }
  };

  const handleUnitClick = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  const handleMouseEnter = (unitId: string) => {
    setHoveredUnit(unitId);
  };

  const handleMouseLeave = () => {
    setHoveredUnit(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Site map visualization */}
        <div className="md:w-3/4 bg-gray-100 p-4 rounded-lg min-h-[400px] flex items-center justify-center">
          {/* SVG Site Map - This is a placeholder, you would replace with actual SVG map */}
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 800 600" 
            className="border border-gray-200 rounded-md"
            style={{ minHeight: '400px' }}
          >
            {/* Site boundaries or roads */}
            <path 
              d="M100,100 L700,100 L700,500 L100,500 Z" 
              fill="none" 
              stroke="#CBD5E0" 
              strokeWidth="2"
            />
            
            {/* Units */}
            {development.units.map((unit) => (
              <g key={unit.id}>
                <rect
                  x={unit.coordinates.x}
                  y={unit.coordinates.y}
                  width={unit.coordinates.width * 10}
                  height={unit.coordinates.height * 10}
                  className={`cursor-pointer transition-colors ${getUnitColor(unit.status)} ${
                    hoveredUnit === unit.id || selectedUnit?.id === unit.id ? 'stroke-blue-600 stroke-2' : 'stroke-gray-400'
                  }`}
                  onClick={() => handleUnitClick(unit)}
                  onMouseEnter={() => handleMouseEnter(unit.id)}
                  onMouseLeave={handleMouseLeave}
                  role="button"
                  aria-label={`Unit ${unit.number}: ${unit.status}`}
                  tabIndex={0}
                />
                <text
                  x={unit.coordinates.x + (unit.coordinates.width * 5)}
                  y={unit.coordinates.y + (unit.coordinates.height * 5) + 5}
                  textAnchor="middle"
                  fill="white"
                  className="text-xs font-bold pointer-events-none"
                >
                  {unit.number}
                </text>
              </g>
            ))}
            
            {/* Legend */}
            <g transform="translate(650, 50)">
              <rect x="0" y="0" width="20" height="20" className="fill-green-500" />
              <text x="25" y="15" fill="#333" className="text-xs">Available</text>
              
              <rect x="0" y="30" width="20" height="20" className="fill-yellow-500" />
              <text x="25" y="45" fill="#333" className="text-xs">Reserved</text>
              
              <rect x="0" y="60" width="20" height="20" className="fill-red-500" />
              <text x="25" y="75" fill="#333" className="text-xs">Sold</text>
            </g>
          </svg>
        </div>
        
        {/* Unit details panel */}
        <div className="md:w-1/4">
          <h3 className="text-lg font-semibold text-[#2B5273] mb-4">
            {selectedUnit ? `Unit ${selectedUnit.number} Details` : 'Select a Unit'}
          </h3>
          
          {selectedUnit ? (
            <div>
              <div className={`inline-block px-2 py-1 rounded text-sm font-semibold mb-4 ${
                selectedUnit.status === 'available' 
                  ? 'bg-green-100 text-green-800' 
                  : selectedUnit.status === 'reserved'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
              }`}>
                {selectedUnit.status.charAt(0).toUpperCase() + selectedUnit.status.slice(1)}
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{selectedUnit.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                  <p className="font-medium">{selectedUnit.bedrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                  <p className="font-medium">{selectedUnit.bathrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Size</p>
                  <p className="font-medium">{selectedUnit.sqm} m²</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-semibold text-[#2B5273] text-lg">{formatPrice(selectedUnit.price)}</p>
                </div>
              </div>
              
              {selectedUnit.status === 'available' && (
                <button
                  className="mt-6 w-full bg-[#2B5273] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#1E3142] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B5273]"
                >
                  Request Details
                </button>
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              <p>Click on a unit from the site plan to view its details.</p>
              <p className="mt-2">Available units are shown in green, reserved units in yellow, and sold units in red.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}