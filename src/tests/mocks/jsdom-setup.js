/**
 * JSDOM Setup for Tests
 * 
 * This file configures the JSDOM testing environment with necessary browser globals
 * and polyfills required for comprehensive testing of React components.
 */

// Set up TextEncoder and TextDecoder for JSDOM
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Performance API methods that might be missing in JSDOM environment
if (typeof window !== 'undefined') {
  // Mock performance.now if not already defined
  if (!window.performance || typeof window.performance.now !== 'function') {
    Object.defineProperty(window, 'performance', {
      value: {
        ...(window.performance || {}),
        now: () => Date.now(),
      },
      writable: true,
      configurable: true
    });
  }

  // Setup requestAnimationFrame and cancelAnimationFrame if not defined
  if (typeof window.requestAnimationFrame !== 'function') {
    window.requestAnimationFrame = callback => setTimeout(callback, 0);
  }

  if (typeof window.cancelAnimationFrame !== 'function') {
    window.cancelAnimationFrame = id => clearTimeout(id);
  }

  // Mock ResizeObserver if not available
  if (typeof window.ResizeObserver === 'undefined') {
    window.ResizeObserver = class MockResizeObserver {
      constructor(callback) {
        this.callback = callback;
        this.observables = new Set();
      }
      
      observe(element) {
        this.observables.add(element);
      }
      
      unobserve(element) {
        this.observables.delete(element);
      }
      
      disconnect() {
        this.observables.clear();
      }
    };
  }

  // Mock IntersectionObserver if not available
  if (typeof window.IntersectionObserver === 'undefined') {
    window.IntersectionObserver = class MockIntersectionObserver {
      constructor(callback) {
        this.callback = callback;
        this.observables = new Set();
      }
      
      observe(element) {
        this.observables.add(element);
      }
      
      unobserve(element) {
        this.observables.delete(element);
      }
      
      disconnect() {
        this.observables.clear();
      }
    };
  }

  // Mock window.matchMedia if not available
  if (!window.matchMedia) {
    window.matchMedia = query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }
}