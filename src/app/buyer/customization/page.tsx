'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useCustomization } from '../../../context/CustomizationContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import { useQuery } from '@tanstack/react-query';
// Import both components, but we'll use SafeRoomVisualizer to avoid the ReactCurrentOwner error
import SafeRoomVisualizer from '../../../components/3d/SafeRoomVisualizer';
import { DataService } from '../../../lib/amplify-data';
import { CustomizationOption } from '../../../types/customization';
import { toast } from "sonner";

// UI Components
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger} from "../../../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle} from "../../../components/ui/card";
// Removed import for build testing;
import { 
  Loader2, 
  Save, 
  Phone, 
  ChevronRight,
  Check,
  X,
  Home,
  Brush,
  Lightbulb,
  Sofa
} from "lucide-react";

// Define interfaces for room and category
interface Room {
  id: string;
  name: string;
  icon: string;
}

interface Category {
  id: string;
  name: string;
}

// Define interface for tracking interaction details
interface TrackingDetails {
  roomId?: string;
  categoryId?: string;
  optionId?: string;
  price?: number;
  totalCost?: number;
  newMode?: string;
}

// Try to use the fallback page if something goes wrong with main page
import FallbackCustomizationPage from './fallback-page';
import { ErrorBoundary } from 'react-error-boundary';

// Simplified component definitions for build testing

// Define interface for button props
interface ButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>\n  );
  [key: string]: any; // For additional props
}

// Simplified Button component
const Button = ({ 
  className = "", 
  variant = "default", 
  children, 
  disabled = false, 
  onClick,
  ...props 
}: ButtonProps) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${
      variant === "outline" 
        ? "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700" 
        : "bg-blue-600 text-white hover:bg-blue-700"
    } h-10 px-4 py-2 ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

// Wrap the main component in a custom error boundary
export default function CustomizationPageWrapper() {
  return (
    <ErrorBoundary 
      fallbackRender={() => <FallbackCustomizationPage />} 
      onError={(error: any) => }
    >
      <CustomizationPageContent />
    </ErrorBoundary>
  );
}

