#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
  'src/lib/three-types.ts',
  'src/lib/three-setup.ts',
  'src/components/3d/RoomVisualizer.old.tsx',
  'src/utils/modelLoaderUtils.tsx'
];

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Fix incorrect import syntax
    content = content.replace(/import\s*{\s*THREE\.(\w+)\s*}\s*from/g, 'import { $1 } from');
    
    // Fix specific three-types.ts issues
    if (file.includes('three-types.ts')) {
      // Replace the entire file with a proper type definition
      content = `import type * as THREE from 'three';

// Re-export commonly used Three.js types
export type {
  Scene,
  Camera,
  PerspectiveCamera,
  OrthographicCamera,
  Mesh,
  Group,
  Object3D,
  Material,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Texture,
  Vector3,
  Quaternion,
  Color,
  Box3,
  BoxGeometry,
  BufferGeometry,
  BufferAttribute,
  Light,
  AmbientLight,
  DirectionalLight,
  PointLight,
  Loader
} from 'three';

// Custom types for our application
export interface ThreeEnvironment {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
}

export interface ModelData {
  url: string;
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: THREE.Vector3;
}

export interface ViewerProps {
  modelUrl: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  cameraPosition?: [number, number, number];
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export interface SceneConfig {
  backgroundColor?: string | number;
  ambientLightIntensity?: number;
  directionalLightIntensity?: number;
  cameraFov?: number;
  cameraNear?: number;
  cameraFar?: number;
}
`;
    } else if (file.includes('three-setup.ts')) {
      // Fix three-setup.ts
      content = content.replace(/THREE\.THREE\./g, 'THREE.');
      content = content.replace(/new\s+THREE\.THREE\./g, 'new THREE.');
    } else if (file.includes('RoomVisualizer')) {
      // Fix component files
      content = content.replace(/THREE\.THREE\./g, 'THREE.');
      content = content.replace(/:\s*THREE\.(\w+),/g, ': THREE.$1,');
    } else if (file.includes('modelLoaderUtils')) {
      // Fix model loader utils
      content = content.replace(/new\s+THREE\.THREE\./g, 'new THREE.');
      content = content.replace(/THREE\.THREE\./g, 'THREE.');
    }
    
    fs.writeFileSync(fullPath, content);
    console.log(`Fixed: ${file}`);
  }
});