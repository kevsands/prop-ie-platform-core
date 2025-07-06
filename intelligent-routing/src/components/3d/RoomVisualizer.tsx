'use client';
import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Import the required JSX type definitions from jsx-three-fiber.d.ts
// No need to use extend() as the types are already defined in the d.ts file

// Simple placeholder component that won't have TypeScript errors
export const RoomVisualizer = ({ 
  room = "livingRoom",
  showPerformanceStats = false,
  height = 500
}: { 
  room?: string;
  showPerformanceStats?: boolean;
  height?: number;
}) => {
  return (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden shadow-md" style={{ height: `${height}px` }}>
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 4], fov: 60 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} castShadow />
        <Room roomType={room} />
        <OrbitControls />
      </Canvas>
      
      {/* Room selection controls */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button 
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          title="Rotate room"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
      </div>
    </div>
  );
};

interface RoomProps {
  roomType: string;
}

function Room({ roomType }: RoomProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [color, setColor] = useState(() => {
    // Different colored rooms based on room type
    switch (roomType.toLowerCase()) {
      case 'livingroom':
        return '#A9D18E'; // Green
      case 'kitchen':
        return '#8EA9D1'; // Blue
      case 'bedroom':
        return '#D18E8E'; // Red
      case 'bathroom':
        return '#8ED1D1'; // Cyan
      default:
        return '#E0E0E0'; // Gray
    }
  });
  
  // Animation loop
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });
  
  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.3} />
    </mesh>
  );
}

export default RoomVisualizer;