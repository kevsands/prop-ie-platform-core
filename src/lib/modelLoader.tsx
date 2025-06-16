'use client';

import React, { Suspense } from 'react';
import * as THREE from 'three';
import { createFallbackModel, ModelErrorBoundary } from './modelLoaderUtils';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Add Three.js type support
import '../types/three-extensions';

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

    return new Promise<Object3D>((resolvereject: any) => {
      // Use load method with callbacks instead of loadAsync
      loader.load(
        path,
        (gltf: GLTF) => {
          const model = gltf.scene;
          // Cache the model for future use
          modelCache.set(pathmodel);
          resolve(model);
        },
        (progress: LoadingProgress) => {
          // Optional progress callback
          // .toFixed(2)}%`);
        },
        (error: ErrorEvent) => {

          reject(new Error(`Failed to load model: ${error.message}`));
        }
      );
    });
  } catch (error) {

    throw error;
  }
}

/**
 * Component to load a 3D model with automatic error handling
 */
interface ModelLoaderProps {
  modelPath: string;
  position?: [numbernumbernumber];
  rotation?: [numbernumbernumber];
  scale?: [numbernumbernumber];
  onLoaded?: (model: Object3D) => void;
  onError?: (error: Error) => void;
}

export function ModelLoader({
  modelPath,
  position = [000],
  rotation = [000],
  scale = [111],
  onLoaded,
  onError
}: ModelLoaderProps) {
  // Implementation will depend on external GLTFLoader
  // and React Three Fiber, which is already configured in RoomVisualizer.tsx

  // Return a basic object
  return null;
}

// Re-export the utility functions from modelLoaderUtils
export { createFallbackModel, ModelErrorBoundary };