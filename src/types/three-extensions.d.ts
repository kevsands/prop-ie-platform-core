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
          position?: [numbernumbernumber];
          rotation?: [numbernumbernumber];
          scale?: [numbernumbernumber];
        },
        HTMLElement
      >
  );
      ambientLight: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          intensity?: number;
          color?: string | number;
        },
        HTMLElement
      >
  );
      directionalLight: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          intensity?: number;
          color?: string | number;
          position?: [numbernumbernumber];
          castShadow?: boolean;
          shadow?: any;
        },
        HTMLElement
      >
  );
      pointLight: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          intensity?: number;
          color?: string | number;
          position?: [numbernumbernumber];
          distance?: number;
          decay?: number;
        },
        HTMLElement
      >
  );
      spotLight: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          intensity?: number;
          color?: string | number;
          position?: [numbernumbernumber];
          angle?: number;
          penumbra?: number;
          distance?: number;
        },
        HTMLElement
      >
  );
      hemisphereLight: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          intensity?: number;
          color?: string | number;
          groundColor?: string | number;
        },
        HTMLElement
      >
  );
      group: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          position?: [numbernumbernumber];
          rotation?: [numbernumbernumber];
          scale?: [numbernumbernumber];
        },
        HTMLElement
      >
  );
      mesh: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          position?: [numbernumbernumber];
          rotation?: [numbernumbernumber];
          scale?: [numbernumbernumber];
          castShadow?: boolean;
          receiveShadow?: boolean;
        },
        HTMLElement
      >
  );
    }
  }
}