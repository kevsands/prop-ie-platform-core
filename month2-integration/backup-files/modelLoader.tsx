'use client';

import React, { Suspense } from 'react';
import * as THREE from 'three';
import { createFallbackModel, ModelErrorBoundary } from './modelLoaderUtils';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useGLTF } from '@react-three/drei';

// Model caching
const modelCache = new Map<string, THREE.Object3D>();

/**
 * Loads a 3D model asynchronously and provides caching
 */
export async function loadModel(path: string): Promise<THREE.Object3D> {
  // Check cache first
  if (modelCache.has(path)) {
    return modelCache.get(path)!;
  }
  
  try {
    const loader = new GLTFLoader();
    
    // Use Promise-based loading pattern
    const gltf = await new Promise<GLTF>((resolve, reject) => {
      loader.load(
        path,
        (gltf: GLTF) => resolve(gltf),
        (progress: { loaded: number; total: number }) => {
          // Optional progress callback
          const percentComplete = (progress.loaded / progress.total) * 100;
          console.log(`Loading model: ${percentComplete.toFixed(2)}% complete`);
        },
        (error: Error) => reject(error)
      );
    });
    
    const model = gltf.scene;
    // Cache the model for future use
    modelCache.set(path, model);
    return model;
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
  onLoaded?: (model: THREE.Object3D) => void;
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
  const { scene } = useGLTF(modelPath);
  
  React.useEffect(() => {
    if (onLoaded) {
      onLoaded(scene);
    }
  }, [scene, onLoaded]);
  
  return (
    <ModelErrorBoundary roomType="default">
      <primitive 
        object={scene} 
        position={position} 
        rotation={rotation} 
        scale={scale} 
      />
    </ModelErrorBoundary>
  );
}

// Re-export the utility functions from modelLoaderUtils
export { createFallbackModel, ModelErrorBoundary };