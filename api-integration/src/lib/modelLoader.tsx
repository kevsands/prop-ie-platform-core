'use client';

import React, { Suspense } from 'react';
import { Object3D } from 'three';
import { createFallbackModel, ModelErrorBoundary } from './modelLoaderUtils';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Type definitions for the GLTFLoader progress and error callbacks
interface LoadingProgress {
  loaded: number;
  total: number;
  itemStart?: (url: string) => void;
  itemEnd?: (url: string) => void;
  itemError?: (url: string) => void;
}

// Model caching
const modelCache = new Map<string, Object3D>();

/**
 * Loads a 3D model asynchronously and provides caching
 */
export async function loadModel(path: string): Promise<Object3D> {
  // Check cache first
  if (modelCache.has(path)) {
    return modelCache.get(path)!;
  }
  
  try {
    // Import required loaders dynamically
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const loader = new GLTFLoader();
    
    return new Promise<Object3D>((resolve, reject) => {
      // Use load method with callbacks instead of loadAsync
      loader.load(
        path,
        (gltf: GLTF) => {
          const model = gltf.scene;
          // Cache the model for future use
          modelCache.set(path, model);
          resolve(model);
        },
        (progress: LoadingProgress) => {
          // Optional progress callback
          // console.log(`Loading: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
        },
        (error: ErrorEvent) => {
          console.error(`Error loading model from ${path}:`, error);
          reject(new Error(`Failed to load model: ${error.message}`));
        }
      );
    });
  } catch (error) {
    console.error(`Failed to load model ${path}:`, error);
    throw error;
  }
}

/**
 * Component to load a 3D model with automatic error handling
 */
interface ModelLoaderProps {
  modelPath: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  onLoaded?: (model: Object3D) => void;
  onError?: (error: Error) => void;
}

export function ModelLoader({
  modelPath,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  onLoaded,
  onError
}: ModelLoaderProps) {
  // Implementation will depend on external GLTFLoader
  // and React Three Fiber, which is already configured in RoomVisualizer.tsx
  console.warn('ModelLoader is a stub implementation and relies on Three.js loading in RoomVisualizer.tsx');
  
  // Return a basic object
  return null;
}

// Re-export the utility functions from modelLoaderUtils
export { createFallbackModel, ModelErrorBoundary };