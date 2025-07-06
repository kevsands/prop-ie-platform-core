'use client';

/**
 * Mock API hooks for development and testing
 * In a real implementation, these would use React Query and fetch from the API
 */

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DocumentItem, DocumentCategory, DocumentStatus } from '@/components/document';
import { Development } from '@/types/development';
import { User } from '@/types/user';

// Extended Development interface for mock data
interface MockDevelopment extends Development {
  soldUnits?: number;
  availableUnits?: number;
  reservedUnits?: number;
}

// Mock data
const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: '1',
    name: 'Planning Permission Application',
    category: 'PLANNING',
    status: 'APPROVED',
    deadline: '2023-11-15',
    description: 'Main planning permission application for the development',
    lastUpdated: '2023-10-20',
    uploadedBy: 'John Developer',
    fileUrl: 'https://example.com/documents/planning-permission.pdf',
    required: true
  },
  {
    id: '2',
    name: 'Environmental Impact Assessment',
    category: 'PLANNING',
    status: 'APPROVED',
    deadline: '2023-11-01',
    description: 'Assessment of the environmental impact of the development',
    lastUpdated: '2023-10-15',
    uploadedBy: 'Jane Engineer',
    fileUrl: 'https://example.com/documents/environmental-impact.pdf',
    required: true
  },
  {
    id: '3',
    name: 'Construction Method Statement',
    category: 'CONSTRUCTION',
    status: 'DRAFT',
    deadline: '2023-12-01',
    description: 'Detailed method statement for construction phase',
    lastUpdated: '2023-11-05',
    uploadedBy: 'John Developer',
    fileUrl: 'https://example.com/documents/method-statement-draft.pdf',
    required: true
  },
  {
    id: '4',
    name: 'Site Layout Plan',
    category: 'PLANNING',
    status: 'APPROVED',
    deadline: '2023-10-15',
    description: 'Detailed site layout including all units and facilities',
    lastUpdated: '2023-09-30',
    uploadedBy: 'Jane Engineer',
    fileUrl: 'https://example.com/documents/site-layout.pdf',
    required: true
  },
  {
    id: '5',
    name: 'Traffic Management Plan',
    category: 'PLANNING',
    status: 'PENDING',
    deadline: '2023-11-20',
    description: 'Plan for managing traffic during construction',
    lastUpdated: '2023-11-10',
    uploadedBy: 'John Developer',
    fileUrl: 'https://example.com/documents/traffic-management.pdf',
    required: true
  },
  {
    id: '6',
    name: 'Construction Contract',
    category: 'LEGAL',
    status: 'MISSING',
    deadline: '2023-12-15',
    description: 'Main contract with construction company',
    required: true
  },
  {
    id: '7',
    name: 'Building Regulations Compliance',
    category: 'LEGAL',
    status: 'PENDING',
    deadline: '2023-12-10',
    description: 'Documentation proving compliance with building regulations',
    lastUpdated: '2023-11-25',
    uploadedBy: 'Jane Engineer',
    fileUrl: 'https://example.com/documents/building-regs.pdf',
    required: true
  },
  {
    id: '8',
    name: 'Marketing Brochure Draft',
    category: 'MARKETING',
    status: 'DRAFT',
    deadline: '2023-12-20',
    description: 'Initial draft of marketing brochure for review',
    lastUpdated: '2023-11-15',
    uploadedBy: 'Mark Marketing',
    fileUrl: 'https://example.com/documents/brochure-draft.pdf',
    required: false
  },
  {
    id: '9',
    name: 'Health and Safety Plan',
    category: 'CONSTRUCTION',
    status: 'MISSING',
    deadline: '2023-12-05',
    description: 'Comprehensive health and safety plan for construction site',
    required: true
  },
  {
    id: '10',
    name: 'Sales Office Plans',
    category: 'MARKETING',
    status: 'PENDING',
    deadline: '2023-12-30',
    description: 'Detailed plans for on-site sales office',
    lastUpdated: '2023-11-20',
    uploadedBy: 'Mark Marketing',
    fileUrl: 'https://example.com/documents/sales-office.pdf',
    required: false
  },
  {
    id: '11',
    name: 'Land Registry Documents',
    category: 'LEGAL',
    status: 'APPROVED',
    deadline: '2023-10-30',
    description: 'Official land registry documentation for the site',
    lastUpdated: '2023-10-15',
    uploadedBy: 'Sarah Legal',
    fileUrl: 'https://example.com/documents/land-registry.pdf',
    required: true
  },
  {
    id: '12',
    name: 'Warranty Agreements',
    category: 'LEGAL',
    status: 'MISSING',
    deadline: '2024-01-15',
    description: 'Builder warranty documentation for all units',
    required: true
  }
];

