'use client';
import { Component } from 'react';
/**
 * Creates a fallback mesh when a model fails to load.
 * This provides a visual indication that something should be displayed,
 * rather than showing nothing at all.
 */
export function createFallbackModel(roomType = 'default') {
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
    // Create a simple wireframe box as fallback
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity: 0.7
    });
    // Create a mesh
    const mesh = new Mesh(geometry, material);
    // Create a group to match the scene structure
    const group = new Group();
    group.add(mesh);
    return {
        scene: group,
        mesh
    };
}
/**
 * Error boundary component for 3D model rendering.
 * Catches errors during the rendering of 3D models and provides fallback UI.
 */
export class ModelErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        // Log the error to an error reporting service
        console.error('Model rendering error:', error, errorInfo);
    }
    render() {
        const { children, roomType, fallback } = this.props;
        if (this.state.hasError) {
            // If a custom fallback is provided, use it
            if (fallback) {
                return fallback;
            }
            // Otherwise, return a default fallback
            return createFallbackModel(roomType).scene;
        }
        // If there's no error, render the children normally
        return children;
    }
}
