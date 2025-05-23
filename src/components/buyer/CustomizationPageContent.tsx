import React from 'react';
"use client";

import { useCustomization } from "@/context/CustomizationContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomizationPageContent() {
  const [activeRoomsetActiveRoom] = useState("livingRoom");
  const [activeCategorysetActiveCategory] = useState("flooring");
  const { selectedOptions, selectOption, totalCost } = useCustomization();
  const router = useRouter();

  const rooms = [
    { id: "livingRoom", name: "Living Room", icon: "🛋️" },
    { id: "kitchen", name: "Kitchen", icon: "🍳" },
    { id: "masterBedroom", name: "Master Bedroom", icon: "🛏️" },
    { id: "bathroom", name: "Bathroom", icon: "🚿" },
    { id: "secondBedroom", name: "Second Bedroom", icon: "🛌" },
    { id: "study", name: "Study/Office", icon: "💻" }];

  const categories = [
    { id: "flooring", name: "Flooring" },
    { id: "paint", name: "Wall Paint" },
    { id: "fixtures", name: "Fixtures & Fittings" },
    { id: "appliances", name: "Appliances" },
    { id: "furniture", name: "Furniture" }];

  const options = {
    livingRoom: {
      flooring: [
        {
          id: "lr-floor-1",
          name: "Oak Hardwood",
          price: 65,
          unit: "per sqm",
          image: "/flooring-oak.jpg",
        {
          id: "lr-floor-2",
          name: "Walnut Hardwood",
          price: 85,
          unit: "per sqm",
          image: "/flooring-walnut.jpg",
        {
          id: "lr-floor-3",
          name: "Engineered Wood",
          price: 45,
          unit: "per sqm",
          image: "/flooring-engineered.jpg",
        {
          id: "lr-floor-4",
          name: "Luxury Vinyl Tile",
          price: 35,
          unit: "per sqm",
          image: "/flooring-vinyl.jpg"],
      paint: [
        {
          id: "lr-paint-1",
          name: "Soft White",
          price: 12,
          unit: "per sqm",
          image: "/paint-white.jpg",
        {
          id: "lr-paint-2",
          name: "Warm Beige",
          price: 14,
          unit: "per sqm",
          image: "/paint-beige.jpg",
        {
          id: "lr-paint-3",
          name: "Sage Green",
          price: 16,
          unit: "per sqm",
          image: "/paint-sage.jpg",
        {
          id: "lr-paint-4",
          name: "Light Gray",
          price: 14,
          unit: "per sqm",
          image: "/paint-gray.jpg"],
      fixtures: [
        {
          id: "lr-fix-1",
          name: "Standard Lighting Package",
          price: 450,
          unit: "package",
          image: "/fixtures-standard.jpg",
        {
          id: "lr-fix-2",
          name: "Premium Lighting Package",
          price: 850,
          unit: "package",
          image: "/fixtures-premium.jpg",
        {
          id: "lr-fix-3",
          name: "Smart Lighting System",
          price: 1200,
          unit: "package",
          image: "/fixtures-smart.jpg"],
      furniture: [
        {
          id: "lr-furn-1",
          name: "Essential Package",
          price: 1800,
          unit: "package",
          image: "/furniture-essential.jpg",
        {
          id: "lr-furn-2",
          name: "Comfort Package",
          price: 3200,
          unit: "package",
          image: "/furniture-comfort.jpg",
        {
          id: "lr-furn-3",
          name: "Luxury Package",
          price: 5500,
          unit: "package",
          image: "/furniture-luxury.jpg"]},
    kitchen: {
      flooring: [
        {
          id: "k-floor-1",
          name: "Ceramic Tile",
          price: 45,
          unit: "per sqm",
          image: "/kitchen-tile.jpg",
        {
          id: "k-floor-2",
          name: "Porcelain Tile",
          price: 65,
          unit: "per sqm",
          image: "/kitchen-porcelain.jpg",
        {
          id: "k-floor-3",
          name: "Luxury Vinyl",
          price: 40,
          unit: "per sqm",
          image: "/kitchen-vinyl.jpg"],
      appliances: [
        {
          id: "k-app-1",
          name: "Standard Appliance Package",
          price: 3500,
          unit: "package",
          image: "/appliances-standard.jpg",
        {
          id: "k-app-2",
          name: "Premium Appliance Package",
          price: 6500,
          unit: "package",
          image: "/appliances-premium.jpg",
        {
          id: "k-app-3",
          name: "Smart Home Appliance Package",
          price: 8500,
          unit: "package",
          image: "/appliances-smart.jpg"],
      fixtures: [
        {
          id: "k-fix-1",
          name: "Standard Fixtures",
          price: 1200,
          unit: "package",
          image: "/kitchen-fixtures-standard.jpg",
        {
          id: "k-fix-2",
          name: "Premium Fixtures",
          price: 2400,
          unit: "package",
          image: "/kitchen-fixtures-premium.jpg"]};

  const handleSaveAndContinue = () => {
    // Save customization and navigate to next step
    router.push("/buyer/customization/summary");
  };

  const handleRequestConsultation = () => {
    // Request consultation with design team
    router.push("/buyer/customization/consultation");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Customize Your Property
          </h1>
          <p className="mt-2 text-gray-600">
            Personalize your new home with your preferred finishes and fixtures.
          </p>
        </div>

        {/* Room Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-4 pb-2">
            {rooms.map((room: any) => (
              <button
                key={room.id}
                onClick={() => setActiveRoom(room.id)}
                className={`flex flex-col items-center px-4 py-3 rounded-lg ${
                  activeRoom === room.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-2xl mb-1">{room.icon}</span>
                <span className="text-sm font-medium">{room.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category: any) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeCategory === category.id
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Options Display */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {activeRoom && rooms.find((r: any) => r.id === activeRoom)?.name} -{" "
            {activeCategory &&
              categories.find((c: any) => c.id === activeCategory)?.name}
          </h2>

          {options[activeRoom as keyof typeof options]?.[
            activeCategory as keyof (typeof options)[keyof typeof options]
          ] ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {options[activeRoom as keyof typeof options][
                activeCategory as keyof (typeof options)[keyof typeof options]
              ]?.map((option: any) => (
                <div
                  key={option.id}
                  className={`border rounded-lg overflow-hidden ${
                    selectedOptions[option.id]
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200"
                  }`}
                >
                  <div className="h-48 bg-gray-200 relative">
                    {/* Image would go here */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <span>Image Placeholder</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {option.name}
                      </h3>
                      <div className="text-blue-600 font-semibold">
                        €{option.price}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{option.unit}</p>
                    <button
                      onClick={() => selectOption(option.id, {
                        ...option,
                        category: activeCategory // Add the required category property
                      })}
                      className={`w-full py-2 rounded-md ${
                        selectedOptions[option.id]
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {selectedOptions[option.id] ? "Selected" : "Select"
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No options available for this combination. Please select a
              different room or category.
            </div>
          )}
        </div>

        {/* Summary and Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-xl font-semibold">Your Selections</h2>
              <p className="text-gray-600">
                Total additional cost:{" "
                <span className="font-semibold text-blue-600">
                  €{totalCost.toLocaleString()}
                </span>
              </p>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <button
                onClick={handleRequestConsultation}
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
              >
                Request Consultation
              </button>
              <button
                onClick={handleSaveAndContinue}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