interface DocumentFilterParams {
  projectId?: string;
  category?: DocumentCategory | 'ALL';
  status?: DocumentStatus | 'ALL';
  search?: string;
}

interface DocumentsResponse {
  data: DocumentItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Mock developments data
const MOCK_DEVELOPMENTS: MockDevelopment[] = [
  {
    id: '1',
    name: 'Ellwood',
    slug: 'ellwood',
    description: 'Luxury riverside apartments with stunning views and premium amenities.',
    location: {
      address: {
        addressLine1: '123 Riverside Drive',
        city: 'Dublin',
        county: 'Dublin',
        postalCode: 'D01 AB12',
        country: 'Ireland'
      },
      coordinates: {
        latitude: 53.349805,
        longitude: -6.260310
      },
      eircode: 'D01 AB12'
    },
    image: '/images/developments/ellwood/main.jpg',
    images: [
      '/images/developments/ellwood/1.jpg',
      '/images/developments/ellwood/2.jpg',
      '/images/developments/ellwood/3.jpg'
    ],
    sitePlanUrl: '/images/developments/ellwood/site-plan.jpg',
    status: 'SELLING_FAST',
    statusColor: 'green',
    availabilityStatus: 'Limited Availability',
    priceRange: '€350,000 - €550,000',
    bedrooms: [1, 2, 3],
    bathrooms: 2,
    buildingType: 'Apartment',
    totalUnits: 72,
    soldUnits: 45,
    availableUnits: 27,
    reservedUnits: 12,
    developmentFeatures: [
      'Riverside promenade',
      'Gym and wellness center',
      'Underground parking',
      'Concierge service',
      'Communal gardens'
    ],
    areaAmenities: [
      'Shopping center (500m)',
      'Public transport links',
      'Schools and universities',
      'Healthcare facilities',
      'Parks and recreation'
    ],
    salesAgent: {
      name: 'John Smith',
      agency: 'PropIE Homes',
      phone: '+353 1 234 5678',
      email: 'john.smith@propie.com'
    },
    showingDates: [
      '2023-12-15',
      '2023-12-16',
      '2023-12-17'
    ],
    completionDate: '2024-03-15',
    startDate: '2022-06-10',
    createdAt: '2022-05-01',
    updatedAt: '2023-11-30',
    developerId: 'dev-1'
  },
  {
    id: '2',
    name: 'Fitzgerald Gardens',
    slug: 'fitzgerald-gardens',
    description: 'Contemporary family homes in a peaceful garden setting close to the city.',
    location: {
      address: {
        addressLine1: '45 Fitzgerald Avenue',
        city: 'Dublin',
        county: 'Dublin',
        postalCode: 'D08 CD34',
        country: 'Ireland'
      },
      coordinates: {
        latitude: 53.339805,
        longitude: -6.270310
      },
      eircode: 'D08 CD34'
    },
    image: '/images/developments/fitzgerald-gardens/main.jpg',
    images: [
      '/images/developments/fitzgerald-gardens/1.jpg',
      '/images/developments/fitzgerald-gardens/2.jpg',
      '/images/developments/fitzgerald-gardens/3.jpg'
    ],
    sitePlanUrl: '/images/developments/fitzgerald-gardens/site-plan.jpg',
    status: 'NEW_RELEASE',
    statusColor: 'blue',
    availabilityStatus: 'Available Now',
    priceRange: '€450,000 - €650,000',
    bedrooms: [3, 4],
    bathrooms: 3,
    buildingType: 'House',
    totalUnits: 48,
    soldUnits: 12,
    availableUnits: 36,
    reservedUnits: 6,
    developmentFeatures: [
      'Landscaped gardens',
      'Energy efficient homes (A-rated)',
      'Smart home technology',
      'Private driveways',
      'Playground area'
    ],
    areaAmenities: [
      'Local shops and restaurants',
      'Primary and secondary schools',
      'Sports facilities',
      'Public parks',
      'Easy access to city center'
    ],
    salesAgent: {
      name: 'Sarah Jones',
      agency: 'PropIE Homes',
      phone: '+353 1 234 5679',
      email: 'sarah.jones@propie.com'
    },
    showingDates: [
      '2023-12-09',
      '2023-12-10'
    ],
    completionDate: '2024-06-30',
    startDate: '2023-01-15',
    createdAt: '2022-11-15',
    updatedAt: '2023-11-28',
    developerId: 'dev-1'
  },
  {
    id: '3',
    name: 'Ballymakenny View',
    slug: 'ballymakenny-view',
    description: 'Stunning architectural homes with countryside views and modern finishes.',
    location: {
      address: {
        addressLine1: '78 Ballymakenny Road',
        city: 'Drogheda',
        county: 'Louth',
        postalCode: 'A92 E2F3',
        country: 'Ireland'
      },
      coordinates: {
        latitude: 53.719805,
        longitude: -6.350310
      },
      eircode: 'A92 E2F3'
    },
    image: '/images/developments/ballymakenny-view/main.jpg',
    images: [
      '/images/developments/ballymakenny-view/1.jpg',
      '/images/developments/ballymakenny-view/2.jpg',
      '/images/developments/ballymakenny-view/3.jpg'
    ],
    sitePlanUrl: '/images/developments/ballymakenny-view/site-plan.jpg',
    status: 'UNDER_CONSTRUCTION',
    statusColor: 'yellow',
    availabilityStatus: 'Coming Soon',
    priceRange: 'From €395,000',
    bedrooms: [2, 3, 4],
    bathrooms: 2,
    buildingType: 'House',
    totalUnits: 60,
    soldUnits: 0,
    availableUnits: 60,
    reservedUnits: 0,
    developmentFeatures: [
      'Solar panels',
      'Heat recovery systems',
      'High-speed internet infrastructure',
      'Electric car charging points',
      'Large gardens'
    ],
    areaAmenities: [
      'Country walks',
      'Local town center (5 min drive)',
      'New school development',
      'Golf course',
      'Shopping centers'
    ],
    salesAgent: {
      name: 'Michael Brown',
      agency: 'PropIE Homes',
      phone: '+353 1 234 5680',
      email: 'michael.brown@propie.com'
    },
    showingDates: [
      '2024-02-10',
      '2024-02-11'
    ],
    completionDate: '2024-08-15',
    startDate: '2023-05-10',
    createdAt: '2023-03-01',
    updatedAt: '2023-11-25',
    developerId: 'dev-1'
  }
];

// Mock sales data
const MOCK_SALES = {
  totalSales: 57,
  targetSales: 100,
  salesByMonth: [
    { month: 'Jan', sales: 2 },
    { month: 'Feb', sales: 5 },
    { month: 'Mar', sales: 8 },
    { month: 'Apr', sales: 4 },
    { month: 'May', sales: 9 },
    { month: 'Jun', sales: 11 },
    { month: 'Jul', sales: 13 },
    { month: 'Aug', sales: 5 }
  ],
  upcomingAppointments: 12,
  leadConversionRate: 28
};

// Document hook implementation
export const useDocuments = (params?: DocumentFilterParams) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<DocumentsResponse | null>(null);

