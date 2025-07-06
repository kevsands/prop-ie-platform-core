'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Toggle } from '@/components/ui/toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Property } from '@/types/property';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Camera,
  Maximize2,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Share2,
  Compass,
  Layers,
  Ruler,
  Sun,
  Moon,
  MapPin,
  Home,
  Eye,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  MessageSquare,
  Hand,
  Monitor,
  Smartphone,
  Headphones
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { useToast } from '@/hooks/useToast';

// Dynamic imports for 3D components
const Canvas = dynamic(() => import('@react-three/fiber').then(mod => mod.Canvas), { ssr: false });
const OrbitControls = dynamic(() => import('@react-three/drei').then(mod => mod.OrbitControls), { ssr: false });
const PerspectiveCamera = dynamic(() => import('@react-three/drei').then(mod => mod.PerspectiveCamera), { ssr: false });

interface VirtualViewingProps {
  property: Property;
  scheduledViewing?: {
    id: string;
    startTime: Date;
    endTime: Date;
    agent?: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
  onComplete?: () => void;
}

interface ViewingMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface HotspotData {
  id: string;
  position: [number, number, number];
  label: string;
  description: string;
  icon?: React.ReactNode;
  type: 'info' | 'feature' | 'issue' | 'measurement';
}

const viewingModes: ViewingMode[] = {
  guided: {
    id: 'guided',
    name: 'Guided Tour',
    description: 'Follow a pre-set path through the property',
    icon: <Navigation />
  },
  free: {
    id: 'free',
    name: 'Free Exploration',
    description: 'Explore the property at your own pace',
    icon: <Compass />
  },
  interactive: {
    id: 'interactive',
    name: 'Interactive',
    description: 'Click on hotspots for more information',
    icon: <Eye />
  }
};

export default function VirtualViewing({
  property,
  scheduledViewing,
  onComplete
}: VirtualViewingProps) {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(0);
  const [viewingMode, setViewingMode] = useState(viewingModes.guided);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [dayTime, setDayTime] = useState<'day' | 'night'>('day');
  const [quality, setQuality] = useState<'auto' | '720p' | '1080p' | '4k'>('auto');
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile' | 'vr'>('desktop');
  
  // Video conference state
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isHandRaised, setIsHandRaised] = useState(false);
  
  const canvasRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sample rooms data
  const rooms = [
    { id: 'living', name: 'Living Room', thumbnail: '/images/rooms/living.jpg' },
    { id: 'kitchen', name: 'Kitchen', thumbnail: '/images/rooms/kitchen.jpg' },
    { id: 'bedroom1', name: 'Master Bedroom', thumbnail: '/images/rooms/bedroom1.jpg' },
    { id: 'bedroom2', name: 'Bedroom 2', thumbnail: '/images/rooms/bedroom2.jpg' },
    { id: 'bathroom', name: 'Bathroom', thumbnail: '/images/rooms/bathroom.jpg' },
    { id: 'exterior', name: 'Exterior', thumbnail: '/images/rooms/exterior.jpg' }
  ];

