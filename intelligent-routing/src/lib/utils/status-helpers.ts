import { 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Home
} from 'lucide-react';

/**
 * Shared status information for properties and units
 */
export interface StatusInfo {
  label: string;
  className: string;
  icon: typeof CheckCircle;
  color: string;
  priority: 'high' | 'medium' | 'low';
}

/**
 * Get standardized status information for properties/units
 */
export const getStatusInfo = (status: string): StatusInfo => {
  switch (status?.toUpperCase()) {
    case 'AVAILABLE':
      return { 
        label: 'Available', 
        className: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        color: 'text-green-500',
        priority: 'high'
      };
    case 'RESERVED':
      return { 
        label: 'Reserved', 
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: AlertCircle,
        color: 'text-yellow-500',
        priority: 'medium'
      };
    case 'SOLD':
      return { 
        label: 'Sold', 
        className: 'bg-red-100 text-red-800 border-red-200',
        icon: CheckCircle,
        color: 'text-red-500',
        priority: 'low'
      };
    case 'UNDER_CONSTRUCTION':
    case 'UNDER CONSTRUCTION':
      return { 
        label: 'Under Construction', 
        className: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: Home,
        color: 'text-orange-500',
        priority: 'medium'
      };
    case 'COMING_SOON':
    case 'COMING SOON':
    default:
      return { 
        label: 'Coming Soon', 
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: Calendar,
        color: 'text-blue-500',
        priority: 'medium'
      };
  }
};

/**
 * Format price in Irish Euro format
 */
export const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null || price === 0) {
    return 'Price on application';
  }
  
  return new Intl.NumberFormat('en-IE', { 
    style: 'currency', 
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(price);
};

/**
 * Convert development name/id to URL-friendly slug
 */
export const getDevelopmentSlug = (devId?: string, devName?: string): string => {
  if (devName) {
    return devName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  if (devId) {
    return devId.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  }
  return 'development';
};

/**
 * Get unit identifier for URLs (prefer unitNumber, fallback to id)
 */
export const getUnitIdentifier = (unit: { unitNumber?: string; id: string }): string => {
  return unit.unitNumber || unit.id;
};

/**
 * Format view count for display
 */
export const formatViewCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

/**
 * Check if a property/unit is Help-to-Buy eligible based on price
 */
export const isHelpToBuyEligible = (price: number): boolean => {
  // HTB scheme in Ireland is for properties up to €500,000
  return price <= 500000;
};

/**
 * Calculate potential Help-to-Buy refund (10% of property price, max €30,000)
 */
export const calculateHelpToBuyRefund = (price: number): number => {
  if (!isHelpToBuyEligible(price)) {
    return 0;
  }
  
  const tenPercent = price * 0.1;
  return Math.min(tenPercent, 30000);
};

/**
 * Sort units/properties by status priority and then by price
 */
export const sortByStatusAndPrice = <T extends { status: string; basePrice?: number; price?: number }>(
  items: T[]
): T[] => {
  return items.sort((a, b) => {
    const aStatus = getStatusInfo(a.status);
    const bStatus = getStatusInfo(b.status);
    
    // First sort by status priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[bStatus.priority] - priorityOrder[aStatus.priority];
    
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    
    // Then sort by price (ascending)
    const aPrice = a.basePrice || a.price || 0;
    const bPrice = b.basePrice || b.price || 0;
    return aPrice - bPrice;
  });
};