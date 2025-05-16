"use client";
import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DataService } from '@/lib/amplify-data'; // Import DataService

// Import centralized types
import { CustomizationOption } from "@/types"; 

// --- Local Types Specific to this Context ---

// Define type for selected options within the context state
export interface SelectedOption {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  room?: string; 
  customData?: Record<string, any>; 
}

// Define state shape
interface CustomizationState {
  selectedOptions: Record<string, SelectedOption>;
  availableOptions: CustomizationOption[]; 
  currentRoom: string;
  totalCost: number;
  loading: boolean;
  error: string | null;
  propertyId: string | null;
  customizationId: string | null; // ID of the currently loaded/saved customization record
  lastSaved?: string; // Timestamp of the last save
}

// Define context value shape
export interface CustomizationContextType {
  state: CustomizationState;
  selectOption: (optionId: string, option: SelectedOption) => void;
  removeOption: (optionId: string) => void;
  setCurrentRoom: (room: string) => void;
  setAvailableOptions: (options: CustomizationOption[]) => void; 
  resetCustomization: (propertyId?: string) => void; // Allow passing propertyId on reset
  saveCustomization: () => Promise<void>;
  loadCustomization: (propertyId: string) => Promise<void>;
  selectedOptions: Record<string, SelectedOption>; 
  totalCost: number; 
}

// Define action types
type CustomizationAction =
  | { type: 'SELECT_OPTION'; payload: { id: string; option: SelectedOption } }
  | { type: 'REMOVE_OPTION'; payload: { id: string } }
  | { type: 'SET_CURRENT_ROOM'; payload: { room: string } }
  | { type: 'SET_AVAILABLE_OPTIONS'; payload: { options: CustomizationOption[] } } 
  | { type: 'SET_LOADING'; payload: { loading: boolean } }
  | { type: 'SET_ERROR'; payload: { error: string | null } }
  | { type: 'RESET_CUSTOMIZATION'; payload?: { propertyId?: string } } // Optional propertyId
  | { type: 'LOAD_CUSTOMIZATION'; payload: { customization: Partial<CustomizationState> } }
  | { type: 'SET_PROPERTY_ID'; payload: { propertyId: string | null } } // Added action
  | { type: 'SET_CUSTOMIZATION_ID'; payload: { customizationId: string | null } }; // Added action

// Create context
const CustomizationContext = createContext<CustomizationContextType | undefined>(undefined);

// Initial state
const initialState: CustomizationState = {
  selectedOptions: {},
  availableOptions: [],
  currentRoom: '', // Start empty, set after loading rooms
  totalCost: 0,
  loading: false,
  error: null,
  propertyId: null,
  customizationId: null,
};

// Reducer function
function customizationReducer(state: CustomizationState, action: CustomizationAction): CustomizationState {
  switch (action.type) {
    case 'SELECT_OPTION':
      return {
        ...state,
        selectedOptions: {
          ...state.selectedOptions,
          [action.payload.id]: action.payload.option,
        },
        totalCost: calculateTotalCost({
          ...state.selectedOptions,
          [action.payload.id]: action.payload.option,
        }),
      };
    case 'REMOVE_OPTION':
      const { [action.payload.id]: removed, ...remainingOptions } = state.selectedOptions;
      return {
        ...state,
        selectedOptions: remainingOptions,
        totalCost: calculateTotalCost(remainingOptions),
      };
    case 'SET_CURRENT_ROOM':
      return {
        ...state,
        currentRoom: action.payload.room,
      };
    case 'SET_AVAILABLE_OPTIONS':
      return {
        ...state,
        availableOptions: action.payload.options,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload.loading,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload.error,
      };
    case 'RESET_CUSTOMIZATION':
      return {
        ...initialState,
        availableOptions: state.availableOptions, // Keep available options
        propertyId: action.payload?.propertyId || null, // Set propertyId if provided
      };
    case 'LOAD_CUSTOMIZATION':
      const loadedSelectedOptions = action.payload.customization.selectedOptions || {};
      return {
        ...state,
        ...action.payload.customization,
        selectedOptions: loadedSelectedOptions, 
        totalCost: calculateTotalCost(loadedSelectedOptions),
        loading: false, // Ensure loading is set to false after load
        error: null,
      };
    case 'SET_PROPERTY_ID':
      return {
        ...state,
        propertyId: action.payload.propertyId,
      };
    case 'SET_CUSTOMIZATION_ID':
      return {
        ...state,
        customizationId: action.payload.customizationId,
      };
    default:
      return state;
  }
}

// Helper to calculate total cost
function calculateTotalCost(selectedOptions: Record<string, SelectedOption>): number {
  return Object.values(selectedOptions).reduce((total, option) => total + (option.price || 0), 0);
}