  // Sample hotspots
  const hotspots: HotspotData[] = [
    {
      id: '1',
      position: [2, 1, 0],
      label: 'Energy Efficient Windows',
      description: 'Triple-glazed windows with A+ rating',
      type: 'feature',
      icon: <Sun size={16} />
    },
    {
      id: '2',
      position: [-2, 1.5, 1],
      label: 'Smart Home Controls',
      description: 'Integrated smart home system',
      type: 'info',
      icon: <Home size={16} />
    },
    {
      id: '3',
      position: [0, 2, -2],
      label: 'Room Dimensions',
      description: '4.5m x 3.8m',
      type: 'measurement',
      icon: <Ruler size={16} />
    }
  ];

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      canvasRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle room navigation
  const navigateRoom = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentRoom((prev) => (prev + 1) % rooms.length);
    } else {
      setCurrentRoom((prev) => (prev - 1 + rooms.length) % rooms.length);
    }
  };

  // Handle screenshot
  const takeScreenshot = () => {
    // Implementation for taking screenshot
    toast({
      title: 'Screenshot Saved',
      description: 'Virtual tour screenshot saved to gallery'
    });
  };

  // Handle recording
  const startRecording = () => {
    // Implementation for recording
    toast({
      title: 'Recording Started',
      description: 'Your virtual tour is being recorded'
    });
  };

  // Handle hotspot click
  const handleHotspotClick = (hotspot: HotspotData) => {
    toast({
      title: hotspot.label,
      description: hotspot.description
    });
  };

  // Auto-play guided tour
  useEffect(() => {
    if (isPlaying && viewingMode.id === 'guided') {
      const timer = setTimeout(() => {
        navigateRoom('next');
      }, 10000); // 10 seconds per room
      
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentRoom, viewingMode]);

  return (
    <div className="space-y-6">
      {/* Main Viewing Area */}
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-muted" ref={canvasRef}>
          {/* 3D Canvas or Video Stream */}
          <Canvas
            camera={{ position: [0, 2, 5], fov: 60 }}
            className="absolute inset-0"
          >
            <PerspectiveCamera makeDefault position={[0, 2, 5]} />
            <OrbitControls
              enablePan={viewingMode.id !== 'guided'}
              enableZoom={viewingMode.id !== 'guided'}
              enableRotate={viewingMode.id !== 'guided'}
            />
            <ambientLight intensity={dayTime === 'day' ? 0.7 : 0.3} />
            <pointLight position={[10, 10, 10]} intensity={dayTime === 'day' ? 1 : 0.5} />
            
            {/* 3D Room Model */}
            <mesh>
              <boxGeometry args={[5, 3, 5]} />
              <meshStandardMaterial color="#f4f4f4" />
            </mesh>
            
            {/* Hotspots */}
            {showHotspots && hotspots.map((hotspot) => (
              <mesh
                key={hotspot.id}
                position={hotspot.position}
                onClick={() => handleHotspotClick(hotspot)}
              >
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
              </mesh>
            ))}
          </Canvas>

          {/* Video Conference Overlay */}
          {scheduledViewing && (
            <div className="absolute top-4 right-4 space-y-2">
              {participants.map((participant, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-32 h-24 bg-black rounded-lg overflow-hidden"
                >
                  <video className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1">
                    <p className="text-xs text-white truncate">{participant.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Control Overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause /> : <Play />}
                </Button>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => navigateRoom('prev')}
                >
                  <ChevronLeft />
                </Button>
                
                <span className="text-white text-sm">
                  {rooms[currentRoom].name} ({currentRoom + 1}/{rooms.length})
                </span>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => navigateRoom('next')}
                >
                  <ChevronRight />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                {/* Video Conference Controls */}
                {scheduledViewing && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    >
                      {isVideoEnabled ? <Video /> : <VideoOff />}
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                    >
                      {isAudioEnabled ? <Mic /> : <MicOff />}
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => setIsHandRaised(!isHandRaised)}
                    >
                      <Hand className={isHandRaised ? 'text-yellow-400' : ''} />
                    </Button>
                  </>
                )}

                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={takeScreenshot}
                >
                  <Camera />
                </Button>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX /> : <Volume2 />}
                </Button>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={toggleFullscreen}
                >
                  <Maximize2 />
                </Button>
              </div>
            </div>

            {/* Room Navigation Thumbnails */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {rooms.map((room, idx) => (
                <button
                  key={room.id}
                  onClick={() => setCurrentRoom(idx)}
                  className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentRoom ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={room.thumbnail}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <p className="text-white text-xs font-medium">{room.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Hotspot Labels */}
          {showHotspots && (
            <AnimatePresence>
              {hotspots.map((hotspot) => (
                <motion.div
                  key={hotspot.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <Badge
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleHotspotClick(hotspot)}
                  >
                    {hotspot.icon}
                    <span className="ml-1">{hotspot.label}</span>
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </Card>

      {/* Controls Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Viewing Mode */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Viewing Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={viewingMode.id}
              onValueChange={(value) => setViewingMode(viewingModes[value])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(viewingModes).map((mode) => (
                  <SelectItem key={mode.id} value={mode.id}>
                    <div className="flex items-center space-x-2">
                      {mode.icon}
                      <span>{mode.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Display Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Hotspots</span>
              <Toggle
                pressed={showHotspots}
                onPressedChange={setShowHotspots}
                size="sm"
              >
                <Eye className="h-4 w-4" />
              </Toggle>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Measurements</span>
              <Toggle
                pressed={showMeasurements}
                onPressedChange={setShowMeasurements}
                size="sm"
              >
                <Ruler className="h-4 w-4" />
              </Toggle>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Time of Day</span>
              <Toggle
                pressed={dayTime === 'night'}
                onPressedChange={(pressed) => setDayTime(pressed ? 'night' : 'day')}
                size="sm"
              >
                {dayTime === 'day' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Toggle>
            </div>
          </CardContent>
        </Card>

        {/* Quality & Device */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Quality & Device</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm">Quality</label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="720p">720p HD</SelectItem>
                  <SelectItem value="1080p">1080p Full HD</SelectItem>
                  <SelectItem value="4k">4K Ultra HD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm">Device</label>
              <div className="flex space-x-2 mt-1">
                <Button
                  size="sm"
                  variant={deviceType === 'desktop' ? 'default' : 'outline'}
                  onClick={() => setDeviceType('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={deviceType === 'mobile' ? 'default' : 'outline'}
                  onClick={() => setDeviceType('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={deviceType === 'vr' ? 'default' : 'outline'}
                  onClick={() => setDeviceType('vr')}
                >
                  <Headphones className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button variant="default" onClick={startRecording}>
          <Video className="mr-2 h-4 w-4" />
          Record Tour
        </Button>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Share Tour
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Assets
        </Button>
        <Button variant="outline">
          <MessageSquare className="mr-2 h-4 w-4" />
          Leave Feedback
        </Button>
      </div>

      {/* Tour Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Tour Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">12:34</p>
              <p className="text-sm text-muted-foreground">Duration</p>
            </div>
            <div>
              <p className="text-2xl font-bold">6/6</p>
              <p className="text-sm text-muted-foreground">Rooms Viewed</p>
            </div>
            <div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-muted-foreground">Hotspots Clicked</p>
            </div>
            <div>
              <p className="text-2xl font-bold">4</p>
              <p className="text-sm text-muted-foreground">Screenshots</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}