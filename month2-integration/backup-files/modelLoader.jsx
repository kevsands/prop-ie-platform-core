'use client';
import { createFallbackModel, ModelErrorBoundary } from './modelLoaderUtils';
// Model caching
const modelCache = new Map();
/**
 * Loads a 3D model asynchronously and provides caching
 */
export async function loadModel(path) {
    // Check cache first
    if (modelCache.has(path)) {
        return modelCache.get(path);
    }
    try {
        // Import required loaders dynamically
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        const loader = new GLTFLoader();
        return new Promise((resolve, reject) => {
            loader.load(path, (gltf) => {
                const model = gltf.scene;
                // Cache the model for future use
                modelCache.set(path, model);
                resolve(model);
            }, (progress) => {
                // Optional progress callback
                console.log(`Loading model: ${Math.round(progress.loaded / progress.total * 100)}%`);
            }, (error) => {
                console.error(`Error loading model from ${path}:`, error);
                reject(error);
            });
        });
    }
    catch (error) {
        console.error(`Failed to load model ${path}:`, error);
        throw error;
    }
}
export function ModelLoader({ modelPath, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], onLoaded, onError }) {
    // Implementation will depend on external GLTFLoader
    // and React Three Fiber, which is already configured in RoomVisualizer.tsx
    console.warn('ModelLoader is a stub implementation and relies on Three.js loading in RoomVisualizer.tsx');
    // Return a basic object
    return null;
}
// Re-export the utility functions from modelLoaderUtils
export { createFallbackModel, ModelErrorBoundary };
