'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { FITZGERALD_GARDENS_UNITS } from '@/features/fitzgerald-gardens/data/units';
import PropertyReservation from '@/components/property/PropertyReservation';

export default function UnitDetailPage() {
  const params = useParams();
  const unitId = params.id as string;
  
  // Find the specific unit
  const unit = FITZGERALD_GARDENS_UNITS.find(u => u.houseNo === unitId);
  
  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unit Not Found</h1>
          <p className="text-gray-600 mb-6">The unit you're looking for doesn't exist.</p>
          <a 
            href="/developments/fitzgerald-gardens" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to All Units
          </a>
        </div>
      </div>
    );
  }

  const handleReservation = (reservationData: any) => {
    console.log('Reservation data:', reservationData);
    // Here you would integrate with your Stripe/payment system
    alert('Reservation submitted! We will contact you shortly.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-gray-600 mb-4">
            <a href="/" className="hover:text-blue-600">Home</a>
            <span className="mx-2">/</span>
            <a href="/developments" className="hover:text-blue-600">Developments</a>
            <span className="mx-2">/</span>
            <a href="/developments/fitzgerald-gardens" className="hover:text-blue-600">Fitzgerald Gardens</a>
            <span className="mx-2">/</span>
            <span className="text-blue-600 font-medium">Unit {unit.houseNo}</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Unit {unit.houseNo} - Fitzgerald Gardens
          </h1>
        </div>
      </div>

      {/* Unit Details & Reservation */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Unit Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Unit Details</h2>
            
            {/* Placeholder image */}
            <div className="w-full h-64 bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
              <span className="text-gray-500">Unit {unit.houseNo} Image</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Unit Number:</span>
                <span>{unit.houseNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Type:</span>
                <span>{unit.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Size:</span>
                <span>{unit.sqm} sqm</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Price:</span>
                <span className="text-2xl font-bold text-green-600">€{unit.basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className={`font-bold ${
                  unit.status === 'Available' ? 'text-green-500' : 
                  unit.status === 'Reserved' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {unit.status}
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Modern fitted kitchen</li>
                <li>• Energy efficient heating</li>
                <li>• Private garden/balcony</li>
                <li>• Allocated parking space</li>
                <li>• Close to amenities</li>
              </ul>
            </div>
          </div>

          {/* Reservation Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <PropertyReservation
              propertyId={unit.houseNo}
              propertyName={`Unit ${unit.houseNo}`}
              propertyType={unit.description}
              propertyPrice={unit.basePrice}
              propertyImage="/placeholder-unit.jpg"
              onReserve={handleReservation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}