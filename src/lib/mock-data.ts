// src/lib/mock-data.ts
// Temporary mock data for when backend is not available

/**
 * Mock Data Provider
 * Provides mock data for the application when database is not available
 */

// Mock rooms
export const mockRooms = [
  {
    id: 'livingRoom',
    name: 'Living Room',
    icon: '🛋️',
    displayOrder: 1
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    icon: '🍳',
    displayOrder: 2
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    icon: '🛏️',
    displayOrder: 3
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    icon: '🚿',
    displayOrder: 4
  }
];

// Mock categories
export const mockCategories = [
  {
    id: 'flooring',
    name: 'Flooring',
    displayOrder: 1
  },
  {
    id: 'paint',
    name: 'Paint',
    displayOrder: 2
  },
  {
    id: 'fixtures',
    name: 'Fixtures',
    displayOrder: 3
  },
  {
    id: 'furniture',
    name: 'Furniture',
    displayOrder: 4
  }
];

// Mock customization options
export const mockCustomizationOptions = {
  flooring: [
    {
      id: 'floor1',
      name: 'Oak Hardwood',
      description: 'Premium oak hardwood flooring',
      price: 1200,
      unit: 'per room',
      image: '/images/customization/flooring/oak.jpg',
      category: 'flooring',
      room: 'livingRoom',
      active: true
    },
    {
      id: 'floor2',
      name: 'Marble Tile',
      description: 'Luxury marble tile flooring',
      price: 2500,
      unit: 'per room',
      image: '/images/customization/flooring/marble.jpg',
      category: 'flooring',
      room: 'livingRoom',
      active: true
    }
  ],
  paint: [
    {
      id: 'paint1',
      name: 'Classic White',
      description: 'Pure white matte paint',
      price: 300,
      unit: 'per room',
      image: '/images/customization/paint/white.jpg',
      category: 'paint',
      room: 'livingRoom',
      active: true
    },
    {
      id: 'paint2',
      name: 'Sage Green',
      description: 'Calming sage green matte paint',
      price: 350,
      unit: 'per room',
      image: '/images/customization/paint/sage.jpg',
      category: 'paint',
      room: 'livingRoom',
      active: true
    }
  ],
  fixtures: [
    {
      id: 'fixture1',
      name: 'Modern Chandelier',
      description: 'Contemporary ceiling light fixture',
      price: 850,
      unit: 'each',
      image: '/images/customization/fixtures/chandelier.jpg',
      category: 'fixtures',
      room: 'livingRoom',
      active: true
    }
  ],
  furniture: [
    {
      id: 'furniture1',
      name: 'Leather Sofa',
      description: 'Premium leather 3-seater sofa',
      price: 2200,
      unit: 'each',
      image: '/images/customization/furniture/sofa.jpg',
      category: 'furniture',
      room: 'livingRoom',
      active: true
    }
  ]
};

