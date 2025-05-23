// Test Three.js imports
// Import the extensions first to ensure they're loaded
import './src/types/three-extensions';
import { 
  BoxGeometry, 
  MeshBasicMaterial, 
  Mesh, 
  Group 
} from 'three';

// Test that these classes exist
console.log('BoxGeometry exists:', !!BoxGeometry);
console.log('MeshBasicMaterial exists:', !!MeshBasicMaterial);
console.log('Mesh exists:', !!Mesh);
console.log('Group exists:', !!Group);

// Create instances to verify
const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshBasicMaterial({ color: 0xff0000 });
const mesh = new Mesh(geometry, material);
const group = new Group();

console.log('All Three.js classes working correctly');