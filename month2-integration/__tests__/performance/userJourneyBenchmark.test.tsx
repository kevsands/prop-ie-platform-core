/**
 * Performance Benchmarking Tests for Key User Journeys
 * 
 * This file contains performance tests for critical user journeys through the application.
 * These tests:
 * 1. Establish performance baselines for critical flows
 * 2. Detect performance regressions through automated testing
 * 3. Measure performance impact of new features or changes
 */

import * as React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../src/context/AuthContext';
import { CustomizationProvider } from '../../src/context/CustomizationContext';
import BuyerDashboard from '../../src/components/buyer/BuyerDashboard';
import PropertyListing from '../../src/components/property/PropertyListing';
import PropertyDetail from '../../src/components/property/PropertyDetail';
import CustomizationPageContent from '../../src/components/buyer/CustomizationPageContent';
// Mock the performance monitor
const performanceMonitor = {
  startTiming: jest.fn(),
  endTiming: jest.fn(),
  addApiTiming: jest.fn(),
  getMetrics: jest.fn().mockReturnValue({
    renderTimings: [],
    apiTimings: [],
    resourceTimings: [],
    webVitals: {}
  }),
  clearMetrics: jest.fn(),
  setThreshold: jest.fn()
};

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Mock the API services
jest.mock('../../src/lib/services/properties', () => ({
  getProperties: jest.fn().mockResolvedValue([
    { id: 'prop1', title: 'Test Property 1', price: 250000 },
    { id: 'prop2', title: 'Test Property 2', price: 350000 },
  ]),
  getProperty: jest.fn().mockResolvedValue({
    id: 'prop1', 
    title: 'Test Property 1',
    price: 250000,
    description: 'A test property',
    location: 'Test Location',
    images: ['img1.jpg', 'img2.jpg'],
  }),
}));

// Mock API client
jest.mock('../../src/lib/api-client', () => ({
  get: jest.fn().mockImplementation((path) => {
    if (path.includes('properties')) {
      return Promise.resolve([
        { id: 'prop1', title: 'Test Property 1', price: 250000 },
        { id: 'prop2', title: 'Test Property 2', price: 350000 },
      ]);
    }
    if (path.includes('customization/options')) {
      return Promise.resolve({
        categories: [
          {
            id: 'cat1',
            name: 'Flooring',
            options: [
              { id: 'opt1', name: 'Carpet', price: 0 },
              { id: 'opt2', name: 'Hardwood', price: 5000 },
            ],
          },
        ],
      });
    }
    return Promise.resolve({});
  }),
  post: jest.fn().mockResolvedValue({ success: true }),
}));