// Mock documents for demo
export const mockDocuments = [
  {
    id: 'doc-001',
    name: 'Reservation Agreement',
    description: 'Property reservation agreement for initial deposit',
    type: 'CONTRACT',
    status: 'SIGNED',
    category: 'LEGAL',
    fileUrl: '/mock-documents/reservation-agreement.pdf',
    fileType: 'application/pdf',
    fileSize: 1024 * 512, // 512KB
    uploadedById: 'user-123',
    uploadedByName: 'John Smith',
    uploadDate: new Date('2025-01-15').toISOString(),
    expiryDate: new Date('2026-01-15').toISOString(),
    tags: ['reservation', 'deposit', 'agreement'],
    version: 1,
    relatedTo: { type: 'property', id: 'prop-1245' },
    metadata: {},
    signatureRequired: true,
    signatureStatus: 'COMPLETED'
  },
  {
    id: 'doc-002',
    name: 'Property Brochure',
    description: 'Detailed brochure for Fitzgerald Gardens development',
    type: 'MARKETING',
    status: 'ACTIVE',
    category: 'MARKETING',
    fileUrl: '/mock-documents/fitzgerald-gardens-brochure.pdf',
    fileType: 'application/pdf',
    fileSize: 1024 * 1024 * 3, // 3MB
    uploadedById: 'user-124',
    uploadedByName: 'Sarah Johnson',
    uploadDate: new Date('2025-01-10').toISOString(),
    expiryDate: null,
    tags: ['brochure', 'marketing', 'fitzgerald-gardens'],
    version: 2,
    relatedTo: { type: 'development', id: 'fitzgerald-gardens' },
    metadata: {},
    signatureRequired: false,
    signatureStatus: null
  },
  {
    id: 'doc-003',
    name: 'KYC Documents',
    description: 'Identity and address verification documents',
    type: 'KYC',
    status: 'VERIFIED',
    category: 'PERSONAL',
    fileUrl: '/mock-documents/kyc-documents.pdf',
    fileType: 'application/pdf',
    fileSize: 1024 * 768, // 768KB
    uploadedById: 'user-123',
    uploadedByName: 'John Smith',
    uploadDate: new Date('2025-01-20').toISOString(),
    expiryDate: new Date('2026-01-20').toISOString(),
    tags: ['kyc', 'identity', 'verification'],
    version: 1,
    relatedTo: { type: 'user', id: 'user-123' },
    metadata: {},
    signatureRequired: false,
    signatureStatus: null
  },
  {
    id: 'doc-004',
    name: 'Mortgage Approval',
    description: 'Official mortgage approval letter from Dublin Bank',
    type: 'FINANCIAL',
    status: 'ACTIVE',
    category: 'FINANCIAL',
    fileUrl: '/mock-documents/mortgage-approval.pdf',
    fileType: 'application/pdf',
    fileSize: 1024 * 384, // 384KB
    uploadedById: 'user-123',
    uploadedByName: 'John Smith',
    uploadDate: new Date('2025-02-15').toISOString(),
    expiryDate: new Date('2025-05-15').toISOString(),
    tags: ['mortgage', 'approval', 'financial'],
    version: 1,
    relatedTo: { type: 'user', id: 'user-123' },
    metadata: {},
    signatureRequired: false,
    signatureStatus: null
  },
  {
    id: 'doc-005',
    name: 'Property Survey',
    description: 'Structural survey report for Unit A-102',
    type: 'TECHNICAL',
    status: 'ACTIVE',
    category: 'PROPERTY',
    fileUrl: '/mock-documents/property-survey.pdf',
    fileType: 'application/pdf',
    fileSize: 1024 * 1024 * 2, // 2MB
    uploadedById: 'user-125',
    uploadedByName: 'Michael Brown',
    uploadDate: new Date('2025-02-10').toISOString(),
    expiryDate: null,
    tags: ['survey', 'structural', 'report'],
    version: 1,
    relatedTo: { type: 'property', id: 'prop-1245' },
    metadata: {},
    signatureRequired: false,
    signatureStatus: null
  }
];

// Mock function to get documents
export const getMockDocuments = (filters: any = {}) => {
  // Apply any filtering based on the filters object
  let filteredDocs = [...mockDocuments];

  // Apply filters if they exist
  if (filters.relatedTo) {
    filteredDocs = filteredDocs.filter(doc => 
      doc.relatedTo.type === filters.relatedTo.type && 
      doc.relatedTo.id === filters.relatedTo.id
    );
  }

  if (filters.type) {
    filteredDocs = filteredDocs.filter(doc => doc.type === filters.type);
  }

  if (filters.status) {
    filteredDocs = filteredDocs.filter(doc => doc.status === filters.status);
  }

  // Return mock paging result
  return {
    documents: filteredDocs,
    total: filteredDocs.length,
    page: 1,
    pages: 1
  };
};

// Add more mock data functions here as needed