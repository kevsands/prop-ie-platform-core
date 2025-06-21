"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import PropertyCard from '@/components/properties/PropertyCard';
import { FiFilter, FiSearch, FiUser, FiBriefcase, FiMessageCircle } from 'react-icons/fi';

// Define the Buyer interface
interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Define the PropertyStatus type to ensure it matches the Property interface
type PropertyStatus = "available" | "under_offer" | "reserved" | "sold";

// Create a custom property type that includes all required Property fields plus our additions
interface AgentProperty {
  id: string;
  name: string;
  address: string;
  price: number;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  floorArea: number;
  parkingSpaces: number;
  projectSlug: string;
  projectName: string;
  description: string;
  type: string;
  images: string[];
  buyers?: Buyer[];
}

// Mock data using only images that exist in the project
const mockProperties: AgentProperty[] = [
  {
    id: '1',
    name: '10 Maple Avenue',
    address: 'Dublin 15, Ireland',
    price: 395000,
    status: 'available',
    bedrooms: 3,
    bathrooms: 2,
    floorArea: 125,
    parkingSpaces: 1,
    projectSlug: 'fitzgerald-gardens',
    projectName: 'Fitzgerald Gardens',
    description: 'Beautiful family home in a quiet suburb',
    type: 'semi-detached',
    images: ['/images/properties/10-maple-ave-1.jpg'],
    buyers: [
      { id: 'b1', name: 'John Murphy', email: 'john.murphy@example.com', phone: '087-123-4567' }]
  },
  {
    id: '2',
    name: '15 Oak Drive',
    address: 'Dublin 18, Ireland',
    price: 450000,
    status: 'under_offer',
    bedrooms: 4,
    bathrooms: 3,
    floorArea: 150,
    parkingSpaces: 2,
    projectSlug: 'fitzgerald-gardens',
    projectName: 'Fitzgerald Gardens',
    description: 'Spacious family home with garden',
    type: 'detached',
    images: ['/images/properties/10-maple-ave-2.jpg'],
    buyers: [
      { id: 'b2', name: 'Sarah O\'Connor', email: 'sarah.oconnor@example.com', phone: '086-765-4321' }]
  },
  {
    id: '3',
    name: '5 Elm Court',
    address: 'Cork City, Ireland',
    price: 320000,
    status: 'reserved',
    bedrooms: 2,
    bathrooms: 2,
    floorArea: 95,
    parkingSpaces: 1,
    projectSlug: 'fitzgerald-gardens',
    projectName: 'Fitzgerald Gardens',
    description: 'Cozy city apartment with balcony',
    type: 'apartment',
    images: ['/images/properties/10-maple-ave-3.jpg'],
    buyers: [
      { id: 'b3', name: 'Michael Kelly', email: 'michael.kelly@example.com', phone: '085-987-6543' }]
  },
  {
    id: '4',
    name: '22 Willow Park',
    address: 'Galway, Ireland',
    price: 375000,
    status: 'available',
    bedrooms: 3,
    bathrooms: 1,
    floorArea: 110,
    parkingSpaces: 1,
    projectSlug: 'ballymakenny-view',
    projectName: 'Ballymakenny View',
    description: 'Modern townhouse near city center',
    type: 'townhouse',
    images: ['/images/properties/10-maple-ave-1.jpg'],
    buyers: []
  },
  {
    id: '5',
    name: '8 Birch Lane',
    address: 'Limerick, Ireland',
    price: 295000,
    status: 'available',
    bedrooms: 2,
    bathrooms: 1,
    floorArea: 85,
    parkingSpaces: 1,
    projectSlug: 'riverside-manor',
    projectName: 'Riverside Manor',
    description: 'Compact modern apartment',
    type: 'apartment',
    images: ['/images/properties/10-maple-ave-2.jpg'],
    buyers: []
  },
  {
    id: '6',
    name: '17 Sycamore Close',
    address: 'Waterford, Ireland',
    price: 340000,
    status: 'sold',
    bedrooms: 3,
    bathrooms: 2,
    floorArea: 115,
    parkingSpaces: 1,
    projectSlug: 'ballymakenny-view',
    projectName: 'Ballymakenny View',
    description: 'Spacious family home with garden',
    type: 'semi-detached',
    images: ['/images/properties/10-maple-ave-3.jpg'],
    buyers: [
      { id: 'b4', name: 'Emma Walsh', email: 'emma.walsh@example.com', phone: '083-456-7890' }]
  }
];