  useEffect(() => {
    // Simulate API request delay
    const timer = setTimeout(() => {
      try {
        // Filter documents based on params
        let filteredDocs = [...MOCK_DOCUMENTS];

        if (params?.category && params.category !== 'ALL') {
          filteredDocs = filteredDocs.filter(doc => doc.category === params.category);
        }

        if (params?.status && params.status !== 'ALL') {
          filteredDocs = filteredDocs.filter(doc => doc.status === params.status);
        }

        if (params?.search) {
          const searchLower = params.search.toLowerCase();
          filteredDocs = filteredDocs.filter(
            doc => doc.name.toLowerCase().includes(searchLower) || 
                  (doc.description && doc.description.toLowerCase().includes(searchLower))
          );
        }

        // Sort by deadline
        filteredDocs.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

        setData({
          data: filteredDocs,
          pagination: {
            total: filteredDocs.length,
            page: 1,
            limit: 50,
            pages: 1
          }
        });
        setIsLoading(false);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        setIsLoading(false);
      }
    }, 1000); // 1 second delay to simulate API call

    return () => clearTimeout(timer);
  }, [params?.category, params?.status, params?.search, params?.projectId]);

  return { data, isLoading, error };
};

// Interface for development filter parameters
interface DevelopmentFilterParams {
  status?: string;
  location?: string; 
  bedrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  buildingType?: string;
  limit?: number;
  page?: number;
  search?: string;
}

