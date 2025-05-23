/**
 * Mock Utilities for Tests
 * 
 * This file provides utilities for creating and managing
 * consistent mock data and functions across tests.
 */

// Mock global fetch
export function mockFetch(responseData: any, status = 200, ok = true) {
  global.fetch = jest.fn().mockResolvedValue({
    json: jest.fn().mockResolvedValue(responseData),
    text: jest.fn().mockResolvedValue(JSON.stringify(responseData)),
    status,
    ok});
  
  return global.fetch;
}

// Mock fetch with error
export function mockFetchError(errorMessage = 'Network error') {
  global.fetch = jest.fn().mockRejectedValue(new Error(errorMessage));
  return global.fetch;
}

// Reset mocked fetch
export function resetFetchMock() {
  if (global.fetch && typeof (global.fetch as jest.Mock).mockReset === 'function') {
    (global.fetch as jest.Mock).mockReset();
  }
}

// Create a mock development entity
export function createMockDevelopment(overrides = {}) {
  return {
    id: 'dev-1',
    name: 'Test Development',
    description: 'A test development property',
    status: 'ACTIVE',
    location: {
      address: '123 Test Street',
      city: 'Test City',
      county: 'Test County',
      postcode: 'TE1 1ST',
      coordinates: {
        latitude: 53.349805,
        longitude: -6.26031
      }
    },
    developerInfo: {
      developerId: 'developer-1',
      companyName: 'Test Developer',
      contactEmail: 'developer@example.com',
      contactPhone: '01234567890'
    },
    images: [
      { url: '/images/test-development-1.jpg', alt: 'Test Development Image 1' },
      { url: '/images/test-development-2.jpg', alt: 'Test Development Image 2' }
    ],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    ...overrides
  };
}

// Create a mock property entity
export function createMockProperty(overrides = {}) {
  return {
    id: 'prop-1',
    developmentId: 'dev-1',
    title: 'Test Property',
    description: 'A test property listing',
    type: 'APARTMENT',
    bedrooms: 2,
    bathrooms: 1,
    livingRooms: 1,
    floorArea: 75,
    price: 250000,
    status: 'AVAILABLE',
    features: ['Parking', 'Garden', 'Central Heating'],
    images: [
      { url: '/images/test-property-1.jpg', alt: 'Test Property Image 1' },
      { url: '/images/test-property-2.jpg', alt: 'Test Property Image 2' }
    ],
    floorPlan: '/images/test-property-floorplan.jpg',
    energyRating: 'B',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    ...overrides
  };
}

// Create a mock user entity
export function createMockUser(overrides = {}) {
  return {
    id: 'user-1',
    email: 'user@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'USER',
    status: 'ACTIVE',
    phoneNumber: '01234567890',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    ...overrides
  };
}

// Create a mock document entity
export function createMockDocument(overrides = {}) {
  return {
    id: 'doc-1',
    title: 'Test Document',
    description: 'A test document',
    type: 'LEGAL',
    category: 'CONTRACT',
    status: 'ACTIVE',
    fileUrl: 'https://example.com/documents/test.pdf',
    fileType: 'application/pdf',
    fileSize: 1024,
    version: 1,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    createdById: 'user-1',
    ...overrides
  };
}

// Mock localStorage
export function mockLocalStorage() {
  const store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => {
        delete store[key];
      });
    }),
    key: jest.fn((index: number) => {
      return Object.keys(store)[index] || null;
    }),
    length: jest.fn(() => Object.keys(store).length),
    store
  };
}

// Set up localStorage mock
export function setupLocalStorageMock() {
  const mockStorage = mockLocalStorage();
  
  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
    writable: true
  });
  
  return mockStorage;
}

// Clear localStorage mock
export function clearLocalStorageMock() {
  window.localStorage.clear();
}

// Mock console methods
export function mockConsole() {
  const originalConsole = { ...console };
  
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
  console.info = jest.fn();
  
  return {
    restore: () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
    }
  };
}

// Mock window functions
export function mockWindow() {
  const originalAlert = window.alert;
  const originalConfirm = window.confirm;
  const originalPrompt = window.prompt;
  
  window.alert = jest.fn();
  window.confirm = jest.fn(() => true);
  window.prompt = jest.fn(() => null);
  
  return {
    restore: () => {
      window.alert = originalAlert;
      window.confirm = originalConfirm;
      window.prompt = originalPrompt;
    }
  };
}