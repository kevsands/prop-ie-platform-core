'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Maximize2, Minimize2, RotateCw, ZoomIn, ZoomOut, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VirtualTourViewerProps {
  url: string;
  height?: string;
  className?: string;
}

const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({
  url,
  height = '100%',
  className = ''}) => {
  const [isLoadingsetIsLoading] = useState(true);
  const [errorsetError] = useState<string | null>(null);
  const [isFullscreensetIsFullscreen] = useState(false);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [url]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.getElementById('virtual-tour-container')?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Check if URL is a supported format
  const isMatterport = url.includes('matterport.com');
  const isKuula = url.includes('kuula.co');
  const isPannellum = url.includes('pannellum.org');
  const isIframe = url.startsWith('http') || url.startsWith('https');

  if (error) {
    return (
      <Card className="flex items-center justify-center h-full bg-gray-50">
        <div className="text-center p-8">
          <p className="text-red-600 mb-2">Failed to load virtual tour</p>
          <p className="text-sm text-gray-600">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => window.open(url, '_blank')}
          >
            Open in New Tab
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div
      id="virtual-tour-container"
      className={`relative bg-black ${className}`}
      style={ height }
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center text-white">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <p>Loading virtual tour...</p>
          </div>
        </div>
      )}

      {/* Virtual Tour Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="bg-white/90 hover:bg-white"
          title="Toggle fullscreen"
          onClick={handleFullscreen}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="bg-white/90 hover:bg-white"
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="bg-white/90 hover:bg-white"
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="bg-white/90 hover:bg-white"
          title="Reset view"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Tour Instructions */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-white/90 p-3 max-w-xs">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">Navigation Tips</p>
              <ul className="text-xs text-gray-600 space-y-0.5">
                <li>• Click and drag to look around</li>
                <li>• Use scroll wheel to zoom</li>
                <li>• Click on hotspots to move</li>
                <li>• Press F for fullscreen</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Virtual Tour Embed */}
      {isIframe ? (
        <iframe
          src={url}
          className="w-full h-full border-0"
          allowFullScreen
          allow="vr; xr; accelerometer; magnetometer; gyroscope"
          onLoad={() => setIsLoading(false)}
          onError={() => setError('Failed to load tour. Please try again.')}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <Card className="p-8 max-w-lg text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCw className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Virtual Tour Demo</h3>
              <p className="text-gray-600 mb-4">
                This is a placeholder for the 360° virtual tour experience.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                In production, this would display an interactive 3D walkthrough
                of the property using services like Matterport, Kuula, or custom
                360° imagery.
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <p className="font-medium text-sm mb-2">Tour Features:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ 360° panoramic views</li>
                  <li>✓ Interactive hotspots</li>
                  <li>✓ Dollhouse view</li>
                  <li>✓ Floor plan navigation</li>
                  <li>✓ Measurement tools</li>
                </ul>
              </div>

              <Button
                className="w-full"
                onClick={() => window.open(url, '_blank')}
              >
                Launch Virtual Tour
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VirtualTourViewer;