// Provider component
export function CustomizationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(customizationReducer, initialState);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Effect to load customization when propertyId changes in URL
  useEffect(() => {
    // Use optional chaining to safely access searchParams.get
    const propertyIdFromUrl = searchParams?.get('propertyId') ?? null;
    if (propertyIdFromUrl && state.propertyId !== propertyIdFromUrl) {
      loadCustomization(propertyIdFromUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only run when searchParams change

  const selectOption = useCallback((optionId: string, option: SelectedOption) => {
    dispatch({ type: 'SELECT_OPTION', payload: { id: optionId, option } });
  }, []);

  const removeOption = useCallback((optionId: string) => {
    dispatch({ type: 'REMOVE_OPTION', payload: { id: optionId } });
  }, []);

  const setCurrentRoom = useCallback((room: string) => {
    dispatch({ type: 'SET_CURRENT_ROOM', payload: { room } });
  }, []);

  const setAvailableOptions = useCallback((options: CustomizationOption[]) => {
    dispatch({ type: 'SET_AVAILABLE_OPTIONS', payload: { options } });
  }, []);

  const resetCustomization = useCallback((propertyId?: string) => {
    dispatch({ type: 'RESET_CUSTOMIZATION', payload: { propertyId } });
  }, []);

  // --- Updated saveCustomization --- 
  const saveCustomization = useCallback(async () => {
    if (!state.propertyId) {
      console.error("Cannot save customization without a propertyId.");
      dispatch({ type: 'SET_ERROR', payload: { error: 'Property ID is missing.' } });
      return;
    }
    dispatch({ type: 'SET_LOADING', payload: { loading: true } });
    dispatch({ type: 'SET_ERROR', payload: { error: null } }); // Clear previous errors
    console.log('Saving customization for property:', state.propertyId);
    try {
      // Prepare data for the backend
      const customizationToSave = { 
        id: state.customizationId, // Pass existing ID for updates
        propertyId: state.propertyId,
        // Backend might expect selectedOptions as JSON string or structured object
        // Adjust based on your GraphQL schema (assuming JSON string for now)
        selectedOptions: JSON.stringify(state.selectedOptions), 
        totalCost: state.totalCost,
        currentRoom: state.currentRoom, // Save current room context
        // Add other relevant fields like status if needed
        status: 'DRAFT', // Example status
      };

      const result = await DataService.saveCustomization(customizationToSave as any);
      
      // Update the customizationId in state if it was a new creation
      if (result.customizationId && !state.customizationId) {
        dispatch({ type: 'SET_CUSTOMIZATION_ID', payload: { customizationId: result.customizationId } });
      }
      
      // Update lastSaved timestamp
      const lastSaved = new Date().toISOString();
      dispatch({ 
        type: 'LOAD_CUSTOMIZATION', 
        payload: { 
          customization: { 
            ...state, 
            lastSaved 
          } 
        } 
      });
      
      console.log('Customization saved successfully, ID:', result.customizationId);
      // Optionally show a success notification to the user

    } catch (error) {
      console.error("Failed to save customization:", error);
      const message = error instanceof Error ? error.message : 'Failed to save customization';
      dispatch({ type: 'SET_ERROR', payload: { error: message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.customizationId, state.propertyId, state.selectedOptions, state.totalCost, state.currentRoom]);

  // --- Updated loadCustomization --- 
  const loadCustomization = useCallback(async (propertyId: string) => {
    if (!propertyId) return; // Don't load if no propertyId
    dispatch({ type: 'SET_LOADING', payload: { loading: true } });
    dispatch({ type: 'SET_ERROR', payload: { error: null } }); // Clear previous errors
    console.log('Loading customization for property:', propertyId);
    try {
      const loadedData = await DataService.getCustomization(propertyId);
      
      if (loadedData) {
        console.log('Loaded customization data from backend:', loadedData);
        // Parse selectedOptions if stored as JSON string
        let parsedSelectedOptions = loadedData.selectedOptions;
        if (typeof parsedSelectedOptions === 'string') {
          try {
            parsedSelectedOptions = JSON.parse(parsedSelectedOptions);
          } catch (e) {
            console.error('Failed to parse loaded selectedOptions:', e);
            parsedSelectedOptions = {}; // Default to empty if parsing fails
          }
        }

        // Prepare payload for reducer, ensuring all necessary fields are present
        const customizationPayload: Partial<CustomizationState> = {
          propertyId: loadedData.propertyId,
          customizationId: loadedData.id,
          selectedOptions: parsedSelectedOptions || {},
          totalCost: loadedData.totalCost ?? calculateTotalCost(parsedSelectedOptions || {}),
          currentRoom: loadedData.currentRoom || state.currentRoom, // Use loaded room or keep current
          // Add other fields from loadedData if needed
        };

        dispatch({ type: 'LOAD_CUSTOMIZATION', payload: { customization: customizationPayload } });
      } else {
        // No existing customization found for this user/property
        console.log('No existing customization found for property:', propertyId);
        dispatch({ type: 'RESET_CUSTOMIZATION', payload: { propertyId } }); // Reset state but keep propertyId
      }
    } catch (error) {
      console.error('Failed to load customization:', error);
      const message = error instanceof Error ? error.message : 'Failed to load customization';
      dispatch({ type: 'SET_ERROR', payload: { error: message } });
      // Optionally reset state on load error, keeping propertyId
      dispatch({ type: 'RESET_CUSTOMIZATION', payload: { propertyId } }); 
    } finally {
      // Loading state is set to false within the LOAD_CUSTOMIZATION reducer case
      // If an error occurred or no data was found, set loading false here
      if (!state.loading) { // Check if reducer already set it
         dispatch({ type: 'SET_LOADING', payload: { loading: false } });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentRoom]); // Include dependencies that might affect default values

  const value: CustomizationContextType = {
    state,
    selectOption,
    removeOption,
    setCurrentRoom,
    setAvailableOptions,
    resetCustomization,
    saveCustomization,
    loadCustomization,
    selectedOptions: state.selectedOptions,
    totalCost: state.totalCost,
  };

  return (
    <CustomizationContext.Provider value={value}>
      {children}
    </CustomizationContext.Provider>
  );
}

export function useCustomization() {
  const context = useContext(CustomizationContext);
  if (context === undefined) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
}

export default CustomizationContext;

