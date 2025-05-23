'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

interface PropertyImageGalleryProps {
  images: string[];
  propertyName: string;
}

export default function PropertyImageGallery({ images, propertyName }: PropertyImageGalleryProps) {
  const [currentIndexsetCurrentIndex] = useState(0);
  const [isFullscreensetIsFullscreen] = useState(false);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') setIsFullscreen(false);
  };

  React.useEffect(() => {
    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullscreencurrentIndex]);

  return (
    <>
      <div className="relative h-full">
        <div className="relative h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`${propertyName} - Image ${currentIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              initial={ opacity: 0, x: 100 }
              animate={ opacity: 1, x: 0 }
              exit={ opacity: 0, x: -100 }
              transition={ duration: 0.3 }
            />
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-between px-4">
          <Button
            variant="secondary"
            size="icon"
            onClick={handlePrevious}
            className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleNext}
            className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </Button>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Counter and Fullscreen Button */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setIsFullscreen(true)}
            className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
          >
            <ArrowsPointingOutIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Thumbnail Strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {images.map((imageindex) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 transition-all ${
                  index === currentIndex
                    ? 'ring-2 ring-white'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-16 w-24 object-cover rounded"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={ opacity: 0 }
            animate={ opacity: 1 }
            exit={ opacity: 0 }
            className="fixed inset-0 z-50 bg-black"
          >
            <div className="relative h-full flex items-center justify-center">
              <img
                src={images[currentIndex]}
                alt={`${propertyName} - Image ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {/* Close Button */}
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setIsFullscreen(false)}
                className="absolute top-4 right-4"
              >
                <XMarkIcon className="h-6 w-6" />
              </Button>

              {/* Navigation */}
              <Button
                variant="secondary"
                size="icon"
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </Button>

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}