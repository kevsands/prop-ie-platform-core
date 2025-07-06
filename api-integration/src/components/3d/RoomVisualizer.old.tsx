'use client';

// src/components/3d/RoomVisualizer.tsx
import React, { useRef, useState, useEffect, Suspense, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, ThreeElements, extend } from '@react-three/fiber';
import { 
  Environment, 
  OrbitControls, 
  useGLTF, 
  useTexture, 
  Stats, 
  useProgress,
  Html,
  PerspectiveCamera
} from '@react-three/drei';
import { useCustomization } from '@/context/CustomizationContext';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle } from "lucide-react";
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// Extend Three.js elements for type safety
extend({ Group: THREE.Group });

// Define proper types for customization
interface CustomizationOption {
  id: string;
  name: string;
  category: string;
  room: string;
  price: number;
  image?: string;
  unit: string;
  materialPath?: string;
  modelPath?: string;
  customData?: {
    colorHex?: string;
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
  };
}

// This adapter interface bridges the gap between RoomVisualizer SelectedOption
// and CustomizationContext SelectedOption
interface RoomVisualizer3DSelectedOption {
  optionId: string;
  option: CustomizationOption;
}

// Helper function to adapt CustomizationContext SelectedOption to RoomVisualizer3DSelectedOption
function adaptSelectedOption(
  id: string, 
  option: import('@/context/CustomizationContext').SelectedOption, 
  availableOptions: CustomizationOption[]
): RoomVisualizer3DSelectedOption {
  // Find the matching CustomizationOption from availableOptions by id
  const matchingOption = availableOptions.find(opt => opt.id === id) || {
    id: option.id || id,
    name: option.name || 'Unknown',
    category: option.category || 'unknown',
    room: option.room || 'unknown',
    price: option.price || 0,
    unit: option.unit || '',
    customData: option.customData || {}
  };
  
  return {
    optionId: id,
    option: matchingOption
  };
}

// Loading indicator for suspense
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-sm font-medium mt-2 text-gray-700">
          Loading {Math.round(progress)}%
        </p>
      </div>
    </Html>
  );
}

// Types for GLTF result
type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.Material>;
};

// Fallback model for error cases
function FallbackModel({ roomType }: { roomType: string }) {
  // Different colored fallback models based on room type
  let color = 0x808080; // Default gray
  
  switch (roomType.toLowerCase()) {
    case 'livingroom':
      color = 0xA9D18E; // Green
      break;
    case 'kitchen':
      color = 0x8EA9D1; // Blue
      break;
    case 'bedroom':
      color = 0xD18E8E; // Red
      break;
    case 'bathroom':
      color = 0x8ED1D1; // Cyan
      break;
  }
  
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial 
          color={color} 
          wireframe 
          transparent 
          opacity={0.7} 
        />
      </mesh>
      <Html position={[0, 2, 0]}>
        <div className="bg-red-50 border border-red-200 rounded-md p-2 shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-xs text-red-700">Model loading error</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

// Room model component that applies materials based on selections
function RoomModel({ 
  room, 
  selectedOptions 
}: { 
  room: string; 
  selectedOptions: Record<string, RoomVisualizer3DSelectedOption> 
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [modelError, setModelError] = useState<Error | null>(null);
  const modelPath = `/models/rooms/${room}.glb`;
  
  // Load textures based on selected options
  const texturePaths = useMemo(() => {
    const paths: Record<string, string> = {};
    
    Object.values(selectedOptions).forEach(selection => {
      const { option } = selection;
      if (option.materialPath) {
        paths[option.category] = option.materialPath;
      }
    });
    
    return paths;
  }, [selectedOptions]);
  
  // Load textures 
  const textures = useTexture(
    Object.entries(texturePaths).reduce((acc, [key, path]) => {
      acc[key] = path;
      return acc;
    }, {} as Record<string, string>),
    (textures) => {
      // Set texture properties after loading
      Object.values(textures).forEach(texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
      });
    }
  );
  
  // Try to load the room model
  let gltf: GLTFResult | null = null;
  try {
    gltf = useGLTF(modelPath) as GLTFResult;
  } catch (error) {
    console.error(`Failed to load model: ${modelPath}`, error);
    setModelError(error as Error);
  }
  
  // Apply materials and textures to the model
  useEffect(() => {
    if (!gltf || !groupRef.current) return;
    
    try {
      groupRef.current.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        
        Object.values(selectedOptions).forEach(selected => {
          const { option } = selected;
          
          // Apply flooring materials
          if (option.category === 'flooring' && 
              child.name.toLowerCase().includes('floor')) {
            if (option.materialPath && textures[option.category]) {
              child.material = new THREE.MeshStandardMaterial({
                map: textures[option.category],
                roughness: 0.7,
                metalness: 0.1,
              });
            }
          }
          
          // Apply wall paint
          if (option.category === 'paint' && 
              child.name.toLowerCase().includes('wall')) {
            if (option.materialPath && textures[option.category]) {
              child.material = new THREE.MeshStandardMaterial({
                map: textures[option.category],
                roughness: 0.9,
                metalness: 0.0,
              });
            } else if (option.customData?.colorHex) {
              child.material = new THREE.MeshStandardMaterial({
                color: new THREE.Color(option.customData.colorHex),
                roughness: 0.9,
                metalness: 0.0,
              });
            }
          }
          
          // Apply fixtures
          if (option.category === 'fixtures' && 
              child.name.toLowerCase().includes('fixture')) {
            if (option.materialPath && textures[option.category]) {
              child.material = new THREE.MeshStandardMaterial({
                map: textures[option.category],
                roughness: 0.2,
                metalness: 0.8,
              });
            }
          }
        });
      });
    } catch (err) {
      console.error("Error applying materials to model", err);
    }
  }, [gltf, selectedOptions, textures]);
  
  // If there was a model error, show the fallback
  if (modelError || !gltf) {
    return <FallbackModel roomType={room} />;
  }
  
  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
    </group>
  );
}

