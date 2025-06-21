// Global type definitions to fix three.js and React Three Fiber issues
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

declare module 'three' {
  // Add missing types for Three.js
  export type Material = THREE.Material;
  export type Group = THREE.Group;
  export type Mesh = THREE.Mesh;
  export type Object3D = THREE.Object3D;
  export type Texture = THREE.Texture;
  export type Color = THREE.Color;
  export type Matrix4 = THREE.Matrix4;
  export type Euler = THREE.Euler;
  export type Quaternion = THREE.Quaternion;
  export type Box3 = THREE.Box3;
  export type Scene = THREE.Scene;
  export type WebGLRenderer = THREE.WebGLRenderer;
  export type Clock = THREE.Clock;
  export type Camera = THREE.Camera;
  export type PerspectiveCamera = THREE.PerspectiveCamera;
  export type OrthographicCamera = THREE.OrthographicCamera;
  export type AnimationMixer = THREE.AnimationMixer;
  export type AnimationClip = THREE.AnimationClip;
  export type AnimationAction = THREE.AnimationAction;
  export type BufferAttribute = THREE.BufferAttribute;
  export type PlaneGeometry = THREE.PlaneGeometry;
  export type BoxGeometry = THREE.BoxGeometry;
  export type SphereGeometry = THREE.SphereGeometry;
  export type CylinderGeometry = THREE.CylinderGeometry;
  export type MeshBasicMaterial = THREE.MeshBasicMaterial;
  export type MeshStandardMaterial = THREE.MeshStandardMaterial;
  export type MeshPhongMaterial = THREE.MeshPhongMaterial;
  export type MeshBasicMaterialParameters = THREE.MeshBasicMaterialParameters;
  export type MeshStandardMaterialParameters = THREE.MeshStandardMaterialParameters;
  export type MeshPhongMaterialParameters = THREE.MeshPhongMaterialParameters;
  export type AmbientLight = THREE.AmbientLight;
  export type DirectionalLight = THREE.DirectionalLight;
  export type PointLight = THREE.PointLight;
  export type SpotLight = THREE.SpotLight;
  export type TextureLoader = THREE.TextureLoader;
  export type LoadingManager = THREE.LoadingManager;
  export type ColorRepresentation = THREE.ColorRepresentation;
}

// Fix React JSX namespace for Three.js elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      primitive: any;
      ambientLight: any;
      directionalLight: any;
      mesh: any;
      bufferGeometry: any;
      lineBasicMaterial: any;
      meshStandardMaterial: any;
      pointLight: any;
      spotLight: any;
    }
  }
}

// Define augmentations for @react-three/fiber
declare module '@react-three/fiber' {
  export const useFrame: any;
  export const useThree: any;
  export const Canvas: React.FC<any>;
}

// Define augmentations for @react-three/drei
declare module '@react-three/drei' {
  export const Environment: React.FC<any>;
  export const OrbitControls: React.FC<any>;
  export const useGLTF: (url: string) => GLTF & {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.Material>;
  };
  export const useTexture: (urls: string | string[]) => THREE.Texture | THREE.Texture[];
  export const Stats: React.FC;
  export const useProgress: () => { progress: number; active: boolean };
  export const Html: React.FC<any>;
  export const PerspectiveCamera: React.FC<any>;
}

// Add missing types for framer-motion
declare module 'framer-motion' {
  export interface HTMLMotionProps<T extends HTMLElement> {
    className?: string;
  }
}

// Add declarations for missing modules
declare module '@/lib/modelLoader' {
  export const createFallbackModel: any;
  export const ModelErrorBoundary: React.FC<any>;
}