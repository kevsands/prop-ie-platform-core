"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PropertyCard from "@/components/property/PropertyCard";

// Mock data for developments
const developments = [
  {
    id: "fitzgerald-gardens",
    name: "Fitzgerald Gardens",
    slug: "fitzgerald-gardens",
    location: "Drogheda, Ireland",
    imageUrl: "/images/fitzgerald-gardens/hero.jpg",
    description:
      "Luxurious living with modern comforts in the heart of Drogheda.",
    propertyCount: 96},
  {
    id: "ballymakenny-view",
    name: "Ballymakenny View",
    slug: "ballymakenny-view",
    location: "Drogheda, Ireland",
    imageUrl: "/images/ballymakenny-view/hero.jpg",
    description:
      "Modern family homes in a convenient location with excellent amenities.",
    propertyCount: 72}];

// Mock data for properties across all developments
const allProperties = [
  // Fitzgerald Gardens properties
  {
    id: "fg-1",
    name: "Unit 1 - Type C",
    location: "Fitzgerald Gardens, Drogheda",
    price: 450000,
    bedrooms: 4,
    bathrooms: 3,
    area: 144,
    imageUrl: "/images/fitzgerald-gardens/type-c.jpg",
    status: "available",
    developmentId: "fitzgerald-gardens",
  {
    id: "fg-2",
    name: "Unit 2 - Type A",
    location: "Fitzgerald Gardens, Drogheda",
    price: 320000,
    bedrooms: 2,
    bathrooms: 2,
    area: 87,
    imageUrl: "/images/fitzgerald-gardens/type-a.jpg",
    status: "available",
    developmentId: "fitzgerald-gardens",
  {
    id: "fg-3",
    name: "Unit 3 - Type A",
    location: "Fitzgerald Gardens, Drogheda",
    price: 320000,
    bedrooms: 2,
    bathrooms: 2,
    area: 87,
    imageUrl: "/images/fitzgerald-gardens/type-a.jpg",
    status: "reserved",
    developmentId: "fitzgerald-gardens",
  {
    id: "fg-4",
    name: "Unit 4 - Type B",
    location: "Fitzgerald Gardens, Drogheda",
    price: 380000,
    bedrooms: 3,
    bathrooms: 2,
    area: 116,
    imageUrl: "/images/fitzgerald-gardens/type-b.jpg",
    status: "available",
    developmentId: "fitzgerald-gardens",
  // Ballymakenny View properties
  {
    id: "bmv-1",
    name: "Unit 1 - Type D",
    location: "Ballymakenny View, Drogheda",
    price: 425000,
    bedrooms: 4,
    bathrooms: 3,
    area: 140,
    imageUrl: "/images/ballymakenny-view/type-d.jpg",
    status: "available",
    developmentId: "ballymakenny-view",
  {
    id: "bmv-2",
    name: "Unit 2 - Type E",
    location: "Ballymakenny View, Drogheda",
    price: 350000,
    bedrooms: 3,
    bathrooms: 2,
    area: 110,
    imageUrl: "/images/ballymakenny-view/type-e.jpg",
    status: "sold",
    developmentId: "ballymakenny-view"];

export default function PropertiesPage() {
  const router = useRouter();
  const [selectedDevelopmentsetSelectedDevelopment] = useState<string>("all");
  const [selectedBedroomssetSelectedBedrooms] = useState<string>("all");
  const [selectedStatussetSelectedStatus] = useState<string>("all");
  const [filteredPropertiessetFilteredProperties] = useState(allProperties);

  // Filter properties based on selected filters
  useEffect(() => {
    let filtered = [...allProperties];

    if (selectedDevelopment !== "all") {
      filtered = filtered.filter(
        (property: any) => property.developmentId === selectedDevelopment,
      );
    }

    if (selectedBedrooms !== "all") {
      filtered = filtered.filter(
        (property: any) => property.bedrooms === parseInt(selectedBedrooms),
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (property: any) => property.status === selectedStatus,
      );
    }

    setFilteredProperties(filtered);
  }, [selectedDevelopmentselectedBedroomsselectedStatus]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3142]/80 to-[#1E3142]/60 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={ backgroundImage: "url('/images/properties-hero.jpg')" }
        ></div>
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AVAILABLE PROPERTIES
          </h1>
          <div className="w-20 h-1 bg-[#C9A86E] mb-6"></div>
          <p className="text-xl text-white max-w-2xl">
            Explore our range of high-quality properties across all developments
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Developments Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#2B5273] mb-6">
            Our Developments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developments.map((development: any) => (
              <Link
                href={`/developments/${development.id}`}
                key={development.id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition duration-300"
              >
                <div className="h-48 w-full overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={
                      backgroundImage: `url(${development.imageUrl || "/placeholder-development.jpg")`}
                  ></div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {development.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {development.location}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    {development.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {development.propertyCount} properties
                    </span>
                    <span className="text-sm font-medium text-[#2B5273]">
                      View Development
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Filter Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="development"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Development
              </label>
              <select
                id="development"
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-[#2B5273]"
                value={selectedDevelopment}
                onChange={(e: any) => setSelectedDevelopment(e.target.value)}
              >
                <option value="all">All Developments</option>
                {developments.map((dev: any) => (
                  <option key={dev.id} value={dev.id}>
                    {dev.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="bedrooms"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Bedrooms
              </label>
              <select
                id="bedrooms"
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-[#2B5273]"
                value={selectedBedrooms}
                onChange={(e: any) => setSelectedBedrooms(e.target.value)}
              >
                <option value="all">Any</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#2B5273] focus:border-[#2B5273]"
                value={selectedStatus}
                onChange={(e: any) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div>
          <h2 className="text-2xl font-bold text-[#2B5273] mb-6">
            Available Properties
          </h2>
          {filteredProperties.length> 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property: any) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  name={property.name}
                  location={property.location}
                  price={property.price}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  area={property.area}
                  imageUrl={property.imageUrl}
                  status={property.status as "available" | "reserved" | "sold"
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600 mb-4">
                No properties match your current filters.
              </p>
              <button
                onClick={() => {
                  setSelectedDevelopment("all");
                  setSelectedBedrooms("all");
                  setSelectedStatus("all");
                }
                className="text-[#2B5273] font-medium hover:text-[#1E3142]"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-[#1E3142] text-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">
                Can't find what you're looking for?
              </h3>
              <p className="text-gray-300">
                Register your interest to be notified about new properties that
                match your criteria.
              </p>
            </div>
            <button className="bg-[#7EEAE4] hover:bg-[#6CD9D3] text-[#1E3142] font-medium py-3 px-8 rounded-full transition duration-300">
              Register Interest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
