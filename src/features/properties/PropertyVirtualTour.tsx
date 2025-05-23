'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlayIcon,
  PauseIcon,
  ViewfinderCircleIcon,
  ArrowsPointingOutIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  Cog6ToothIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReactPlayer from 'react-player';

interface PropertyVirtualTourProps {
  tourUrl: string;
  propertyName: string;
  tourType?: 'matterport' | 'video' | '360' | 'custom';
}

export default function PropertyVirtualTour({ 
  tourUrl, 
  propertyName,
  tourType = 'matterport'
}: PropertyVirtualTourProps) {
  const [isPlayingsetIsPlaying] = useState(true);
  const [isMutedsetIsMuted] = useState(false);
  const [isFullscreensetIsFullscreen] = useState(false);
  const [qualitysetQuality] = useState('1080p');
  const [tourModesetTourMode] = useState<'guided' | 'free'>('guided');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (tourType === 'matterport') {
    return (
      <div className="relative h-full" ref={containerRef}>
        <iframe
          ref={iframeRef}
          src={tourUrl}
          title={`${propertyName} Virtual Tour`}
          className="w-full h-full"
          allowFullScreen
          allow="vr; xr; accelerometer; magnetometer; gyroscope"
        />

        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleFullscreen}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
              >
                <ArrowsPointingOutIcon className="h-4 w-4 mr-2" />
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </Button>

              <Select value={tourMode} onValueChange={setTourMode}>
                <SelectTrigger className="w-[120px] bg-white/20 backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guided">Guided Tour</SelectItem>
                  <SelectItem value="free">Free Explore</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <ViewfinderCircleIcon className="h-5 w-5 text-white" />
              <span className="text-white text-sm">360° Virtual Tour</span>
            </div>
          </div>
        </div>

        {/* VR Mode Indicator */}
        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          VR Compatible
        </div>
      </div>
    );
  }

  if (tourType === 'video') {
    return (
      <div className="relative h-full bg-black" ref={containerRef}>
        <ReactPlayer
          url={tourUrl}
          playing={isPlaying}
          muted={isMuted}
          width="100%"
          height="100%"
          controls={false}
          onEnded={() => setIsPlaying(false)}
          config={
            youtube: {
              playerVars: {
                showinfo: 0,
                rel: 0,
                modestbranding: 1}
            }
          }
        />

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
              >
                {isPlaying ? (
                  <PauseIcon className="h-5 w-5" />
                ) : (
                  <PlayIcon className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="secondary"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
              >
                {isMuted ? (
                  <SpeakerXMarkIcon className="h-5 w-5" />
                ) : (
                  <SpeakerWaveIcon className="h-5 w-5" />
                )}
              </Button>

              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger className="w-[100px] bg-white/20 backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1080p">1080p</SelectItem>
                  <SelectItem value="720p">720p</SelectItem>
                  <SelectItem value="480p">480p</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={toggleFullscreen}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
            >
              <ArrowsPointingOutIcon className="h-4 w-4 mr-2" />
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <VideoCameraIcon className="h-5 w-5 text-white" />
            <span className="text-white text-sm">Virtual Tour Video</span>
          </div>
        </div>
      </div>
    );
  }

  // Default fallback for other tour types
  return (
    <div className="relative h-full flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <ViewfinderCircleIcon className="h-12 w-12 text-white mx-auto mb-4" />
        <p className="text-white text-lg mb-2">Virtual Tour</p>
        <Button
          variant="secondary"
          onClick={() => window.open(tourUrl, '_blank')}
        >
          Open in New Tab
        </Button>
      </div>
    </div>
  );
}