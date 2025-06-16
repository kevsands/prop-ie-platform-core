"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  FiRotateCw, 
  FiRotateCcw, 
  FiZoomIn, 
  FiZoomOut, 
  FiCheck, 
  FiX, 
  FiRefreshCw,
  FiCrop,
  FiSun,
  FiImage
} from 'react-icons/fi';
import type { MediaFile } from './MediaUpload';

interface ImagePreviewProps {
  file: MediaFile;
  onSave: (editedFile: MediaFile) => void;
  onCancel: () => void;
  maxWidth?: number;
  maxHeight?: number;
  showControls?: boolean;
}

type EditSettings = {
  rotation: number;
  zoom: number;
  brightness: number;
  contrast: number;
};

const DEFAULT_SETTINGS: EditSettings = {
  rotation: 0,
  zoom: 1,
  brightness: 100,
  contrast: 100
};

const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  onSave,
  onCancel,
  maxWidth = 800,
  maxHeight = 600,
  showControls = true
}) => {
  const [settings, setSettings] = useState<EditSettings>({ ...DEFAULT_SETTINGS });
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string>(file.preview || '');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Create image preview if not already available
  useEffect(() => {
    if (!file.preview && file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [file]);

  // Reset settings to default
  const handleReset = () => {
    setSettings({ ...DEFAULT_SETTINGS });
  };

  // Rotate image clockwise
  const handleRotateClockwise = () => {
    setSettings(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  };

  // Rotate image counter-clockwise
  const handleRotateCounterClockwise = () => {
    setSettings(prev => ({
      ...prev,
      rotation: (prev.rotation - 90 + 360) % 360
    }));
  };

  // Zoom in
  const handleZoomIn = () => {
    setSettings(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom + 0.13)
    }));
  };

  // Zoom out
  const handleZoomOut = () => {
    setSettings(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom - 0.1, 0.5)
    }));
  };

  // Update brightness
  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      brightness: Number(e.target.value)
    }));
  };

  // Update contrast
  const handleContrastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      contrast: Number(e.target.value)
    }));
  };

  // Apply edits and save the image
  const handleSave = async () => {
    if (!imageRef.current || !canvasRef.current) return;

    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      const img = imageRef.current;

      // Calculate dimensions
      let width = img.naturalWidth;
      let height = img.naturalHeight;

      // Apply rotation
      if (settings.rotation === 90 || settings.rotation === 270) {
        canvas.width = height;
        canvas.height = width;
      } else {
        canvas.width = width;
        canvas.height = height;
      }

      // Clear canvas and transform context
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Set the origin to the center of the canvas
      ctx.translate(canvas.width / 2, canvas.height / 2);

      // Rotate the canvas
      ctx.rotate((settings.rotation * Math.PI) / 180);

      // Apply zoom
      ctx.scale(settings.zoom, settings.zoom);

      // Apply filters
      ctx.filter = `brightness(${settings.brightness}%) contrast(${settings.contrast}%)`;

      // Draw the image centered
      ctx.drawImage(
        img,
        -width / 2,
        -height / 2,
        width,
        height
      );

      // Convert canvas to blob
      const blob = await new Promise<Blob | null>((resolve: any) => 
        canvas.toBlob(resolve, file.type)
      );

      if (!blob) {
        throw new Error('Could not create image blob');
      }

      // Create a new file with the edited image
      const editedFile = new File([blob], file.name, { type: file.type }) as MediaFile;

      // Create a new preview URL
      editedFile.preview = URL.createObjectURL(blob);
      editedFile.id = file.id; // Preserve the original ID

      // Pass the edited file back
      onSave(editedFile);
    } catch (error) {

    } finally {
      setIsProcessing(false);
    }
  };

  // Get styles for the preview image based on current settings
  const getImageStyle = () => {
    return {
      transform: `rotate(${settings.rotation}deg) scale(${settings.zoom})`,
      filter: `brightness(${settings.brightness}%) contrast(${settings.contrast}%)`,
      maxWidth: `${maxWidth}px`,
      maxHeight: `${maxHeight}px`,
      objectFit: 'contain' as const
    };
  };

  if (!file.type.startsWith('image/')) {
    return (
      <div className="p-8 text-center bg-gray-50 rounded-lg">
        <FiImage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600">This file is not an image and cannot be previewed.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="image-preview flex flex-col">
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Image preview */}
      <div className="flex-1 overflow-hidden flex items-center justify-center bg-gray-100 rounded-lg mb-4 p-4">
        {preview ? (
          <img
            ref={imageRef}
            src={preview}
            alt={file.name}
            style={getImageStyle()}
            className="transition-transform duration-200"
            onLoad={() => {
              // Ensure image is fully loaded
              if (imageRef.current) {
                imageRef.current.style.opacity = '1';
              }
            }
          />
        ) : (
          <div className="text-center p-4">
            <FiRefreshCw className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Loading image...</p>
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex flex-col space-y-4 bg-gray-50 p-4 rounded-lg">
          {/* Rotation controls */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Rotation</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleRotateCounterClockwise}
                className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                title="Rotate counter-clockwise"
              >
                <FiRotateCcw size={16} />
              </button>
              <button
                type="button"
                onClick={handleRotateClockwise}
                className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                title="Rotate clockwise"
              >
                <FiRotateCw size={16} />
              </button>
            </div>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Zoom</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                title="Zoom out"
                disabled={settings.zoom <= 0.5}
              >
                <FiZoomOut size={16} />
              </button>
              <span className="inline-flex items-center px-2 text-sm">
                {Math.round(settings.zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                title="Zoom in"
                disabled={settings.zoom>= 3}
              >
                <FiZoomIn size={16} />
              </button>
            </div>
          </div>

          {/* Brightness slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Brightness</label>
              <span className="text-sm text-gray-500">{settings.brightness}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={settings.brightness}
              onChange={handleBrightnessChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Contrast slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Contrast</label>
              <span className="text-sm text-gray-500">{settings.contrast}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="150"
              value={settings.contrast}
              onChange={handleContrastChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1 text-gray-700 hover:bg-gray-100 rounded-md text-sm flex items-center"
            >
              <FiRefreshCw className="mr-1" size={14} />
              Reset
            </button>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <FiX className="mr-1" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isProcessing}
                className={`px-4 py-2 rounded-md text-white flex items-center ${
                  isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isProcessing ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-1" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiCheck className="mr-1" />
                    Apply Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;