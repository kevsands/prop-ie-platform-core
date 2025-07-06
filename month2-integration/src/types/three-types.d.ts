/// <reference types="three" />

// Ensure Three.js types are properly available
declare module 'three' {
  namespace THREE {
    // Re-export classes to ensure they're available
  }
}

// Declare global namespace merge
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      primitive: any;
    }
  }
}