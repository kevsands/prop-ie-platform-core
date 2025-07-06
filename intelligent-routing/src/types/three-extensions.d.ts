// src/types/three-extensions.d.ts
import { Object3D } from 'three';
import { JSX } from 'react';

// The Vector3 interfaces are defined inline to avoid module augmentation issues
// with Next.js and TypeScript

// Extend JSX.IntrinsicElements to include Three.js elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      primitive: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          object: Object3D;
          position?: [number, number, number];
          rotation?: [number, number, number];
          scale?: [number, number, number];
        },
        HTMLElement
      >;
      ambientLight: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          intensity?: number;
          color?: string | number;
        },
        HTMLElement
      >;
      directionalLight: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          intensity?: number;
          color?: string | number;
          position?: [number, number, number];
          castShadow?: boolean;
          shadow?: any;
        },
        HTMLElement
      >;
      pointLight: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          intensity?: number;
          color?: string | number;
          position?: [number, number, number];
          distance?: number;
          decay?: number;
        },
        HTMLElement
      >;
      spotLight: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          intensity?: number;
          color?: string | number;
          position?: [number, number, number];
          angle?: number;
          penumbra?: number;
          distance?: number;
        },
        HTMLElement
      >;
      hemisphereLight: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          intensity?: number;
          color?: string | number;
          groundColor?: string | number;
        },
        HTMLElement
      >;
      group: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          position?: [number, number, number];
          rotation?: [number, number, number];
          scale?: [number, number, number];
        },
        HTMLElement
      >;
      mesh: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          position?: [number, number, number];
          rotation?: [number, number, number];
          scale?: [number, number, number];
          castShadow?: boolean;
          receiveShadow?: boolean;
        },
        HTMLElement
      >;
    }
  }
}