// Development response interface
interface DevelopmentsResponse {
  data: Development[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Hook to fetch developments with optional filtering
 */
export const useDevelopments = (params?: DevelopmentFilterParams) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<DevelopmentsResponse | null>(null);

  useEffect(() => {
    // Simulate API request delay
    const timer = setTimeout(() => {
      try {
        // Filter developments based on params
        let filteredDevelopments = [...MOCK_DEVELOPMENTS];

        if (params?.status) {
          filteredDevelopments = filteredDevelopments.filter(dev => 
            dev.status.toLowerCase() === params.status?.toLowerCase()
          );
        }

        if (params?.location) {
          filteredDevelopments = filteredDevelopments.filter(dev => 
            dev.location.address.city.toLowerCase().includes(params.location?.toLowerCase() || '') ||
            dev.location.address.county.toLowerCase().includes(params.location?.toLowerCase() || '')
          );
        }

        if (params?.bedrooms) {
          filteredDevelopments = filteredDevelopments.filter(dev => 
            dev.bedrooms.includes(params.bedrooms || 0)
          );
        }

        if (params?.buildingType) {
          filteredDevelopments = filteredDevelopments.filter(dev => 
            dev.buildingType.toLowerCase() === params.buildingType?.toLowerCase()
          );
        }

        if (params?.search) {
          const searchLower = params.search.toLowerCase();
          filteredDevelopments = filteredDevelopments.filter(dev => 
            dev.name.toLowerCase().includes(searchLower) || 
            dev.description.toLowerCase().includes(searchLower) ||
            dev.location.address.city.toLowerCase().includes(searchLower) ||
            dev.location.address.county.toLowerCase().includes(searchLower)
          );
        }

        // Calculate price ranges if needed
        if (params?.minPrice || params?.maxPrice) {
          // This is a simplification - in a real app you'd have actual price data
          // Here we're just using the string price range to filter
          filteredDevelopments = filteredDevelopments.filter(dev => {
            const priceText = dev.priceRange.replace(/[^0-9]/g, '');
            const prices = priceText.match(/\d+/g)?.map(Number) || [];
            const minDevPrice = Math.min(...prices);
            const maxDevPrice = Math.max(...prices);
            
            const satisfiesMinPrice = params?.minPrice ? minDevPrice >= params.minPrice : true;
            const satisfiesMaxPrice = params?.maxPrice ? maxDevPrice <= params.maxPrice : true;
            
            return satisfiesMinPrice && satisfiesMaxPrice;
          });
        }

        // Get page of results if pagination is specified
        const limit = params?.limit || 10;
        const page = params?.page || 1;
        const offset = (page - 1) * limit;
        const paginatedDevelopments = filteredDevelopments.slice(offset, offset + limit);

        setData({
          data: paginatedDevelopments,
          pagination: {
            total: filteredDevelopments.length,
            page,
            limit,
            pages: Math.ceil(filteredDevelopments.length / limit)
          }
        });
        setIsLoading(false);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        setIsLoading(false);
      }
    }, 800); // 800ms delay to simulate API call

    return () => clearTimeout(timer);
  }, [
    params?.status, 
    params?.location, 
    params?.bedrooms, 
    params?.minPrice, 
    params?.maxPrice, 
    params?.buildingType,
    params?.limit,
    params?.page,
    params?.search
  ]);

  return { data, isLoading, error };
};

/**
 * Hook to fetch sales data
 */
// Define a type for the sales data
interface SalesData {
  totalSales: number;
  targetSales: number;
  salesByMonth: Array<{ month: string; sales: number }>;
  upcomingAppointments: number;
  leadConversionRate: number;
}

export const useSales = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<SalesData | null>(null);

  useEffect(() => {
    // Simulate API request delay
    const timer = setTimeout(() => {
      try {
        setData(MOCK_SALES);
        setIsLoading(false);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
        setIsLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading, error };
};

/**
 * Hook to fetch user data
 */
export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      // In a real app, this would call an API
      return {
        id: userId,
        firstName: 'John',
        lastName: 'Developer',
        email: 'john@propie.com',
        role: 'developer',
        company: 'PropIE Developments Ltd'
      } as User;
    }
  });
};

/**
 * Hook to delete a development
 */
export const useDeleteDevelopment = () => {
  return {
    mutate: (id: string, options?: {
      onSuccess?: () => void;
      onError?: (error: Error) => void;
    }) => {
      // Simulate API request
      setTimeout(() => {
        // In a real app, this would call an API endpoint to delete the development
        console.log(`Development ${id} deleted`);
        if (options?.onSuccess) {
          options.onSuccess();
        }
      }, 800);
    },
    isPending: false
  };
};

// Add default exports for hooks to fix import issues
export default {
  useDocuments,
  useDevelopments,
  useSales,
  useUser,
  useDeleteDevelopment
};