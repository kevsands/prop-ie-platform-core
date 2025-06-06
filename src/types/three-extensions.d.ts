// src/types/three-extensions.d.ts
import * as THREE from 'three';
import { JSX } from 'react';

// The THREE.Vector3 interfaces are defined inline to avoid module augmentation issues
// with Next.js and TypeScript

// Add missing THREE class declarations for TypeScript
declare module 'three' {
  export class BoxGeometry extends THREE.BufferGeometry {
    constructor(
      width?: number, 
      height?: number, 
      depth?: number, 
      widthSegments?: number, 
      heightSegments?: number, 
      depthSegments?: number
    );
  }
  
  export class MeshBasicMaterial extends THREE.Material {
    constructor(parameters?: THREE.MeshBasicMaterialParameters);
  }
  
  export class Mesh<
    TGeometry extends THREE.BufferGeometry = THREE.BufferGeometry,
    TMaterial extends THREE.Material | THREE.Material[] = THREE.Material | THREE.Material[]
  > extends THREE.Object3D {
    constructor(geometry?: TGeometry, material?: TMaterial);
    geometry: TGeometry;
    material: TMaterial;
  }
  
  export class Group extends THREE.Object3D {
    constructor();
  }
}

// Extend JSX.IntrinsicElements to include Three.js elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      primitive: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          object: Object3D;
          position?: [number, numbernumber];
          rotation?: [number, numbernumber];
          scale?: [number, numbernumber];
        },
        HTMLElement
      >\n  );
      ambientLight: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          intensity?: number;
          color?: string | number;
        },
        HTMLElement
      >\n  );
      directionalLight: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          intensity?: number;
          color?: string | number;
          position?: [number, numbernumber];
          castShadow?: boolean;
          shadow?: any;
        },
        HTMLElement
      >\n  );
      pointLight: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          intensity?: number;
          color?: string | number;
          position?: [number, numbernumber];
          distance?: number;
          decay?: number;
        },
        HTMLElement
      >\n  );
      spotLight: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          intensity?: number;
          color?: string | number;
          position?: [number, numbernumber];
          angle?: number;
          penumbra?: number;
          distance?: number;
        },
        HTMLElement
      >\n  );
      hemisphereLight: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          intensity?: number;
          color?: string | number;
          groundColor?: string | number;
        },
        HTMLElement
      >\n  );
      group: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          position?: [number, numbernumber];
          rotation?: [number, numbernumber];
          scale?: [number, numbernumber];
        },
        HTMLElement
      >\n  );
      mesh: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          position?: [number, numbernumber];
          rotation?: [number, numbernumber];
          scale?: [number, numbernumber];
          castShadow?: boolean;
          receiveShadow?: boolean;
        },
        HTMLElement
      >\n  );
    }
  }
}