// The main component content with all the original functionality
function CustomizationPageContent() {
  const [activeRoomsetActiveRoom] = useState("livingRoom");
  const [activeCategorysetActiveCategory] = useState("flooring");
  const [viewModesetViewMode] = useState<'grid' | '3d'>('grid');
  const { state, selectOption, removeOption, saveCustomization } = useCustomization();
  const router = useRouter();

  // Fetch rooms
  const { data: rooms, isLoading: isLoadingRooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: DataService.getRooms,
    staleTime: Infinity, // This data rarely changes
  });

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: DataService.getCategories,
    staleTime: Infinity, // This data rarely changes
  });

  // Fetch options for current room and category
  const { data: optionsData, isLoading: isLoadingOptions } = useQuery({
    queryKey: ['customizationOptions', activeRoomactiveCategory],
    queryFn: () => DataService.getCustomizationOptions(activeRoomactiveCategory),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get options for the current category
  const options = optionsData?.[activeCategory] || [];

  // Track user interactions for analytics and session
  const trackInteraction = useCallback(
    debounce((action: string, details: TrackingDetails) => {
      // This would normally call an analytics tracking service

    }, 500),
    [activeRoomactiveCategory]
  );

  // Handle room change
  const handleRoomChange = (roomId: string) => {
    setActiveRoom(roomId);
    trackInteraction('change_room', { roomId });
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    trackInteraction('change_category', { categoryId });
  };

  // Handle option selection
  const handleOptionSelect = (option: CustomizationOption) => {
    selectOption(option.idoption);
    trackInteraction('select_option', { optionId: option.id, price: option.price });
    toast.success(`${option.name} added to your selections`);
  };

  // Handle option deselection
  const handleOptionDeselect = (optionId: string) => {
    removeOption(optionId);
    trackInteraction('deselect_option', { optionId });
  };

  // Handle view mode toggle
  const handleViewModeToggle = () => {
    setViewMode(viewMode === 'grid' ? '3d' : 'grid');
    trackInteraction('toggle_view_mode', { newMode: viewMode === 'grid' ? '3d' : 'grid' });
  };

  // Handle save and continue
  const handleSaveAndContinue = async () => {
    try {
      await saveCustomization();
      trackInteraction('save_customization', { totalCost: state.totalCost });
      router.push('/buyer/customization/summary');
    } catch (error) {

    }
  };

  // Handle consultation request
  const handleRequestConsultation = () => {
    trackInteraction('request_consultation', { totalCost: state.totalCost });
    router.push('/buyer/customization/consultation');
  };

  // Loading state
  if (isLoadingRooms || isLoadingCategories) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        <p>Loading customization options...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Customize Your Property
            </h1>
            <p className="mt-2 text-gray-600">
              Personalize your new home with your preferred finishes and fixtures.
            </p>
          </div>

          {/* View Mode Toggle */}
          <Button
            variant={viewMode === '3d' ? "secondary" : "outline"
            onClick={handleViewModeToggle}
            className="flex items-center space-x-2"
          >
            {viewMode === 'grid' ? (
              <>
                <span>View in 3D</span>
                <Home className="ml-2 h-4 w-4" / />
            ) : (
              <>
                <span>Grid View</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </>
            )}
          </Button>
        </div>

        {/* Room Navigation */}
        <Tabs defaultValue={activeRoom} onValueChange={handleRoomChange} className="mb-8">
          <TabsList className="flex overflow-x-auto pb-1 mb-2">
            {rooms?.map((room: Room) => (
              <TabsTrigger 
                key={room.id} 
                value={room.id}
                className="flex flex-col items-center px-6 py-3"
              >
                <span className="text-2xl mb-1">{room.icon}</span>
                <span className="text-sm font-medium">{room.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {rooms?.map((room: Room) => (
            <TabsContent key={room.id} value={room.id} className="mt-0">
              {/* 3D View or Grid View */}
              <div className="flex flex-col space-y-6">
                {/* If in 3D mode, show 3D view */}
                {viewMode === '3d' && (
                  <motion.div
                    initial={ opacity: 0, y: 10 }
                    animate={ opacity: 1, y: 0 }
                    transition={ duration: 0.3 }
                  >
                    <SafeRoomVisualizer room={room.id} />
                  </motion.div>
                )}

                {/* Category Tabs */}
                <Tabs defaultValue={activeCategory} onValueChange={handleCategoryChange}>
                  <TabsList className="flex mb-6">
                    {categories?.map((category: Category) => (
                      <TabsTrigger key={category.id} value={category.id}>
                        {getCategoryIcon(category.id)}
                        <span className="ml-2">{category.name}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {categories?.map((category: Category) => (
                    <TabsContent key={category.id} value={category.id}>
                      {isLoadingOptions ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {options?.length> 0 ? (
                            options.map((option: CustomizationOption) => (
                              <motion.div
                                key={option.id}
                                initial={ opacity: 0 }
                                animate={ opacity: 1 }
                                transition={ duration: 0.3 }
                              >
                                <Card className={`overflow-hidden transition-all ${
                                  state.selectedOptions[option.id]
                                    ? "ring-2 ring-blue-400 shadow-md"
                                    : "hover:shadow-md"
                                }`}>
                                  <div className="h-48 bg-gray-200 relative">
                                    {option.image ? (
                                      <img
                                        src={option.image}
                                        alt={option.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                        <span>Image Placeholder</span>
                                      </div>
                                    )}
                                  </div>
                                  <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                      <CardTitle className="text-lg">{option.name}</CardTitle>
                                      <p className="font-semibold text-blue-600">€{option.price.toLocaleString()}</p>
                                    </div>
                                    <CardDescription>{option.unit}</CardDescription>
                                  </CardHeader>
                                  <CardFooter className="pt-0">
                                    <Button
                                      className="w-full"
                                      variant={state.selectedOptions[option.id] ? "default" : "outline"
                                      onClick={() =>
                                        state.selectedOptions[option.id]
                                          ? handleOptionDeselect(option.id)
                                          : handleOptionSelect(option)
                                      }
                                    >
                                      {state.selectedOptions[option.id] ? (
                                        <>
                                          <Check className="mr-2 h-4 w-4" />
                                          Selected
                                        </>
                                      ) : (
                                        "Select"
                                      )}
                                    </Button>
                                  </CardFooter>
                                </Card>
                              </motion.div>
                            ))
                          ) : (
                            <div className="col-span-3 text-center py-12 text-gray-500">
                              No options available for this combination. Please select a
                              different room or category.
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Summary and Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Selections</CardTitle>
            <CardDescription>
              Total additional cost:{" "
              <span className="font-semibold text-blue-600">
                €{state.totalCost.toLocaleString()}
              </span>
            </CardDescription>
            {state.lastSaved && (
              <p className="text-sm text-gray-500 mt-1">
                Last saved: {new Date(state.lastSaved).toLocaleString()}
              </p>
            )}
          </CardHeader>
          <CardFooter className="flex justify-between flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={handleRequestConsultation}
              className="flex items-center"
            >
              <Phone className="mr-2 h-4 w-4" />
              Request Consultation
            </Button>
            <Button
              onClick={handleSaveAndContinue}
              className="flex items-center"
            >
              <Save className="mr-2 h-4 w-4" />
              Save & Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Helper function to get icons for categories
function getCategoryIcon(categoryId: string) {
  switch (categoryId) {
    case 'flooring':
      return <Home className="h-4 w-4" />\n  );
    case 'paint':
      return <Brush className="h-4 w-4" />\n  );
    case 'fixtures':
      return <Lightbulb className="h-4 w-4" />\n  );
    case 'furniture':
      return <Sofa className="h-4 w-4" />\n  );
    default:
      return null;
  }
} // End of getCategoryIcon function