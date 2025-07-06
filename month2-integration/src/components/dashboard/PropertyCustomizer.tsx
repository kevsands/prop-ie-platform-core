"use client";

// src/components/PropertyCustomizer.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useCustomization } from '@/context/CustomizationContext';
import { DataService } from '@/lib/amplify-data';
import { CustomizationOption, Room, Category } from '@/types';
import ModelViewer from '../3d/ModelViewer'; // Import the ModelViewer component

interface PropertyCustomizerProps {
  propertyId: string; // Pass the property ID to potentially load/save customization
  baseModelUrl: string; // URL for the base 3D model of the property
}

const PropertyCustomizer: React.FC<PropertyCustomizerProps> = ({ propertyId, baseModelUrl }) => {
  const {
    state,
    selectOption,
    removeOption,
    setCurrentRoom,
    setAvailableOptions,
    loadCustomization, // To load existing customization for this property
    saveCustomization, // To save the current selections
  } = useCustomization();

  const [allOptions, setAllOptions] = useState<CustomizationOption[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>(''); // Track selected category within the room
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data: rooms, categories, all options, and load existing customization
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch in parallel
        const [fetchedRooms, fetchedCategories, fetchedOptions, loadedCustomizationData] = await Promise.all([
          DataService.getRooms(),
          DataService.getCategories(),
          DataService.getAllActiveCustomizationOptions(),
          DataService.getCustomization(propertyId) // Load existing customization for this property
        ]);

        setRooms(fetchedRooms);
        setCategories(fetchedCategories);
        setAllOptions(fetchedOptions);
        setAvailableOptions(fetchedOptions); // Update context with all available options

        // If customization data was loaded, apply it to the context
        if (loadedCustomizationData) {
          // Ensure loaded data structure matches context expectations
          let parsedSelectedOptions = loadedCustomizationData.selectedOptions;
          if (typeof parsedSelectedOptions === 'string') {
            try {
              parsedSelectedOptions = JSON.parse(parsedSelectedOptions);
            } catch (e) {
              console.error('Failed to parse loaded selectedOptions:', e);
              parsedSelectedOptions = {}; // Default to empty if parsing fails
            }
          }
          
          // Dispatch action to load state into context (assuming LOAD_CUSTOMIZATION exists)
          // dispatch({ type: 'LOAD_CUSTOMIZATION', payload: { customization: { ...loadedCustomizationData, selectedOptions: parsedSelectedOptions } } });
          console.log("Loaded customization data:", loadedCustomizationData);
          // Set initial room and category based on loaded data
          setCurrentRoom(loadedCustomizationData.currentRoom || fetchedRooms[0]?.id || '');
        } else {
           // If no customization loaded, set default room
           if (fetchedRooms.length > 0) {
             setCurrentRoom(fetchedRooms[0].id);
           }
        }

        // Set initial category based on the current room (either loaded or default)
        const initialRoomId = loadedCustomizationData?.currentRoom || fetchedRooms[0]?.id || '';
        if (initialRoomId) {
            const categoriesForInitialRoom = fetchedCategories.filter(cat => 
                fetchedOptions.some(opt => opt.room === initialRoomId && opt.category === cat.id)
            );
            if (categoriesForInitialRoom.length > 0) {
                setCurrentCategory(categoriesForInitialRoom[0].id);
            }
        }

      } catch (err) {
        console.error("Failed to fetch customization data:", err);
        setError('Failed to load customization options. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId, setAvailableOptions]); // Removed setCurrentRoom from deps as it causes loops if not memoized

  // Filter options based on current room and category
  const filteredOptions = useMemo(() => {
    return allOptions.filter(
      (option) => option.room === state.currentRoom && option.category === currentCategory
    );
  }, [allOptions, state.currentRoom, currentCategory]);

  // Filter categories based on current room and available options
  const availableCategoriesForRoom = useMemo(() => {
    const categoryIdsInRoom = new Set(
        allOptions.filter(opt => opt.room === state.currentRoom).map(opt => opt.category)
    );
    return categories.filter(cat => categoryIdsInRoom.has(cat.id));
  }, [allOptions, state.currentRoom, categories]);

  // Handle room selection
  const handleRoomSelect = (roomId: string) => {
    setCurrentRoom(roomId);
    // Reset category when room changes, select the first available category for the new room
    const categoriesForNewRoom = categories.filter(cat => 
        allOptions.some(opt => opt.room === roomId && opt.category === cat.id)
    );
    setCurrentCategory(categoriesForNewRoom[0]?.id || '');
  };

  // Handle option selection/deselection
  const handleOptionToggle = (option: CustomizationOption) => {
    if (state.selectedOptions[option.id]) {
      removeOption(option.id);
    } else {
      // Map CustomizationOption to SelectedOption format for the context
      const selectedOption = {
        id: option.id,
        name: option.name,
        price: option.price,
        unit: option.unit,
        category: option.category,
        room: option.room,
        customData: option.customData, // Pass custom data if needed
      };
      selectOption(option.id, selectedOption);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading customization options...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="property-customizer p-4 border rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Customize Your Property</h2>
      
      {/* 3D Model View Area */}
      <div className="mb-6">
        <ModelViewer baseModelUrl={baseModelUrl} />
      </div>

      {/* Room Selection Tabs/Buttons */}
      <div className="mb-4 border-b">
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => handleRoomSelect(room.id)}
            className={`px-4 py-2 mr-2 ${state.currentRoom === room.id ? 'border-b-2 border-blue-600 font-semibold' : 'text-gray-600'}`}
          >
            {room.name}
          </button>
        ))}
      </div>

      {/* Category Selection Tabs/Buttons */}
      <div className="mb-4">
        {availableCategoriesForRoom.map((category) => (
          <button
            key={category.id}
            onClick={() => setCurrentCategory(category.id)}
            className={`px-3 py-1 mr-2 rounded ${currentCategory === category.id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Options Grid/List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <div key={option.id} className="border rounded p-3 flex flex-col justify-between">
              <div>
                {option.image && (
                  <img src={option.image} alt={option.name} className="w-full h-32 object-cover mb-2 rounded" />
                )}
                <h4 className="font-semibold">{option.name}</h4>
                <p className="text-sm text-gray-600">{option.description}</p>
                <p className="text-lg font-medium mt-1">€{option.price.toFixed(2)} {option.unit && `/ ${option.unit}`}</p>
              </div>
              <button
                onClick={() => handleOptionToggle(option)}
                className={`mt-3 w-full py-1 rounded ${state.selectedOptions[option.id] ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
              >
                {state.selectedOptions[option.id] ? 'Remove' : 'Select'}
              </button>
            </div>
          ))
        ) : (
          <p>No options available for this category in this room.</p>
        )}
      </div>

      {/* Summary and Actions */}
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="text-xl font-semibold mb-2">Customization Summary</h3>
        <p className="text-lg">Total Cost: <span className="font-bold">€{state.totalCost.toFixed(2)}</span></p>
        {/* Add a button to save customization */} 
        <button 
          onClick={saveCustomization} 
          disabled={state.loading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {state.loading ? 'Saving...' : 'Save Customization'}
        </button>
        {state.error && <p className="text-red-500 mt-2">Error saving: {state.error}</p>}
      </div>

    </div>
  );
};

export default PropertyCustomizer;

