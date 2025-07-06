import { PropertyStatus, PropertyType } from './enums';

// Base property interface for the PropertyCard component
export interface PropertyCardProps {
  // Core identification
  id: string;
  name: string;
  title?: string;
  
  // Location
  address?: string | {
    city?: string;
    country?: string;
    [key: string]: any;
  };
  
  // Unit details
  price: number;
  status: PropertyStatus | string;
  bedrooms: number;
  bathrooms: number;
  floorArea: number;
  type: PropertyType | string;
  
  // Media
  images?: string[];
  
  // Project information
  projectName?: string;
  projectSlug?: string;
  unitNumber?: string;
}

// Helper function to format price
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(price);
};

// Helper function to get status color
export const getStatusColor = (status: PropertyStatus | string): string => {
  const normalizedStatus = typeof status === 'string' 
    ? status.toLowerCase() 
    : String(status).toLowerCase();
  
  switch (normalizedStatus) {
    case PropertyStatus.Available:
      return 'bg-green-100 text-green-800';
    case PropertyStatus.Reserved:
      return 'bg-orange-100 text-orange-800';
    case PropertyStatus.Sold:
      return 'bg-red-100 text-red-800';
    case PropertyStatus.UnderConstruction:
      return 'bg-yellow-100 text-yellow-800';
    case PropertyStatus.ComingSoon:
      return 'bg-blue-100 text-blue-800';
    case PropertyStatus.OffMarket:
      return 'bg-gray-100 text-gray-800';
    case PropertyStatus.UnderOffer:
      return 'bg-purple-100 text-purple-800';
    case PropertyStatus.SaleAgreed:
      return 'bg-indigo-100 text-indigo-800';
    case PropertyStatus.ToLet:
      return 'bg-teal-100 text-teal-800';
    case PropertyStatus.Selling:
      return 'bg-emerald-100 text-emerald-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}; 