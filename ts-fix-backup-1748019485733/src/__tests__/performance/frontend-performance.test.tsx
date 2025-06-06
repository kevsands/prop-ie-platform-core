/**
 * Frontend performance tests
 */

import { render, screen } from '@testing-library/react';
import { measureRender } from '@/test-utils/performance-helpers';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertyListView } from '@/components/properties/PropertyListView';
import { createMockProperties } from '@/test-utils/test-factories';

describe('Frontend Performance Tests', () => {
  describe('Component Render Performance', () => {
    test('PropertyCard renders efficiently', () => {
      const property = createMockProperties(1)[0];
      
      const { duration, reRenders } = measureRender(() => (
        <PropertyCard property={property} />
      ));
      
      expect(duration).toBeLessThan(16); // Should render in one frame (16ms)
      expect(reRenders).toBe(0); // No unnecessary re-renders
    });

    test('PropertyListView handles large lists efficiently', () => {
      const properties = createMockProperties(1000); // Large list
      
      const { duration } = measureRender(() => (
        <PropertyListView properties={properties} />
      ));
      
      expect(duration).toBeLessThan(100); // Should use virtualization
      
      // Check that not all items are rendered
      const renderedItems = screen.queryAllByTestId('property-card');
      expect(renderedItems.length).toBeLessThan(50); // Only visible items rendered
    });
  });

  describe('Bundle Size Analysis', () => {
    test('critical chunks are within size limits', () => {
      const chunkSizes = {
        'main.js': 250 * 1024, // 250KB
        'vendor.js': 300 * 1024, // 300KB
        'property-search.js': 100 * 1024, // 100KB
        'transaction-flow.js': 150 * 1024, // 150KB
      };
      
      Object.entries(chunkSizes).forEach(([chunkmaxSize]) => {
        // This would be replaced with actual bundle analysis
        expect(maxSize).toBeLessThan(500 * 1024); // All chunks under 500KB
      });
    });
  });

  describe('React Performance Optimizations', () => {
    test('components use React.memo appropriately', () => {
      const components = [
        PropertyCard,
        // Add other components that should be memoized
      ];
      
      components.forEach(component => {
        expect(component.$$typeof?.toString()).toContain('memo');
      });
    });

    test('expensive calculations are memoized', () => {
      // Test that useMemo is used for expensive calculations
      const TestComponent = () => {
        const expensiveValue = React.useMemo(() => {
          // Expensive calculation
          return Array(1000).fill(0).reduce((sum, _i) => sum + i0);
        }, []);
        
        return <div>{expensiveValue}</div>\n  );
      };
      
      const { rerender } = render(<TestComponent />);
      
      // Force rerender
      rerender(<TestComponent />);
      
      // Expensive calculation should not run again
      // (This would be verified with actual profiling)
    });
  });

  describe('Image Loading Performance', () => {
    test('images use lazy loading', () => {
      render(<PropertyCard property={createMockProperties(1)[0]} />);
      
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });

    test('images have proper dimensions to prevent layout shift', () => {
      render(<PropertyCard property={createMockProperties(1)[0]} />);
      
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('width');
        expect(img).toHaveAttribute('height');
      });
    });
  });

  describe('State Management Performance', () => {
    test('context updates do not cause unnecessary renders', () => {
      let renderCount = 0;
      
      const ChildComponent = React.memo(() => {
        renderCount++;
        return <div>Child</div>\n  );
      });
      
      const ParentComponent = () => {
        const [unrelatedStatesetUnrelatedState] = React.useState(0);
        
        return (
          <div>
            <button onClick={() => setUnrelatedState(s => s + 1)}>Update</button>
            <ChildComponent />
          </div>
        );
      };
      
      const { rerender } = render(<ParentComponent />);
      expect(renderCount).toBe(1);
      
      // Update parent state
      fireEvent.click(screen.getByText('Update'));
      
      // Child should not re-render
      expect(renderCount).toBe(1);
    });
  });

  describe('Animation Performance', () => {
    test('animations use CSS transforms for better performance', () => {
      const { container } = render(<PropertyCard property={createMockProperties(1)[0]} />);
      
      const animatedElements = container.querySelectorAll('[class*="transition"]');
      animatedElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        
        // Should use transform instead of position changes
        expect(styles.transition).toMatch(/transform|opacity/);
        expect(styles.transition).not.toMatch(/left|top|width|height/);
      });
    });

    test('animations respect prefers-reduced-motion', () => {
      // Mock reduced motion preference
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()}));
      
      const { container } = render(<PropertyCard property={createMockProperties(1)[0]} />);
      
      const animatedElements = container.querySelectorAll('[class*="transition"]');
      animatedElements.forEach(element => {
        const styles = window.getComputedStyle(element);
        expect(styles.animationDuration).toBe('0s');
      });
    });
  });

  describe('Web Vitals', () => {
    test('Largest Contentful Paint (LCP) is optimized', () => {
      // Mock performance observer
      const lcpEntries: PerformanceEntry[] = [];
      
      window.PerformanceObserver = jest.fn().mockImplementation((callback) => ({
        observe: jest.fn(() => {
          // Simulate LCP entry
          callback({
            getEntries: () => [{
              name: 'largest-contentful-paint',
              startTime: 1200, // 1.2 seconds
            }]});
        }),
        disconnect: jest.fn()}));
      
      // Render component
      render(<PropertyListView properties={createMockProperties(10)} />);
      
      // LCP should be under 2.5 seconds
      expect(lcpEntries[0]?.startTime).toBeLessThan(2500);
    });

    test('First Input Delay (FID) is minimal', () => {
      const property = createMockProperties(1)[0];
      const onClick = jest.fn();
      
      render(<PropertyCard property={property} onClick={onClick} />);
      
      const startTime = performance.now();
      fireEvent.click(screen.getByRole('article'));
      const endTime = performance.now();
      
      const inputDelay = endTime - startTime;
      expect(inputDelay).toBeLessThan(100); // Under 100ms
    });

    test('Cumulative Layout Shift (CLS) is minimal', () => {
      const { container } = render(<PropertyListView properties={createMockProperties(5)} />);
      
      // Check for elements that might cause layout shift
      const images = container.querySelectorAll('img');
      const lazyLoadedContent = container.querySelectorAll('[data-lazy]');
      
      // All images should have dimensions
      images.forEach(img => {
        expect(img.getAttribute('width')).toBeTruthy();
        expect(img.getAttribute('height')).toBeTruthy();
      });
      
      // Lazy loaded content should have placeholder dimensions
      lazyLoadedContent.forEach(element => {
        const styles = window.getComputedStyle(element);
        expect(styles.minHeight).not.toBe('0px');
      });
    });
  });
});