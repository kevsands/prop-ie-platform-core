/**
 * Jest setup file for tests that need a DOM environment
 * This provides minimal mocking of DOM APIs for tests running in node
 */

// Mock TextEncoder and TextDecoder for JSDOM
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Check if window is undefined (node environment)
if (typeof window === 'undefined') {
  // Mock document
  global.document = {
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(() => []),
    getElementById: jest.fn(),
    createElement: jest.fn(() => ({
      setAttribute: jest.fn(),
      style: {},
      appendChild: jest.fn(),
    })),
    createTextNode: jest.fn(),
    body: {
      appendChild: jest.fn(),
      removeChild: jest.fn(),
      contains: jest.fn(() => false),
    },
    head: {
      appendChild: jest.fn(),
    },
  };

  // Mock window
  global.window = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    location: {
      href: 'https://example.com',
      pathname: '/',
      search: '',
      origin: 'https://example.com',
    },
    matchMedia: jest.fn(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
    requestAnimationFrame: jest.fn(callback => setTimeout(callback, 0)),
    cancelAnimationFrame: jest.fn(),
    getComputedStyle: jest.fn(() => ({
      getPropertyValue: jest.fn(() => ''),
    })),
    URL: {
      createObjectURL: jest.fn(),
      revokeObjectURL: jest.fn(),
    },
  };

  // Mock HTMLElement
  global.HTMLElement = class HTMLElement {
    constructor() {
      this.style = {};
      this.children = [];
    }
    appendChild() {}
    removeChild() {}
  };

  // Mock DOM APIs needed for testing
  global.MutationObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    disconnect() {}
  };

  global.ResizeObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Mock react-dom module
  jest.mock('react-dom', () => ({
    render: jest.fn(),
    unmountComponentAtNode: jest.fn(),
  }));
}

// Setup for module path aliasing in Jest tests
// This is needed to make @/* imports work correctly in tests
jest.mock('@/lib/db/repositories', () => {
  // First try to require the actual module implementation
  try {
    const actual = jest.requireActual('../src/lib/db/repositories/index.ts');
    return {
      ...actual,
      __esModule: true,
    };
  } catch (e) {
    // If that fails, provide mock implementations
    return {
      __esModule: true,
      userRepository: {
        findById: jest.fn(),
        findByEmail: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      },
      developmentRepository: {
        findById: jest.fn(),
        findByDeveloperId: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      },
      unitRepository: {
        findById: jest.fn(),
        findByDevelopment: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      },
      documentRepository: {
        findById: jest.fn(),
        findByUser: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      },
      financialRepository: {
        findById: jest.fn(),
        findByDevelopmentId: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      }
    };
  }
}, { virtual: true });

jest.mock('@/types/core/user', () => {
  try {
    const actual = jest.requireActual('../src/types/core/user.ts');
    return {
      ...actual,
      __esModule: true
    };
  } catch (e) {
    // Provide fallback mock if module can't be loaded
    return {
      __esModule: true,
      UserRole: {
        DEVELOPER: 'developer',
        BUYER: 'buyer',
        INVESTOR: 'investor',
        ADMIN: 'admin'
      },
      UserStatus: {
        ACTIVE: 'active',
        PENDING: 'pending',
        SUSPENDED: 'suspended',
        INACTIVE: 'inactive'
      }
    };
  }
}, { virtual: true });

// Mock fetch for API calls
if (!global.fetch) {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    status: 200,
    ok: true
  }));
}

// Import and use our comprehensive React Query mocks
jest.mock('@tanstack/react-query', () => {
  // Using require here to avoid import issues during test setup
  const { reactQueryMocks } = require('../src/tests/mocks/react-query-mock');
  return reactQueryMocks;
});
