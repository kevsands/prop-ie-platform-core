/**
 * Three.js Setup Utility
 * 
 * This file initializes Three.js elements for use with React Three Fiber
 * It should be imported once at the app level
 */
import * as THREE from 'three';
// Note: extend is now imported directly in jsx-three-fiber.d.ts

// Export the THREE namespace for use in components
export { THREE };

// Re-export types that might be needed
export type ThreeEvent<T> = { 
  object: THREE.Object3D; 
  distance: number; 
  point: THREE.Vector3; 
  normal: THREE.Vector3 
} & T;

// Export common Three.js types for convenience
export type {
  Mesh,
  BoxGeometry,
  MeshStandardMaterial
} from 'three';