// Defines the structure for Fitzgerald Gardens property data and customizations

export type FitzgeraldHouseDescription =
  | "1B / 2P Mid-Terrace Duplex"
  | "2B / 4P Mid-Terrace Duplex"
  | "2B / 4P End-Terrace Duplex"
  | "2B / 4P Terraced"
  | "3B / 5P Terraced"
  | "3B / 5P Mid-Terrace Duplex"
  | "3B / 5P Semi-Detached"
  | "3B / 5P Detached"
  | "4B / 7P End-Terrace"
  | "4B / 8P Semi-Detached"
  | "4B / 8P Mid-Terrace Duplex";

export interface FitzgeraldUnitPrice {
  description: FitzgeraldHouseDescription;
  sqm: number;
  basePrice: number;
}

export interface CustomizationOption {
  id: string; // e.g., 'quartz_worktops'
  name: string; // e.g., "Premium Worktops (Quartz)"
  price: number; // e.g., 3500
  description?: string;
}

export interface CustomizationCategory {
  id: string; // e.g., 'kitchen'
  name: string; // e.g., "Kitchen"
  options: CustomizationOption[];
}

export type UnitStatus = "Available" | "Reserved" | "Sold";

export interface FitzgeraldPropertyUnit {
  houseNo: string; // From "House No." column, can be string like "D5"
  streetName: "Fitzgerald Gardens"; // Constant for this development
  houseTypeCol: string; // Raw value from "House Type" column (e.g., "5", "6", "D2")
  houseSubTypeCol: string | null; // Raw value from "House SubType" column (e.g., "A", "0", or null if empty)
  description: FitzgeraldHouseDescription;
  sqm: number;
  basePrice: number;
  status: UnitStatus;
  selectedCustomizations?: {
    [categoryId: string]: string; // e.g., { kitchen_worktop: 'quartz_premium', flooring_living: 'engineered_wood' }
  };
  totalPrice?: number; // basePrice + sum of selected customization prices
  // Add other relevant fields as needed, e.g., plotNumber, specific site plan reference
}

// Example of overall development configuration
export interface FitzgeraldDevelopmentConfig {
  name: "Fitzgerald Gardens";
  units: FitzgeraldPropertyUnit[];
  customizationCategories: CustomizationCategory[];
}

// List of base prices (to be used for populating unit data)
// Derived from user input
export const FITZGERALD_UNIT_PRICES: FitzgeraldUnitPrice[] = [
  { description: "1B / 2P Mid-Terrace Duplex", sqm: 57, basePrice: 295000 },
  { description: "2B / 4P Mid-Terrace Duplex", sqm: 79, basePrice: 325000 }, // Assuming 79sqm variant
  { description: "2B / 4P Mid-Terrace Duplex", sqm: 81, basePrice: 325000 }, // Assuming 81sqm variant (same price for now)
  { description: "2B / 4P End-Terrace Duplex", sqm: 81, basePrice: 325000 }, // Assuming same as mid-terrace for now
  { description: "2B / 4P Terraced", sqm: 87, basePrice: 345000 },
  { description: "3B / 5P Terraced", sqm: 107, basePrice: 385000 }, // Assuming 107sqm variant
  { description: "3B / 5P Terraced", sqm: 116, basePrice: 385000 }, // Assuming 116sqm variant
  { description: "3B / 5P Mid-Terrace Duplex", sqm: 109, basePrice: 365000 },
  { description: "3B / 5P Semi-Detached", sqm: 110, basePrice: 395000 },
  { description: "3B / 5P Detached", sqm: 115, basePrice: 425000 },
  { description: "4B / 7P End-Terrace", sqm: 144, basePrice: 425000 },
  { description: "4B / 8P Semi-Detached", sqm: 158, basePrice: 445000 },
  { description: "4B / 8P Mid-Terrace Duplex", sqm: 81, basePrice: 345000 },
];

export const FITZGERALD_CUSTOMIZATIONS: CustomizationCategory[] = [
  {
    id: "kitchen",
    name: "Kitchen",
    options: [
      { id: "kitchen_standard", name: "Standard Kitchen", price: 0 },
      { id: "kitchen_worktops_quartz", name: "Premium Worktops (Quartz)", price: 3500 },
      { id: "kitchen_designer_package", name: "Designer Kitchen Package", price: 8500 },
    ],
  },
  {
    id: "flooring",
    name: "Flooring",
    options: [
      { id: "flooring_carpet_standard", name: "Standard Carpet", price: 0 },
      { id: "flooring_laminate_throughout", name: "Laminate Throughout", price: 3500 },
      { id: "flooring_engineered_wood", name: "Engineered Wood", price: 6500 },
    ],
  },
  {
    id: "bathrooms",
    name: "Bathrooms",
    options: [
      { id: "bathrooms_standard", name: "Standard Suite", price: 0 },
      { id: "bathrooms_premium_tiles_fixtures", name: "Premium Tiles & Fixtures (per bathroom)", price: 2500 },
    ],
  },
  {
    id: "wardrobes",
    name: "Wardrobes",
    options: [
      { id: "wardrobes_master_only", name: "Master Bedroom Only (Standard)", price: 0 },
      { id: "wardrobes_all_fitted", name: "All Bedrooms Fitted", price: 4500 },
    ],
  },
  {
    id: "paint",
    name: "Paint",
    options: [
      { id: "paint_standard_magnolia", name: "Standard Magnolia", price: 0 },
      { id: "paint_designer_colors", name: "Designer Colors", price: 1500 },
    ],
  },
  {
    id: "smart_home",
    name: "Smart Home",
    options: [
      { id: "smarthome_basic", name: "Basic Package", price: 2500 },
      { id: "smarthome_premium", name: "Premium Package", price: 5000 },
    ],
  },
]; 