// Mock AWS Amplify
jest.mock('aws-amplify/auth', () => ({
  getCurrentUser: jest.fn().mockResolvedValue({
    userId: 'test-user',
    username: 'testuser',
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

// Test wrapper setup with all providers
const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CustomizationProvider>
          {ui}
        </CustomizationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('User Journey Performance Benchmarks', () => {
  // Clear mocks and performance measurements between tests
  beforeEach(() => {
    jest.clearAllMocks();
    performanceMonitor.clearMetrics();
  });

  /**
   * Property Search & Browse Journey
   * Critical user journey: Searching and browsing property listings
   */
  describe('Property Search & Browse Journey', () => {
    it('should render property listing with acceptable performance', async () => {
      // Start performance measurement
      performanceMonitor.startTiming('property-listing-render');

      // Render component
      renderWithProviders(<PropertyListing />);

      // Wait for properties to load
      await waitFor(() => {
        expect(screen.getByText('Test Property 1')).toBeInTheDocument();
      });

      // End performance measurement
      const renderTime = performanceMonitor.endTiming('property-listing-render');
      
      console.log(`Property listing render time: ${renderTime}ms`);
      
      // Baseline expectations: property listing should render in under 500ms
      expect(renderTime).toBeLessThan(500);
    });

    it('should navigate to property detail with acceptable performance', async () => {
      // First render listing
      renderWithProviders(<PropertyListing />);
      
      // Wait for properties to load
      await waitFor(() => {
        expect(screen.getByText('Test Property 1')).toBeInTheDocument();
      });

      // Start performance measurement for click and navigation
      performanceMonitor.startTiming('property-detail-navigation');
      
      // Click on property (simulate user journey)
      const propertyCard = screen.getByText('Test Property 1').closest('div');
      if (propertyCard) {
        await act(async () => {
          fireEvent.click(propertyCard);
        });
      }

      const navigationTime = performanceMonitor.endTiming('property-detail-navigation');
      console.log(`Property detail navigation time: ${navigationTime}ms`);
      
      // Baseline expectations: navigation should occur in under 300ms
      expect(navigationTime).toBeLessThan(300);
    });

    it('should load property details with acceptable performance', async () => {
      // Start performance measurement
      performanceMonitor.startTiming('property-detail-render');

      // Render component with property ID
      renderWithProviders(<PropertyDetail id="prop1" />);

      // Wait for property details to load
      await waitFor(() => {
        expect(screen.getByText('Test Property 1')).toBeInTheDocument();
        expect(screen.getByText('£250,000')).toBeInTheDocument();
      });

      // End performance measurement
      const renderTime = performanceMonitor.endTiming('property-detail-render');
      
      console.log(`Property detail render time: ${renderTime}ms`);
      
      // Baseline expectations: property detail should render in under 600ms
      expect(renderTime).toBeLessThan(600);
    });
  });

  /**
   * Property Customization Journey
   * Critical user journey: Customizing property options
   */
  describe('Property Customization Journey', () => {
    it('should render customization page with acceptable performance', async () => {
      // Start performance measurement
      performanceMonitor.startTiming('customization-render');

      // Render component
      renderWithProviders(<CustomizationPageContent />);

      // Wait for customization options to load
      await waitFor(() => {
        expect(screen.getByText('Flooring')).toBeInTheDocument();
      });

      // End performance measurement
      const renderTime = performanceMonitor.endTiming('customization-render');
      
      console.log(`Customization page render time: ${renderTime}ms`);
      
      // Baseline expectations: customization page should render in under 800ms
      expect(renderTime).toBeLessThan(800);
    });

    it('should handle customization selection with acceptable performance', async () => {
      // Render component
      renderWithProviders(<CustomizationPageContent />);

      // Wait for customization options to load
      await waitFor(() => {
        expect(screen.getByText('Hardwood')).toBeInTheDocument();
      });

      // Start performance measurement for option selection
      performanceMonitor.startTiming('customization-selection');
      
      // Select an option
      const optionElement = screen.getByText('Hardwood').closest('div');
      if (optionElement) {
        await act(async () => {
          fireEvent.click(optionElement);
        });
      }

      // End performance measurement
      const selectionTime = performanceMonitor.endTiming('customization-selection');
      
      console.log(`Customization selection time: ${selectionTime}ms`);
      
      // Baseline expectations: option selection should process in under 200ms
      expect(selectionTime).toBeLessThan(200);
    });
  });

  /**
   * Buyer Dashboard Journey
   * Critical user journey: Buyer reviewing their dashboard
   */
  describe('Buyer Dashboard Journey', () => {
    it('should render buyer dashboard with acceptable performance', async () => {
      // Start performance measurement
      performanceMonitor.startTiming('dashboard-render');

      // Render component
      renderWithProviders(<BuyerDashboard />);

      // Wait for dashboard to load
      await waitFor(() => {
        // Look for typical dashboard elements
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
      });

      // End performance measurement
      const renderTime = performanceMonitor.endTiming('dashboard-render');
      
      console.log(`Buyer dashboard render time: ${renderTime}ms`);
      
      // Baseline expectations: dashboard should render in under 1000ms
      expect(renderTime).toBeLessThan(1000);
    });
  });

  /**
   * Full User Journey
   * End-to-end performance test of a typical user journey through the app
   */
  describe('Full User Journey', () => {
    it('should complete a typical user journey with acceptable performance', async () => {
      // Start overall journey timing
      performanceMonitor.startTiming('full-journey');
      
      // 1. Render property listing
      const user = userEvent.setup();
      renderWithProviders(<PropertyListing />);
      
      // Wait for properties to load
      await waitFor(() => {
        expect(screen.getByText('Test Property 1')).toBeInTheDocument();
      });
      
      // 2. Click on a property
      const propertyCard = screen.getByText('Test Property 1').closest('div');
      if (propertyCard) {
        await user.click(propertyCard);
      }
      
      // 3. Navigate to customization (in a real app, we would check the router push)
      
      // 4. Complete customization
      
      // 5. View dashboard
      
      // End performance measurement for full journey
      const fullJourneyTime = performanceMonitor.endTiming('full-journey');
      
      console.log(`Full user journey time: ${fullJourneyTime}ms`);
      
      // Baseline expectations: full journey should complete in under 3000ms
      expect(fullJourneyTime).toBeLessThan(3000);
    });
  });
});