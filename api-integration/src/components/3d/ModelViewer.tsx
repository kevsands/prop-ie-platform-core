"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Import Three.js setup
import '../../lib/three-setup';

interface ModelViewerProps {
  baseModelUrl: string;
  customMaterials?: {
    partName: string;
    materialPath?: string;
    color?: string;
  }[];
  width?: string | number;
  height?: string | number;
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  baseModelUrl,
  customMaterials = [],
  width = '100%',
  height = '400px'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize the 3D environment
  useEffect(() => {
    if (!containerRef.current) return;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0xf0f0f0, 1);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);
    cameraRef.current = camera;

    // Setup controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Animation/render loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
    };
  }, [/* This effect only runs once on mount to set up the 3D environment */]);
  // An empty dependency array is appropriate here as this initializes the scene once

  // Load the model
  useEffect(() => {
    if (!sceneRef.current) return;
    
    setIsLoading(true);
    setError(null);

    // Load model fallback if URL doesn't exist
    const actualModelUrl = baseModelUrl || '/models/default_room.glb';
    
    const loader = new GLTFLoader();
    
    loader.load(
      actualModelUrl,
      (gltf) => {
        // Remove previous model if it exists
        if (modelRef.current && sceneRef.current) {
          sceneRef.current.remove(modelRef.current);
        }

        const model = gltf.scene;
        model.traverse((child) => {
          if ((child as Mesh).isMesh) {
            (child as Mesh).castShadow = true;
            (child as Mesh).receiveShadow = true;
          }
        });

        // Apply custom materials if provided
        if (customMaterials && customMaterials.length > 0) {
          applyCustomMaterials(model, customMaterials);
        }

        if (sceneRef.current) {
          sceneRef.current.add(model);
          modelRef.current = model;

          // Center model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          
          // Position camera to see full model
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const fov = cameraRef.current?.fov || 45;
          const cameraZ = Math.abs(maxDim / Math.sin(Math.PI * fov / 360));
          
          if (cameraRef.current) {
            cameraRef.current.position.z = cameraZ * 1.5;
            cameraRef.current.updateProjectionMatrix();
          }
          
          if (controlsRef.current) {
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
          }
        }

        setIsLoading(false);
      },
      (xhr) => {
        // Progress callback - could update a loading indicator
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        console.error('Error loading model:', error);
        setError('Failed to load 3D model');
        setIsLoading(false);
      }
    );
  }, [baseModelUrl, customMaterials]);

  // Helper function to apply custom materials
  const applyCustomMaterials = (
    model: THREE.Group, 
    customMaterials: { partName: string; materialPath?: string; color?: string }[]
  ) => {
    customMaterials.forEach(material => {
      model.traverse((node) => {
        if ((node as THREE.Mesh).isMesh && node.name.includes(material.partName)) {
          const mesh = node as THREE.Mesh;
          
          if (material.color) {
            // Apply color
            const color = new THREE.Color(material.color);
            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach(mat => {
                  if (mat instanceof THREE.MeshStandardMaterial) {
                    mat.color.set(color);
                  }
                });
              } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
                mesh.material.color.set(color);
              }
            }
          }
          
          if (material.materialPath) {
            // Load and apply texture
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(material.materialPath, (texture) => {
              if (mesh.material) {
                const newMaterial = new THREE.MeshStandardMaterial({ map: texture });
                
                if (Array.isArray(mesh.material)) {
                  mesh.material = mesh.material.map(() => newMaterial);
                } else {
                  mesh.material = newMaterial;
                }
              }
            });
          }
        }
      });
    });
  };

  return (
    <div 
      ref={containerRef} 
      style={{ width, height, position: 'relative' }}
      className="model-viewer-container"
    >
      {isLoading && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(240, 240, 240, 0.7)',
          zIndex: 10 
        }}>
          <div className="loading-spinner">Loading 3D Model...</div>
        </div>
      )}
      
      {error && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'rgba(240, 240, 240, 0.9)',
          color: 'red',
          zIndex: 10 
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default ModelViewer;