export default function AgentListings() {
  const [showContactModalsetShowContactModal] = useState(false);
  const [showInviteModalsetShowInviteModal] = useState(false);
  const [selectedBuyersetSelectedBuyer] = useState<Buyer | null>(null);
  const [selectedPropertysetSelectedProperty] = useState<AgentProperty | null>(null);
  const [filterStatussetFilterStatus] = useState<'all' | PropertyStatus>('all');
  const [searchTermsetSearchTerm] = useState('');

  // Handle opening the contact buyer modal
  const handleContactBuyer = (property: AgentProperty, buyer: Buyer) => {
    setSelectedProperty(property);
    setSelectedBuyer(buyer);
    setShowContactModal(true);
  };

  // Handle opening the invite solicitor modal
  const handleInviteSolicitor = (property: AgentProperty, buyer: Buyer) => {
    setSelectedProperty(property);
    setSelectedBuyer(buyer);
    setShowInviteModal(true);
  };

  // Filter properties by status and search term
  const filteredProperties = mockProperties.filter(property => {
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    const matchesSearch = 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      property.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="mt-1 text-sm text-gray-500">
            {filteredProperties.length} properties found
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search properties..."
              className="pl-10 pr-4 py-2 border rounded-md w-full"
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          <select
            value={filterStatus}
            onChange={(e: any) => setFilterStatus(e.target.value as 'all' | PropertyStatus)}
            className="pl-10 pr-4 py-2 border rounded-md appearance-none"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="under_offer">Under Offer</option>
            <option value="sold">Sold</option>
          </select>
          <FiFilter className="absolute left-3 top-3 text-gray-400 hidden sm:block" style={ marginLeft: '220px', marginTop: '2px' } />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map(property => {
          // Map property to PropertyCard format
          const propertyForCard = {
            id: property.id,
            title: property.name,
            location: property.address,
            price: property.price,
            status: property.status,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            size: property.floorArea,
            image: property.images[0] || '/images/placeholder.jpg',
            tags: [property.type]
          };

          return (
            <div key={property.id} className="flex flex-col">
              <PropertyCard property={propertyForCard} />

              {/* Actions for each property */}
              <div className="mt-2 flex gap-2">
                {property.buyers && property.buyers.length> 0 ? (
                  <>
                    <button
                      onClick={() => property.buyers && property.buyers.length> 0 && handleContactBuyer(property, property.buyers[0])}
                      className="flex-1 py-2 px-3 bg-[#2B5273] hover:bg-[#1E3142] text-white rounded-md flex items-center justify-center text-sm"
                    >
                      <FiMessageCircle className="mr-2" />
                      Contact Buyer
                    </button>

                    <button
                      onClick={() => property.buyers && property.buyers.length> 0 && handleInviteSolicitor(property, property.buyers[0])}
                      className="flex-1 py-2 px-3 bg-white border border-[#2B5273] hover:bg-gray-50 text-[#2B5273] rounded-md flex items-center justify-center text-sm"
                    >
                      <FiBriefcase className="mr-2" />
                      Invite Solicitor
                    </button>
                  </>
                ) : (
                  <Link
                    href={`/agents/marketing/${property.id}`}
                    className="w-full py-2 px-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md flex items-center justify-center text-sm"
                  >
                    <FiUser className="mr-2" />
                    Add Buyer
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Buyer Modal */}
      {showContactModal && selectedProperty && selectedBuyer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Contact Buyer</h2>
            <p className="mb-4">
              <span className="font-medium">Property:</span> {selectedProperty.name}
            </p>
            <p className="mb-2">
              <span className="font-medium">Buyer:</span> {selectedBuyer.name}
            </p>
            <p className="mb-2">
              <span className="font-medium">Email:</span> {selectedBuyer.email}
            </p>
            <p className="mb-4">
              <span className="font-medium">Phone:</span> {selectedBuyer.phone}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                className="w-full border rounded-md p-2 h-24"
                placeholder="Type your message here..."
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowContactModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Message sent!");
                  setShowContactModal(false);
                }
                className="px-4 py-2 bg-[#2B5273] text-white rounded-md"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Solicitor Modal */}
      {showInviteModal && selectedProperty && selectedBuyer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Invite Solicitor</h2>
            <p className="mb-4">
              <span className="font-medium">Property:</span> {selectedProperty.name}
            </p>
            <p className="mb-4">
              <span className="font-medium">Buyer:</span> {selectedBuyer.name}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Solicitor Email
              </label>
              <input
                type="email"
                className="w-full border rounded-md p-2"
                placeholder="solicitor@example.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message (Optional)
              </label>
              <textarea
                className="w-full border rounded-md p-2 h-24"
                placeholder="Add a personal message..."
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Invitation sent!");
                  setShowInviteModal(false);
                }
                className="px-4 py-2 bg-[#2B5273] text-white rounded-md"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 