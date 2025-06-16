'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Maximize2, 
  Info, 
  X, 
  CheckCircle, 
  Clock, 
  Home,
  Eye,
  Calendar,
  DollarSign
} from 'lucide-react';

interface Unit {
  id: string;
  number: string;
  type: string;
  status: 'available' | 'reserved' | 'sold';
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  floor: number;
  x: number; // Position on site plan (percentage)
  y: number; // Position on site plan (percentage)
}

interface InteractiveSitePlanProps {
  units: Unit[];
  projectName: string;
  onUnitSelect?: (unit: Unit) => void;
}

export default function InteractiveSitePlan({ units, projectName, onUnitSelect }: InteractiveSitePlanProps) {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      setDragStart({ 
        x: e.clientX - pan.x, 
        y: e.clientY - pan.y 
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleUnitClick = (unit: Unit) => {
    setSelectedUnit(unit);
    onUnitSelect?.(unit);
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getUnitColor = (status: string): string => {
    switch (status) {
      case 'available':
        return 'bg-green-500 border-green-600';
      case 'reserved':
        return 'bg-amber-500 border-amber-600';
      case 'sold':
        return 'bg-gray-500 border-gray-600';
      default:
        return 'bg-blue-500 border-blue-600';
    }
  };

  const getUnitIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <Home size={12} className="text-white" />;
      case 'reserved':
        return <Clock size={12} className="text-white" />;
      case 'sold':
        return <CheckCircle size={12} className="text-white" />;
      default:
        return <Home size={12} className="text-white" />;
    }
  };

  const statusCounts = units.reduce((acc, unit) => {
    acc[unit.status] = (acc[unit.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={`${fullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Interactive Site Plan</h3>
          <p className="text-sm text-gray-600">{projectName} - Real-time Unit Availability</p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-white rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="px-2 py-1 text-sm font-medium min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-white rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          <button
            onClick={resetView}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Reset View
          </button>

          <button
            onClick={() => setFullscreen(!fullscreen)}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {fullscreen ? <X size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Available ({statusCounts.available || 0})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Reserved ({statusCounts.reserved || 0})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Sold ({statusCounts.sold || 0})</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            Click on units for details • Drag to pan • Scroll to zoom
          </div>
        </div>
      </div>

      {/* Site Plan Container */}
      <div className="flex flex-1 h-96 md:h-[500px] lg:h-[600px]">
        {/* Main Site Plan */}
        <div 
          ref={containerRef}
          className="flex-1 relative overflow-hidden cursor-move bg-gradient-to-br from-green-50 to-blue-50"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Site Plan Background */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transformOrigin: 'center center'
            }}
          >
            {/* Site boundaries and landscaping */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
              {/* Site boundary */}
              <rect x="50" y="50" width="700" height="500" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="10,5" />
              
              {/* Roads */}
              <rect x="0" y="0" width="800" height="50" fill="#6b7280" />
              <rect x="0" y="550" width="800" height="50" fill="#6b7280" />
              <rect x="0" y="0" width="50" height="600" fill="#6b7280" />
              
              {/* Landscaping areas */}
              <circle cx="150" cy="150" r="30" fill="#22c55e" opacity="0.3" />
              <circle cx="650" cy="150" r="40" fill="#22c55e" opacity="0.3" />
              <circle cx="400" cy="450" r="50" fill="#22c55e" opacity="0.3" />
              
              {/* Paths */}
              <path d="M50 300 Q400 280 750 300" stroke="#9ca3af" strokeWidth="8" fill="none" />
              <path d="M400 50 Q380 300 400 550" stroke="#9ca3af" strokeWidth="6" fill="none" />
            </svg>

            {/* Units */}
            {units.map((unit) => (
              <div
                key={unit.id}
                className={`absolute w-8 h-8 ${getUnitColor(unit.status)} rounded-lg border-2 cursor-pointer transform transition-all duration-200 hover:scale-110 hover:shadow-lg flex items-center justify-center`}
                style={{
                  left: `${unit.x}%`,
                  top: `${unit.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleUnitClick(unit)}
                title={`Unit ${unit.number} - ${unit.type} - ${unit.status}`}
              >
                {getUnitIcon(unit.status)}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded px-1 py-0.5 text-xs font-medium shadow-sm">
                  {unit.number}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unit Details Panel */}
        {selectedUnit && (
          <div className="w-80 bg-white border-l flex flex-col">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Unit {selectedUnit.number}</h4>
                <button
                  onClick={() => setSelectedUnit(null)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-600">{selectedUnit.type}</p>
            </div>

            <div className="flex-1 p-4 space-y-4">
              {/* Status */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getUnitColor(selectedUnit.status).split(' ')[0]}`}></div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedUnit.status === 'available' ? 'bg-green-100 text-green-800' :
                  selectedUnit.status === 'reserved' ? 'bg-amber-100 text-amber-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedUnit.status.charAt(0).toUpperCase() + selectedUnit.status.slice(1)}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-blue-600" />
                <span className="text-lg font-semibold text-gray-900">
                  €{selectedUnit.price.toLocaleString()}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bedrooms</span>
                  <span className="font-medium">{selectedUnit.beds}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bathrooms</span>
                  <span className="font-medium">{selectedUnit.baths}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Floor Area</span>
                  <span className="font-medium">{selectedUnit.sqft} sq ft</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Floor Level</span>
                  <span className="font-medium">Floor {selectedUnit.floor}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4 border-t">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <Eye size={16} />
                  View Floor Plan
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Calendar size={16} />
                  Schedule Viewing
                </button>
                {selectedUnit.status === 'available' && (
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Reserve Unit
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}