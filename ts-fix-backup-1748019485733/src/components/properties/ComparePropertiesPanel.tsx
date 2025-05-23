'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  ScaleIcon,
  HomeIcon,
  CurrencyEuroIcon,
  ArrowsPointingOutIcon,
  MapPinIcon,
  BoltIcon,
  CalendarIcon,
  CheckIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow} from "@/components/ui/table";
import { Property } from '@/types/property';
import { cn } from "@/lib/utils";

interface ComparePropertiesPanelProps {
  properties: Property[];
  onRemove: (property: Property) => void;
  onClear: () => void;
}

export default function ComparePropertiesPanel({
  properties,
  onRemove,
  onClear
}: ComparePropertiesPanelProps) {
  const [isExpandedsetIsExpanded] = useState(true);

  const compareFeatures = [
    'Price',
    'Location',
    'Property Type',
    'Bedrooms',
    'Bathrooms',
    'Size',
    'BER Rating',
    'Status',
    'Parking',
    'Garden',
    'Balcony',
    'Available Date',
    'Service Charge',
    'Features'
  ];

  const getPropertyValue = (property: Property, feature: string) => {
    switch (feature) {
      case 'Price':
        return `€${property.price.toLocaleString()}`;
      case 'Location':
        return property.location;
      case 'Property Type':
        return property.type;
      case 'Bedrooms':
        return property.bedrooms;
      case 'Bathrooms':
        return property.bathrooms;
      case 'Size':
        return `${property.size} m²`;
      case 'BER Rating':
        return property.berRating || 'N/A';
      case 'Status':
        return property.status;
      case 'Parking':
        return property.features?.includes('parking') ? '✓' : '✗';
      case 'Garden':
        return property.features?.includes('garden') ? '✓' : '✗';
      case 'Balcony':
        return property.features?.includes('balcony') ? '✓' : '✗';
      case 'Available Date':
        return property.availableDate ? new Date(property.availableDate).toLocaleDateString() : 'Immediate';
      case 'Service Charge':
        return property.serviceCharge ? `€${property.serviceCharge}/month` : 'N/A';
      case 'Features':
        return property.features?.join(', ') || 'None listed';
      default:
        return 'N/A';
    }
  };

  const getValueStyle = (feature: string, value: any) => {
    if (feature === 'Parking' || feature === 'Garden' || feature === 'Balcony') {
      return value === '✓' ? 'text-green-600' : 'text-red-600';
    }
    if (feature === 'Status') {
      switch (value) {
        case 'AVAILABLE':
          return 'text-green-600';
        case 'RESERVED':
          return 'text-yellow-600';
        case 'SOLD':
          return 'text-red-600';
        default:
          return '';
      }
    }
    return '';
  };

  return (
    <motion.div
      initial={ y: 100 }
      animate={ y: 0 }
      exit={ y: 100 }
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl",
        "transition-all duration-300",
        isExpanded ? "h-[600px]" : "h-20"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <ScaleIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-semibold">
            Compare Properties ({properties.length}/4)
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Minimize' : 'Expand'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-red-600 hover:text-red-700"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            {/* Property Cards Row */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {properties.map((property) => (
                <div key={property.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(property)}
                    className="absolute -top-2 -right-2 z-10 bg-white shadow-lg rounded-full"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </Button>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="aspect-video relative">
                      <Image
                        src={property.images?.[0] || '/images/properties/placeholder.jpg'}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                        {property.title}
                      </h3>
                      <p className="text-2xl font-bold text-blue-600">
                        €{property.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty slots */}
              {[...Array(4 - properties.length)].map((_i) => (
                <div key={`empty-${i}`} className="border-2 border-dashed rounded-lg">
                  <div className="aspect-video bg-gray-50 flex items-center justify-center">
                    <p className="text-gray-400 text-sm">Add property to compare</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-40">Feature</TableHead>
                    {properties.map((property) => (
                      <TableHead key={property.id} className="text-center">
                        {property.title}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compareFeatures.map((feature) => (
                    <TableRow key={feature}>
                      <TableCell className="font-medium">{feature}</TableCell>
                      {properties.map((property) => {
                        const value = getPropertyValue(propertyfeature);
                        return (
                          <TableCell 
                            key={property.id} 
                            className={cn(
                              "text-center",
                              getValueStyle(featurevalue)
                            )}
                          >
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline">
                Download Comparison
              </Button>
              <Button variant="outline">
                Share Comparison
              </Button>
              <Button>
                Book Multiple Viewings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Minimized View */}
      {!isExpanded && (
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <ScaleIcon className="h-6 w-6 text-blue-600" />
            <span className="font-medium">
              Comparing {properties.length} properties
            </span>
            <div className="flex -space-x-2">
              {properties.map((propertyindex) => (
                <div
                  key={property.id}
                  className="w-12 h-12 rounded-full border-2 border-white overflow-hidden"
                  style={ zIndex: properties.length - index }
                >
                  <Image
                    src={property.images?.[0] || '/images/properties/placeholder.jpg'}
                    alt={property.title}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}