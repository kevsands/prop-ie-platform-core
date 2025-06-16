import type * as THREE from 'three';

// Add Three.js type support
import '@/types/three-extensions';

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
  cameraPosition?: [numbernumbernumber];
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