// Furniture model component with error handling
function FurnitureItem({ 
  option,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: { 
  option: CustomizationOption;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}) {
  const modelPath = option.modelPath || '';
  const [error, setError] = useState<Error | null>(null);
  
  // Try to load the model, handle errors gracefully
  let gltf: GLTF | null = null;
  try {
    gltf = useGLTF(modelPath);
  } catch (err) {
    console.error(`Failed to load furniture model: ${modelPath}`, err);
    setError(err as Error);
    return null;
  }
  
  // Configure the model
  useEffect(() => {
    if (!gltf?.scene) return;
    
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [gltf]);
  
  // If there was an error, don't render anything
  if (error || !gltf) {
    return null;
  }
  
  return (
    <primitive 
      object={gltf.scene} 
      position={position} 
      rotation={rotation as [number, number, number]} 
      scale={scale as [number, number, number]} 
    />
  );
}

// Camera controller with smooth transitions
function CameraController({ 
  targetPosition = [0, 1, 0],
  minDistance = 2,
  maxDistance = 10,
  minPolarAngle = Math.PI / 6,
  maxPolarAngle = Math.PI / 2
}: { 
  targetPosition?: [number, number, number];
  minDistance?: number;
  maxDistance?: number;
  minPolarAngle?: number;
  maxPolarAngle?: number;
}) {
  const controlsRef = useRef<OrbitControls>(null);
  const target = useMemo(() => new THREE.Vector3(...targetPosition), [targetPosition]);
  
  // Smooth camera transitions
  useFrame(() => {
    if (controlsRef.current) {
      const currentTarget = controlsRef.current.target;
      // Smoothly interpolate camera target
      currentTarget.lerp(target, 0.1);
      controlsRef.current.update();
    }
  });
  
  return (
    <OrbitControls 
      ref={controlsRef}
      enableZoom
      enablePan
      minDistance={minDistance}
      maxDistance={maxDistance}
      minPolarAngle={minPolarAngle}
      maxPolarAngle={maxPolarAngle}
      makeDefault
    />
  );
}

// Performance monitoring component
function PerformanceMonitor({ enabled = false }) {
  if (!enabled) return null;
  return <Stats />;
}

// Error boundary for 3D components
class ModelErrorBoundary extends React.Component<
  { roomType: string; children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { roomType: string; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Model rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackModel roomType={this.props.roomType} />;
    }
    return this.props.children;
  }
}

// Main RoomVisualizer component with error boundary
export function RoomVisualizer({ 
  room = "livingRoom",
  showPerformanceStats = false,
  height = 600,
}: { 
  room?: string;
  showPerformanceStats?: boolean;
  height?: number;
}) {
  // Get customization context
  const customizationContext = useCustomization();
  
  // Safely access state, provide fallback if needed
  const state = customizationContext?.state || { selectedOptions: {} };
  
  // Component state
  const [isLoading, setIsLoading] = useState(true);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number]>([0, 1, 0]);
  const [error, setError] = useState<Error | null>(null);
  
  // Filter options for current room and get furniture items
  const selectedOptionsForRoom = useMemo(() => {
    return Object.values(state.selectedOptions)
      .filter(selected => selected.room === room);
  }, [state.selectedOptions, room]);
  
  const furnitureItems = useMemo(() => {
    return selectedOptionsForRoom
      .filter(selected => selected.category === 'furniture');
  }, [selectedOptionsForRoom]);
  
  // Handle model loading completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [room]);
  
  // Focus camera on specific areas based on category
  const focusOnArea = useCallback((category: string) => {
    switch(category) {
      case 'flooring':
        setCameraTarget([0, 0, 0]);
        break;
      case 'paint':
        setCameraTarget([0, 1.5, 0]);
        break;
      case 'fixtures':
        setCameraTarget([1, 1.5, 0]);
        break;
      case 'furniture':
        setCameraTarget([0, 0.5, 0]);
        break;
      default:
        setCameraTarget([0, 1, 0]);
    }
  }, []);
  
  // Handle errors
  const handleError = useCallback((err: Error) => {
    console.error('RoomVisualizer encountered an error:', err);
    setError(err);
    setIsLoading(false);
  }, []);
  
  return (
    <ErrorBoundary
      fallbackRender={({ error }: FallbackProps) => (
        <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="text-center">
            <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-red-800">Visualization Error</h3>
            <p className="text-sm text-red-600 mt-1">
              Failed to load 3D visualization. Please try refreshing the page.
            </p>
            <p className="text-xs text-red-500 mt-4">{error.message}</p>
          </div>
        </div>
      )}
      onError={handleError}
    >
      <div className="w-full bg-gray-100 rounded-lg overflow-hidden shadow-md relative" style={{ height: `${height}px` }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            <Loader2 className="mr-2 h-8 w-8 animate-spin text-blue-500" />
            <span className="text-lg font-medium">Loading 3D model...</span>
          </div>
        )}
        
        <motion.div 
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0.3 : 1 }}
          transition={{ duration: 0.5 }}
        >
          <Canvas 
            shadows 
            camera={{ position: [0, 1.5, 4], fov: 60 }}
            gl={{ antialias: true, preserveDrawingBuffer: true }}
            dpr={[1, 2]} // Responsive to device pixel ratio
          >
            {/* Camera setup */}
            <PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={60} />
            
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight 
              position={[10, 10, 10]} 
              intensity={1}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />
            
            {/* Models */}
            <Suspense fallback={<Loader />}>
              <ModelErrorBoundary roomType={room}>
                <RoomModel 
                  room={room} 
                  selectedOptions={
                    // Convert the CustomizationContext options to RoomVisualizer compatible options
                    Object.entries(state.selectedOptions).reduce((acc, [id, option]) => {
                      acc[id] = adaptSelectedOption(id, option, customizationContext?.state?.availableOptions || []);
                      return acc;
                    }, {} as Record<string, RoomVisualizer3DSelectedOption>)
                  } 
                />
                
                {/* Furniture items */}
                {furnitureItems.map((selected) => {
                  // Adapt each option
                  const adaptedItem = adaptSelectedOption(
                    selected.id, 
                    selected, 
                    customizationContext?.state?.availableOptions || []
                  );
                  
                  return (
                    <FurnitureItem 
                      key={adaptedItem.optionId}
                      option={adaptedItem.option}
                      position={adaptedItem.option.customData?.position || [0, 0, 0]}
                      rotation={adaptedItem.option.customData?.rotation || [0, 0, 0]}
                      scale={adaptedItem.option.customData?.scale || [1, 1, 1]}
                    />
                  );
                })}
                
                {/* Environment and controls */}
                <Environment preset="apartment" />
                <CameraController targetPosition={cameraTarget} />
                <PerformanceMonitor enabled={showPerformanceStats} />
              </ModelErrorBoundary>
            </Suspense>
          </Canvas>
        </motion.div>
        
        {/* View controls */}
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button 
            onClick={() => focusOnArea('flooring')} 
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            title="Focus on floor"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="20" width="20" height="2" rx="1" />
              <path d="M4 18V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12" />
            </svg>
          </button>
          <button 
            onClick={() => focusOnArea('paint')} 
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            title="Focus on walls"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 2v20H2V2h2z" />
              <path d="M22 2v20h-2V2h2z" />
              <path d="M4 2h16" />
              <path d="M4 22h16" />
            </svg>
          </button>
          <button 
            onClick={() => focusOnArea('fixtures')} 
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            title="Focus on fixtures"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <path d="M8 18v4" />
              <path d="M16 18v4" />
              <path d="M2 8h20" />
              <path d="M2 16h20" />
              <path d="M2 8v8" />
              <path d="M22 8v8" />
            </svg>
          </button>
          <button 
            onClick={() => focusOnArea('default')} 
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            title="Reset view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Preload models to improve performance
useGLTF.preload('/models/rooms/livingRoom.glb');
useGLTF.preload('/models/rooms/kitchen.glb');
useGLTF.preload('/models/rooms/bedroom.glb');
useGLTF.preload('/models/rooms/bathroom.glb');

export default RoomVisualizer;