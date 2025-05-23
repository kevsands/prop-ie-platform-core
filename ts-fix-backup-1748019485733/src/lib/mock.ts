// src/lib/mock.ts
// Mock data for services and dashboard components

import { PropertyStatus, PropertyType } from '@/types/enums';

// Mock data for dashboard
export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string; 
}

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  isRead: boolean;
  link?: string;
}

export const mockTasks: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Submit HTB Application',
    description: 'Complete and submit the Help-to-Buy application form',
    dueDate: '2025-05-10T12:00:00Z',
    priority: 'high',
    status: 'pending'
  },
  {
    id: 'task-2',
    title: 'Upload Identification Documents',
    description: 'Upload passport and proof of address for verification',
    dueDate: '2025-05-05T12:00:00Z',
    priority: 'high',
    status: 'in_progress'
  },
  {
    id: 'task-3',
    title: 'Complete Property Customization',
    description: 'Select kitchen and bathroom finishes for your property',
    dueDate: '2025-05-20T12:00:00Z',
    priority: 'medium',
    status: 'pending'
  },
  {
    id: 'task-4',
    title: 'Schedule Meeting with Mortgage Advisor',
    description: 'Arrange a meeting to discuss mortgage options',
    dueDate: '2025-05-08T12:00:00Z',
    priority: 'medium',
    status: 'completed'
  },
  {
    id: 'task-5',
    title: 'Sign Contract Documents',
    description: 'Review and sign the property purchase agreement',
    dueDate: '2025-05-30T12:00:00Z',
    priority: 'high',
    status: 'pending'
  }
];

export const mockAlerts: AlertItem[] = [
  {
    id: 'alert-1',
    title: 'Customization Deadline Approaching',
    message: 'You have 5 days left to finalize your property customization selections.',
    timestamp: '2025-05-01T09:15:00Z',
    severity: 'high',
    isRead: false,
    link: '/buyer/customization'
  },
  {
    id: 'alert-2',
    title: 'Document Verification Complete',
    message: 'Your identification documents have been verified successfully.',
    timestamp: '2025-04-28T14:30:00Z',
    severity: 'info',
    isRead: true
  },
  {
    id: 'alert-3',
    title: 'HTB Application Status Update',
    message: 'Your Help-to-Buy application is pending review. We\'ll notify you once it\'s approved.',
    timestamp: '2025-04-25T11:45:00Z',
    severity: 'medium',
    isRead: false,
    link: '/buyer/htb/status'
  },
  {
    id: 'alert-4',
    title: 'Construction Update',
    message: 'New photos of your property construction progress have been uploaded.',
    timestamp: '2025-04-20T16:00:00Z',
    severity: 'info',
    isRead: true,
    link: '/buyer/property/construction'
  },
  {
    id: 'alert-5',
    title: 'Payment Due',
    message: 'Your next deposit payment of €25,000 is due on May 15th.',
    timestamp: '2025-04-15T10:30:00Z',
    severity: 'critical',
    isRead: false
  }
];

// Mock user with well-defined roles
export const mockUser = {
  id: "user-123",
  username: "johndoe",
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  roles: ["buyer", "user"],
  // Add other user properties as needed
};

// Interface for development filters
export interface DevelopmentFilters {
  location?: string;
  priceRange?: string;
  bedrooms?: number;
  status?: string;
}

// Mock development data
export interface Development {
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  status: string;
  statusColor: string;
  priceRange?: string;
  bedrooms?: number[];
  features?: string[];
}

export const mockDevelopments: Development[] = [
  {
    id: 'dev-1',
    name: 'Fitzgerald Gardens',
    description: 'Luxury apartments in Dublin city center',
    location: 'Dublin 2',
    image: '/images/developments/fitzgerald-gardens/hero.jpg',
    status: 'Selling',
    statusColor: 'green',
    priceRange: '€450,000 - €650,000',
    bedrooms: [1, 23]
  },
  {
    id: 'dev-2',
    name: 'Ballymakenny View',
    description: 'Family homes in a peaceful neighborhood',
    location: 'Drogheda',
    image: '/images/developments/ballymakenny-view/hero.jpg',
    status: 'Selling',
    statusColor: 'green',
    priceRange: '€375,000 - €495,000',
    bedrooms: [34]
  }
];

// Mock data service functions that return Promises
export const mockGetTasks = (): Promise<TaskItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTasks);
    }, 300);
  });
};

export const mockGetAlerts = (): Promise<AlertItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAlerts);
    }, 300);
  });
};

export const mockGetUser = (): Promise<typeof mockUser> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockUser);
    }, 300);
  });
};

export function getDevelopments(filters?: Partial<DevelopmentFilters>): Development[] {
  let filteredDevelopments = [...mockDevelopments];

  if (filters) {
    // Apply location filter with null check
    if (filters.location) {
      filteredDevelopments = filteredDevelopments
        .filter(dev => dev.location.toLowerCase().includes(filters.location?.toLowerCase() || ''));
    }

    // Apply price range filter
    if (filters.priceRange) {
      filteredDevelopments = filteredDevelopments
        .filter(dev => dev.priceRange === filters.priceRange);
    }

    // Apply bedrooms filter
    if (filters.bedrooms) {
      filteredDevelopments = filteredDevelopments
        .filter(dev => dev.bedrooms?.includes(filters.bedrooms!) || false);
    }

    // Apply status filter
    if (filters.status) {
      filteredDevelopments = filteredDevelopments
        .filter(dev => dev.status === filters.status);
    }
  }

  return filteredDevelopments;
}