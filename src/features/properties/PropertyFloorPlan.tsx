'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface FloorPlan {
  id: string;
  name: string;
  floor: number;
  imageUrl: string;
  sqft: number;
  rooms: {
    name: string;
    dimensions: string;
  }[];
}

interface PropertyFloorPlanProps {
  floorPlans: FloorPlan[];
  propertyName: string;
}

export default function PropertyFloorPlan({ floorPlans, propertyName }: PropertyFloorPlanProps) {
  const [selectedPlansetSelectedPlan] = useState(0);
  const [isFullscreensetIsFullscreen] = useState(false);

  const currentPlan = floorPlans[selectedPlan];

  const handlePrevious = () => {
    setSelectedPlan((prev: any) => (prev === 0 ? floorPlans.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedPlan((prev: any) => (prev === floorPlans.length - 1 ? 0 : prev + 1));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      {/* Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <Select
          value={selectedPlan.toString()}
          onValueChange={(value: any) => setSelectedPlan(parseInt(value))}
        >
          <SelectTrigger className="w-[200px] bg-white/90 backdrop-blur-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {floorPlans.map((planindex: any) => (
              <SelectItem key={plan.id} value={index.toString()}>
                {plan.name} - Floor {plan.floor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleFullscreen}
            className="bg-white/90 backdrop-blur-sm"
          >
            {isFullscreen ? (
              <ArrowsPointingInIcon className="h-5 w-5" />
            ) : (
              <ArrowsPointingOutIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Floor Plan Viewer */}
      <div className="flex-1 relative">
        <TransformWrapper
          initialScale={1}
          initialPositionX={0}
          initialPositionY={0}
          minScale={0.5}
          maxScale={3}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <TransformComponent wrapperClass="h-full" contentClass="h-full">
                <div className="h-full flex items-center justify-center bg-gray-100">
                  <img
                    src={currentPlan.imageUrl}
                    alt={`${propertyName} - ${currentPlan.name}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </TransformComponent>

              {/* Zoom Controls */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => zoomIn()}
                  className="bg-white/90 backdrop-blur-sm"
                >
                  <MagnifyingGlassPlusIcon className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => zoomOut()}
                  className="bg-white/90 backdrop-blur-sm"
                >
                  <MagnifyingGlassMinusIcon className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => resetTransform()}
                  className="bg-white/90 backdrop-blur-sm"
                >
                  Reset
                </Button>
              </div>
            </>
          )}
        </TransformWrapper>

        {/* Navigation for multiple floor plans */}
        {floorPlans.length> 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none">
            <Button
              variant="secondary"
              size="icon"
              onClick={handlePrevious}
              className="bg-white/90 backdrop-blur-sm pointer-events-auto"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleNext}
              className="bg-white/90 backdrop-blur-sm pointer-events-auto"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>

      {/* Room Details */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 max-w-xs">
        <h3 className="font-semibold mb-2">{currentPlan.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{currentPlan.sqft} sq ft</p>
        <div className="space-y-1">
          {currentPlan.rooms.map((roomindex: any) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{room.name}</span>
              <span className="text-gray-600">{room.dimensions}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}