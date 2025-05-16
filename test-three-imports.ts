// Test Three.js imports
import * as THREE from 'three';

// Test that these classes exist
console.log('BoxGeometry exists:', !!THREE.BoxGeometry);
console.log('MeshBasicMaterial exists:', !!THREE.MeshBasicMaterial);
console.log('Mesh exists:', !!THREE.Mesh);
console.log('Group exists:', !!THREE.Group);

// Create instances to verify
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
const group = new THREE.Group();

console.log('All Three.js classes working correctly');