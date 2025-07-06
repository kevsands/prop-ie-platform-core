"use client";

import React, { useState, useEffect } from 'react';
import { FiFilter, FiDownload, FiPlus, FiEdit2, FiEye } from 'react-icons/fi';
import Link from 'next/link';
import type { IconBaseProps } from 'react-icons';

// Define TypeScript interfaces
interface UnitType {
  id: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  floorArea: number;
}

interface Unit {
  id: string;
  unitNumber: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  floorArea: number;
  price: number;
  phase: number;
  status: string;
  unitType: string;
}

interface FilterState {
  phase: string;
  bedrooms: string;
  status: string;
  priceMin: string;
  priceMax: string;
}

// Mock data for Fitzgerald Gardens' 97 units
const generateMockUnits = (): Unit[] => {
  const unitTypes: UnitType[] = [
    { id: 'type-a', name: 'Type A - 2 Bed Apartment', bedrooms: 2, bathrooms: 2, floorArea: 85 },
    { id: 'type-b', name: 'Type B - 3 Bed Semi-Detached', bedrooms: 3, bathrooms: 2.5, floorArea: 110 },
    { id: 'type-c', name: 'Type C - 4 Bed Detached', bedrooms: 4, bathrooms: 3, floorArea: 145 },
  ];
  
  const statuses = ['Available', 'Reserved', 'Sale Agreed', 'Sold', 'Under Construction'];
  
  const units: Unit[] = [];
  
  // Generate 97 units across 4 phases
  for (let i = 1; i <= 97; i++) {
    // Determine phase (1-4)
    const phase = i <= 20 ? 1 : i <= 45 ? 2 : i <= 75 ? 3 : 4;
    
    // Determine unit type
    const typeIndex = Math.floor(Math.random() * unitTypes.length);
    const unitType = unitTypes[typeIndex];
    
    // Determine status (weight more towards available)
    const statusIndex = Math.floor(Math.random() * (statuses.length + 5));
    const status = statusIndex >= statuses.length ? 'Available' : statuses[statusIndex];
    
    // Generate price based on unit type and some variation
    const basePrice = unitType.id === 'type-a' ? 285000 : 
                     unitType.id === 'type-b' ? 350000 : 410000;
    const priceVariation = Math.floor(Math.random() * 30000);
    const price = basePrice + priceVariation;
    
    units.push({
      id: `unit-${i}`,
      unitNumber: `${i <= 9 ? '0' : ''}${i}`,
      address: `${unitType.bedrooms} ${unitType.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'} ${phase === 4 ? 'Penthouse' : unitType.id === 'type-c' ? 'Detached House' : unitType.id === 'type-b' ? 'Semi-Detached House' : 'Apartment'}`,
      bedrooms: unitType.bedrooms,
      bathrooms: unitType.bathrooms,
      floorArea: unitType.floorArea,
      price: price,
      phase: phase,
      status: status,
      unitType: unitType.id
    });
  }
  
  return units;
};

export default function FitzgeraldGardensUnits() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<Unit[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    phase: 'all',
    bedrooms: 'all',
    status: 'all',
    priceMin: '',
    priceMax: '',
  });
  
  useEffect(() => {
    // In a real app, this would fetch from API
    const mockUnits = generateMockUnits();
    setUnits(mockUnits);
    setFilteredUnits(mockUnits);
  }, []);
  
  useEffect(() => {
    // Apply filters
    let result = [...units];
    
    if (filters.phase !== 'all') {
      result = result.filter(unit => unit.phase === parseInt(filters.phase));
    }
    
    if (filters.bedrooms !== 'all') {
      result = result.filter(unit => unit.bedrooms === parseInt(filters.bedrooms));
    }
    
    if (filters.status !== 'all') {
      result = result.filter(unit => unit.status === filters.status);
    }
    
    if (filters.priceMin) {
      result = result.filter(unit => unit.price >= parseInt(filters.priceMin));
    }
    
    if (filters.priceMax) {
      result = result.filter(unit => unit.price <= parseInt(filters.priceMax));
    }
    
    setFilteredUnits(result);
  }, [filters, units]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Unit Number', 'Address', 'Bedrooms', 'Bathrooms', 'Floor Area', 'Price', 'Phase', 'Status'];
    const rows = filteredUnits.map(unit => [
      unit.unitNumber,
      unit.address,
      unit.bedrooms,
      unit.bathrooms,
      unit.floorArea,
      unit.price,
      unit.phase,
      unit.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fitzgerald_gardens_units.csv';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#2B5273]">Fitzgerald Gardens - Units</h1>
          <p className="text-gray-600">Managing all 97 units in the development</p>
        </div>
        <div>
          <button 
            onClick={exportToCSV}
            className="px-4 py-2 flex items-center border border-[#2B5273] text-[#2B5273] rounded-md hover:bg-blue-50 transition-colors"
          >
            {FiDownload({ className: "mr-2" })} Export Units
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          {FiFilter({ className: "text-[#2B5273] mr-2" })}
          <h2 className="text-lg font-semibold">Filter Units</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phase</label>
            <select
              name="phase"
              value={filters.phase}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
            >
              <option value="all">All Phases</option>
              <option value="1">Phase 1</option>
              <option value="2">Phase 2</option>
              <option value="3">Phase 3</option>
              <option value="4">Phase 4</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <select
              name="bedrooms"
              value={filters.bedrooms}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
            >
              <option value="all">All Bedrooms</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4 Bedrooms</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
            >
              <option value="all">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Sale Agreed">Sale Agreed</option>
              <option value="Sold">Sold</option>
              <option value="Under Construction">Under Construction</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
            <input
              type="number"
              name="priceMin"
              value={filters.priceMin}
              onChange={handleFilterChange}
              placeholder="Min €"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
            <input
              type="number"
              name="priceMax"
              value={filters.priceMax}
              onChange={handleFilterChange}
              placeholder="Max €"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
            />
          </div>
        </div>
      </div>
      
      {/* Units Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phase</th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUnits.map((unit) => (
                <tr key={unit.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {unit.unitNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{unit.address}</div>
                    <div className="text-sm text-gray-500">
                      {unit.bedrooms} bed, {unit.bathrooms} bath · {unit.floorArea} m²
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Phase {unit.phase}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    €{unit.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${unit.status === 'Available' ? 'bg-green-100 text-green-800' : 
                      unit.status === 'Reserved' ? 'bg-blue-100 text-blue-800' : 
                      unit.status === 'Sold' ? 'bg-purple-100 text-purple-800' : 
                      unit.status === 'Sale Agreed' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                      {unit.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link href={`/developer/projects/fitzgerald-gardens/units/${unit.id}`} className="text-[#2B5273] hover:text-[#1E3142]">
                        {FiEye({ className: "text-blue-600" })}
                      </Link>
                      <Link href={`/developer/projects/fitzgerald-gardens/units/${unit.id}/edit`} className="text-[#2B5273] hover:text-[#1E3142]">
                        {FiEdit2({ className: "text-green-600" })}
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredUnits.length}</span> of <span className="font-medium">{units.length}</span> units
          </div>
        </div>
      </div>
    </div>
  );
}