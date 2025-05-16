/**
 * Type definitions for Three.js integration
 * This file creates proper type definitions to work with Three.js in TypeScript
 */

// Import necessary modules from Three.js
// Core
import { Object3D } from 'three/src/core/Object3D';
import { Mesh } from 'three/src/objects/Mesh';
import { Group } from 'three/src/objects/Group';
import { Scene } from 'three/src/scenes/Scene';
import { Color } from 'three/src/math/Color';
import { BufferGeometry } from 'three/src/core/BufferGeometry';
import { BufferAttribute } from 'three/src/core/BufferAttribute';
import { Material } from 'three/src/materials/Material';
import { Texture } from 'three/src/textures/Texture';

// Math
import { Vector3 } from 'three/src/math/Vector3';
import { Matrix4 } from 'three/src/math/Matrix4';
import { Euler } from 'three/src/math/Euler';
import { Quaternion } from 'three/src/math/Quaternion';
import { Box3 } from 'three/src/math/Box3';

// Camera
import { Camera } from 'three/src/cameras/Camera';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera';

// Renderers
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';
import { Clock } from 'three/src/core/Clock';

// Animations
import { AnimationClip } from 'three/src/animation/AnimationClip';
import { AnimationAction } from 'three/src/animation/AnimationAction';
import { AnimationMixer } from 'three/src/animation/AnimationMixer';

// Geometries
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
import { BoxGeometry } from 'three/src/geometries/BoxGeometry';
import { SphereGeometry } from 'three/src/geometries/SphereGeometry';
import { CylinderGeometry } from 'three/src/geometries/CylinderGeometry';

// Materials
import { MeshBasicMaterial, MeshBasicMaterialParameters } from 'three/src/materials/MeshBasicMaterial';
import { MeshStandardMaterial, MeshStandardMaterialParameters } from 'three/src/materials/MeshStandardMaterial';
import { MeshPhongMaterial, MeshPhongMaterialParameters } from 'three/src/materials/MeshPhongMaterial';

// Lights
import { AmbientLight } from 'three/src/lights/AmbientLight';
import { DirectionalLight } from 'three/src/lights/DirectionalLight';
import { PointLight } from 'three/src/lights/PointLight';
import { SpotLight } from 'three/src/lights/SpotLight';

// Loaders
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { LoadingManager } from 'three/src/loaders/LoadingManager';

// Helpers
import { GridHelper } from 'three/src/helpers/GridHelper';
import { AxesHelper } from 'three/src/helpers/AxesHelper';

// Legacy import for compatibility
import * as THREE from 'three';

// Import GLTF Loader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Re-export all types
export type {
  Vector3, Matrix4, Euler, Quaternion, Box3, Scene,
  WebGLRenderer, Clock, Camera, PerspectiveCamera, OrthographicCamera,
  AnimationMixer, AnimationClip, AnimationAction, Object3D, Group, Mesh,
  Material, Texture, Color, BufferGeometry, BufferAttribute,
  PlaneGeometry, BoxGeometry, SphereGeometry, CylinderGeometry,
  MeshBasicMaterial, MeshStandardMaterial, MeshPhongMaterial,
  MeshBasicMaterialParameters, MeshStandardMaterialParameters, MeshPhongMaterialParameters,
  AmbientLight, DirectionalLight, PointLight, SpotLight,
  TextureLoader, LoadingManager, GridHelper, AxesHelper
};

// ColorRepresentation is a type, but not an exported interface, so define it here
export type ColorRepresentation = THREE.ColorRepresentation;

// HemisphereLight is missing but used in types, so define a compatibility alias
export type HemisphereLight = any; // Fallback type

// Factory functions for geometries
export function createPlaneGeometry(width: number, height: number, widthSegments?: number, heightSegments?: number): PlaneGeometry {
  return new PlaneGeometry(width, height, widthSegments, heightSegments);
}

export function createBoxGeometry(width?: number, height?: number, depth?: number, widthSegments?: number, heightSegments?: number, depthSegments?: number): BoxGeometry {
  return new BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
}

export function createSphereGeometry(radius?: number, widthSegments?: number, heightSegments?: number, phiStart?: number, phiLength?: number, thetaStart?: number, thetaLength?: number): SphereGeometry {
  return new SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
}

export function createCylinderGeometry(
  radiusTop?: number, 
  radiusBottom?: number, 
  height?: number, 
  radialSegments?: number, 
  heightSegments?: number, 
  openEnded?: boolean, 
  thetaStart?: number, 
  thetaLength?: number
): CylinderGeometry {
  return new CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
}

// Factory functions for materials
export function createMeshBasicMaterial(parameters?: MeshBasicMaterialParameters): MeshBasicMaterial {
  return new MeshBasicMaterial(parameters);
}

export function createMeshStandardMaterial(parameters?: MeshStandardMaterialParameters): MeshStandardMaterial {
  return new MeshStandardMaterial(parameters);
}

export function createMeshPhongMaterial(parameters?: MeshPhongMaterialParameters): MeshPhongMaterial {
  return new MeshPhongMaterial(parameters);
}

// Factory functions for lights
export function createAmbientLight(color?: ColorRepresentation, intensity?: number): AmbientLight {
  return new AmbientLight(color, intensity);
}

export function createDirectionalLight(color?: ColorRepresentation, intensity?: number): DirectionalLight {
  return new DirectionalLight(color, intensity);
}

// Factory functions for objects
export function createGroup(): Group {
  return new Group();
}

export function createMesh(geometry?: BufferGeometry, material?: Material | Material[]): Mesh {
  return new Mesh(geometry, material);
}

// Factory functions for loaders
export function createTextureLoader(): TextureLoader {
  return new TextureLoader();
}

// Helper functions
export function traverseMaterials(object: Object3D, callback: (material: Material) => void): void {
  if (!object) return;
  
  object.traverse((child: any) => {
    if (child instanceof Mesh) {
      const mesh = child as Mesh;
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach(callback);
      } else if (mesh.material) {
        callback(mesh.material);
      }
    }
  });
}

/**
 * Safely dispose of a Three.js object and all its children
 */
export function disposeObject3D(object: Object3D | null | undefined): void {
  if (!object) return;
  
  // First, remove it from its parent
  if (object.parent) {
    object.parent.remove(object);
  }
  
  // Then dispose of all geometries and materials
  object.traverse((child: Object3D) => {
    // Handle meshes
    if (child instanceof Mesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      
      if (Array.isArray(child.material)) {
        child.material.forEach((material: Material) => {
          disposeMaterial(material);
        });
      } else if (child.material) {
        disposeMaterial(child.material);
      }
    }
  });
}

/**
 * Dispose of a material and all its textures
 */
function disposeMaterial(material: Material): void {
  if (!material) return;
  
  // Dispose textures
  Object.keys(material).forEach(prop => {
    if ((material as any)[prop] instanceof Texture) {
      const texture = (material as any)[prop] as Texture;
      texture.dispose();
    }
  });
  
  // Dispose material
  material.dispose();
}

/**
 * Common model loader types
 */
export interface ModelOptions {
  scale?: number | [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  visible?: boolean;
}

export type ModelLoadResult = {
  scene: Object3D;
  animations: AnimationClip[];
  originalData: GLTF;
  mixer?: AnimationMixer;
};

export enum RoomType {
  LivingRoom = 'livingRoom',
  Kitchen = 'kitchen',
  Bedroom = 'bedroom',
  Bathroom = 'bathroom',
  Office = 'office',
  Generic = 'generic'
}